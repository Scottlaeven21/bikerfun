import { DocumentLink } from '@/components/dealer/document-link';
import { getDealerDocumentUrl } from '@/app/actions/dealer';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Omkeurformulier - Dealerportaal', robots: { index: false, follow: false } };

export default async function DealerFormPage() {
  const supabase = await createClient();
  const { data } = await (supabase as any)
    .from('dealer_portal_settings')
    .select('form_path')
    .eq('id', 1)
    .maybeSingle();

  const formPath = (data as { form_path?: string } | null)?.form_path;
  const preview = formPath ? await getDealerDocumentUrl(formPath) : { url: null };

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Formulier</h1>
        <p className="text-gray-600 mt-2">
          Download het officiële omkeurformulier, print het zelf uit en laat de klant tekenen.
        </p>
      </div>

      {formPath ? (
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="font-semibold">Officieel PDF-formulier</p>
            <DocumentLink path={formPath} label="Download PDF" />
          </div>
          {preview.url ? (
            <iframe
              src={preview.url}
              title="Voorbeeld omkeurformulier"
              className="w-full h-[80vh] rounded-xl border border-gray-200 bg-gray-50"
            />
          ) : (
            <p className="text-sm text-gray-500">Het voorbeeld kon niet worden geladen. Gebruik de downloadknop.</p>
          )}
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-sm">
          Er is nog geen PDF-sjabloon geüpload. Zodra Bikerfun die klaarzet, zie je hier het formulier.
        </div>
      )}
    </div>
  );
}
