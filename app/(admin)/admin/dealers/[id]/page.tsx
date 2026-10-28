import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { formatDate, formatPrice } from '@/lib/utils/format';
import { DeleteDealerButton } from '@/components/admin/delete-dealer-button';
import { DealerInvoiceForm } from '@/components/admin/dealer-invoice-form';
import { DealerInvoicePaidButton } from '@/components/admin/dealer-invoice-paid-button';
import { DocumentLink } from '@/components/dealer/document-link';
import { ApplicationStatusBadge, InvoiceStatusBadge } from '@/components/dealer/status-badge';
import { APPLICATION_STATUS_LABELS } from '@/lib/dealer/status';
import type { Dealer, DealerApplication, DealerInvoice } from '@/lib/dealer/types';

function previousMonth() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    start,
    end,
    label: start.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' }),
  };
}

export const metadata = { title: 'Dealer | Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminDealerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: dealerData }, { data: appsData }, { data: invoicesData }] = await Promise.all([
    (supabase as any).from('dealers').select('*').eq('id', id).maybeSingle(),
    (supabase as any)
      .from('dealer_applications')
      .select('*')
      .eq('dealer_id', id)
      .order('created_at', { ascending: false }),
    (supabase as any)
      .from('dealer_invoices')
      .select('*')
      .eq('dealer_id', id)
      .order('created_at', { ascending: false }),
  ]);

  const dealer = dealerData as Dealer | null;
  if (!dealer) notFound();
  const applications = (appsData as DealerApplication[] | null) || [];
  const invoices = (invoicesData as DealerInvoice[] | null) || [];
  const period = previousMonth();
  const monthApps = applications.filter((app) => {
    const created = new Date(app.created_at);
    return created >= period.start && created < period.end;
  });

  return (
    <div className="p-8 space-y-8">
      <Link href="/admin/dealers" className="text-sm text-gray-600 hover:underline">
        ← Dealers
      </Link>
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{dealer.company_name}</h1>
          <p className="text-gray-600">
            {dealer.contact_name} · {dealer.email}
            {dealer.phone ? ` · ${dealer.phone}` : ''}
          </p>
        </div>
        <DeleteDealerButton dealerId={dealer.id} companyName={dealer.company_name} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Aanvragen</h2>
        <div className="space-y-2">
          {applications.map((app) => (
            <Link
              key={app.id}
              href={`/admin/omkeuren/${app.id}`}
              className="flex items-center justify-between border rounded-lg p-3 hover:border-biker-yellow"
            >
              <span className="font-semibold">{app.license_plate}</span>
              <ApplicationStatusBadge status={app.status} />
            </Link>
          ))}
          {!applications.length && <p className="text-gray-500">Nog geen aanvragen.</p>}
        </div>
      </div>

      <div id="facturen" className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-xl font-bold">Verzamelfacturen</h2>
        <p className="text-sm text-gray-600">
          Eén factuur per maand voor alle aanvragen van de maand ervoor. Upload jullie PDF; de dealer
          ziet die in het portaal en krijgt een e-mail.
        </p>
        {monthApps.length > 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-semibold mb-2">
              Aanvragen {period.label} ({monthApps.length})
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              {monthApps.map((app) => (
                <li key={app.id}>
                  {app.license_plate}
                  {app.brand || app.model ? ` · ${[app.brand, app.model].filter(Boolean).join(' ')}` : ''}
                  {' · '}
                  {APPLICATION_STATUS_LABELS[app.status]}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Geen aanvragen in {period.label}.</p>
        )}
        <DealerInvoiceForm
          dealerId={dealer.id}
          defaultDescription={`Verzamelfactuur ${period.label}`}
        />
        <table className="w-full text-sm">
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-t">
                <td className="py-3">{invoice.description}</td>
                <td className="py-3">{formatPrice(Number(invoice.amount))}</td>
                <td className="py-3">
                  <InvoiceStatusBadge status={invoice.status} />
                </td>
                <td className="py-3 text-gray-500">{formatDate(invoice.due_date || invoice.created_at)}</td>
                <td className="py-3">
                  {invoice.pdf_path ? (
                    <DocumentLink path={invoice.pdf_path} label="PDF" />
                  ) : (
                    <span className="text-gray-400">Geen PDF</span>
                  )}
                </td>
                <td className="py-3">
                  <DealerInvoicePaidButton invoiceId={invoice.id} paid={invoice.status === 'paid'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
