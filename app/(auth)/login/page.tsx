import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Inloggen - Bikerfun',
  description: 'Log in op je Bikerfun account',
};

export default function LoginPage() {
  return (
    <div className="bg-biker-dark rounded-2xl border-2 border-biker-gray p-8 shadow-2xl">
      <div className="mb-8 text-center">
        <h1 style={{ fontFamily: 'var(--font-inter)' }} className="text-3xl md:text-4xl font-bold text-white mb-3 uppercase tracking-tight">
          Welkom <span className="text-biker-yellow">Terug</span>
        </h1>
        <p className="text-biker-light text-lg">
          Log in op je account
        </p>
      </div>

      <LoginForm />

      <div className="mt-6 text-center text-sm text-biker-light">
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
