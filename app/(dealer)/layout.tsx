import { redirect } from 'next/navigation';
import { getDealerSession } from '@/lib/dealer/auth';
import { DealerNav } from '@/components/dealer/dealer-nav';
import { passwordChangePath } from '@/lib/auth/must-change-password';

export default async function DealerLayout({ children }: { children: React.ReactNode }) {
  const { user, dealer, profile } = await getDealerSession();

  if (!user) {
    redirect('/login?redirect=/dealer');
  }

  if (!dealer || !profile?.is_dealer) {
    redirect('/');
  }

  if (profile.must_change_password) {
    redirect(passwordChangePath('/dealer'));
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <DealerNav company={dealer.company_name} />
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-10 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {children}
      </main>
    </div>
  );
}
