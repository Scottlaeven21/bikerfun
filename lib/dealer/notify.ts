import { getToEmail, isEmailConfigured, sendEmail } from '@/lib/email/client';
import {
  dealerApplicationAdminEmail,
  dealerStatusUpdateEmail,
} from '@/lib/email/templates';
import {
  APPLICATION_STATUS_HINTS,
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from './status';
import type { Dealer, DealerApplication } from './types';
import { dealerPortalUrl } from './auth';

function recipients(dealer: Dealer, application: DealerApplication) {
  const map = new Map<string, string>();
  const add = (value?: string | null) => {
    const email = (value || '').trim();
    if (!email.includes('@')) return;
    const key = email.toLowerCase();
    if (!map.has(key)) map.set(key, email);
  };
  add(dealer.email);
  add(application.customer_email);
  return [...map.values()];
}

export async function notifyApplicationCreated(dealer: Dealer, application: DealerApplication) {
  if (!isEmailConfigured()) return;

  const adminMail = dealerApplicationAdminEmail({
    company: dealer.company_name,
    contact: dealer.contact_name,
    email: dealer.email,
    licensePlate: application.license_plate,
    meldcode: application.meldcode,
    vin: application.vin,
    brand: application.brand,
    model: application.model,
    customerEmail: application.customer_email,
  });
  await sendEmail({ to: getToEmail(), subject: adminMail.subject, html: adminMail.html });

  const to = recipients(dealer, application);
  if (!to.length) return;
  const mail = dealerStatusUpdateEmail({
    greetingName: application.customer_name || dealer.contact_name,
    company: dealer.company_name,
    licensePlate: application.license_plate,
    statusLabel: APPLICATION_STATUS_LABELS.received,
    statusHint: APPLICATION_STATUS_HINTS.received,
    portalUrl: dealerPortalUrl(),
  });
  await sendEmail({ to, subject: mail.subject, html: mail.html });
}

export async function notifyApplicationStatus(
  dealer: Dealer,
  application: DealerApplication,
  status: ApplicationStatus,
  remark?: string
) {
  if (!isEmailConfigured()) return;
  const to = recipients(dealer, application);
  if (!to.length) return;

  const mail = dealerStatusUpdateEmail({
    greetingName: application.customer_name || dealer.contact_name,
    company: dealer.company_name,
    licensePlate: application.license_plate,
    statusLabel: APPLICATION_STATUS_LABELS[status],
    statusHint: APPLICATION_STATUS_HINTS[status],
    remark,
    portalUrl: dealerPortalUrl(),
  });
  await sendEmail({ to, subject: mail.subject, html: mail.html });
}
