'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

type Props = {
  descriptionHtml: string;
  hasShortDescriptionAbove: boolean;
};

export function ProductDetailAccordions({ descriptionHtml, hasShortDescriptionAbove }: Props) {
  const showFullDescription = Boolean(descriptionHtml?.trim());

  return (
    <div className="mt-8 border-t border-gray-200 pt-2">
      {showFullDescription && (
        <AccordionItem title="Volledige productinformatie">
          <div
            className="prose prose-sm max-w-none text-gray-700 prose-headings:text-biker-black prose-p:text-gray-700 prose-a:text-biker-yellow prose-strong:text-biker-black prose-ul:text-gray-700 prose-li:marker:text-biker-yellow"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
          {hasShortDescriptionAbove ? (
            <p className="mt-4 text-xs text-gray-500">
              Bekijk boven ook de korte samenvatting bij de prijs.
            </p>
          ) : null}
        </AccordionItem>
      )}

      <AccordionItem title="Verzending & levering">
        <p className="text-sm leading-relaxed text-gray-600">
          We verzenden met betrouwbare vervoerders. Levertijd en verzendkosten hangen af van je bestelling en
          adres — alle details vind je op onze verzendpagina.
        </p>
        <Link
          href="/verzending"
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-biker-yellow hover:text-biker-yellowHover"
        >
          Naar verzendinformatie
          <span aria-hidden>→</span>
        </Link>
      </AccordionItem>

      <AccordionItem title="Retourneren">
        <p className="text-sm leading-relaxed text-gray-600">
          Wil je een artikel retourneren? Check onze voorwaarden voor de voorwaarden, bedenktijd en hoe je een
          retour aanmeldt.
        </p>
        <Link
          href="/voorwaarden"
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-biker-yellow hover:text-biker-yellowHover"
        >
          Naar algemene voorwaarden
          <span aria-hidden>→</span>
        </Link>
      </AccordionItem>

      <AccordionItem title="Veelgestelde vragen">
        <p className="text-sm leading-relaxed text-gray-600">
          Antwoorden op vragen over bestellen, betalen, garantie en meer staan op onze FAQ-pagina.
        </p>
        <Link
          href="/faq"
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-biker-yellow hover:text-biker-yellowHover"
        >
          Naar FAQ
          <span aria-hidden>→</span>
        </Link>
      </AccordionItem>

      <AccordionItem title="Contact & service">
        <p className="text-sm leading-relaxed text-gray-600">
          Vragen over dit product of je bestelling? Neem gerust contact op — we helpen je graag verder.
        </p>
        <Link
          href="/contact"
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-biker-yellow hover:text-biker-yellowHover"
        >
          Contactpagina
          <span aria-hidden>→</span>
        </Link>
      </AccordionItem>

      <AccordionItem title="Privacy">
        <p className="text-sm leading-relaxed text-gray-600">
          Hoe we met je gegevens omgaan, lees je in ons privacybeleid.
        </p>
        <Link
          href="/privacy-policy"
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-biker-yellow hover:text-biker-yellowHover"
        >
          Naar privacybeleid
          <span aria-hidden>→</span>
        </Link>
      </AccordionItem>
    </div>
  );
}

function AccordionItem({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group border-b border-gray-100 last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3.5 text-left text-sm font-semibold text-biker-black transition hover:text-gray-700 [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 transition group-open:rotate-45 group-open:border-biker-yellow group-open:bg-biker-yellow/10 group-open:text-biker-black"
          aria-hidden
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </summary>
      <div className="border-l-2 border-biker-yellow pb-4 pl-4 pr-1">{children}</div>
    </details>
  );
}
