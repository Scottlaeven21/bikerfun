import { createAdminClient } from '@/lib/supabase/admin';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';
import { normalizeTrafficSource } from '@/lib/analytics/sources';

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
  avg_seconds?: number;
}

export interface EventStats {
  event_name: string;
  count: number;
}

export async function fetchAllRows<T>(
  query: (from: number, to: number) => PromiseLike<{ data: T[] | null }>
): Promise<T[]> {
  const pageSize = 1000;
  const rows: T[] = [];
  for (let from = 0; from < 200_000; from += pageSize) {
    const { data } = await query(from, from + pageSize - 1);
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < pageSize) break;
  }
  return rows;
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
  topClicks: Array<{
    label: string;
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

  const { count: exactViewCount } = await (supabase as any)
    .from('page_views')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', start)
    .lte('created_at', end);

  const { data: totalsRows } = await (supabase as any).rpc('get_analytics_totals', {
    start_date: start,
    end_date: end,
  });
  const totalsRow = Array.isArray(totalsRows) ? totalsRows[0] : totalsRows;

  const pageViewsData = await fetchAllRows<any>((from, to) =>
    (supabase as any)
      .from('page_views')
      .select('page_path, ip_address, device_type, referrer')
      .gte('created_at', start)
      .lte('created_at', end)
      .range(from, to)
  );

  const pageViewsMap = new Map<string, Set<string>>();
  pageViewsData?.forEach((view: any) => {
    if (!pageViewsMap.has(view.page_path)) {
      pageViewsMap.set(view.page_path, new Set());
    }
    if (view.ip_address) {
      pageViewsMap.get(view.page_path)!.add(view.ip_address);
    }
  });

  const eventsData = await fetchAllRows<any>((from, to) =>
    (supabase as any)
      .from('analytics_events')
      .select('event_name, event_data, page_path')
      .gte('created_at', start)
      .lte('created_at', end)
      .range(from, to)
  );

  const durationTotals = new Map<string, { total: number; count: number }>();
  eventsData
    ?.filter((event: any) => event.event_name === 'page_duration')
    .forEach((event: any) => {
      const path = String(event.page_path || '/');
      const seconds = Number(event.event_data?.seconds) || 0;
      if (seconds <= 0 || seconds > 60 * 60 * 2) return;
      const current = durationTotals.get(path) || { total: 0, count: 0 };
      durationTotals.set(path, { total: current.total + seconds, count: current.count + 1 });
    });

  const topPages: PageStats[] = Array.from(pageViewsMap.entries())
    .map(([page_path, ips]) => {
      const duration = durationTotals.get(page_path);
      return {
        page_path,
        views: pageViewsData?.filter((v: any) => v.page_path === page_path).length || 0,
        unique_visitors: ips.size,
        avg_seconds: duration ? duration.total / duration.count : undefined,
      };
    })
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  const eventCounts = new Map<string, number>();
  eventsData?.forEach((event: any) => {
    if (event.event_name === 'page_duration' || event.event_name === 'button_click') return;
    eventCounts.set(event.event_name, (eventCounts.get(event.event_name) || 0) + 1);
  });

  const topEvents: EventStats[] = Array.from(eventCounts.entries())
    .map(([event_name, count]) => ({ event_name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const deviceBreakdown = {
    mobile: pageViewsData.filter((d: any) => d.device_type === 'mobile').length,
    desktop: pageViewsData.filter((d: any) => d.device_type === 'desktop').length,
    tablet: pageViewsData.filter((d: any) => d.device_type === 'tablet').length,
  };

  const referrerCounts = new Map<string, number>();
  pageViewsData.forEach((r: any) => {
    const ref = normalizeTrafficSource(r.referrer);
    referrerCounts.set(ref, (referrerCounts.get(ref) || 0) + 1);
  });

  const referrerStats = Array.from(referrerCounts.entries())
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const totalViews = Number(totalsRow?.total_views ?? exactViewCount ?? pageViewsData.length) || 0;
  const uniqueIPs = pageViewsData.map((v: any) => v.ip_address).filter(Boolean);
  const uniqueVisitors = Number(totalsRow?.unique_visitors) || new Set(uniqueIPs).size;

  const totalEvents = eventsData.length || 0;
  const conversionEvents = eventsData?.filter((e: any) => 
    e.event_name.includes('contact') || e.event_name.includes('motor_request')
  ).length || 0;
  const conversionRate = totalViews > 0 ? (conversionEvents / totalViews) * 100 : 0;

  const clickCounts = new Map<string, number>();
  eventsData
    ?.filter((event: any) => event.event_name === 'button_click')
    .forEach((event: any) => {
      const label = String(event.event_data?.label || 'Onbekend').slice(0, 80);
      clickCounts.set(label, (clickCounts.get(label) || 0) + 1);
    });
  const topClicks = Array.from(clickCounts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

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
    topClicks,
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
