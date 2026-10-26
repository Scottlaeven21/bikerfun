import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Admin2faForm } from '@/components/auth/admin-2fa-form';
import { isAdmin2faVerified, issueAdmin2faCode, shouldSkipAdmin2fa, setAdmin2faCookie } from '@/lib/auth/admin-2fa';

export const metadata: Metadata = {
  title: 'Bevestig admin-login - Bikerfun',
  robots: { index: false, follow: false },
};

export default async function Admin2faPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = params.redirect?.startsWith('/') ? params.redirect : '/admin';
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, email')
    .eq('id', user.id)
    .single();

  if (!(profile as { is_admin?: boolean } | null)?.is_admin) {
    redirect('/');
  }

  if (await isAdmin2faVerified(user.id)) {
    redirect(redirectTo);
  }

  if (shouldSkipAdmin2fa()) {
    await setAdmin2faCookie(user.id);
    redirect(redirectTo);
  }

  await issueAdmin2faCode(user.id, user.email || (profile as { email?: string } | null)?.email || '');

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-2xl">
      <div className="mb-8 text-center">
        <h1
          style={{ fontFamily: 'var(--font-inter)' }}
          className="text-3xl md:text-4xl font-bold text-biker-black mb-3 uppercase tracking-tight"
        >
          Extra <span className="text-biker-yellow">controle</span>
        </h1>
        <p className="text-gray-600 text-lg">Admin-login bevestigen via e-mail</p>
      </div>
      <Admin2faForm
        redirectTo={redirectTo}
        email={user.email || (profile as { email?: string } | null)?.email || ''}
      />
    </div>
  );
}
