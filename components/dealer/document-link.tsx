'use client';

import { getDealerDocumentUrl } from '@/app/actions/dealer';

export function DocumentLink({ path, label }: { path: string; label: string }) {
  async function open() {
    const result = await getDealerDocumentUrl(path);
    if (result.url) window.open(result.url, '_blank', 'noopener,noreferrer');
    else alert(result.error || 'Bestand niet gevonden.');
  }

  return (
    <button type="button" onClick={open} className="text-sm font-semibold text-biker-yellow hover:underline">
      {label}
    </button>
  );
}
