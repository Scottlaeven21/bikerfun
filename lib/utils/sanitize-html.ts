import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content from WooCommerce/external sources
 * Uses DOMPurify for XSS protection + custom formatting cleanup
 */
export function sanitizeHtmlDescription(html: string): string {
  if (!html) return '';

  try {
    let clean = html;

    // Pre-processing: Fix escape characters before DOMPurify
    clean = clean.replace(/\\n/g, '<br />');
    clean = clean.replace(/\\r/g, '');
    clean = clean.replace(/\\t/g, ' ');
    clean = clean.replace(/\\"/g, '"');
    clean = clean.replace(/\\'/g, "'");

    // DOMPurify: Remove malicious scripts and tags
    clean = DOMPurify.sanitize(clean, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'b', 'i', 'ul', 'ol', 'li', 'a', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
      ALLOW_DATA_ATTR: false,
    });

    // Post-processing: Clean up formatting
    clean = clean.replace(/ {2,}/g, ' ');
    clean = clean.replace(/(<br\s*\/?>){3,}/gi, '<br /><br />');
    clean = clean.replace(/<p>\s*<\/p>/g, '');
    clean = clean.trim();

    return clean;
  } catch {
    // Als DOMPurify crasht (bijv. server-side JSDOM issue), geef plain text terug
    return html.replace(/<[^>]*>/g, '').trim();
  }
}
