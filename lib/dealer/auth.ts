import { createClient } from '@/lib/supabase/server';
import type { Dealer } from './types';

export async function getDealerSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null, dealer: null };
  }

  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('is_admin, is_dealer, email, full_name, must_change_password')
    .eq('id', user.id)
    .maybeSingle();

  const { data: dealer } = await (supabase as any)
    .from('dealers')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  return {
    user,
    profile: profile as {
      is_admin: boolean;
      is_dealer: boolean;
      email: string;
      full_name: string | null;
      must_change_password?: boolean;
    } | null,
    dealer: (dealer as Dealer | null) ?? null,
  };
}

export function dealerPortalUrl() {
  return `${(process.env.NEXT_PUBLIC_APP_URL || 'https://bikerfun.nl').replace(/\/$/, '')}/dealer`;
}
