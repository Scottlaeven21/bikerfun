import { createClient } from '@/lib/supabase/server';
import { DocumentLink } from '@/components/dealer/document-link';
import { PrintButton } from '@/components/dealer/print-button';
import { DealerTerms } from '@/components/dealer/dealer-terms';

export const metadata = { title: 'Omkeurformulier - Dealerportaal', robots: { index: false, follow: false } };

export default async function DealerFormPage() {
  const supabase = await createClient();
  const { data } = await (supabase as any)
    .from('dealer_portal_settings')
    .select('form_path')
    .eq('id', 1)
    .maybeSingle();

  const formPath = (data as { form_path?: string } | null)?.form_path;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Formulier</h1>
        <p className="text-gray-600 mt-2">
          Download of print het omkeurformulier. Handig als je het op papier wilt invullen of aan de klant wilt meegeven.
        </p>
      </div>

      {formPath ? (
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
          <p className="mb-3 font-semibold">Officieel PDF-formulier</p>
          <DocumentLink path={formPath} label="Download PDF" />
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-sm">
          Er is nog geen PDF-sjabloon geüpload. Gebruik hieronder het printbare formulier tot Bikerfun de PDF klaarzet.
        </div>
      )}

      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 md:p-8 print:border-0 print:shadow-none">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-bold tracking-widest text-gray-500">BIKERFUN · DEALER</p>
            <h2 className="text-2xl font-bold">Omkeurformulier A2 / 35kW</h2>
          </div>
          <PrintButton />
        </div>

        <div className="space-y-5 text-sm">
          <Field label="Kenteken" />
          <Field label="Meldcode" />
          <Field label="Framenummer" />
          <Field label="Typegoedkeuring (e-nummer op het plaatje, bijv. e4*92/61*0190*…)" />
          <Field label="Merk / model / bouwjaar" />
          <Field label="Dealer / motorzaak" />
          <Field label="Contactpersoon" />
          <Field label="Naam klant" />
          <Field label="E-mail klant" />
          <div className="grid grid-cols-2 gap-6 pt-8">
            <div>
              <p className="font-semibold mb-8">Handtekening dealer</p>
              <div className="border-b border-gray-400 h-16" />
            </div>
            <div>
              <p className="font-semibold mb-8">Handtekening klant</p>
              <div className="border-b border-gray-400 h-16" />
            </div>
          </div>
        </div>

        <DealerTerms className="mt-10 pt-8 border-t border-gray-200" />
      </div>
    </div>
  );
}

function Field({ label }: { label: string }) {
  return (
    <div>
      <p className="text-gray-500 mb-2">{label}</p>
      <div className="border-b border-gray-300 h-8" />
    </div>
  );
}
