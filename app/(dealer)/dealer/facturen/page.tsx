import { createClient } from '@/lib/supabase/server';
import { getDealerSession } from '@/lib/dealer/auth';
import { formatDate, formatPrice } from '@/lib/utils/format';
import { DocumentLink } from '@/components/dealer/document-link';
import { InvoiceStatusBadge } from '@/components/dealer/status-badge';
import type { DealerInvoice } from '@/lib/dealer/types';

export const metadata = { title: 'Facturen - Dealerportaal', robots: { index: false, follow: false } };

export default async function DealerInvoicesPage() {
  const { dealer } = await getDealerSession();
  const supabase = await createClient();
  const { data } = await (supabase as any)
    .from('dealer_invoices')
    .select('*')
    .eq('dealer_id', dealer!.id)
    .order('created_at', { ascending: false });

  const invoices = (data as DealerInvoice[] | null) || [];
  const open = invoices.filter((i) => i.status === 'open');
  const paid = invoices.filter((i) => i.status === 'paid');
  const openTotal = open.reduce((sum, i) => sum + Number(i.amount), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Facturen</h1>
        <p className="text-gray-600 mt-1">
          Elke maand één verzamelfactuur voor de aanvragen van de maand ervoor. Betaal binnen 30 dagen.
        </p>
        <p className="text-gray-600 mt-1">
          Nog te betalen: <strong>{formatPrice(openTotal)}</strong> · {open.length} open · {paid.length} betaald
        </p>
      </div>

      <section>
        <h2 className="text-xl font-bold mb-3">Nog te betalen</h2>
        <InvoiceList invoices={open} empty="Geen openstaande facturen." />
      </section>
      <section>
        <h2 className="text-xl font-bold mb-3">Betaald</h2>
        <InvoiceList invoices={paid} empty="Nog geen betaalde facturen." />
      </section>
    </div>
  );
}

function InvoiceList({ invoices, empty }: { invoices: DealerInvoice[]; empty: string }) {
  if (!invoices.length) {
    return <div className="bg-white rounded-xl border-2 border-gray-200 p-6 text-gray-600">{empty}</div>;
  }

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="px-4 py-3">Omschrijving</th>
            <th className="px-4 py-3">Bedrag</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Datum</th>
            <th className="px-4 py-3">Factuur</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-t">
              <td className="px-4 py-3">{invoice.description}</td>
              <td className="px-4 py-3 font-semibold">{formatPrice(Number(invoice.amount))}</td>
              <td className="px-4 py-3">
                <InvoiceStatusBadge status={invoice.status} />
              </td>
              <td className="px-4 py-3 text-gray-600">
                {formatDate(invoice.due_date || invoice.paid_at || invoice.created_at)}
              </td>
              <td className="px-4 py-3">
                {invoice.pdf_path ? (
                  <DocumentLink path={invoice.pdf_path} label="Download PDF" />
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
