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
            <p className="text-biker-muted text-sm">
              Jouw partner voor occasions en motorkleding. Van cruisers tot sportmotoren - bij Bikerfun vind je kwaliteit en passie.
            </p>
            <div className="mt-4 text-sm text-biker-muted">
              <p>Rafaëlweg 23</p>
              <p>6114BX Susteren</p>
            </div>
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
                <Link href="/faq" className="hover:text-biker-yellow transition-colors">
                  Veelgestelde Vragen
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
                <Link href="/products?category=helmet-covers" className="hover:text-biker-yellow transition-colors">
                  Helmet Covers
                </Link>
              </li>
              <li>
                <Link href="/products?category=sleutelhangers" className="hover:text-biker-yellow transition-colors">
                  Sleutelhangers
                </Link>
              </li>
              <li>
                <Link href="/products?category=overige" className="hover:text-biker-yellow transition-colors">
                  Overige
                </Link>
              </li>
            </ul>
          </div>

          {/* Info & Juridisch */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-biker-yellow">Informatie</h4>
            <ul className="space-y-2 text-biker-muted">
              <li>
                <Link href="/verzending" className="hover:text-biker-yellow transition-colors">
                  Verzending & Levering
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-biker-yellow transition-colors">
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link href="/voorwaarden" className="hover:text-biker-yellow transition-colors">
                  Algemene Voorwaarden
                </Link>
              </li>
              <li>
                <a href="tel:+31615452108" className="hover:text-biker-yellow transition-colors">
                  📞 06 15 45 21 08
                </a>
              </li>
              <li>
                <a href="mailto:bikerfun.info@gmail.com" className="hover:text-biker-yellow transition-colors">
                  ✉️ bikerfun.info@gmail.com
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/31616298684?text=Hoi%20Bikerfun%2C%20ik%20heb%20een%20vraag..." 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-biker-yellow transition-colors"
                >
                  💬 WhatsApp: 06 16 29 86 84
                </a>
              </li>
              <li className="text-sm">
                Ma-Vr: 07:00 - 17:00
              </li>
              <li className="text-sm">
                Za: 12:00 - 17:00
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
