/**
 * Sanitize HTML content from WooCommerce/external sources
 * Removes escape characters, fixes line breaks, and cleans up formatting
 */
export function sanitizeHtmlDescription(html: string): string {
  if (!html) return '';
  
  let clean = html;
  
  // Replace literal \n with actual line breaks
  clean = clean.replace(/\\n/g, '<br />');
  
  // Replace literal \r with nothing
  clean = clean.replace(/\\r/g, '');
  
  // Replace literal \t with spaces
  clean = clean.replace(/\\t/g, ' ');
  
  // Replace escaped quotes
  clean = clean.replace(/\\"/g, '"');
  clean = clean.replace(/\\'/g, "'");
  
  // Replace double+ spaces with single space
  clean = clean.replace(/ {2,}/g, ' ');
  
  // Replace multiple <br> tags with max 2
  clean = clean.replace(/(<br\s*\/?>){3,}/gi, '<br /><br />');
  
  // Remove empty paragraphs
  clean = clean.replace(/<p>\s*<\/p>/g, '');
  
  // Trim
  clean = clean.trim();
  
  return clean;
}
