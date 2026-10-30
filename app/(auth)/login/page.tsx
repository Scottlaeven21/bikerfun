import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Inloggen - Bikerfun',
  description: 'Log in op je Bikerfun account',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>;
}) {
  const { reset } = await searchParams;

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-2xl">
      <div className="mb-8 text-center">
        <h1 style={{ fontFamily: 'var(--font-inter)' }} className="text-3xl md:text-4xl font-bold text-biker-black mb-3 uppercase tracking-tight">
          Welkom <span className="text-biker-yellow">Terug</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Log in op je account
        </p>
      </div>

      {reset === 'ok' && (
        <div className="mb-6 bg-emerald-50 border-2 border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-sm">
          Je wachtwoord is gewijzigd. Log in met je nieuwe wachtwoord.
        </div>
      )}

      <LoginForm />

      <div className="mt-6 text-center text-sm text-gray-600">
        Nog geen account?{' '}
        <Link
          href="/register"
          className="font-semibold text-biker-yellow hover:text-biker-yellowHover transition-colors"
        >
          Registreer nu
        </Link>
      </div>
    </div>
  );
}
