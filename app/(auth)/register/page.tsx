import { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'Registreren - Bikerfun',
  description: 'Maak een Bikerfun account aan',
};

export default function RegisterPage() {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-2xl">
      <div className="mb-8 text-center">
        <h1 style={{ fontFamily: 'var(--font-inter)' }} className="text-3xl md:text-4xl font-bold text-biker-black mb-3 uppercase tracking-tight">
          Account <span className="text-biker-yellow">Aanmaken</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Word lid van Bikerfun
        </p>
      </div>

      <RegisterForm />

      <div className="mt-6 text-center text-sm text-gray-600">
        Al een account?{' '}
        <Link
          href="/login"
          className="font-semibold text-biker-yellow hover:text-biker-yellowHover transition-colors"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
