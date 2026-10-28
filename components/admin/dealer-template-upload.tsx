'use client';

import { useState } from 'react';
import { uploadDealerFormTemplate } from '@/app/actions/admin-dealers';

export function DealerTemplateUpload() {
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await uploadDealerFormTemplate(new FormData(e.currentTarget));
    setMessage(result.error || 'PDF-sjabloon geüpload. Dealers kunnen het downloaden.');
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-start">
      <input type="file" name="template_file" accept="application/pdf" required className="text-sm" />
      <button type="submit" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold">
        Upload PDF-sjabloon
      </button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  );
}
