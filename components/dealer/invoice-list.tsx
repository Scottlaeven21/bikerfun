import { formatDate, formatPrice } from '@/lib/utils/format';
import { DocumentLink } from '@/components/dealer/document-link';
import { InvoiceStatusBadge } from '@/components/dealer/status-badge';
import { invoiceRemaining } from '@/lib/dealer/status';
import type { DealerInvoice } from '@/lib/dealer/types';

export function DealerInvoiceList({
  invoices,
  empty,
  showPdf = false,
}: {
  invoices: DealerInvoice[];
  empty: string;
  showPdf?: boolean;
}) {
  if (!invoices.length) {
    return <div className="bg-white rounded-xl border-2 border-gray-200 p-5 text-sm text-gray-600">{empty}</div>;
  }

  return (
    <>
      <div className="md:hidden space-y-3">
        {invoices.map((invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} showPdf={showPdf} />
        ))}
      </div>
      <div className="hidden md:block bg-white rounded-xl border-2 border-gray-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[36rem]">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Omschrijving</th>
              <th className="px-4 py-3">Bedrag</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Datum</th>
              {showPdf && <th className="px-4 py-3">Factuur</th>}
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-t">
                <td className="px-4 py-3">{invoice.description}</td>
                <td className="px-4 py-3 font-semibold">
                  <AmountCell invoice={invoice} />
                </td>
                <td className="px-4 py-3">
                  <InvoiceStatusBadge status={invoice.status} />
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {formatDate(invoice.due_date || invoice.paid_at || invoice.created_at)}
                </td>
                {showPdf && (
                  <td className="px-4 py-3">
                    {invoice.pdf_path ? (
                      <DocumentLink path={invoice.pdf_path} label="Download PDF" />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function InvoiceCard({ invoice, showPdf }: { invoice: DealerInvoice; showPdf: boolean }) {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-gray-900 break-words">{invoice.description}</p>
        <InvoiceStatusBadge status={invoice.status} />
      </div>
      <div>
        <p className="text-lg font-bold">{formatPrice(Number(invoice.amount))}</p>
        <RemainingNote invoice={invoice} />
      </div>
      <p className="text-sm text-gray-600">
        {formatDate(invoice.due_date || invoice.paid_at || invoice.created_at)}
      </p>
      {showPdf && invoice.pdf_path && (
        <DocumentLink
          path={invoice.pdf_path}
          label="Download PDF"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full border-2 border-biker-yellow bg-biker-yellow px-4 py-2 text-sm font-bold uppercase tracking-wider text-biker-black"
        />
      )}
    </div>
  );
}

function AmountCell({ invoice }: { invoice: DealerInvoice }) {
  return (
    <>
      <div>{formatPrice(Number(invoice.amount))}</div>
      <RemainingNote invoice={invoice} />
    </>
  );
}

function RemainingNote({ invoice }: { invoice: DealerInvoice }) {
  if (invoice.status === 'paid' || invoiceRemaining(invoice) === Number(invoice.amount)) {
    return null;
  }
  return (
    <div className="text-xs font-normal text-gray-500">Restant {formatPrice(invoiceRemaining(invoice))}</div>
  );
}
