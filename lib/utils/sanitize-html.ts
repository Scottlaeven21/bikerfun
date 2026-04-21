/**
 * Sanitize HTML content from WooCommerce / Supabase.
 * Pure regex-based – no external dependencies, works identically in
 * browser and Node.js (Vercel server components).
 */
export function sanitizeHtmlDescription(html: string): string {
  if (!html) return '';

  try {
    let clean = html;

    // Fix escaped characters written as literal backslash sequences
    clean = clean.replace(/\\n/g, '<br />');
    clean = clean.replace(/\\r/g, '');
    clean = clean.replace(/\\t/g, ' ');
    clean = clean.replace(/\\"/g, '"');
    clean = clean.replace(/\\'/g, "'");

    // Remove dangerous elements
    clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    clean = clean.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
    clean = clean.replace(/<embed[^>]*>/gi, '');
    clean = clean.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '');

    // Remove dangerous attributes
    clean = clean.replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '');
    clean = clean.replace(/\bon\w+\s*=\s*[^\s>]*/gi, '');
    clean = clean.replace(/javascript\s*:/gi, '');
    clean = clean.replace(/vbscript\s*:/gi, '');
    clean = clean.replace(/data\s*:/gi, '');

    // Post-processing: clean up whitespace and empty tags
    clean = clean.replace(/ {2,}/g, ' ');
    clean = clean.replace(/(<br\s*\/?>){3,}/gi, '<br /><br />');
    clean = clean.replace(/<p>\s*<\/p>/g, '');
    clean = clean.trim();

    return clean;
  } catch {
    // Last resort: strip ALL tags and return plain text
    return html.replace(/<[^>]*>/g, '').trim();
  }
}
