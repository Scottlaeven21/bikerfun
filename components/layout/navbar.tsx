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
  const [aanbodOpen, setAanbodOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-biker-black text-white shadow-lg border-b-2 border-biker-dark sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Links */}
          <Link href="/" className="flex items-center group">
            <div className="relative w-12 h-12 transition-transform group-hover:scale-110">
              <Image
                src="/bikerfun-logo.png"
                alt="Bikerfun Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation - Rechts */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Aanbod Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setAanbodOpen(true)}
              onMouseLeave={() => setAanbodOpen(false)}
            >
              <button className="text-white hover:text-biker-yellow transition-colors font-bold text-lg flex items-center space-x-1">
                <span>Aanbod</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {aanbodOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-biker-dark rounded-lg shadow-xl border-2 border-biker-gray py-2">
                  <Link
                    href="/occasions"
                    className="block px-4 py-3 hover:bg-biker-black hover:text-biker-yellow transition-colors font-semibold"
                  >
                    Occasion Aanbod
                  </Link>
                </div>
              )}
            </div>

            {/* Menu Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button className="text-white hover:text-biker-yellow transition-colors font-bold text-lg flex items-center space-x-1">
                <span>Menu</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {menuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-biker-dark rounded-lg shadow-xl border-2 border-biker-gray py-2">
                  <Link
                    href="/occasions"
                    className="block px-4 py-3 hover:bg-biker-black hover:text-biker-yellow transition-colors font-semibold"
                  >
                    Occasions
                  </Link>
                  <Link
                    href="/motorkleding"
                    className="block px-4 py-3 hover:bg-biker-black hover:text-biker-yellow transition-colors font-semibold"
                  >
                    Motorkleding
                  </Link>
                  <Link
                    href="/accessoires"
                    className="block px-4 py-3 hover:bg-biker-black hover:text-biker-yellow transition-colors font-semibold"
                  >
                    Accessoires
                  </Link>
                  <Link
                    href="/over-ons"
                    className="block px-4 py-3 hover:bg-biker-black hover:text-biker-yellow transition-colors font-semibold"
                  >
                    Over Ons
                  </Link>
                  <Link
                    href="/motor-op-aanvraag"
                    className="block px-4 py-3 hover:bg-biker-black hover:text-biker-yellow transition-colors font-semibold"
                  >
                    Motor op Aanvraag
                  </Link>
                  <Link
                    href="/contact"
                    className="block px-4 py-3 hover:bg-biker-black hover:text-biker-yellow transition-colors font-semibold"
                  >
                    Contact
                  </Link>
                  <Link
                    href="/inruilen"
                    className="block px-4 py-3 hover:bg-biker-black hover:text-biker-yellow transition-colors font-semibold"
                  >
                    Inruilen
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-biker-yellow transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-biker-dark border-t-2 border-biker-gray">
          <div className="px-4 py-4 space-y-1">
            {/* Aanbod Section */}
            <div className="py-2">
              <div className="text-biker-yellow font-bold mb-2 text-sm uppercase">Aanbod</div>
              <Link
                href="/occasions"
                className="block py-2 px-4 hover:bg-biker-black hover:text-biker-yellow transition-colors rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Occasion Aanbod
              </Link>
            </div>

            {/* Menu Section */}
            <div className="py-2 border-t border-biker-gray">
              <div className="text-biker-yellow font-bold mb-2 text-sm uppercase">Menu</div>
              <Link
                href="/occasions"
                className="block py-2 px-4 hover:bg-biker-black hover:text-biker-yellow transition-colors rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Occasions
              </Link>
              <Link
                href="/motorkleding"
                className="block py-2 px-4 hover:bg-biker-black hover:text-biker-yellow transition-colors rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Motorkleding
              </Link>
              <Link
                href="/accessoires"
                className="block py-2 px-4 hover:bg-biker-black hover:text-biker-yellow transition-colors rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accessoires
              </Link>
              <Link
                href="/over-ons"
                className="block py-2 px-4 hover:bg-biker-black hover:text-biker-yellow transition-colors rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Over Ons
              </Link>
              <Link
                href="/motor-op-aanvraag"
                className="block py-2 px-4 hover:bg-biker-black hover:text-biker-yellow transition-colors rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Motor op Aanvraag
              </Link>
              <Link
                href="/contact"
                className="block py-2 px-4 hover:bg-biker-black hover:text-biker-yellow transition-colors rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/inruilen"
                className="block py-2 px-4 hover:bg-biker-black hover:text-biker-yellow transition-colors rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inruilen
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
