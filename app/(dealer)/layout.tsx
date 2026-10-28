import { redirect } from 'next/navigation';
import { getDealerSession } from '@/lib/dealer/auth';
import { DealerNav } from '@/components/dealer/dealer-nav';

export default async function DealerLayout({ children }: { children: React.ReactNode }) {
  const { user, dealer, profile } = await getDealerSession();

  if (!user) {
    redirect('/login?redirect=/dealer');
  }

  if (!dealer || !profile?.is_dealer) {
    redirect('/');
  }

  if (dealer.status === 'rejected') {
    return (
      <div className="min-h-screen bg-gray-50">
        <DealerNav company={dealer.company_name} />
        <main className="max-w-3xl mx-auto px-4 py-16">
          <div className="bg-white border-2 border-red-200 rounded-2xl p-8">
            <h1 className="text-2xl font-bold mb-3">Account niet actief</h1>
            <p className="text-gray-600">Neem contact op met Bikerfun als je denkt dat dit niet klopt.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DealerNav company={dealer.company_name} />
      {dealer.status === 'pending' && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-sm px-4 py-3 text-center">
          Je aanmelding wordt nog bekeken. Je kunt alvast motoren aanmelden.
        </div>
      )}
      <main className="max-w-6xl mx-auto px-4 py-10">{children}</main>
    </div>
  );
}
