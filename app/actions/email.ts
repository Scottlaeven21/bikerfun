'use server';

// Server Actions for sending emails

import { sendEmail, getToEmail, isEmailConfigured } from '@/lib/email/client';
import {
  contactFormEmail,
  motorAanvraagEmail,
  contactAutoReplyEmail,
} from '@/lib/email/templates';

/**
 * Send contact form email
 */
export async function sendContactEmail({
  name,
  email,
  phone,
  message,
}: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  try {
    if (!isEmailConfigured()) {
      console.error('Email not configured');
      return {
        success: false,
        error: 'Email service is momenteel niet beschikbaar. Probeer het later opnieuw of bel ons direct.',
      };
    }

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
        success: false,
        error: 'Er is iets misgegaan bij het versturen. Probeer het opnieuw.',
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
    console.log('Motor aanvraag received:', { name, email, hasMotorDetails: !!motorDetails });

    if (!isEmailConfigured()) {
      console.error('Email not configured');
      return {
        success: false,
        error: 'Email service is momenteel niet beschikbaar. Probeer het later opnieuw of bel ons direct: 06 16 29 86 84',
      };
    }

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

    // Generate email content
    const emailContent = motorAanvraagEmail({
      name,
      email,
      phone,
      message,
      motorDetails: motorDetails || undefined,
    });

    console.log('Sending email to:', getToEmail());

    // Send to business
    const result = await sendEmail({
      to: getToEmail(),
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (!result.success) {
      console.error('Failed to send email:', result.error);
      return {
        success: false,
        error: 'Er is iets misgegaan bij het versturen. Probeer het opnieuw of bel ons: 06 16 29 86 84',
      };
    }

    console.log('Email sent successfully, sending auto-reply...');

    // Send auto-reply to customer
    try {
      const autoReply = contactAutoReplyEmail(name);
      await sendEmail({
        to: email,
        subject: autoReply.subject,
        html: autoReply.html,
      });
      console.log('Auto-reply sent successfully');
    } catch (autoReplyError) {
      console.error('Auto-reply failed (non-critical):', autoReplyError);
      // Don't fail the whole request if auto-reply fails
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
