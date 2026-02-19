// Email templates with Bikerfun branding

const BIKER_YELLOW = '#f5c80d';
const BIKER_BLACK = '#000000';

/**
 * Base email layout with Bikerfun styling
 */
function emailLayout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bikerfun</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${BIKER_BLACK} 0%, #1a1a1a 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: ${BIKER_YELLOW}; font-size: 32px; font-weight: bold; letter-spacing: 2px;">
                BIKERFUN
              </h1>
              <p style="margin: 10px 0 0; color: #ffffff; font-size: 14px;">
                Vrijheid begint op twee wielen
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 3px solid ${BIKER_YELLOW};">
              <p style="margin: 0 0 15px; color: #666; font-size: 14px; font-weight: bold;">
                BIKERFUN
              </p>
              <p style="margin: 0 0 5px; color: #666; font-size: 13px;">
                Rafaëlweg 23, 6114BX Susteren
              </p>
              <p style="margin: 0 0 5px; color: #666; font-size: 13px;">
                <a href="tel:+31616298684" style="color: ${BIKER_YELLOW}; text-decoration: none;">Tel: 06 16 29 86 84</a>
              </p>
              <p style="margin: 0 0 5px; color: #666; font-size: 13px;">
                <a href="mailto:info@bikerfun.nl" style="color: ${BIKER_YELLOW}; text-decoration: none;">Email: info@bikerfun.nl</a>
              </p>
              <p style="margin: 15px 0 0; color: #666; font-size: 13px;">
                <a href="https://wa.me/31616298684" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 8px 20px; border-radius: 25px; text-decoration: none; font-weight: bold; font-size: 12px; margin-top: 10px;">
                  💬 WhatsApp Ons
                </a>
              </p>
              <p style="margin: 15px 0 0; color: #999; font-size: 11px;">
                © ${new Date().getFullYear()} Bikerfun. Alle rechten voorbehouden.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Contact form submission email template
 */
export function contactFormEmail({
  name,
  email,
  phone,
  message,
}: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}): { subject: string; html: string } {
  const content = `
    <h2 style="margin: 0 0 20px; color: ${BIKER_BLACK}; font-size: 24px;">
      Nieuw contactformulier bericht
    </h2>
    
    <div style="background-color: ${BIKER_YELLOW}; padding: 3px; margin-bottom: 30px;"></div>
    
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
          <strong style="color: #666; font-size: 14px;">Naam:</strong>
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">
          <span style="color: ${BIKER_BLACK}; font-size: 14px;">${name}</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
          <strong style="color: #666; font-size: 14px;">Email:</strong>
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">
          <a href="mailto:${email}" style="color: ${BIKER_YELLOW}; text-decoration: none; font-size: 14px;">${email}</a>
        </td>
      </tr>
      ${
        phone
          ? `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
          <strong style="color: #666; font-size: 14px;">Telefoon:</strong>
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">
          <a href="tel:${phone}" style="color: ${BIKER_YELLOW}; text-decoration: none; font-size: 14px;">${phone}</a>
        </td>
      </tr>
      `
          : ''
      }
    </table>
    
    <div style="margin-top: 30px;">
      <h3 style="margin: 0 0 15px; color: ${BIKER_BLACK}; font-size: 18px;">Bericht:</h3>
      <div style="background-color: #f9f9f9; padding: 20px; border-left: 3px solid ${BIKER_YELLOW}; border-radius: 4px;">
        <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
      </div>
    </div>
    
    <div style="margin-top: 30px; padding: 20px; background-color: #f0f0f0; border-radius: 4px;">
      <p style="margin: 0; color: #666; font-size: 12px; text-align: center;">
        Dit bericht werd verzonden via het contactformulier op bikerfun.nl
      </p>
    </div>
  `;

  return {
    subject: `Nieuw contactbericht van ${name}`,
    html: emailLayout(content),
  };
}

/**
 * Motor op aanvraag email template
 */
export function motorAanvraagEmail({
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
}): { subject: string; html: string } {
  const content = `
    <h2 style="margin: 0 0 20px; color: ${BIKER_BLACK}; font-size: 24px;">
      Nieuwe motor aanvraag
    </h2>
    
    <div style="background-color: ${BIKER_YELLOW}; padding: 3px; margin-bottom: 30px;"></div>
    
    ${
      motorDetails
        ? `
    <div style="background: linear-gradient(135deg, ${BIKER_BLACK} 0%, #1a1a1a 100%); padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <h3 style="margin: 0 0 15px; color: ${BIKER_YELLOW}; font-size: 20px;">Motor informatie:</h3>
      <p style="margin: 0 0 10px; color: #ffffff; font-size: 18px; font-weight: bold;">
        ${motorDetails.brand || ''} ${motorDetails.model || ''}
      </p>
      ${
        motorDetails.price
          ? `
      <p style="margin: 0 0 10px; color: ${BIKER_YELLOW}; font-size: 16px;">
        € ${motorDetails.price.toLocaleString('nl-NL')},-
      </p>
      `
          : ''
      }
      ${
        motorDetails.occasionUrl
          ? `
      <a href="${motorDetails.occasionUrl}" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background-color: ${BIKER_YELLOW}; color: ${BIKER_BLACK}; text-decoration: none; font-weight: bold; border-radius: 25px; font-size: 14px;">
        BEKIJK OCCASION
      </a>
      `
          : ''
      }
    </div>
    `
        : ''
    }
    
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
          <strong style="color: #666; font-size: 14px;">Naam:</strong>
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">
          <span style="color: ${BIKER_BLACK}; font-size: 14px;">${name}</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
          <strong style="color: #666; font-size: 14px;">Email:</strong>
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">
          <a href="mailto:${email}" style="color: ${BIKER_YELLOW}; text-decoration: none; font-size: 14px;">${email}</a>
        </td>
      </tr>
      ${
        phone
          ? `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
          <strong style="color: #666; font-size: 14px;">Telefoon:</strong>
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">
          <a href="tel:${phone}" style="color: ${BIKER_YELLOW}; text-decoration: none; font-size: 14px;">${phone}</a>
        </td>
      </tr>
      `
          : ''
      }
    </table>
    
    <div style="margin-top: 30px;">
      <h3 style="margin: 0 0 15px; color: ${BIKER_BLACK}; font-size: 18px;">Bericht:</h3>
      <div style="background-color: #f9f9f9; padding: 20px; border-left: 3px solid ${BIKER_YELLOW}; border-radius: 4px;">
        <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
      </div>
    </div>
    
    <div style="margin-top: 30px; padding: 20px; background-color: #f0f0f0; border-radius: 4px;">
      <p style="margin: 0; color: #666; font-size: 12px; text-align: center;">
        Dit bericht werd verzonden via het aanvraagformulier op bikerfun.nl
      </p>
    </div>
  `;

  const subjectSuffix = motorDetails
    ? ` - ${motorDetails.brand || ''} ${motorDetails.model || ''}`.trim()
    : '';

  return {
    subject: `Nieuwe motor aanvraag van ${name}${subjectSuffix}`,
    html: emailLayout(content),
  };
}

/**
 * Auto-reply email for contact form
 */
export function contactAutoReplyEmail(name: string): { subject: string; html: string } {
  const content = `
    <h2 style="margin: 0 0 20px; color: ${BIKER_BLACK}; font-size: 24px;">
      Bedankt voor je bericht!
    </h2>
    
    <div style="background-color: ${BIKER_YELLOW}; padding: 3px; margin-bottom: 30px;"></div>
    
    <p style="margin: 0 0 20px; color: #333; font-size: 16px; line-height: 1.6;">
      Beste ${name},
    </p>
    
    <p style="margin: 0 0 20px; color: #333; font-size: 16px; line-height: 1.6;">
      Bedankt voor je bericht! We hebben je aanvraag goed ontvangen en nemen zo spoedig mogelijk contact met je op.
    </p>
    
    <p style="margin: 0 0 20px; color: #333; font-size: 16px; line-height: 1.6;">
      In de tussentijd kun je natuurlijk ook direct contact met ons opnemen:
    </p>
    
    <div style="background-color: #f9f9f9; padding: 20px; border-left: 3px solid ${BIKER_YELLOW}; border-radius: 4px; margin-bottom: 30px;">
      <p style="margin: 0 0 10px; color: #666; font-size: 14px;">
        <strong>Telefoon:</strong> <a href="tel:0616298684" style="color: ${BIKER_YELLOW}; text-decoration: none;">06 16 29 86 84</a>
      </p>
      <p style="margin: 0 0 10px; color: #666; font-size: 14px;">
        <strong>Email:</strong> <a href="mailto:info@bikerfun.nl" style="color: ${BIKER_YELLOW}; text-decoration: none;">info@bikerfun.nl</a>
      </p>
      <p style="margin: 0; color: #666; font-size: 14px;">
        <strong>Adres:</strong> Rafaëlweg 23, 6114BX Susteren
      </p>
    </div>
    
    <p style="margin: 0; color: #333; font-size: 16px; line-height: 1.6;">
      Met vriendelijke groet,<br>
      <strong>Team Bikerfun</strong>
    </p>
  `;

  return {
    subject: 'Bedankt voor je bericht - Bikerfun',
    html: emailLayout(content),
  };
}
