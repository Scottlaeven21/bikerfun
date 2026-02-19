// Email client using Resend
// Documentation: https://resend.com/docs/send-with-nextjs

import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Check if email is properly configured
 */
export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY && !!process.env.RESEND_FROM_EMAIL;
}

/**
 * Get configured "from" email address
 */
export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL || 'noreply@bikerfun.nl';
}

/**
 * Get configured "to" email address (for receiving notifications)
 */
export function getToEmail(): string {
  return process.env.RESEND_TO_EMAIL || 'info@bikerfun.nl';
}

/**
 * Send email using Resend
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
      console.error('Email is not configured. Please add RESEND_API_KEY to environment variables.');
      return {
        success: false,
        error: 'Email service is not configured',
      };
    }

    const { data, error } = await resend.emails.send({
      from: getFromEmail(),
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text: text || stripHtml(html),
    });

    if (error) {
      console.error('Failed to send email:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      id: data?.id,
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

export { resend };
