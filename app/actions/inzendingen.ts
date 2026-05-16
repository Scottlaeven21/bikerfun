'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { logAuditEvent } from '@/lib/audit/logger';

/**
 * Verwijder een formulier-inzending (contact / motor_aanvraag / bezichtiging).
 * Alleen admins mogen dit. We checken eerst de admin-status met de gebruiker
 * cookies-client en doen de delete vervolgens met de service-role client
 * zodat we niet afhankelijk zijn van de exacte RLS-policy configuratie.
 */
export async function deleteFormSubmission(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!id || typeof id !== 'string') {
    return { success: false, error: 'Ongeldige inzending ID' };
  }

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Niet ingelogd' };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!(profile as { is_admin: boolean } | null)?.is_admin) {
      return { success: false, error: 'Geen admin rechten' };
    }

    const admin = createAdminClient();
    const { error } = await (admin as any)
      .from('form_submissions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete form submission:', error);
      return { success: false, error: 'Verwijderen mislukt' };
    }

    await logAuditEvent({
      userId: user.id,
      userEmail: user.email || 'unknown',
      action: 'delete',
      resourceType: 'system',
      resourceId: id,
      details: { table: 'form_submissions' },
    });

    revalidatePath('/admin/inzendingen');

    return { success: true };
  } catch (err) {
    console.error('deleteFormSubmission error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Onbekende fout',
    };
  }
}
