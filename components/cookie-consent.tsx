'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
    // Here you can initialize analytics or other tracking
    console.log('Cookies accepted');
  };

  const rejectCookies = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowBanner(false);
    console.log('Cookies rejected');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-slide-up">
      <div className="max-w-6xl mx-auto bg-biker-dark border-2 border-biker-yellow rounded-2xl shadow-2xl">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-biker-yellow/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-biker-yellow"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <div>
                  <h3
                    style={{ fontFamily: 'var(--font-inter)' }}
                    className="text-xl font-bold text-white mb-2"
                  >
                    🍪 Cookie Instellingen
                  </h3>
                  <p className="text-biker-light text-sm leading-relaxed">
                    We gebruiken cookies om je ervaring op onze website te verbeteren. 
                    Essentiële cookies zijn nodig voor de werking van de site. 
                    Optionele cookies helpen ons de site te analyseren en verbeteren.{' '}
                    <Link
                      href="/privacy-policy"
                      className="text-biker-yellow hover:text-biker-yellowHover underline"
                    >
                      Meer info
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
              <button
                onClick={rejectCookies}
                className="px-6 py-3 rounded-full border-2 border-white text-white font-bold uppercase text-sm tracking-wider hover:bg-white/10 transition-all duration-300"
              >
                Alleen Noodzakelijk
              </button>
              <button
                onClick={acceptCookies}
                className="px-6 py-3 rounded-full bg-biker-yellow text-black font-bold uppercase text-sm tracking-wider hover:bg-biker-yellowHover transition-all duration-300"
              >
                Accepteer Alles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
