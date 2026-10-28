import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getDealerSession } from '@/lib/dealer/auth';
import { formatDate } from '@/lib/utils/format';
import { ApplicationStatusBadge } from '@/components/dealer/status-badge';
import type { DealerApplication } from '@/lib/dealer/types';

export const metadata = { title: 'Omgekeurde motoren - Dealerportaal', robots: { index: false, follow: false } };

export default async function DealerCompletedPage() {
  const { dealer } = await getDealerSession();
  const supabase = await createClient();
  const { data } = await (supabase as any)
    .from('dealer_applications')
    .select('*')
    .eq('dealer_id', dealer!.id)
    .eq('status', 'completed')
    .order('updated_at', { ascending: false });

  const applications = (data as DealerApplication[] | null) || [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Omgekeurde motoren</h1>
      <p className="text-gray-600 mb-8">Alles wat correct bij de RDW staat.</p>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-10 text-center text-gray-600">
          Nog geen afgeronde omkeuringen.
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <Link
              key={app.id}
              href={`/dealer/aanvragen/${app.id}`}
              className="block bg-white rounded-xl border-2 border-gray-200 p-5 hover:border-biker-yellow"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-lg">{app.license_plate}</p>
                  <p className="text-sm text-gray-600">
                    {[app.brand, app.model].filter(Boolean).join(' ') || 'Motor'} · {formatDate(app.updated_at)}
                  </p>
                </div>
                <ApplicationStatusBadge status={app.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
