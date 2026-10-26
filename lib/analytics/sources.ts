const SITE_HOSTS = ['bikerfun.nl', 'www.bikerfun.nl', 'localhost'];

export function normalizeTrafficSource(referrer: string | null | undefined): string {
  if (!referrer || referrer === 'Direct') return 'Direct';

  try {
    const url = referrer.includes('://') ? new URL(referrer) : new URL(`https://${referrer}`);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();

    if (SITE_HOSTS.some((site) => host === site || host.endsWith(`.${site}`))) {
      return 'Intern';
    }
    if (host.includes('google')) return 'Google';
    if (host.includes('facebook') || host === 'fb.com' || host.includes('l.facebook')) return 'Facebook';
    if (host.includes('instagram')) return 'Instagram';
    if (host.includes('tiktok')) return 'TikTok';
    if (host.includes('youtube')) return 'YouTube';
    if (host.includes('bing')) return 'Bing';
    if (host.includes('whatsapp')) return 'WhatsApp';
    return host;
  } catch {
    return 'Direct';
  }
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0s';
  const rounded = Math.round(seconds);
  if (rounded < 60) return `${rounded}s`;
  const minutes = Math.floor(rounded / 60);
  const rest = rounded % 60;
  if (minutes < 60) return rest ? `${minutes}m ${rest}s` : `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins ? `${hours}u ${mins}m` : `${hours}u`;
}

export function friendlyPageName(path: string): string {
  if (!path || path === '/') return 'Homepage';
  if (path === '/omkeuren') return 'Omkeuren';
  if (path === '/occasions') return 'Occasions';
  if (path.startsWith('/occasions/')) return 'Occasion detail';
  if (path === '/products') return 'Webshop';
  if (path.startsWith('/products/')) return 'Product';
  if (path === '/contact') return 'Contact';
  if (path === '/over-ons') return 'Over ons';
  if (path === '/cart') return 'Winkelwagen';
  if (path === '/checkout') return 'Afrekenen';
  return path;
}
