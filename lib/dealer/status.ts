export const APPLICATION_STATUSES = [
  'received',
  'approved',
  'docs_requested',
  'awaiting_delivery',
  'rdw_submitted',
  'completed',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
export type SignedFormStatus = 'none' | 'waiting' | 'received';
export type DealerAccountStatus = 'pending' | 'active' | 'rejected';
export type InvoiceStatus = 'open' | 'paid';

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  received: 'Aanvraag ontvangen',
  approved: 'Aanvraag goedgekeurd',
  docs_requested: 'Wachten op machtigingsformulier',
  awaiting_delivery: 'Wachten op levering',
  rdw_submitted: 'Aanvraag ingediend bij de RDW',
  completed: 'Registratie afgerond',
};

export const APPLICATION_STATUS_HINTS: Record<ApplicationStatus, string> = {
  received: 'We hebben de aanvraag binnen en kijken of omkeuren mogelijk is.',
  approved: 'Omkeuren is mogelijk. We gaan verder met de papieren.',
  docs_requested:
    'We hebben een door de klant ondertekend machtigingsformulier nodig, zodat wij het vermogen namens de klant mogen wijzigen.',
  awaiting_delivery: 'We wachten op levering van documentatie van onze leverancier.',
  rdw_submitted: 'De aanvraag staat bij de RDW. Zodra die rond is, hoor je het.',
  completed:
    'Nieuw kentekenbewijs wordt aangemaakt en verzonden. Deze wordt binnen 1-3 werkdagen geleverd.',
};

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  open: 'Nog te betalen',
  paid: 'Betaald',
};

export function isApplicationStatus(value: string): value is ApplicationStatus {
  return (APPLICATION_STATUSES as readonly string[]).includes(value);
}
