'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface NavbarProps {
  user: { id: string; email?: string } | null;
  isAdmin: boolean;
  cartItemCount: number;
}

export function Navbar({ user, isAdmin, cartItemCount }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-biker-black text-white shadow-lg border-b-2 border-biker-dark sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-32">
          {/* Logo + Brand - Links */}
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative w-28 h-28 transition-transform group-hover:scale-110">
              <Image
                src="/bikerfun-logo.png"
                alt="Bikerfun Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-white group-hover:text-biker-yellow transition-colors tracking-tight leading-none" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>
                BIKER
              </span>
              <span className="text-3xl font-black text-white group-hover:text-biker-yellow transition-colors tracking-tight leading-none" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>
                FUN
              </span>
            </div>
          </Link>

            {/* Desktop Navigation - Rechts */}
            <div className="flex items-center space-x-4">
              {/* Aanbod Button */}
              <Link
                href="/occasions"
                className="relative bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-6 py-3 rounded-lg font-bold text-lg transition-all transform hover:scale-105 hover:shadow-xl shadow-lg border-2 border-transparent hover:border-biker-yellowHover"
              >
                <span className="relative z-10">Aanbod</span>
              </Link>

              {/* Menu Button */}
              <button
                onClick={() => setMenuOpen(true)}
                className="relative bg-gradient-to-r from-biker-yellow to-biker-yellowHover hover:from-biker-yellowHover hover:to-biker-yellow text-biker-black px-6 py-3 rounded-lg font-bold text-lg flex items-center space-x-2 transition-all transform hover:scale-105 hover:shadow-xl shadow-lg border-2 border-transparent hover:border-biker-yellowHover group"
              >
                <span className="relative z-10">Menu</span>
                <svg className="w-5 h-5 relative z-10 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Slide-in Menu van Rechts */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-biker-black text-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        menuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Menu Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-biker-dark">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <Image
                src="/bikerfun-logo.png"
                alt="Bikerfun Logo"
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-biker-yellow">Menu</h2>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-white hover:text-biker-yellow transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col p-6 space-y-2 overflow-y-auto h-[calc(100%-88px)]">
          <Link
            href="/occasions"
            className="py-4 px-4 hover:bg-biker-dark hover:text-biker-yellow transition-all rounded-lg font-semibold text-lg border-b border-biker-dark"
            onClick={() => setMenuOpen(false)}
          >
            Occasions
          </Link>
          <Link
            href="/motorkleding"
            className="py-4 px-4 hover:bg-biker-dark hover:text-biker-yellow transition-all rounded-lg font-semibold text-lg border-b border-biker-dark"
            onClick={() => setMenuOpen(false)}
          >
            Motorkleding
          </Link>
          <Link
            href="/accessoires"
            className="py-4 px-4 hover:bg-biker-dark hover:text-biker-yellow transition-all rounded-lg font-semibold text-lg border-b border-biker-dark"
            onClick={() => setMenuOpen(false)}
          >
            Accessoires
          </Link>
          <Link
            href="/over-ons"
            className="py-4 px-4 hover:bg-biker-dark hover:text-biker-yellow transition-all rounded-lg font-semibold text-lg border-b border-biker-dark"
            onClick={() => setMenuOpen(false)}
          >
            Over Ons
          </Link>
          <Link
            href="/motor-op-aanvraag"
            className="py-4 px-4 hover:bg-biker-dark hover:text-biker-yellow transition-all rounded-lg font-semibold text-lg border-b border-biker-dark"
            onClick={() => setMenuOpen(false)}
          >
            Motor op Aanvraag
          </Link>
          <Link
            href="/contact"
            className="py-4 px-4 hover:bg-biker-dark hover:text-biker-yellow transition-all rounded-lg font-semibold text-lg border-b border-biker-dark"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
          <Link
            href="/inruilen"
            className="py-4 px-4 hover:bg-biker-dark hover:text-biker-yellow transition-all rounded-lg font-semibold text-lg border-b border-biker-dark"
            onClick={() => setMenuOpen(false)}
          >
            Inruilen
          </Link>

          {/* Extra CTA at bottom */}
          <div className="pt-8">
            <Link
              href="/occasions"
              className="block w-full bg-biker-yellow hover:bg-biker-yellowHover text-biker-black py-4 px-6 rounded-lg font-bold text-center transition-all transform hover:scale-105"
              onClick={() => setMenuOpen(false)}
            >
              Bekijk Ons Aanbod
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
