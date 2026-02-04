'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Er is iets misgegaan
        </h1>
        <p className="text-gray-600 mb-8">
          {error.message || 'Een onverwachte fout is opgetreden.'}
        </p>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="block w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Probeer opnieuw
          </button>
          <Link
            href="/"
            className="block w-full bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Terug naar home
          </Link>
        </div>
      </div>
    </div>
  );
}
