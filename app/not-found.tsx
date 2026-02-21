import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Pagina Niet Gevonden | Bikerfun',
  description: 'Deze pagina bestaat niet.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black noise-overlay text-white flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="text-9xl font-bold text-biker-yellow/20 leading-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-biker-yellow/10 backdrop-blur-sm flex items-center justify-center border-4 border-biker-yellow">
                <svg 
                  className="w-16 h-16 text-biker-yellow" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 10V3L4 14h7v7l9-11h-7z" 
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 
          style={{ fontFamily: 'var(--font-inter)' }}
          className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight"
        >
          Pagina <span className="text-biker-yellow">Niet Gevonden</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-biker-light mb-10 max-w-xl mx-auto">
          Oeps! Het lijkt erop dat je een verkeerde afslag hebt genomen. 
          Deze pagina bestaat niet of is verplaatst.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="btn-primary inline-block bg-biker-yellow hover:bg-black text-black hover:text-biker-yellow border-2 border-biker-yellow px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300"
          >
            TERUG NAAR HOME
          </Link>
          
          <Link
            href="/occasions"
            className="inline-block bg-transparent hover:bg-biker-yellow/10 text-white border-2 border-white hover:border-biker-yellow px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300"
          >
            BEKIJK OCCASIONS
          </Link>
        </div>

        {/* Help Links */}
        <div className="mt-12 pt-8 border-t border-biker-gray">
          <p className="text-sm text-biker-light mb-4">Zoek je iets specifieks?</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/contact" className="text-biker-yellow hover:text-biker-yellowHover transition-colors">
              Contact
            </Link>
            <Link href="/webshop" className="text-biker-yellow hover:text-biker-yellowHover transition-colors">
              Webshop
            </Link>
            <Link href="/occasions" className="text-biker-yellow hover:text-biker-yellowHover transition-colors">
              Occasions
            </Link>
            <Link href="/over-ons" className="text-biker-yellow hover:text-biker-yellowHover transition-colors">
              Over Ons
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8">
          <p className="text-sm text-biker-muted">
            Hulp nodig? Bel ons op{' '}
            <a 
              href="tel:0615452108" 
              className="text-biker-yellow hover:text-biker-yellowHover transition-colors font-medium"
            >
              06 15 45 21 08
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
