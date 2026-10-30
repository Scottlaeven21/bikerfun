import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { RecoverySessionCatcher } from '@/components/auth/recovery-session-catcher';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Nieuw wachtwoord - Bikerfun',
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-2xl">
      <RecoverySessionCatcher />
      <div className="mb-8 text-center">
        <h1
          style={{ fontFamily: 'var(--font-inter)' }}
          className="text-3xl md:text-4xl font-bold text-biker-black mb-3 uppercase tracking-tight"
        >
          Nieuw <span className="text-biker-yellow">wachtwoord</span>
        </h1>
        <p className="text-gray-600 text-lg">
          {user
            ? 'Kies een nieuw wachtwoord voor je account.'
            : 'We maken de resetlink klaar. Even geduld, of vraag een nieuwe aan als dit te lang duurt.'}
        </p>
      </div>

      {user ? (
        <ResetPasswordForm />
      ) : (
        <div className="text-center text-sm text-gray-600">
          <Link href="/login/vergeten" className="font-semibold text-biker-yellow hover:text-biker-yellowHover">
            Nieuwe resetlink aanvragen
          </Link>
        </div>
      )}
    </div>
  );
}
