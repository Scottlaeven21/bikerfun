'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const links = [
  { href: '/dealer', label: 'Overzicht' },
  { href: '/dealer/aanvragen/nieuw', label: 'Nieuwe aanvraag' },
  { href: '/dealer/formulier', label: 'Formulier' },
  { href: '/dealer/omgekeurd', label: 'Omgekeurd' },
  { href: '/dealer/facturen', label: 'Facturen' },
];

export function DealerNav({ company }: { company: string }) {
  const pathname = usePathname();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/api/auth/signout';
  }

  return (
    <header className="bg-black border-b-2 border-biker-yellow">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/dealer" className="text-biker-yellow font-bold tracking-wider text-xl">
            BIKERFUN
          </Link>
          <p className="text-white text-sm mt-1">Dealerportaal · {company}</p>
        </div>
        <nav className="flex flex-wrap gap-2 items-center">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  active
                    ? 'bg-biker-yellow text-biker-black'
                    : 'text-white border border-white/30 hover:border-biker-yellow'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={logout}
            className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white border border-red-400 hover:bg-red-600"
          >
            Uitloggen
          </button>
        </nav>
      </div>
    </header>
  );
}
