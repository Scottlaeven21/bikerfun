import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils/format';
import { DealerStatusForm } from '@/components/admin/dealer-status-form';
import type { DealerApplication } from '@/lib/dealer/types';

export const metadata = { title: 'Omkeuring | Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminOmkeurenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await (supabase as any)
    .from('dealer_applications')
    .select('*, dealers(*)')
    .eq('id', id)
    .maybeSingle();

  const application = data as DealerApplication | null;
  if (!application) notFound();

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <Link href="/admin/omkeuren" className="text-sm text-gray-600 hover:underline">
        ← Omkeuringen
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
        <h1 className="text-3xl font-bold">{application.license_plate}</h1>
        <p className="text-gray-600">
          {application.dealers?.company_name} · {application.dealers?.contact_name}
        </p>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <Item label="Meldcode" value={application.meldcode} />
          <Item label="Framenummer" value={application.vin} />
          <Item label="Typegoedkeuring" value={application.type_approval ?? undefined} />
          <Item label="Motor" value={[application.brand, application.model, application.year].filter(Boolean).join(' ')} />
          <Item label="Klant" value={[application.customer_name, application.customer_email].filter(Boolean).join(' · ')} />
          <Item label="Aangemeld" value={formatDate(application.created_at)} />
        </dl>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Status bijwerken</h2>
        <DealerStatusForm applicationId={application.id} status={application.status} />
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
