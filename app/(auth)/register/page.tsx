import { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'Registreren',
  description: 'Maak een Bikerfun account aan',
};

export default function RegisterPage() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Account aanmaken
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Word lid van Bikerfun
        </p>
      </div>

      <RegisterForm />

      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Al een account?{' '}
        <Link
          href="/login"
          className="font-medium text-red-600 hover:text-red-500"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
