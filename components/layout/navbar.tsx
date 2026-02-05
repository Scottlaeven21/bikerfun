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
      <nav className="absolute top-0 left-0 right-0 text-white z-50 bg-gradient-to-b from-black/30 via-black/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-28">
          {/* Logo + Brand - Links */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-20 h-16 transition-transform group-hover:scale-110">
              <Image
                src="/bikerfun-new-logo.png"
                alt="Bikerfun Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

            {/* Desktop Navigation - Rechts */}
            <div className="flex items-center space-x-3">
              {/* Aanbod Button - Black with White Text */}
              <Link
                href="/occasions"
                className="bg-biker-black hover:bg-biker-dark text-white px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-xl border border-white/20"
              >
                AANBOD
              </Link>

              {/* Menu Button - Yellow/Orange with White Text */}
              <button
                onClick={() => setMenuOpen(true)}
                className="bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider flex items-center space-x-2 transition-all shadow-lg hover:shadow-xl"
              >
                <span>MENU</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
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
      <div className={`fixed top-0 right-0 h-full w-96 bg-black text-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        menuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Close Button */}
        <div className="absolute top-6 right-6">
          <button
            onClick={() => setMenuOpen(false)}
            className="bg-biker-yellow text-biker-black p-2 rounded-full hover:bg-biker-yellowHover transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav 
          style={{ fontFamily: 'var(--font-inter)' }}
          className="flex flex-col justify-center h-full px-12 space-y-1"
        >
          <Link
            href="/"
            className="py-3 text-4xl font-bold hover:text-biker-yellow transition-colors uppercase tracking-tight"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/occasions"
            className="py-3 text-4xl font-bold hover:text-biker-yellow transition-colors uppercase tracking-tight"
            onClick={() => setMenuOpen(false)}
          >
            Aanbod
          </Link>
          <Link
            href="/over-ons"
            className="py-3 text-4xl font-bold hover:text-biker-yellow transition-colors uppercase tracking-tight"
            onClick={() => setMenuOpen(false)}
          >
            Over Ons
          </Link>
          <Link
            href="/motorkleding"
            className="py-3 text-4xl font-bold hover:text-biker-yellow transition-colors uppercase tracking-tight"
            onClick={() => setMenuOpen(false)}
          >
            Webshop
          </Link>
          <Link
            href="/motor-op-aanvraag"
            className="py-3 text-4xl font-bold hover:text-biker-yellow transition-colors uppercase tracking-tight"
            onClick={() => setMenuOpen(false)}
          >
            Aanvraag
          </Link>
          <Link
            href="/contact"
            className="py-3 text-4xl font-bold hover:text-biker-yellow transition-colors uppercase tracking-tight"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
        </nav>
      </div>
    </>
  );
}
