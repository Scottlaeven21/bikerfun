import { createAdminClient } from '@/lib/supabase/admin';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

export interface DailyStats {
  date: string;
  total_views: number;
  unique_visitors: number;
  bounce_rate?: number;
  avg_session_duration?: number;
}

export interface PageStats {
  page_path: string;
  views: number;
  unique_visitors: number;
}

export interface EventStats {
  event_name: string;
  count: number;
}

export interface DetailedAnalytics {
  dailyStats: DailyStats[];
  topPages: PageStats[];
  topEvents: EventStats[];
  totalStats: {
    total_views: number;
    unique_visitors: number;
    total_events: number;
    conversion_rate: number;
  };
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  referrerStats: Array<{
    referrer: string;
    count: number;
  }>;
}

export async function getDetailedAnalytics(
  startDate: Date,
  endDate: Date
): Promise<DetailedAnalytics> {
  const supabase = createAdminClient();
  
  const start = startOfDay(startDate).toISOString();
  const end = endOfDay(endDate).toISOString();

  // Get daily stats
  const { data: dailyData } = await (supabase as any)
    .rpc('get_daily_analytics', {
      start_date: start,
      end_date: end,
    });

  const dailyStats: DailyStats[] = dailyData || [];

  // Get page views grouped by page
  const { data: pageViewsData } = await (supabase as any)
    .from('page_views')
    .select('page_path, ip_address')
    .gte('created_at', start)
    .lte('created_at', end);

  const pageViewsMap = new Map<string, Set<string>>();
  pageViewsData?.forEach((view: any) => {
    if (!pageViewsMap.has(view.page_path)) {
      pageViewsMap.set(view.page_path, new Set());
    }
    if (view.ip_address) {
      pageViewsMap.get(view.page_path)!.add(view.ip_address);
    }
  });

  const topPages: PageStats[] = Array.from(pageViewsMap.entries())
    .map(([page_path, ips]) => ({
      page_path,
      views: pageViewsData?.filter((v: any) => v.page_path === page_path).length || 0,
      unique_visitors: ips.size,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Get events
  const { data: eventsData } = await (supabase as any)
    .from('analytics_events')
    .select('event_name')
    .gte('created_at', start)
    .lte('created_at', end);

  const eventCounts = new Map<string, number>();
  eventsData?.forEach((event: any) => {
    eventCounts.set(event.event_name, (eventCounts.get(event.event_name) || 0) + 1);
  });

  const topEvents: EventStats[] = Array.from(eventCounts.entries())
    .map(([event_name, count]) => ({ event_name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Get device breakdown
  const { data: deviceData } = await (supabase as any)
    .from('page_views')
    .select('device_type')
    .gte('created_at', start)
    .lte('created_at', end);

  const deviceBreakdown = {
    mobile: deviceData?.filter((d: any) => d.device_type === 'mobile').length || 0,
    desktop: deviceData?.filter((d: any) => d.device_type === 'desktop').length || 0,
    tablet: deviceData?.filter((d: any) => d.device_type === 'tablet').length || 0,
  };

  // Get referrer stats
  const { data: referrerData } = await (supabase as any)
    .from('page_views')
    .select('referrer')
    .gte('created_at', start)
    .lte('created_at', end);

  const referrerCounts = new Map<string, number>();
  referrerData?.forEach((r: any) => {
    const ref = r.referrer || 'Direct';
    referrerCounts.set(ref, (referrerCounts.get(ref) || 0) + 1);
  });

  const referrerStats = Array.from(referrerCounts.entries())
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Calculate total stats
  const totalViews = pageViewsData?.length || 0;
  const uniqueVisitors = new Set(pageViewsData?.map((v: any) => v.ip_address).filter(Boolean)).size;
  const totalEvents = eventsData?.length || 0;
  const conversionEvents = eventsData?.filter((e: any) => 
    e.event_name.includes('contact') || e.event_name.includes('motor_request')
  ).length || 0;
  const conversionRate = totalViews > 0 ? (conversionEvents / totalViews) * 100 : 0;

  return {
    dailyStats,
    topPages,
    topEvents,
    totalStats: {
      total_views: totalViews,
      unique_visitors: uniqueVisitors,
      total_events: totalEvents,
      conversion_rate: conversionRate,
    },
    deviceBreakdown,
    referrerStats,
  };
}

export async function getQuickStats() {
  const supabase = createAdminClient();
  
  const now = new Date();
  const todayStart = startOfDay(now).toISOString();
  const yesterdayStart = startOfDay(subDays(now, 1)).toISOString();
  const weekStart = startOfDay(subDays(now, 7)).toISOString();
  const monthStart = startOfDay(subDays(now, 30)).toISOString();

  // Today's views
  const { count: todayViews } = await (supabase as any)
    .from('page_views')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', todayStart);

  // Yesterday's views
  const { count: yesterdayViews } = await (supabase as any)
    .from('page_views')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', yesterdayStart)
    .lt('created_at', todayStart);

  // Week views
  const { count: weekViews } = await (supabase as any)
    .from('page_views')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', weekStart);

  // Month views
  const { count: monthViews } = await (supabase as any)
    .from('page_views')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', monthStart);

  return {
    today: todayViews || 0,
    yesterday: yesterdayViews || 0,
    week: weekViews || 0,
    month: monthViews || 0,
  };
}
