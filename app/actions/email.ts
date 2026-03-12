'use server';

// Server Actions for sending emails

import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { sendEmail, getToEmail, isEmailConfigured } from '@/lib/email/client';
import {
  contactFormEmail,
  motorAanvraagEmail,
  contactAutoReplyEmail,
} from '@/lib/email/templates';

async function saveFormSubmission(data: {
  type: 'contact' | 'motor_aanvraag' | 'bezichtiging';
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
  motor_details?: object;
}) {
  const supabase = await createClient();
  const headersList = await headers();
  const forwarded = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');
  const referrer = headersList.get('referer') || '';

  let pagePath: string | null = null;
  try {
    if (referrer) pagePath = new URL(referrer).pathname;
  } catch {
    // Invalid URL, ignore
  }

  await (supabase as any).from('form_submissions').insert({
    ...data,
    ip_address: forwarded ? forwarded.split(',')[0].trim() : realIp || null,
    page_path: pagePath,
  });
}

/**
 * Send contact form email
 */
export async function sendContactEmail({
  name,
  email,
  phone,
  message,
  subject,
}: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
}) {
  try {
    // Validation
    if (!name || !email || !message) {
      return {
        success: false,
        error: 'Vul alle verplichte velden in.',
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Voer een geldig e-mailadres in.',
      };
    }

    // Always save to DB first (mailing may not work yet)
    await saveFormSubmission({
      type: 'contact',
      name,
      email,
      phone,
      message,
      subject,
    });

    if (!isEmailConfigured()) {
      return {
        success: true,
        message: 'Bericht ontvangen! We nemen zo snel mogelijk contact met je op.',
      };
    }

    // Generate email content
    const emailContent = contactFormEmail({ name, email, phone, message });

    // Send to business
    const result = await sendEmail({
      to: getToEmail(),
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (!result.success) {
      return {
        success: true,
        message: 'Bericht ontvangen! We nemen zo snel mogelijk contact met je op.',
      };
    }

    // Send auto-reply to customer
    const autoReply = contactAutoReplyEmail(name);
    await sendEmail({
      to: email,
      subject: autoReply.subject,
      html: autoReply.html,
    });

    return {
      success: true,
      message: 'Bericht succesvol verzonden! We nemen zo snel mogelijk contact met je op.',
    };
  } catch (error) {
    console.error('Contact form error:', error);
    return {
      success: false,
      error: 'Er is een onverwachte fout opgetreden. Probeer het later opnieuw.',
    };
  }
}

/**
 * Send motor aanvraag email
 */
export async function sendMotorAanvraagEmail({
  name,
  email,
  phone,
  message,
  motorDetails,
}: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  motorDetails?: {
    brand?: string;
    model?: string;
    price?: number;
    occasionUrl?: string;
  };
}) {
  try {
    // Validation
    if (!name || !email || !message) {
      return {
        success: false,
        error: 'Vul alle verplichte velden in.',
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Voer een geldig e-mailadres in.',
      };
    }

    // Always save to DB first (mailing may not work yet)
    // Bezichtiging = specific occasion, Motor aanvraag = general search
    await saveFormSubmission({
      type: motorDetails ? 'bezichtiging' : 'motor_aanvraag',
      name,
      email,
      phone,
      message,
      motor_details: motorDetails || undefined,
    });

    if (!isEmailConfigured()) {
      return {
        success: true,
        message: 'Aanvraag ontvangen! We nemen zo snel mogelijk contact met je op.',
      };
    }

    // Generate email content
    const emailContent = motorAanvraagEmail({
      name,
      email,
      phone,
      message,
      motorDetails: motorDetails || undefined,
    });

    // Send to business
    const result = await sendEmail({
      to: getToEmail(),
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (!result.success) {
      return {
        success: true,
        message: 'Aanvraag ontvangen! We nemen zo snel mogelijk contact met je op.',
      };
    }

    // Send auto-reply to customer
    try {
      const autoReply = contactAutoReplyEmail(name);
      await sendEmail({
        to: email,
        subject: autoReply.subject,
        html: autoReply.html,
      });
    } catch (autoReplyError) {
      console.error('Auto-reply failed (non-critical):', autoReplyError);
    }

    return {
      success: true,
      message: 'Aanvraag succesvol verzonden! We nemen zo snel mogelijk contact met je op.',
    };
  } catch (error) {
    console.error('Motor aanvraag error:', error);
    return {
      success: false,
      error: 'Er is een onverwachte fout opgetreden. Bel ons direct: 06 16 29 86 84',
    };
  }
}
