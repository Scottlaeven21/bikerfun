import { getToEmail, isEmailConfigured, sendEmail } from '@/lib/email/client';
import {
  dealerApplicationAdminEmail,
  dealerStatusUpdateEmail,
} from '@/lib/email/templates';
import {
  APPLICATION_STATUS_HINTS,
  APPLICATION_STATUS_LABELS,
  isDealerOnlyStatus,
  shouldNotifyDealer,
  type ApplicationStatus,
} from './status';
import type { Dealer, DealerApplication } from './types';
import { dealerPortalUrl } from './auth';

function validEmail(value?: string | null) {
  const email = (value || '').trim();
  return email.includes('@') ? email : null;
}

async function sendStatusMail({
  to,
  greetingName,
  dealer,
  application,
  status,
  remark,
  withPortal,
}: {
  to: string;
  greetingName: string;
  dealer: Dealer;
  application: DealerApplication;
  status: ApplicationStatus;
  remark?: string;
  withPortal: boolean;
}) {
  const mail = dealerStatusUpdateEmail({
    greetingName,
    company: dealer.company_name,
    licensePlate: application.license_plate,
    statusLabel: APPLICATION_STATUS_LABELS[status],
    statusHint: APPLICATION_STATUS_HINTS[status],
    remark,
    portalUrl: withPortal ? dealerPortalUrl() : undefined,
    customerName: application.customer_name,
    forDealer: withPortal,
  });
  const result = await sendEmail({ to, subject: mail.subject, html: mail.html });
  if (!result.success) {
    throw new Error(result.error || `Mail naar ${to} mislukt`);
  }
}

async function notifyDealerAndCustomer(
  dealer: Dealer,
  application: DealerApplication,
  status: ApplicationStatus,
  remark?: string
) {
  const dealerEmail = validEmail(dealer.email);
  const customerEmail = validEmail(application.customer_email);
  if (!customerEmail && !isDealerOnlyStatus(status)) {
    console.warn('Geen klantmail verstuurd: geen geldig klant-e-mailadres op aanvraag', application.id);
  }

  const tasks: Promise<void>[] = [];

  if (dealerEmail && shouldNotifyDealer(dealer.email_updates, status)) {
    tasks.push(
      sendStatusMail({
        to: dealerEmail,
        greetingName: dealer.contact_name,
        dealer,
        application,
        status,
        remark,
        withPortal: true,
      })
    );
  }

  if (!isDealerOnlyStatus(status) && customerEmail && customerEmail.toLowerCase() !== dealerEmail?.toLowerCase()) {
    tasks.push(
      sendStatusMail({
        to: customerEmail,
        greetingName: application.customer_name || 'klant',
        dealer,
        application,
        status,
        remark,
        withPortal: false,
      })
    );
  }

  const results = await Promise.allSettled(tasks);
  const failed = results.filter((result) => result.status === 'rejected');
  if (failed.length) {
    console.error('Statusmail deels mislukt:', failed);
  }
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
    typeApproval: application.type_approval,
    brand: application.brand,
    model: application.model,
    customerEmail: application.customer_email,
    proceedOnApproval: application.proceed_on_approval,
  });
  await sendEmail({ to: getToEmail(), subject: adminMail.subject, html: adminMail.html });

  await notifyDealerAndCustomer(dealer, application, 'received');
}

export async function notifyApplicationStatus(
  dealer: Dealer,
  application: DealerApplication,
  status: ApplicationStatus,
  remark?: string
) {
  if (!isEmailConfigured()) return;
  await notifyDealerAndCustomer(dealer, application, status, remark);
}
