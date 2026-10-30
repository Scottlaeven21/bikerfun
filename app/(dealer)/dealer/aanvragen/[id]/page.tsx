import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getDealerSession } from '@/lib/dealer/auth';
import { APPLICATION_STATUS_HINTS } from '@/lib/dealer/status';
import { formatDate } from '@/lib/utils/format';
import { ApplicationStatusBadge } from '@/components/dealer/status-badge';
import { CustomerEmailForm } from '@/components/dealer/customer-email-form';
import { DocumentLink } from '@/components/dealer/document-link';
import { SignedFormUpload } from '@/components/dealer/signed-form-upload';
import type { DealerApplication } from '@/lib/dealer/types';

export const metadata = { title: 'Omkeuring - Dealerportaal', robots: { index: false, follow: false } };

export default async function DealerApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { dealer } = await getDealerSession();
  const supabase = await createClient();
  const { data } = await (supabase as any)
    .from('dealer_applications')
    .select('*')
    .eq('id', id)
    .eq('dealer_id', dealer!.id)
    .maybeSingle();

  const application = data as DealerApplication | null;
  if (!application) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/dealer" className="text-sm font-semibold text-gray-600 hover:underline">
        ← Terug naar overzicht
      </Link>
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">{application.license_plate}</h1>
            <p className="text-gray-600">
              {[application.brand, application.model, application.year].filter(Boolean).join(' ') || 'Motor'}
            </p>
            <p className="text-sm text-gray-500 mt-1">Aangemeld {formatDate(application.created_at)}</p>
          </div>
          <ApplicationStatusBadge status={application.status} />
        </div>

        <p className="text-gray-700">{APPLICATION_STATUS_HINTS[application.status]}</p>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-gray-500">Meldcode</dt>
            <dd className="font-semibold">{application.meldcode}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Framenummer</dt>
            <dd className="font-semibold break-all">{application.vin}</dd>
          </div>
          {application.type_approval && (
            <div className="md:col-span-2">
              <dt className="text-gray-500">Typegoedkeuring</dt>
              <dd className="font-semibold break-all">{application.type_approval}</dd>
            </div>
          )}
          <div className="md:col-span-2">
            <dt className="text-gray-500">Na goedkeuring</dt>
            <dd className="font-semibold">
              {application.proceed_on_approval
                ? 'Direct doorstarten — documentatie mag meteen besteld worden.'
                : 'Eerst contact, nog niet automatisch verder.'}
            </dd>
          </div>
        </dl>

        {application.notes && (
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{application.notes}</p>
        )}
      </div>

      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 md:p-8 space-y-4">
        <h2 className="text-xl font-bold">Machtigingsformulier</h2>
        <p className="text-sm text-gray-600">
          Download het lege formulier, laat de klant tekenen en upload hier de PDF of een duidelijke foto.
        </p>
        <Link href="/dealer/formulier" className="inline-block text-sm font-semibold text-biker-yellow hover:underline">
          Leeg formulier downloaden
        </Link>
        {application.form_path && (
          <p className="text-sm text-gray-700">
            Geüpload{application.form_uploaded_at ? ` op ${formatDate(application.form_uploaded_at)}` : ''}.{' '}
            <DocumentLink path={application.form_path} label="Bekijk formulier" />
          </p>
        )}
        <SignedFormUpload applicationId={application.id} hasUpload={Boolean(application.form_path)} />
      </div>

      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 md:p-8 space-y-4">
        <h2 className="text-xl font-bold">Klantupdates</h2>
        <p className="text-sm text-gray-600">
          Als je hier een e-mailadres zet, krijgen jij en de klant allebei een mail bij elke statuswijziging. De klant ziet geen dealerportaal.
        </p>
        <CustomerEmailForm
          applicationId={application.id}
          customerName={application.customer_name || ''}
          customerEmail={application.customer_email || ''}
        />
      </div>
    </div>
  );
}
