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
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black noise-overlay text-white flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="text-9xl font-bold text-red-500/20 leading-none">
              500
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-red-500/10 backdrop-blur-sm flex items-center justify-center border-4 border-red-500">
                <svg 
                  className="w-16 h-16 text-red-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 
          style={{ fontFamily: 'var(--font-inter)' }}
          className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight"
        >
          Er Ging Iets <span className="text-red-500">Mis</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-biker-light mb-10 max-w-xl mx-auto">
          Sorry! Er is een onverwachte fout opgetreden. 
          We zijn op de hoogte gebracht en lossen dit zo snel mogelijk op.
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-biker-dark border-2 border-red-500/50 rounded-lg text-left max-w-xl mx-auto">
            <p className="text-xs text-red-400 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-biker-muted font-mono mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="btn-primary inline-block bg-biker-yellow hover:bg-black text-black hover:text-biker-yellow border-2 border-biker-yellow px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300"
          >
            PROBEER OPNIEUW
          </button>
          
          <Link
            href="/"
            className="inline-block bg-transparent hover:bg-biker-yellow/10 text-white border-2 border-white hover:border-biker-yellow px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300"
          >
            TERUG NAAR HOME
          </Link>
        </div>

        {/* Help Links */}
        <div className="mt-12 pt-8 border-t border-biker-gray">
          <p className="text-sm text-biker-light mb-4">Of ga naar:</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/occasions" className="text-biker-yellow hover:text-biker-yellowHover transition-colors">
              Occasions
            </Link>
            <Link href="/webshop" className="text-biker-yellow hover:text-biker-yellowHover transition-colors">
              Webshop
            </Link>
            <Link href="/contact" className="text-biker-yellow hover:text-biker-yellowHover transition-colors">
              Contact
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8">
          <p className="text-sm text-biker-muted">
            Direct contact nodig?{' '}
            <a 
              href="tel:0615452108" 
              className="text-biker-yellow hover:text-biker-yellowHover transition-colors font-medium"
            >
              06 15 45 21 08
            </a>
            {' '}of{' '}
            <a 
              href="mailto:info@bikerfun.nl" 
              className="text-biker-yellow hover:text-biker-yellowHover transition-colors font-medium"
            >
              info@bikerfun.nl
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
