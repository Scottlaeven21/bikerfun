import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils/format';
import type { Dealer } from '@/lib/dealer/types';
import { CreateDealerForm, type DealerFormPrefill } from '@/components/admin/create-dealer-form';
import { DeleteDealerButton } from '@/components/admin/delete-dealer-button';
import { DealerTemplateUpload } from '@/components/admin/dealer-template-upload';

export const metadata = { title: 'Dealers | Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminDealersPage() {
  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from('dealers')
    .select('*')
    .order('created_at', { ascending: false });

  const dealers = (data as Dealer[] | null) || [];
  const dealerEmails = new Set(dealers.map((dealer) => dealer.email.toLowerCase()));

  const { data: signupData } = await (supabase as any)
    .from('form_submissions')
    .select('name, email, phone, motor_details, created_at')
    .eq('subject', 'Dealer omkeuren')
    .order('created_at', { ascending: false })
    .limit(30);

  const pendingSignups = ((signupData as Array<{
    name: string;
    email: string;
    phone?: string;
    motor_details?: Record<string, string | boolean | undefined>;
  }> | null) || [])
    .filter((signup) => signup.email && !dealerEmails.has(signup.email.toLowerCase()))
    .map((signup): DealerFormPrefill => {
      const details = signup.motor_details || {};
      return {
        name: signup.name,
        email: signup.email,
        phone: signup.phone,
        company: String(details.company || ''),
        location: String(details.location || ''),
        kvk: String(details.kvk || ''),
        vatNumber: String(details.vatNumber || ''),
        rdwRecognized: String(details.rdwRecognized || ''),
        hasWorkshop: String(details.hasWorkshop || ''),
      };
    })
    .filter((signup, index, list) => list.findIndex((item) => item.email?.toLowerCase() === signup.email?.toLowerCase()) === index)
    .slice(0, 8);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dealers</h1>
      <p className="text-gray-600 mb-6">Dealerportalen die jullie hebben aangemaakt.</p>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-2 border-biker-yellow">
        <h2 className="text-xl font-bold mb-4">Nieuw dealerportaal</h2>
        <CreateDealerForm pendingSignups={pendingSignups} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-2">Omkeurformulier voor dealers</h2>
        <p className="text-gray-600 text-sm mb-4">
          Upload een PDF. Dealers kunnen die in het portaal downloaden of printen.
        </p>
        <DealerTemplateUpload />
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded mb-6">
          Kon dealers niet laden. Voer eerst <code className="font-mono text-sm">032_dealer_portal.sql</code> uit in Supabase.
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Bedrijf</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Sinds</th>
              <th className="px-4 py-3"></th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {dealers.map((dealer) => (
              <tr key={dealer.id} className="border-t">
                <td className="px-4 py-3">
                  <Link href={`/admin/dealers/${dealer.id}`} className="font-semibold hover:underline">
                    {dealer.company_name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {dealer.contact_name}
                  <div className="text-gray-500">{dealer.email}</div>
                </td>
                <td className="px-4 py-3 text-gray-600">{formatDate(dealer.created_at)}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/dealers/${dealer.id}#facturen`} className="font-semibold text-sm hover:underline">
                    Factuur
                  </Link>
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteDealerButton dealerId={dealer.id} companyName={dealer.company_name} compact />
                </td>
              </tr>
            ))}
            {!dealers.length && !error && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Nog geen dealers.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
