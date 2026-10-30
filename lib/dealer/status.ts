export const APPLICATION_STATUSES = [
  'received',
  'approved',
  'not_possible',
  'docs_requested',
  'awaiting_delivery',
  'rdw_submitted',
  'completed',
  'invoiced',
  'paid',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
export type SignedFormStatus = 'none' | 'waiting' | 'received';
export type DealerAccountStatus = 'pending' | 'active' | 'rejected';
export type InvoiceStatus = 'open' | 'partial' | 'paid';
export type DealerEmailUpdates = 'all' | 'action' | 'none';

export const DEALER_EMAIL_UPDATE_OPTIONS: {
  value: DealerEmailUpdates;
  label: string;
  hint: string;
}[] = [
  {
    value: 'all',
    label: 'Alle updates',
    hint: 'Elke statuswijziging per mail.',
  },
  {
    value: 'action',
    label: 'Alleen als er actie nodig is',
    hint: 'Bijvoorbeeld een machtigingsformulier of een openstaande factuur.',
  },
  {
    value: 'none',
    label: 'Geen statusmails',
    hint: 'Geen mails over de voortgang. Facturen sturen we wél.',
  },
];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  received: 'Aanvraag ontvangen',
  approved: 'Aanvraag goedgekeurd',
  docs_requested: 'Wachten op machtigingsformulier',
  awaiting_delivery: 'Wachten op levering',
  rdw_submitted: 'Aanvraag ingediend bij de RDW',
  completed: 'Registratie afgerond',
  not_possible: 'Aanvraag afgekeurd',
  invoiced: 'Gefactureerd',
  paid: 'Betaald',
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
  not_possible: 'Omkeuren is niet mogelijk voor deze motor.',
  invoiced: 'De factuur staat klaar in het dealerportaal.',
  paid: 'De factuur is voldaan. Bedankt.',
};

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  open: 'Nog te betalen',
  partial: 'Deels betaald',
  paid: 'Betaald',
};

export function invoiceAmountPaid(invoice: { amount_paid?: number | null }) {
  return Number(invoice.amount_paid) || 0;
}

export function invoiceRemaining(invoice: { amount: number; amount_paid?: number | null }) {
  return Math.max(0, Math.round((Number(invoice.amount) - invoiceAmountPaid(invoice)) * 100) / 100);
}

export function invoiceStatusFromAmounts(amount: number, amountPaid: number): InvoiceStatus {
  if (amountPaid <= 0.009) return 'open';
  if (amountPaid + 0.009 < amount) return 'partial';
  return 'paid';
}

export function isApplicationStatus(value: string): value is ApplicationStatus {
  return (APPLICATION_STATUSES as readonly string[]).includes(value);
}

export function isClosedApplication(status: ApplicationStatus) {
  return status === 'completed' || status === 'not_possible' || status === 'invoiced' || status === 'paid';
}

export function isDealerOnlyStatus(status: ApplicationStatus) {
  return status === 'invoiced' || status === 'paid';
}

export function isDealerActionStatus(status: ApplicationStatus) {
  return status === 'docs_requested' || status === 'invoiced';
}

export function shouldNotifyDealer(
  preference: DealerEmailUpdates | null | undefined,
  status: ApplicationStatus
) {
  if (preference === 'none') return false;
  if (preference === 'action') return isDealerActionStatus(status);
  return true;
}
