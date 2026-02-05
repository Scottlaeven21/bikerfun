import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-biker-black text-white mt-auto border-t-2 border-biker-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-24 h-8">
                <Image
                  src="/bikerfun-new-logo.png"
                  alt="Bikerfun Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-biker-muted">
              Premium motor gear en lifestyle producten voor echte motorliefhebbers.
            </p>
          </div>

          {/* Occasions */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-biker-yellow">Occasions</h4>
            <ul className="space-y-2 text-biker-muted">
              <li>
                <Link href="/occasions" className="hover:text-biker-yellow transition-colors">
                  Ons Aanbod
                </Link>
              </li>
              <li>
                <Link href="/motor-op-aanvraag" className="hover:text-biker-yellow transition-colors">
                  Motor Op Aanvraag
                </Link>
              </li>
              <li>
                <Link href="/over-ons" className="hover:text-biker-yellow transition-colors">
                  Over Ons
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-biker-yellow transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Webshop */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-biker-yellow">Webshop</h4>
            <ul className="space-y-2 text-biker-muted">
              <li>
                <Link href="/products" className="hover:text-biker-yellow transition-colors">
                  Alle Producten
                </Link>
              </li>
              <li>
                <Link href="/products?category=helmen" className="hover:text-biker-yellow transition-colors">
                  Helmen
                </Link>
              </li>
              <li>
                <Link href="/products?category=jassen" className="hover:text-biker-yellow transition-colors">
                  Jassen
                </Link>
              </li>
              <li>
                <Link href="/products?category=handschoenen" className="hover:text-biker-yellow transition-colors">
                  Handschoenen
                </Link>
              </li>
            </ul>
          </div>

          {/* Info & Juridisch */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-biker-yellow">Informatie</h4>
            <ul className="space-y-2 text-biker-muted">
              <li>
                <Link href="/privacy" className="hover:text-biker-yellow transition-colors">
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link href="/voorwaarden" className="hover:text-biker-yellow transition-colors">
                  Algemene Voorwaarden
                </Link>
              </li>
              <li>
                <a href="tel:+31201234567" className="hover:text-biker-yellow transition-colors">
                  020 - 123 45 67
                </a>
              </li>
              <li>
                <a href="mailto:info@bikerfun.nl" className="hover:text-biker-yellow transition-colors">
                  info@bikerfun.nl
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-biker-dark mt-8 pt-8 text-center text-biker-muted">
          <p>&copy; {new Date().getFullYear()} <span className="text-biker-yellow font-bold">Bikerfun</span>. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  );
}
