import Link from 'next/link';

const items = [
  {
    title: 'Verzending',
    text: 'Duidelijke levertijden en opties',
    href: '/verzending',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
      />
    ),
  },
  {
    title: 'Retourneren',
    text: 'Voorwaarden en uitleg',
    href: '/voorwaarden',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
      />
    ),
  },
  {
    title: 'Veilig betalen',
    text: 'O.a. iDEAL en Mollie',
    href: '/voorwaarden',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
  },
  {
    title: 'Service',
    text: 'FAQ en contact',
    href: '/faq',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
      />
    ),
  },
] as const;

export function ProductShopTrustStrip() {
  return (
    <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="sr-only">Koop met vertrouwen</h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.title}>
            <Link
              href={item.href}
              className="flex h-full gap-3 rounded-xl border border-gray-100 bg-stone-50/80 p-4 transition hover:border-biker-yellow/50 hover:bg-biker-yellow/5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-biker-black text-biker-yellow">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  {item.icon}
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block font-bold text-biker-black">{item.title}</span>
                <span className="text-sm text-gray-600">{item.text}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
