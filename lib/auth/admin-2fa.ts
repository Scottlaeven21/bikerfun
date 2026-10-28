import { createHash, createHmac, randomInt, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { isEmailConfigured, sendEmail } from '@/lib/email/client';
import { admin2faEmail } from '@/lib/email/templates';

export const ADMIN_2FA_COOKIE = 'bf_admin_2fa';
const CODE_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_SEC = 12 * 60 * 60;
const MAX_ATTEMPTS = 5;

function secret() {
  return (
    process.env.CRON_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'bikerfun-admin-2fa-dev'
  );
}

export function hashOtp(userId: string, code: string) {
  return createHash('sha256').update(`${userId}:${code}:${secret()}`).digest('hex');
}

export function signAdmin2faCookie(userId: string) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SEC;
  const payload = `${userId}.${exp}`;
  const sig = createHmac('sha256', secret()).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

export function readAdmin2faCookie(value: string | undefined, userId: string): boolean {
  if (!value) return false;
  const parts = value.split('.');
  if (parts.length !== 3) return false;
  const [id, expRaw, sig] = parts;
  const exp = Number(expRaw);
  if (!id || id !== userId || !Number.isFinite(exp) || exp * 1000 < Date.now()) return false;
  const expected = createHmac('sha256', secret()).update(`${id}.${expRaw}`).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isAdmin2faVerified(userId: string): Promise<boolean> {
  const store = await cookies();
  return readAdmin2faCookie(store.get(ADMIN_2FA_COOKIE)?.value, userId);
}

export async function setAdmin2faCookie(userId: string) {
  const store = await cookies();
  store.set(ADMIN_2FA_COOKIE, signAdmin2faCookie(userId), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SEC,
  });
}

export async function clearAdmin2faCookie() {
  const store = await cookies();
  store.delete(ADMIN_2FA_COOKIE);
}

export function shouldSkipAdmin2fa() {
  return process.env.NODE_ENV !== 'production' && !isEmailConfigured();
}

/** Alleen het e-mailadres waarmee de admin inlogt. */
export function getAdmin2faRecipients(accountEmail: string): string[] {
  const email = (accountEmail || '').trim();
  return email.includes('@') ? [email] : [];
}

export async function issueAdmin2faCode(userId: string, accountEmail: string, force = false) {
  const recipients = getAdmin2faRecipients(accountEmail);
  if (!recipients.length) {
    return { sent: false, skipped: false as const, recipients, error: 'Geen inlog-e-mail gevonden.' };
  }

  if (shouldSkipAdmin2fa()) {
    return { sent: false, skipped: true as const, recipients };
  }

  const supabase = createAdminClient();
  const now = new Date();

  const { data: existing } = await (supabase as any)
    .from('admin_2fa_codes')
    .select('id, created_at, expires_at')
    .eq('user_id', userId)
    .is('consumed_at', null)
    .gt('expires_at', now.toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing && !force) {
    return { sent: false, already: true as const, skipped: false as const, recipients };
  }

  await (supabase as any)
    .from('admin_2fa_codes')
    .update({ consumed_at: now.toISOString() })
    .eq('user_id', userId)
    .is('consumed_at', null);

  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
  const { error } = await (supabase as any).from('admin_2fa_codes').insert({
    user_id: userId,
    code_hash: hashOtp(userId, code),
    expires_at: new Date(Date.now() + CODE_TTL_MS).toISOString(),
  });

  if (error) {
    console.error('Admin 2FA insert failed:', error.message);
    return { sent: false, skipped: false as const, recipients, error: error.message };
  }

  const mail = admin2faEmail(code);
  console.log('Admin 2FA mail naar:', recipients.join(', '));
  const result = await sendEmail({
    to: recipients,
    subject: mail.subject,
    html: mail.html,
  });

  if (!result.success) {
    await (supabase as any)
      .from('admin_2fa_codes')
      .update({ consumed_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('consumed_at', null);
    console.error('Admin 2FA mail mislukt:', result.error);
    return { sent: false, skipped: false as const, recipients, error: result.error };
  }

  return { sent: true, skipped: false as const, recipients };
}

export async function consumeAdmin2faCode(userId: string, code: string) {
  const cleaned = code.replace(/\s/g, '');
  if (!/^\d{6}$/.test(cleaned)) {
    return { ok: false, error: 'Vul de 6-cijferige code in.' };
  }

  const supabase = createAdminClient();
  const { data: row } = await (supabase as any)
    .from('admin_2fa_codes')
    .select('id, code_hash, expires_at, attempts, consumed_at')
    .eq('user_id', userId)
    .is('consumed_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!row) {
    return { ok: false, error: 'Geen geldige code. Vraag een nieuwe aan.' };
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    return { ok: false, error: 'Deze code is verlopen. Vraag een nieuwe aan.' };
  }

  if ((row.attempts || 0) >= MAX_ATTEMPTS) {
    return { ok: false, error: 'Te veel pogingen. Vraag een nieuwe code aan.' };
  }

  const expected = hashOtp(userId, cleaned);
  const match =
    expected.length === row.code_hash.length &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(row.code_hash));

  if (!match) {
    await (supabase as any)
      .from('admin_2fa_codes')
      .update({ attempts: (row.attempts || 0) + 1 })
      .eq('id', row.id);
    return { ok: false, error: 'Onjuiste code. Probeer het opnieuw.' };
  }

  await (supabase as any)
    .from('admin_2fa_codes')
    .update({ consumed_at: new Date().toISOString() })
    .eq('id', row.id);

  await setAdmin2faCookie(userId);
  return { ok: true };
}
