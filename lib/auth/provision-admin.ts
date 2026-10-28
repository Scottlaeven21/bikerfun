import { randomBytes } from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { isEmailConfigured, sendEmail } from '@/lib/email/client';
import { adminWelcomeEmail } from '@/lib/email/templates';

function tempPassword() {
  const chunk = () => randomBytes(3).toString('base64url').replace(/[^a-zA-Z0-9]/g, 'X').slice(0, 4);
  return `Bf-${chunk()}-${chunk()}`;
}

export async function provisionAdminAccount(name: string, emailRaw: string) {
  const admin = createAdminClient();
  const email = emailRaw.trim().toLowerCase();
  const loginUrl = `${(process.env.NEXT_PUBLIC_APP_URL || 'https://bikerfun.nl').replace(/\/$/, '')}/login?redirect=/admin`;

  const { data: existingProfile } = await (admin as any)
    .from('profiles')
    .select('id, email, is_admin')
    .ilike('email', email)
    .maybeSingle();

  let userId = existingProfile?.id as string | undefined;
  let password: string | null = null;
  let createdUser = false;

  if (!userId) {
    password = tempPassword();
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name, is_admin: true },
    });
    if (error || !data.user) {
      return { ok: false as const, error: error?.message || 'Account aanmaken mislukt' };
    }
    userId = data.user.id;
    createdUser = true;
  }

  await (admin as any)
    .from('profiles')
    .update({
      is_admin: true,
      full_name: name,
      email,
      ...(createdUser ? { must_change_password: true } : {}),
    })
    .eq('id', userId);

  let emailed = false;
  if (isEmailConfigured()) {
    const mail = adminWelcomeEmail({
      name,
      email,
      password,
      loginUrl,
      existingAccount: !createdUser,
    });
    const sent = await sendEmail({ to: email, subject: mail.subject, html: mail.html });
    emailed = Boolean(sent.success);
  }

  return {
    ok: true as const,
    createdUser,
    alreadyExisted: Boolean(existingProfile?.id),
    password,
    emailed,
    userId,
  };
}
