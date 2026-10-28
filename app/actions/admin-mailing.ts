'use server';

import { getDealerSession } from '@/lib/dealer/auth';
import { isEmailConfigured, sendEmail } from '@/lib/email/client';
import { bikerfunMailingEmail } from '@/lib/email/templates';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_RECIPIENTS = 30;

function parseRecipients(value: string) {
  const unique = new Set<string>();
  for (const part of value.split(/[\s,;]+/)) {
    const email = part.trim().toLowerCase();
    if (!email) continue;
    unique.add(email);
  }
  return [...unique];
}

export async function sendAdminMailing(formData: FormData) {
  const session = await getDealerSession();
  if (!session.user || !session.profile?.is_admin) {
    return { error: 'Geen admin.' };
  }

  const recipients = parseRecipients(String(formData.get('to') || ''));
  const subject = String(formData.get('subject') || '').trim();
  const title = String(formData.get('title') || '').trim() || subject;
  const body = String(formData.get('body') || '').trim();
  const buttonLabel = String(formData.get('button_label') || '').trim();
  const buttonUrl = String(formData.get('button_url') || '').trim();

  if (!recipients.length) {
    return { error: 'Vul minstens één e-mailadres in.' };
  }
  if (recipients.length > MAX_RECIPIENTS) {
    return { error: `Maximaal ${MAX_RECIPIENTS} adressen per keer.` };
  }
  if (recipients.some((email) => !EMAIL_RE.test(email))) {
    return { error: 'Een of meer e-mailadressen zijn ongeldig.' };
  }
  if (!subject || !body) {
    return { error: 'Vul onderwerp en bericht in.' };
  }
  if ((buttonLabel && !buttonUrl) || (!buttonLabel && buttonUrl)) {
    return { error: 'Vul knoptekst en link allebei in, of laat beide leeg.' };
  }
  if (buttonUrl && !/^https?:\/\//i.test(buttonUrl)) {
    return { error: 'De knoplink moet met http:// of https:// beginnen.' };
  }
  if (!isEmailConfigured()) {
    return { error: 'E-mail is niet ingesteld. Controleer SMTP op Vercel.' };
  }

  const mail = bikerfunMailingEmail({
    title,
    body,
    buttonLabel: buttonLabel || undefined,
    buttonUrl: buttonUrl || undefined,
  });

  const failed: string[] = [];
  let sent = 0;
  for (const to of recipients) {
    const result = await sendEmail({ to, subject, html: mail.html });
    if (result.success) sent += 1;
    else failed.push(to);
  }

  if (!sent) {
    return { error: 'Versturen mislukt. Controleer SMTP.' };
  }
  if (failed.length) {
    return { error: `Verzonden naar ${sent}, mislukt: ${failed.join(', ')}` };
  }
  return { success: true, sent };
}
