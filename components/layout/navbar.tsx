'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  user: { id: string; email?: string } | null;
  isAdmin: boolean;
  cartItemCount: number;
}

export function Navbar({ user, isAdmin, cartItemCount }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Show cart/account icons only on webshop pages
  const showShopIcons = pathname?.startsWith('/products') || 
                        pathname?.startsWith('/cart') || 
                        pathname?.startsWith('/checkout') ||
                        pathname?.startsWith('/account');

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
              {/* Cart & Account Icons - Only on Webshop Pages */}
              {showShopIcons && (
                <>
                  {/* Cart Icon */}
                  <Link
                    href="/cart"
                    className="relative bg-biker-dark/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-biker-yellow hover:text-biker-black transition-all duration-300 group"
                    title="Winkelwagen"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-biker-yellow text-biker-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center group-hover:bg-biker-black group-hover:text-biker-yellow transition-all">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>

                  {/* Account Icon */}
                  <Link
                    href={user ? "/account" : "/login?redirect=/account"}
                    className="bg-biker-dark/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-biker-yellow hover:text-biker-black transition-all duration-300"
                    title={user ? "Mijn Account" : "Inloggen"}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                </>
              )}

              {/* Aanbod Button */}
              <Link
                href="/occasions"
                className="btn-secondary bg-transparent text-white px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 border-2 border-white"
              >
                AANBOD
              </Link>

              {/* Menu Button */}
              <button
                onClick={() => setMenuOpen(true)}
                className="btn-primary bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider flex items-center space-x-2 transition-all duration-300"
              >
                <span>MENU</span>
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
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
            href="/products"
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

          {/* User Section */}
          <div className="pt-6 mt-6 border-t border-biker-gray">
            {user ? (
              <>
                <Link
                  href="/account"
                  className="py-3 text-2xl font-bold hover:text-biker-yellow transition-colors uppercase tracking-tight flex items-center space-x-3"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Mijn Account</span>
                </Link>
                <Link
                  href="/cart"
                  className="py-3 text-2xl font-bold hover:text-biker-yellow transition-colors uppercase tracking-tight flex items-center space-x-3"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Winkelwagen {cartItemCount > 0 && `(${cartItemCount})`}</span>
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="py-3 text-2xl font-bold hover:text-biker-yellow transition-colors uppercase tracking-tight flex items-center space-x-3"
                onClick={() => setMenuOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Inloggen</span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
