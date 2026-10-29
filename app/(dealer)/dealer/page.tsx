import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getDealerSession } from '@/lib/dealer/auth';
import { formatDate, formatPrice } from '@/lib/utils/format';
import { ApplicationStatusBadge, InvoiceStatusBadge } from '@/components/dealer/status-badge';
import { invoiceRemaining, isClosedApplication } from '@/lib/dealer/status';
import type { DealerApplication, DealerInvoice } from '@/lib/dealer/types';

export const metadata = { title: 'Dealerportaal - Bikerfun', robots: { index: false, follow: false } };

function averageDurationDays(applications: DealerApplication[]) {
  const done = applications.filter((app) => app.status === 'completed');
  if (!done.length) return null;
  const total = done.reduce((sum, app) => {
    const start = new Date(app.created_at).getTime();
    const end = new Date(app.updated_at).getTime();
    return sum + Math.max(0, end - start);
  }, 0);
  return Math.max(1, Math.round(total / done.length / 86_400_000));
}

export default async function DealerHomePage() {
  const { dealer } = await getDealerSession();
  const supabase = await createClient();
  const [{ data: appsData }, { data: invoicesData }] = await Promise.all([
    (supabase as any)
      .from('dealer_applications')
      .select('*')
      .eq('dealer_id', dealer!.id)
      .order('created_at', { ascending: false }),
    (supabase as any)
      .from('dealer_invoices')
      .select('*')
      .eq('dealer_id', dealer!.id)
      .order('created_at', { ascending: false }),
  ]);

  const applications = (appsData as DealerApplication[] | null) || [];
  const invoices = (invoicesData as DealerInvoice[] | null) || [];
  const openApps = applications.filter((app) => !isClosedApplication(app.status));
  const doneApps = applications.filter((app) => app.status === 'completed');
  const openInvoices = invoices.filter((invoice) => invoice.status !== 'paid');
  const paidInvoices = invoices.filter((invoice) => invoice.status === 'paid');
  const openTotal = openInvoices.reduce((sum, invoice) => sum + invoiceRemaining(invoice), 0);
  const avgDays = averageDurationDays(applications);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Overzicht</h1>
          <p className="text-gray-600 mt-1">Alle motoren, facturen en de status in één oogopslag.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dealer/formulier"
            className="bg-white text-biker-black border-2 border-gray-300 px-6 py-3 rounded-full font-bold uppercase text-sm hover:border-biker-yellow"
          >
            Formulier downloaden
          </Link>
          <Link
            href="/dealer/aanvragen/nieuw"
            className="bg-biker-yellow text-biker-black px-6 py-3 rounded-full font-bold uppercase text-sm"
          >
            Nieuwe aanvraag
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="In behandeling" value={String(openApps.length)} />
        <Stat label="Afgerond" value={String(doneApps.length)} />
        <Stat
          label="Gem. doorlooptijd"
          value={avgDays ? `${avgDays} dagen` : '—'}
          hint="Van aanvraag tot registratie afgerond"
        />
        <Stat label="Openstaand" value={formatPrice(openTotal)} hint={`${openInvoices.length} facturen`} />
      </div>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Alle motoren</h2>
        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-10 text-center">
            <p className="text-gray-600 mb-4">Nog geen aanvragen.</p>
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
                      {[app.brand, app.model].filter(Boolean).join(' ') || 'Motor'}
                      {app.customer_name ? ` · ${app.customer_name}` : ''}
                      {' · '}
                      {formatDate(app.created_at)}
                    </p>
                  </div>
                  <ApplicationStatusBadge status={app.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-bold text-gray-900">Facturen</h2>
          <Link href="/dealer/facturen" className="text-sm font-semibold underline">
            Alles bekijken
          </Link>
        </div>
        <InvoiceBlock title="Openstaand" invoices={openInvoices} empty="Geen openstaande facturen." />
        <InvoiceBlock title="Betaald" invoices={paidInvoices} empty="Nog geen betaalde facturen." />
      </section>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function InvoiceBlock({
  title,
  invoices,
  empty,
}: {
  title: string;
  invoices: DealerInvoice[];
  empty: string;
}) {
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      {invoices.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-5 text-sm text-gray-600">{empty}</div>
      ) : (
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-t first:border-t-0">
                  <td className="px-4 py-3">{invoice.description}</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(Number(invoice.amount))}</td>
                  <td className="px-4 py-3">
                    <InvoiceStatusBadge status={invoice.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(invoice.due_date || invoice.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
