import { randomBytes } from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { isEmailConfigured, sendEmail } from '@/lib/email/client';
import { dealerWelcomeEmail } from '@/lib/email/templates';
import { dealerPortalUrl } from './auth';

function tempPassword() {
  const chunk = () => randomBytes(3).toString('base64url').replace(/[^a-zA-Z0-9]/g, 'X').slice(0, 4);
  return `Bf-${chunk()}-${chunk()}`;
}

export type DealerSignupInput = {
  name: string;
  email: string;
  phone?: string;
  company: string;
  location?: string;
  kvk?: string;
  vatNumber?: string;
  rdwRecognized?: string;
  hasWorkshop?: string;
  estimatedOmkeuren?: string;
  message?: string;
};

export async function provisionDealerFromSignup(input: DealerSignupInput) {
  const admin = createAdminClient();
  const email = input.email.trim().toLowerCase();

  const { data: existingDealer } = await (admin as any)
    .from('dealers')
    .select('id, user_id')
    .ilike('email', email)
    .maybeSingle();

  const { data: existingProfile } = await (admin as any)
    .from('profiles')
    .select('id, email')
    .ilike('email', email)
    .maybeSingle();

  let userId = (existingDealer?.user_id || existingProfile?.id) as string | undefined;
  let password: string | null = null;
  let createdUser = false;

  if (!userId) {
    password = tempPassword();
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: input.name, is_dealer: true },
    });

    if (error || !data.user) {
      console.error('Dealer account create failed:', error?.message);
      return { ok: false as const, error: error?.message || 'Account aanmaken mislukt' };
    }

    userId = data.user.id;
    createdUser = true;
  }

  await (admin as any)
    .from('profiles')
    .update({
      is_dealer: true,
      full_name: input.name,
      email,
      ...(createdUser ? { must_change_password: true } : {}),
    })
    .eq('id', userId);

  const dealerRow = {
    user_id: userId,
    company_name: input.company,
    contact_name: input.name,
    email,
    phone: input.phone || null,
    location: input.location || null,
    kvk: input.kvk || null,
    vat_number: input.vatNumber || null,
    rdw_recognized: input.rdwRecognized || null,
    has_workshop: input.hasWorkshop || null,
    estimated_omkeuren: input.estimatedOmkeuren || null,
    notes: input.message || null,
    status: 'active',
  };

  let dealerId = existingDealer?.id as string | undefined;
  if (existingDealer?.id) {
    const update = { ...dealerRow, updated_at: new Date().toISOString() };
    await (admin as any).from('dealers').update(update).eq('id', existingDealer.id);
  } else {
    const { data: inserted, error: insertError } = await (admin as any)
      .from('dealers')
      .insert(dealerRow)
      .select('id')
      .single();
    if (insertError) {
      console.error('Dealer insert failed:', insertError.message);
      return { ok: false as const, error: insertError.message };
    }
    dealerId = inserted?.id;
  }

  if (isEmailConfigured()) {
    const mail = dealerWelcomeEmail({
      name: input.name,
      company: input.company,
      email,
      password,
      loginUrl: `${dealerPortalUrl().replace(/\/dealer$/, '')}/login?redirect=/dealer`,
      existingAccount: !createdUser,
    });
    await sendEmail({ to: email, subject: mail.subject, html: mail.html });
  }

  return { ok: true as const, createdUser, userId, dealerId, alreadyExisted: Boolean(existingDealer?.id) };
}
