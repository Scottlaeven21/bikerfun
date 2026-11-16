'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const links = [
  { href: '/dealer', label: 'Overzicht' },
  { href: '/dealer/aanvragen/nieuw', label: 'Nieuwe aanvraag' },
  { href: '/dealer/formulier', label: 'Formulier' },
  { href: '/dealer/omgekeurd', label: 'Omgekeurd' },
  { href: '/dealer/facturen', label: 'Facturen' },
  { href: '/dealer#instellingen', label: 'Instellingen' },
];

function isActive(pathname: string, href: string) {
  if (href === '/dealer') return pathname === '/dealer';
  if (href.includes('#')) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

const pillClass = (active: boolean) =>
  `inline-flex min-h-11 items-center justify-center px-3 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
    active
      ? 'bg-biker-yellow text-biker-black'
      : 'text-white border border-white/30 hover:border-biker-yellow'
  }`;

export function DealerNav({ company }: { company: string }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    const desktop = window.matchMedia('(min-width: 1024px)');
    function onDesktopChange() {
      if (desktop.matches) setMenuOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onDesktopChange);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onDesktopChange);
    };
  }, []);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/api/auth/signout';
  }

  function closeMenu(href?: string) {
    setMenuOpen(false);
    if (href?.includes('#') && pathname === '/dealer') {
      const id = href.split('#')[1];
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-black border-b-2 border-biker-yellow pt-[env(safe-area-inset-top)]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <Link href="/dealer" className="text-biker-yellow font-bold tracking-wider text-xl">
            BIKERFUN
          </Link>
          <p className="text-white text-xs sm:text-sm mt-0.5 truncate">Dealerportaal · {company}</p>
        </div>

        <nav className="hidden lg:flex flex-wrap gap-2 items-center justify-end">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={pillClass(isActive(pathname, link.href))}>
              {link.label}
            </Link>
          ))}
          <button type="button" onClick={logout} className={`${pillClass(false)} border-red-400 hover:bg-red-600`}>
            Uitloggen
          </button>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="lg:hidden inline-flex min-h-11 items-center gap-1.5 bg-biker-yellow text-biker-black border-2 border-biker-yellow px-3.5 py-2 rounded-full font-bold text-xs uppercase tracking-wider"
          aria-expanded={menuOpen}
          aria-controls="dealer-menu"
        >
          <span>Menu</span>
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 z-[55] lg:hidden" onClick={() => setMenuOpen(false)} />
      )}

      <div
        id="dealer-menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={`fixed top-0 right-0 h-full w-[min(20rem,88%)] bg-black text-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[60] lg:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-4 border-b border-white/10">
          <p className="text-biker-yellow font-bold tracking-wider">Menu</p>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="bg-biker-yellow text-biker-black border-2 border-biker-yellow p-2 rounded-full"
            aria-label="Menu sluiten"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col px-5 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] overflow-y-auto h-[calc(100%-4rem)]">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => closeMenu(link.href)}
                className={`py-3.5 text-lg font-bold uppercase tracking-tight border-b border-white/10 ${
                  active ? 'text-biker-yellow' : 'text-white hover:text-biker-yellow'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={logout}
            className="mt-6 min-h-12 rounded-full border-2 border-red-400 px-4 py-3 font-bold uppercase tracking-wider text-white hover:bg-red-600"
          >
            Uitloggen
          </button>
        </nav>
      </div>
    </header>
  );
}
