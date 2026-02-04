'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  user: { id: string; email?: string } | null;
  isAdmin: boolean;
  cartItemCount: number;
}

export function Navbar({ user, isAdmin, cartItemCount }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">Bikerfun</span>
            <span className="text-2xl">🏍️</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`hover:text-red-500 transition-colors ${
                isActive('/') ? 'text-red-500' : ''
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`hover:text-red-500 transition-colors ${
                isActive('/products') ? 'text-red-500' : ''
              }`}
            >
              Producten
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className={`hover:text-red-500 transition-colors ${
                  pathname.startsWith('/admin') ? 'text-red-500' : ''
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/cart"
              className="relative hover:text-red-500 transition-colors"
            >
              <span className="text-xl">🛒</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`hover:text-red-500 transition-colors ${
                    pathname.startsWith('/dashboard') ? 'text-red-500' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Uitloggen
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:text-red-500 transition-colors"
                >
                  Inloggen
                </Link>
                <Link
                  href="/register"
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Registreren
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 px-4 py-4 space-y-3">
          <Link
            href="/"
            className="block hover:text-red-500"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/products"
            className="block hover:text-red-500"
            onClick={() => setMobileMenuOpen(false)}
          >
            Producten
          </Link>
          <Link
            href="/cart"
            className="block hover:text-red-500"
            onClick={() => setMobileMenuOpen(false)}
          >
            Winkelwagen ({cartItemCount})
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="block hover:text-red-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </Link>
          )}
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="block hover:text-red-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left hover:text-red-500"
              >
                Uitloggen
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block hover:text-red-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inloggen
              </Link>
              <Link
                href="/register"
                className="block hover:text-red-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Registreren
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
