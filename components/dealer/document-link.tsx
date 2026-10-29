'use client';

import { getDealerDocumentUrl } from '@/app/actions/dealer';

export function DocumentLink({
  path,
  label,
  className = 'text-sm font-semibold text-biker-yellow hover:underline',
}: {
  path: string;
  label: string;
  className?: string;
}) {
  async function open() {
    const result = await getDealerDocumentUrl(path);
    if (result.url) window.open(result.url, '_blank', 'noopener,noreferrer');
    else alert(result.error || 'Bestand niet gevonden.');
  }

  return (
    <button type="button" onClick={open} className={className}>
      {label}
    </button>
  );
}
