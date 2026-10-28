import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils/format';
import { ApplicationStatusBadge } from '@/components/dealer/status-badge';
import type { DealerApplication } from '@/lib/dealer/types';

export const metadata = { title: 'Omkeuren | Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminOmkeurenPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const supabase = await createClient();
  let query = (supabase as any)
    .from('dealer_applications')
    .select('*, dealers(company_name, email, contact_name, phone)')
    .order('created_at', { ascending: false });

  if (filter === 'completed') query = query.eq('status', 'completed');
  if (filter === 'open') query = query.neq('status', 'completed');

  const { data, error } = await query;
  const applications = (data as DealerApplication[] | null) || [];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dealer-omkeuringen</h1>
      <p className="text-gray-600 mb-6">Zet de status handmatig. Dealers en klanten krijgen automatisch een mail.</p>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded mb-6">
          Kon aanvragen niet laden. Voer eerst <code className="font-mono text-sm">032_dealer_portal.sql</code> uit.
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <FilterLink href="/admin/omkeuren" active={!filter} label="Alles" />
        <FilterLink href="/admin/omkeuren?filter=open" active={filter === 'open'} label="Openstaand" />
        <FilterLink href="/admin/omkeuren?filter=completed" active={filter === 'completed'} label="Omgekeurd" />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Kenteken</th>
              <th className="px-4 py-3">Dealer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Datum</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-t">
                <td className="px-4 py-3">
                  <Link href={`/admin/omkeuren/${app.id}`} className="font-semibold hover:underline">
                    {app.license_plate}
                  </Link>
                </td>
                <td className="px-4 py-3">{app.dealers?.company_name || '—'}</td>
                <td className="px-4 py-3">
                  <ApplicationStatusBadge status={app.status} />
                </td>
                <td className="px-4 py-3 text-gray-600">{formatDate(app.created_at)}</td>
              </tr>
            ))}
            {!applications.length && !error && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  Nog geen aanvragen.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${
        active ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
      }`}
    >
      {label}
    </Link>
  );
}
