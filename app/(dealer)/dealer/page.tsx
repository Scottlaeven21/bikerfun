import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getDealerSession } from '@/lib/dealer/auth';
import { formatDate } from '@/lib/utils/format';
import { ApplicationStatusBadge, SignedFormBadge } from '@/components/dealer/status-badge';
import type { DealerApplication } from '@/lib/dealer/types';

export const metadata = { title: 'Dealerportaal - Bikerfun', robots: { index: false, follow: false } };

export default async function DealerHomePage() {
  const { dealer } = await getDealerSession();
  const supabase = await createClient();
  const { data } = await (supabase as any)
    .from('dealer_applications')
    .select('*')
    .eq('dealer_id', dealer!.id)
    .neq('status', 'completed')
    .order('created_at', { ascending: false });

  const applications = (data as DealerApplication[] | null) || [];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Openstaande omkeuringen</h1>
          <p className="text-gray-600 mt-1">Meld een motor aan, upload het formulier en volg de status.</p>
        </div>
        <Link
          href="/dealer/aanvragen/nieuw"
          className="bg-biker-yellow text-biker-black px-6 py-3 rounded-full font-bold uppercase text-sm"
        >
          Nieuwe aanvraag
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-10 text-center">
          <p className="text-gray-600 mb-4">Nog geen openstaande aanvragen.</p>
          <Link href="/dealer/aanvragen/nieuw" className="font-bold text-biker-black underline">
            Eerste motor aanmelden
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <Link
              key={app.id}
              href={`/dealer/aanvragen/${app.id}`}
              className="block bg-white rounded-xl border-2 border-gray-200 p-5 hover:border-biker-yellow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="font-bold text-lg">{app.license_plate}</p>
                  <p className="text-sm text-gray-600">
                    {[app.brand, app.model].filter(Boolean).join(' ') || 'Motor'} · {formatDate(app.created_at)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ApplicationStatusBadge status={app.status} />
                  <SignedFormBadge status={app.signed_form_status} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
