'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { logAuditEvent } from '@/lib/audit/logger';
import {
  consumeAdmin2faCode,
  issueAdmin2faCode,
  shouldSkipAdmin2fa,
} from '@/lib/auth/admin-2fa';

async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, email: null };

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, email')
    .eq('id', user.id)
    .single();

  if (!(profile as { is_admin?: boolean } | null)?.is_admin) {
    return { user: null, email: null };
  }

  return { user, email: user.email || (profile as { email?: string } | null)?.email || '' };
}

export async function sendAdmin2fa(force = false) {
  const { user, email } = await requireAdminUser();
  if (!user || !email) {
    return { success: false, error: 'Niet ingelogd als admin.' };
  }
  if (shouldSkipAdmin2fa()) {
    return { success: true, skipped: true };
  }

  const result = await issueAdmin2faCode(user.id, email, force);
  if (result.cooldown) {
    return { success: false, error: 'Even wachten: je kunt over een minuut een nieuwe code vragen.' };
  }
  if (result.error) {
    return {
      success: false,
      error: `We konden de code niet mailen naar ${email}. ${result.error}`,
    };
  }
  return {
    success: true,
    skipped: result.skipped,
    recipients: result.recipients,
  };
}

export async function verifyAdmin2fa(prevState: { error?: string } | null, formData: FormData) {
  const code = String(formData.get('code') || '');
  const redirectTo = String(formData.get('redirect') || '/admin');
  const safeRedirect = redirectTo.startsWith('/') ? redirectTo : '/admin';

  const { user, email } = await requireAdminUser();
  if (!user) {
    return { error: 'Sessie verlopen. Log opnieuw in.' };
  }

  const result = await consumeAdmin2faCode(user.id, code);
  if (!result.ok) {
    await logAuditEvent({
      userId: user.id,
      userEmail: email || user.email || 'unknown',
      action: 'login',
      resourceType: 'user',
      details: { success: false, target: 'admin', step: '2fa', error: result.error },
    });
    return { error: result.error };
  }

  await logAuditEvent({
    userId: user.id,
    userEmail: email || user.email || 'unknown',
    action: 'login',
    resourceType: 'user',
    details: { success: true, target: 'admin', step: '2fa' },
  });

  redirect(safeRedirect);
}
