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
