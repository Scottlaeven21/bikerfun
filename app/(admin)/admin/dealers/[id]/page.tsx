import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { formatDate, formatPrice } from '@/lib/utils/format';
import { DealerInvoiceForm } from '@/components/admin/dealer-invoice-form';
import { DealerInvoicePaidButton } from '@/components/admin/dealer-invoice-paid-button';
import { DocumentLink } from '@/components/dealer/document-link';
import { ApplicationStatusBadge, InvoiceStatusBadge } from '@/components/dealer/status-badge';
import type { Dealer, DealerApplication, DealerInvoice } from '@/lib/dealer/types';

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

  return (
    <div className="p-8 space-y-8">
      <Link href="/admin/dealers" className="text-sm text-gray-600 hover:underline">
        ← Dealers
      </Link>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-2">{dealer.company_name}</h1>
        <p className="text-gray-600">
          {dealer.contact_name} · {dealer.email}
          {dealer.phone ? ` · ${dealer.phone}` : ''}
        </p>
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

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-xl font-bold">Facturen</h2>
        <DealerInvoiceForm dealerId={dealer.id} />
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
