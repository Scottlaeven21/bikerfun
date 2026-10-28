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
                <a href="tel:+31615452108" style="color: ${BIKER_YELLOW}; text-decoration: none;">Tel: 06 15 45 21 08</a>
              </p>
              <p style="margin: 0 0 5px; color: #666; font-size: 13px;">
                <a href="mailto:info@bikerfun.nl" style="color: ${BIKER_YELLOW}; text-decoration: none;">Email: info@bikerfun.nl</a>
              </p>
              <p style="margin: 15px 0 0; color: #666; font-size: 13px;">
                <a href="https://wa.me/31615452108" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 8px 20px; border-radius: 25px; text-decoration: none; font-weight: bold; font-size: 12px; margin-top: 10px;">
                  WhatsApp Ons
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
        <strong>Telefoon:</strong> <a href="tel:+31615452108" style="color: ${BIKER_YELLOW}; text-decoration: none;">06 15 45 21 08</a>
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

/** Notificatie naar beheerder: webshopbestelling betaald (klant krijgt WooCommerce-mail apart). */
export function adminOrderPaidEmail(payload: {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  total: string;
  lines: Array<{ name: string; qty: number; lineTotal: string }>;
  adminOrderUrl: string;
}): { subject: string; html: string } {
  const rows = payload.lines
    .map(
      (l) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(l.name)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${l.qty}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${escapeHtml(l.lineTotal)}</td>
    </tr>`
    )
    .join('');

  const content = `
    <h2 style="margin: 0 0 16px; color: ${BIKER_BLACK}; font-size: 22px;">
      Nieuwe betaalde webshopbestelling
    </h2>
    <div style="background-color: ${BIKER_YELLOW}; padding: 3px; margin-bottom: 24px;"></div>
    <p style="margin: 0 0 12px; color: #333; font-size: 15px;">
      Bestelling <strong>${escapeHtml(payload.orderNumber)}</strong> is betaald via Mollie.
      De klant ontvangt de orderbevestiging vanuit WooCommerce (indien sync gelukt is).
    </p>
    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <tr>
        <td style="padding: 6px 0; color: #555;"><strong>Klant</strong></td>
        <td style="padding: 6px 0;">${escapeHtml(payload.customerName)}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #555;"><strong>E-mail</strong></td>
        <td style="padding: 6px 0;"><a href="mailto:${escapeHtml(payload.customerEmail)}">${escapeHtml(payload.customerEmail)}</a></td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #555;"><strong>Totaal</strong></td>
        <td style="padding: 6px 0;"><strong>${escapeHtml(payload.total)}</strong></td>
      </tr>
    </table>
    <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
      <thead>
        <tr style="background: #f5f5f5;">
          <th style="padding: 8px; text-align: left;">Product</th>
          <th style="padding: 8px; text-align: center;">Aantal</th>
          <th style="padding: 8px; text-align: right;">Subtotaal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="margin: 24px 0 0;">
      <a href="${payload.adminOrderUrl}" style="display: inline-block; background: ${BIKER_YELLOW}; color: ${BIKER_BLACK}; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
        Bekijk in admin
      </a>
    </p>
  `;

  return {
    subject: `Betaald: bestelling ${payload.orderNumber} — Bikerfun webshop`,
    html: emailLayout(content),
  };
}

export function omkeurenEmail({
  name,
  email,
  phone,
  company,
  location,
  kvk,
  vatNumber,
  rdwRecognized,
  hasWorkshop,
  estimatedOmkeuren,
  isDealer,
  brand,
  model,
  generation,
  licensePlate,
  typeApproval,
  year,
  vin,
  message,
}: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  location?: string;
  kvk?: string;
  vatNumber?: string;
  rdwRecognized?: string;
  hasWorkshop?: string;
  estimatedOmkeuren?: string;
  isDealer: boolean;
  brand?: string;
  model?: string;
  generation?: string;
  licensePlate?: string;
  typeApproval?: string;
  year?: string;
  vin?: string;
  message?: string;
}): { subject: string; html: string } {
  const row = (label: string, value?: string) =>
    value
      ? `<tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
            <strong style="color: #666; font-size: 14px;">${label}:</strong>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">
            <span style="color: ${BIKER_BLACK}; font-size: 14px;">${escapeHtml(value)}</span>
          </td>
        </tr>`
      : '';

  const content = `
    <h2 style="margin: 0 0 20px; color: ${BIKER_BLACK}; font-size: 24px;">
      ${isDealer ? 'Nieuwe dealer-aanmelding omkeuren' : 'Nieuwe omkeur-aanvraag'}
    </h2>
    <div style="background-color: ${BIKER_YELLOW}; padding: 3px; margin-bottom: 30px;"></div>
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
      ${row('Type', isDealer ? 'Dealer / motorzaak' : 'Particulier')}
      ${row('Contactpersoon', name)}
      ${row('Bedrijf', company)}
      ${row('Locatie', location)}
      ${row('KVK', kvk)}
      ${row('BTW-nummer', vatNumber)}
      ${row('RDW-erkend', rdwRecognized)}
      ${row('Werkplaats', hasWorkshop)}
      ${row('Geschatte omkeuringen', estimatedOmkeuren)}
      ${row('Email', email)}
      ${row('Telefoon', phone)}
      ${row('Merk', brand)}
      ${row('Model', model)}
      ${row('Generatie', generation)}
      ${row('Kenteken', licensePlate)}
      ${row('Typegoedkeuring', typeApproval)}
      ${row('Bouwjaar', year)}
      ${row('Framenummer', vin)}
    </table>
    ${
      message
        ? `<div style="margin-top: 30px;">
            <h3 style="margin: 0 0 15px; color: ${BIKER_BLACK}; font-size: 18px;">Bericht:</h3>
            <div style="background-color: #f9f9f9; padding: 20px; border-left: 3px solid ${BIKER_YELLOW}; border-radius: 4px;">
              <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
            </div>
          </div>`
        : ''
    }
  `;

  return {
    subject: isDealer
      ? `Dealer-aanmelding omkeuren van ${name}`
      : `Omkeur-aanvraag: ${[brand, model].filter(Boolean).join(' ') || 'motor'} van ${name}`,
    html: emailLayout(content),
  };
}

export function admin2faEmail(code: string): { subject: string; html: string } {
  const content = `
    <h2 style="margin: 0 0 20px; color: ${BIKER_BLACK}; font-size: 24px;">
      Je inlogcode
    </h2>
    <p style="margin: 0 0 20px; color: #333; font-size: 15px; line-height: 1.6;">
      Iemand probeert in te loggen op het Bikerfun admin-panel. Gebruik deze code binnen 10 minuten:
    </p>
    <div style="background-color: #111; color: ${BIKER_YELLOW}; font-size: 36px; letter-spacing: 8px; font-weight: bold; text-align: center; padding: 22px 12px; border-radius: 8px; margin: 0 0 24px;">
      ${escapeHtml(code)}
    </div>
    <p style="margin: 0; color: #666; font-size: 13px;">
      Was jij dit niet? Wijzig dan meteen je wachtwoord en neem contact op.
    </p>
  `;
  return {
    subject: `${code} is je Bikerfun admin-code`,
    html: emailLayout(content),
  };
}

export function adminWelcomeEmail({
  name,
  email,
  password,
  loginUrl,
  existingAccount,
}: {
  name: string;
  email: string;
  password: string | null;
  loginUrl: string;
  existingAccount: boolean;
}): { subject: string; html: string } {
  const content = existingAccount
    ? `
    <h2 style="margin: 0 0 20px; color: ${BIKER_BLACK}; font-size: 24px;">
      Je hebt nu admin-toegang
    </h2>
    <p style="margin: 0 0 16px; color: #333; font-size: 15px; line-height: 1.6;">
      Hallo ${escapeHtml(name)}, dit account (${escapeHtml(email)}) kan inloggen op het Bikerfun admin-panel.
      Gebruik je bestaande wachtwoord.
    </p>
    <p style="margin: 24px 0 0;">
      <a href="${loginUrl}" style="display:inline-block;background:${BIKER_YELLOW};color:${BIKER_BLACK};text-decoration:none;font-weight:bold;padding:14px 22px;border-radius:999px;">
        Inloggen als admin
      </a>
    </p>
  `
    : `
    <h2 style="margin: 0 0 20px; color: ${BIKER_BLACK}; font-size: 24px;">
      Je Bikerfun admin-account
    </h2>
    <p style="margin: 0 0 16px; color: #333; font-size: 15px; line-height: 1.6;">
      Hallo ${escapeHtml(name)}, er is een extra admin-account voor je gemaakt.
      De 2FA-code gaat naar dit e-mailadres.
    </p>
    <table role="presentation" style="width:100%;border-collapse:collapse;margin:20px 0;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;">E-mail</td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;font-weight:bold;">${escapeHtml(email)}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;">Tijdelijk wachtwoord</td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;font-weight:bold;">${escapeHtml(password || '')}</td>
      </tr>
    </table>
    <p style="margin: 0 0 20px; color: #666; font-size: 13px;">
      Bij de eerste login moet je dit tijdelijke wachtwoord vervangen door een eigen wachtwoord.
    </p>
    <p style="margin: 24px 0 0;">
      <a href="${loginUrl}" style="display:inline-block;background:${BIKER_YELLOW};color:${BIKER_BLACK};text-decoration:none;font-weight:bold;padding:14px 22px;border-radius:999px;">
        Inloggen als admin
      </a>
    </p>
  `;

  return {
    subject: existingAccount ? 'Admin-toegang Bikerfun' : 'Je Bikerfun admin-account',
    html: emailLayout(content),
  };
}

export function dealerWelcomeEmail({
  name,
  company,
  email,
  password,
  loginUrl,
  existingAccount,
}: {
  name: string;
  company: string;
  email: string;
  password: string | null;
  loginUrl: string;
  existingAccount: boolean;
}): { subject: string; html: string } {
  const content = existingAccount
    ? `
    <h2 style="margin: 0 0 20px; color: ${BIKER_BLACK}; font-size: 24px;">
      Je dealerportaal staat klaar
    </h2>
    <p style="margin: 0 0 16px; color: #333; font-size: 15px; line-height: 1.6;">
      Hallo ${escapeHtml(name)}, je motorzaak ${escapeHtml(company)} is aangemeld bij Bikerfun.
      Log in met dit e-mailadres (${escapeHtml(email)}) en je bestaande wachtwoord.
    </p>
    <p style="margin: 24px 0 0;">
      <a href="${loginUrl}" style="display:inline-block;background:${BIKER_YELLOW};color:${BIKER_BLACK};text-decoration:none;font-weight:bold;padding:14px 22px;border-radius:999px;">
        Open dealerportaal
      </a>
    </p>
  `
    : `
    <h2 style="margin: 0 0 20px; color: ${BIKER_BLACK}; font-size: 24px;">
      Welkom in het dealerportaal
    </h2>
    <p style="margin: 0 0 16px; color: #333; font-size: 15px; line-height: 1.6;">
      Hallo ${escapeHtml(name)}, we hebben een account gemaakt voor ${escapeHtml(company)}.
      Daarmee meld je motoren aan voor omkeuren en volg je de status.
    </p>
    <table role="presentation" style="width:100%;border-collapse:collapse;margin:20px 0;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;">E-mail</td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;font-weight:bold;">${escapeHtml(email)}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;">Tijdelijk wachtwoord</td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;font-weight:bold;">${escapeHtml(password || '')}</td>
      </tr>
    </table>
    <p style="margin: 0 0 20px; color: #666; font-size: 13px;">
      Bij de eerste login moet je dit tijdelijke wachtwoord vervangen door een eigen wachtwoord.
    </p>
    <p style="margin: 24px 0 0;">
      <a href="${loginUrl}" style="display:inline-block;background:${BIKER_YELLOW};color:${BIKER_BLACK};text-decoration:none;font-weight:bold;padding:14px 22px;border-radius:999px;">
        Inloggen op het portaal
      </a>
    </p>
  `;

  return {
    subject: existingAccount
      ? `Dealerportaal Bikerfun voor ${company}`
      : `Je Bikerfun dealer-account voor ${company}`,
    html: emailLayout(content),
  };
}

export function dealerApplicationAdminEmail({
  company,
  contact,
  email,
  licensePlate,
  meldcode,
  vin,
  brand,
  model,
  customerEmail,
}: {
  company: string;
  contact: string;
  email: string;
  licensePlate: string;
  meldcode: string;
  vin: string;
  brand?: string | null;
  model?: string | null;
  customerEmail?: string | null;
}): { subject: string; html: string } {
  const row = (label: string, value?: string | null) =>
    value
      ? `<tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;">${label}</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;">${escapeHtml(value)}</td>
        </tr>`
      : '';

  const content = `
    <h2 style="margin: 0 0 20px; color: ${BIKER_BLACK}; font-size: 24px;">
      Nieuwe dealer-omkeuring
    </h2>
    <table role="presentation" style="width:100%;border-collapse:collapse;">
      ${row('Dealer', company)}
      ${row('Contact', contact)}
      ${row('E-mail', email)}
      ${row('Kenteken', licensePlate)}
      ${row('Meldcode', meldcode)}
      ${row('Framenummer', vin)}
      ${row('Motor', [brand, model].filter(Boolean).join(' '))}
      ${row('Klant e-mail', customerEmail)}
    </table>
  `;

  return {
    subject: `Dealer-omkeuring ${licensePlate} — ${company}`,
    html: emailLayout(content),
  };
}

export function dealerStatusUpdateEmail({
  greetingName,
  company,
  licensePlate,
  statusLabel,
  statusHint,
  remark,
  portalUrl,
}: {
  greetingName: string;
  company: string;
  licensePlate: string;
  statusLabel: string;
  statusHint: string;
  remark?: string;
  portalUrl: string;
}): { subject: string; html: string } {
  const remarkHtml = remark
    ? `
    <div style="background:#f9f9f9;border-left:4px solid ${BIKER_YELLOW};padding:14px 16px;margin:0 0 24px;">
      <p style="margin:0 0 6px;color:#666;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.04em;">Opmerking van Bikerfun</p>
      <p style="margin:0;color:#333;font-size:15px;line-height:1.6;">${escapeHtml(remark).replace(/\n/g, '<br>')}</p>
    </div>`
    : '';

  const content = `
    <h2 style="margin: 0 0 20px; color: ${BIKER_BLACK}; font-size: 24px;">
      Update omkeuring ${escapeHtml(licensePlate)}
    </h2>
    <p style="margin: 0 0 16px; color: #333; font-size: 15px; line-height: 1.6;">
      Hallo ${escapeHtml(greetingName)}, de status van de omkeuring bij ${escapeHtml(company)} is bijgewerkt.
    </p>
    <div style="background:#111;color:${BIKER_YELLOW};font-weight:bold;padding:16px 18px;border-radius:8px;margin:0 0 16px;">
      ${escapeHtml(statusLabel)}
    </div>
    <p style="margin: 0 0 16px; color: #333; font-size: 15px; line-height: 1.6;">
      ${escapeHtml(statusHint)}
    </p>
    ${remarkHtml}
    <p style="margin: 0;">
      <a href="${portalUrl}" style="display:inline-block;background:${BIKER_YELLOW};color:${BIKER_BLACK};text-decoration:none;font-weight:bold;padding:14px 22px;border-radius:999px;">
        Bekijk in het portaal
      </a>
    </p>
  `;

  return {
    subject: `Status ${licensePlate}: ${statusLabel}`,
    html: emailLayout(content),
  };
}

export function bikerfunMailingEmail({
  title,
  body,
  buttonLabel,
  buttonUrl,
}: {
  title: string;
  body: string;
  buttonLabel?: string;
  buttonUrl?: string;
}): { html: string } {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map(
      (block) =>
        `<p style="margin: 0 0 16px; color: #333; font-size: 15px; line-height: 1.6;">${escapeHtml(block).replace(/\n/g, '<br>')}</p>`
    )
    .join('');

  const button =
    buttonLabel && buttonUrl
      ? `
    <p style="margin: 24px 0 0;">
      <a href="${escapeHtml(buttonUrl)}" style="display:inline-block;background:${BIKER_YELLOW};color:${BIKER_BLACK};text-decoration:none;font-weight:bold;padding:14px 22px;border-radius:999px;">
        ${escapeHtml(buttonLabel)}
      </a>
    </p>`
      : '';

  const content = `
    <h2 style="margin: 0 0 20px; color: ${BIKER_BLACK}; font-size: 24px;">
      ${escapeHtml(title)}
    </h2>
    ${paragraphs || `<p style="margin: 0; color: #333; font-size: 15px;"> </p>`}
    ${button}
  `;

  return { html: emailLayout(content) };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
