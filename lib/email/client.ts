// Email client using SMTP (StackMail)
// Compatible with StackCP hosting email

import nodemailer from 'nodemailer';

/**
 * Check if email is properly configured
 */
export function isEmailConfigured(): boolean {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD &&
    process.env.SMTP_FROM_EMAIL
  );
}

/**
 * Get configured "from" email address
 */
export function getFromEmail(): string {
  return process.env.SMTP_FROM_EMAIL || 'info@bikerfun.nl';
}

/**
 * Get configured "to" email address (for receiving notifications)
 */
export function getToEmail(): string {
  return process.env.SMTP_TO_EMAIL || 'info@bikerfun.nl';
}

/** Eén of meerdere beheerders voor order-notificaties (komma-gescheiden). Valt terug op SMTP_TO_EMAIL. */
export function getAdminOrderNotificationRecipients(): string[] {
  const extra = process.env.SMTP_ADMIN_ORDER_EMAILS?.trim();
  if (extra) {
    return extra.split(',').map((e) => e.trim()).filter(Boolean);
  }
  return [getToEmail()];
}

/** Standaard aan. Zet op "false" om geen e-mail naar de klant te sturen na contactformulier. */
export function isContactFormAutoreplyEnabled(): boolean {
  return process.env.CONTACT_FORM_AUTOREPLY !== 'false';
}

/** Standaard aan. Zet op "false" om geen bevestiging naar de klant te sturen na motor-aanvraag. */
export function isMotorFormsAutoreplyEnabled(): boolean {
  return process.env.MOTOR_FORMS_AUTOREPLY !== 'false';
}

/** Standaard aan. E-mail naar beheerder bij eerste succesvolle betaling (Mollie). Klant krijgt geen dubbele shop-mail van SMTP. */
export function isAdminOrderPaidNotificationEnabled(): boolean {
  return process.env.ADMIN_ORDER_PAID_NOTIFICATION !== 'false';
}

/**
 * Create SMTP transporter
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

/**
 * Send email using SMTP
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    if (!isEmailConfigured()) {
      console.error('Email is not configured. Please add SMTP credentials to environment variables.');
      return {
        success: false,
        error: 'Email service is not configured',
      };
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: getFromEmail(),
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
      text: text || stripHtml(html),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent:', info.messageId);

    return {
      success: true,
      id: info.messageId,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Simple HTML to text converter
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}
