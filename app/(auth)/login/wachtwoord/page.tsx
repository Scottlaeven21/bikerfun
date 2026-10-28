import { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ChangePasswordForm } from '@/components/auth/change-password-form';
import { userMustChangePassword } from '@/lib/auth/must-change-password';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Nieuw wachtwoord - Bikerfun',
  robots: { index: false, follow: false },
};

export default async function ChangePasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  if (!(await userMustChangePassword(user.id))) {
    redirect('/');
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-2xl">
      <div className="mb-8 text-center">
        <h1
          style={{ fontFamily: 'var(--font-inter)' }}
          className="text-3xl md:text-4xl font-bold text-biker-black mb-3 uppercase tracking-tight"
        >
          Kies je <span className="text-biker-yellow">wachtwoord</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Je tijdelijke wachtwoord moet je nu vervangen door een eigen wachtwoord.
        </p>
      </div>
      <Suspense>
        <ChangePasswordForm />
      </Suspense>
    </div>
  );
}
