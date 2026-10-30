import { Metadata } from 'next';
import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export const metadata: Metadata = {
  title: 'Wachtwoord vergeten - Bikerfun',
  robots: { index: false, follow: false },
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-2xl">
      <div className="mb-8 text-center">
        <h1
          style={{ fontFamily: 'var(--font-inter)' }}
          className="text-3xl md:text-4xl font-bold text-biker-black mb-3 uppercase tracking-tight"
        >
          Wachtwoord <span className="text-biker-yellow">vergeten</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Vul je e-mailadres in. Als het bij ons bekend is, sturen we een resetlink.
        </p>
      </div>

      {error === 'reset' && (
        <div className="mb-6 bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
          Deze resetlink is ongeldig of verlopen. Vraag hieronder een nieuwe aan.
        </div>
      )}

      <ForgotPasswordForm />

      <div className="mt-6 text-center text-sm text-gray-600">
        <Link href="/login" className="font-semibold text-biker-yellow hover:text-biker-yellowHover">
          Terug naar inloggen
        </Link>
      </div>
    </div>
  );
}
