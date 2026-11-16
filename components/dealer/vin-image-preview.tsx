'use client';

import { useEffect, useState } from 'react';
import { getDealerDocumentUrl } from '@/app/actions/dealer';
import { DocumentLink } from '@/components/dealer/document-link';

export function VinImagePreview({ path }: { path: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getDealerDocumentUrl(path).then((result) => {
      if (active) setUrl(result.url);
    });
    return () => {
      active = false;
    };
  }, [path]);

  return (
    <div className="space-y-2">
      {url ? (
        <a href={url} target="_blank" rel="noreferrer">
          <img
            src={url}
            alt="Foto framenummer"
            className="max-h-72 rounded-lg border border-gray-200 object-contain bg-gray-50"
          />
        </a>
      ) : (
        <p className="text-sm text-gray-500">Foto laden…</p>
      )}
      <DocumentLink path={path} label="Open origineel" />
    </div>
  );
}
