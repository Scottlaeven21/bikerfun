import { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/forms/contact-form';

export const metadata: Metadata = {
  title: 'Contact | Bikerfun',
  description: 'Neem contact op met Bikerfun voor vragen over occasions, motorkleding of service.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black noise-overlay text-white">
      {/* Hero Section with Video */}
      <section className="relative h-[50vh] overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
        >
          <source src="/hero-contact.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-biker-black/70 via-biker-black/50 to-biker-black/90"></div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <h1 
              style={{ 
                fontFamily: 'var(--font-inter)',
                letterSpacing: '0.05em'
              }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-2xl uppercase"
            >
              Neem <span className="text-biker-yellow">Contact</span> Op
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              Vragen over een occasion? Interesse in motorkleding? Of gewoon even sparren over je volgende rit? 
              We helpen je graag verder!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ContactForm />

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Address */}
              <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-biker-yellow rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-biker-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Bezoekadres</h3>
                    <p className="text-biker-light">
                      Bikerfun<br />
                      Rafaëlweg 23<br />
                      6114BX Susteren
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-biker-yellow rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-biker-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Telefoon</h3>
                    <p className="text-biker-light">
                      <a href="tel:+31615452108" className="hover:text-biker-yellow transition-colors">
                        06 15 45 21 08
                      </a>
                    </p>
                    <p className="text-sm text-biker-muted mt-1">
                      Ma-Vr: 07:00 - 17:00<br />
                      Za: 12:00 - 17:00
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-biker-yellow rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-biker-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">E-mail</h3>
                    <p className="text-biker-light">
                      <a href="mailto:bikerfun.info@gmail.com" className="hover:text-biker-yellow transition-colors">
                        bikerfun.info@gmail.com
                      </a>
                    </p>
                    <p className="text-sm text-biker-muted mt-1">
                      We reageren binnen 24 uur
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray hover:border-biker-yellow transition-all">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">WhatsApp</h3>
                    <p className="text-biker-light">
                      <a 
                        href="https://wa.me/31615452108?text=Hoi%20Bikerfun%2C%20ik%20heb%20een%20vraag%20over..." 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-biker-yellow transition-colors"
                      >
                        06 15 45 21 08
                      </a>
                    </p>
                    <p className="text-sm text-biker-muted mt-1">
                      Direct chatten via WhatsApp
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray">
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">Volg Ons op TikTok</h3>
                <div className="flex justify-center">
                  <a
                    href="https://www.tiktok.com/@bikerfuntiktok"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-biker-black rounded-full flex items-center justify-center hover:bg-biker-yellow hover:text-biker-black transition-colors"
                    aria-label="TikTok"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-biker-dark border-y border-biker-gray/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight"
          >
            Liever <span className="text-biker-yellow">Persoonlijk</span> Contact?
          </h2>
          <p className="text-lg md:text-xl text-biker-light mb-10 max-w-3xl mx-auto">
            Kom gerust langs in onze showroom! Bekijk onze occasions, pas motorkleding 
            en drink een bakkie koffie terwijl we je adviseren.
          </p>
          <Link
            href="/occasions"
            style={{ fontFamily: 'var(--font-montserrat)' }}
            className="btn-primary inline-block bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300"
          >
            BEKIJK OCCASIONS
          </Link>
        </div>
      </section>
    </div>
  );
}
