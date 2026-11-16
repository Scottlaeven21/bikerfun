import { createClient } from '@/lib/supabase/server';
import { getDealerSession } from '@/lib/dealer/auth';
import { formatPrice } from '@/lib/utils/format';
import { DealerInvoiceList } from '@/components/dealer/invoice-list';
import { invoiceRemaining } from '@/lib/dealer/status';
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
  const open = invoices.filter((i) => i.status !== 'paid');
  const paid = invoices.filter((i) => i.status === 'paid');
  const openTotal = open.reduce((sum, i) => sum + invoiceRemaining(i), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Facturen</h1>
        <p className="text-gray-600 mt-1">
          Elke maand één verzamelfactuur voor de aanvragen van de maand ervoor. Betaal binnen 30 dagen.
        </p>
        <p className="text-gray-600 mt-1">
          Nog te betalen: <strong>{formatPrice(openTotal)}</strong> · {open.length} open · {paid.length} betaald
        </p>
      </div>

      <section>
        <h2 className="text-xl font-bold mb-3">Nog te betalen</h2>
        <DealerInvoiceList invoices={open} empty="Geen openstaande facturen." showPdf />
      </section>
      <section>
        <h2 className="text-xl font-bold mb-3">Betaald</h2>
        <DealerInvoiceList invoices={paid} empty="Nog geen betaalde facturen." showPdf />
      </section>
    </div>
  );
}

