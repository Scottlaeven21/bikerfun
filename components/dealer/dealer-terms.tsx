export const DEALER_TERMS = [
  'De dealer verklaart en garandeert dat iedere door hem ingediende aanvraag voor een vermogenswijziging betrekking heeft op een voertuig waarvan het motorvermogen daadwerkelijk en aantoonbaar is aangepast, overeenkomstig de toepasselijke wettelijke voorschriften, technische eisen en eventuele voorschriften van de fabrikant.',
  'De dealer is verantwoordelijk voor de correcte uitvoering van de technische werkzaamheden, de juistheid en volledigheid van de verstrekte gegevens en documenten en het naleven van de toepasselijke wet- en regelgeving.',
  'Alle aanvragen die door de dealer gedurende een kalendermaand worden ingediend en door BikerFun worden verwerkt, worden gebundeld gefactureerd op de 12e dag van de daaropvolgende kalendermaand.',
  'De dealer is verplicht iedere factuur volledig te voldoen binnen 30 kalenderdagen na de factuurdatum.',
  'Eventuele bezwaren tegen een factuur dienen door de dealer binnen een redelijke termijn schriftelijk en gemotiveerd te worden gemeld. Dit laat de wettelijke rechten en verplichtingen van beide partijen onverlet.',
] as const;

export function DealerTerms({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <h3 className="font-bold text-gray-900 mb-3">Voorwaarden dealer</h3>
      <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
        {DEALER_TERMS.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
