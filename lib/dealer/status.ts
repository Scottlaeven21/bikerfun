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
  docs_requested: 'Documentatie aangevraagd',
  awaiting_delivery: 'Wachten op levering',
  rdw_submitted: 'Aanvraag ingediend bij de RDW',
  completed: 'Omgekeurd',
};

export const APPLICATION_STATUS_HINTS: Record<ApplicationStatus, string> = {
  received: 'We hebben de aanvraag binnen en kijken of omkeuren mogelijk is.',
  approved: 'Omkeuren is mogelijk. We gaan verder met de papieren.',
  docs_requested: 'Er is extra documentatie nodig. Check je mail of het portaal.',
  awaiting_delivery: 'We wachten tot de motor of de stukken bij ons zijn.',
  rdw_submitted: 'De aanvraag staat bij de RDW. Zodra die rond is, hoor je het.',
  completed: 'De motor is correct geregistreerd bij de RDW.',
};

export const SIGNED_FORM_LABELS: Record<SignedFormStatus, string> = {
  none: 'Formulier nog niet gestart',
  waiting: 'Wachten op ondertekend formulier',
  received: 'Ondertekend formulier ontvangen',
};

export const DEALER_STATUS_LABELS: Record<DealerAccountStatus, string> = {
  pending: 'In behandeling',
  active: 'Actief',
  rejected: 'Afgewezen',
};

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  open: 'Nog te betalen',
  paid: 'Betaald',
};

export function isApplicationStatus(value: string): value is ApplicationStatus {
  return (APPLICATION_STATUSES as readonly string[]).includes(value);
}

export function canSubmitToRdw(signedFormStatus: SignedFormStatus) {
  return signedFormStatus === 'received';
}

export function nextSignedFormStatus(current: SignedFormStatus, nextStatus: ApplicationStatus): SignedFormStatus {
  if (current === 'received') return 'received';
  if (nextStatus === 'received') return current;
  return current === 'none' ? 'waiting' : current;
}
