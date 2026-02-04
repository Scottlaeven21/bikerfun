import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Inloggen',
  description: 'Log in op je Bikerfun account',
};

export default function LoginPage() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welkom terug
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Log in op je account
        </p>
      </div>

      <LoginForm />

      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Nog geen account?{' '}
        <Link
          href="/register"
          className="font-medium text-red-600 hover:text-red-500"
        >
          Registreer nu
        </Link>
      </div>
    </div>
  );
}
