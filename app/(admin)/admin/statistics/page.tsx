import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { StatisticsClient } from './statistics-client';
import { getDetailedAnalytics } from '@/lib/analytics/queries';
import { subDays } from 'date-fns';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StatisticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string; startDate?: string; endDate?: string }>;
}) {
  const supabase = await createClient();
  
  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login?redirect=/admin/statistics');
  }

  const { data: profileData } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  const profile = profileData as { is_admin: boolean } | null;

  if (!profile?.is_admin) {
    redirect('/');
  }

  const params = await searchParams;
  
  // Default to last 30 days
  const days = parseInt(params.days || '30');
  const endDate = params.endDate ? new Date(params.endDate) : new Date();
  const startDate = params.startDate ? new Date(params.startDate) : subDays(endDate, days);

  // Fetch analytics data
  const analytics = await getDetailedAnalytics(startDate, endDate);

  return (
    <div className="min-h-screen bg-biker-black pt-32 pb-12">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Website Statistieken</h1>
          <p className="text-gray-400">
            Uitgebreid overzicht van bezoekersgedrag en website prestaties
          </p>
        </div>

        <StatisticsClient 
          initialData={analytics}
          initialStartDate={startDate.toISOString()}
          initialEndDate={endDate.toISOString()}
        />
      </div>
    </div>
  );
}
