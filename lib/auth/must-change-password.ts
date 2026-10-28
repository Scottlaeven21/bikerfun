import { createClient } from '@/lib/supabase/server';

export function passwordChangePath(redirectTo: string) {
  const next = redirectTo.startsWith('/') ? redirectTo : '/';
  return `/login/wachtwoord?redirect=${encodeURIComponent(next)}`;
}

export async function userMustChangePassword(userId: string) {
  const supabase = await createClient();
  const { data } = await (supabase as any)
    .from('profiles')
    .select('must_change_password')
    .eq('id', userId)
    .maybeSingle();
  return Boolean(data?.must_change_password);
}
