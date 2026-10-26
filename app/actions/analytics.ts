'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { normalizeTrafficSource } from '@/lib/analytics/sources';

// Track page view
export async function trackPageView(pagePath: string, pageTitle?: string) {
  try {
    const supabase = await createClient();
    const headersList = await headers();
    
    const userAgent = headersList.get('user-agent') || '';
    const referrer = headersList.get('referer') || '';
    
    // Get IP address from headers
    const forwarded = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const ipAddress = forwarded ? forwarded.split(',')[0].trim() : (realIp || 'unknown');
    
    // Determine device type from user agent
    const deviceType = /mobile/i.test(userAgent) ? 'mobile' : 
                      /tablet/i.test(userAgent) ? 'tablet' : 'desktop';

    // Cast to any to avoid TypeScript errors before migration is run
    await (supabase as any).from('page_views').insert({
      page_path: pagePath,
      page_title: pageTitle,
      referrer,
      user_agent: userAgent,
      device_type: deviceType,
      ip_address: ipAddress,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to track page view:', error);
    return { success: false };
  }
}

// Track custom event
export async function trackEvent(eventName: string, eventData?: Record<string, any>) {
  try {
    const supabase = await createClient();
    const headersList = await headers();
    
    const userAgent = headersList.get('user-agent') || '';
    
    // Get IP address from headers
    const forwarded = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const ipAddress = forwarded ? forwarded.split(',')[0].trim() : (realIp || 'unknown');

    // Cast to any to avoid TypeScript errors before migration is run
    await (supabase as any).from('analytics_events').insert({
      event_name: eventName,
      event_data: eventData || {},
      user_agent: userAgent,
      ip_address: ipAddress,
      page_path: typeof window !== 'undefined' ? window.location.pathname : null,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to track event:', error);
    return { success: false };
  }
}

// Track occasion view
export async function trackOccasionView(occasionId: string) {
  try {
    const supabase = await createClient();
    const headersList = await headers();
    
    const userAgent = headersList.get('user-agent') || '';
    
    // Get IP address from headers
    const forwarded = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const ipAddress = forwarded ? forwarded.split(',')[0].trim() : (realIp || 'unknown');

    // Cast to any to avoid TypeScript errors before migration is run
    await (supabase as any).from('occasion_views').insert({
      occasion_id: occasionId,
      user_agent: userAgent,
      ip_address: ipAddress,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to track occasion view:', error);
    return { success: false };
  }
}

// Get analytics data for admin dashboard
export async function getAnalyticsData() {
  try {
    const supabaseClient = await createClient();
    // Cast to any to avoid TypeScript errors before migration is run
    const supabase = supabaseClient as any;
    
    // Get date ranges
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setDate(lastMonth.getDate() - 30);

    // Today's stats
    const { count: todayViews } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // Yesterday's stats
    const { count: yesterdayViews } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterday.toISOString())
      .lt('created_at', today.toISOString());

    // This week's stats
    const { count: weekViews } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', lastWeek.toISOString());

    // This month's stats
    const { count: monthViews } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', lastMonth.toISOString());

    // Total stats
    const { count: totalViews } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true });

    // Form submissions (contact forms)
    const { count: contactSubmissions } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_name', 'contact_form_submit')
      .gte('created_at', lastMonth.toISOString());

    // Motor aanvragen
    const { count: motorAanvragen } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_name', 'motor_aanvraag_submit')
      .gte('created_at', lastMonth.toISOString());

    // Most viewed occasions (fetch all from last month)
    const { data: topOccasions } = await supabase
      .from('occasion_views')
      .select('occasion_id, occasions(brand, model, main_image)')
      .gte('created_at', lastMonth.toISOString())
      .limit(100000);

    // Count views per occasion
    const occasionViewCounts: Record<string, number> = {};
    topOccasions?.forEach((view: any) => {
      const id = view.occasion_id;
      occasionViewCounts[id] = (occasionViewCounts[id] || 0) + 1;
    });

    // Sort by view count and return ALL occasions (no limit)
    const topOccasionsWithCounts = Object.entries(occasionViewCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([occasionId, viewCount]) => {
        const occasion = topOccasions?.find((v: any) => v.occasion_id === occasionId);
        return {
          occasion_id: occasionId,
          view_count: viewCount,
          brand: occasion?.occasions?.brand,
          model: occasion?.occasions?.model,
          main_image: occasion?.occasions?.main_image,
        };
      });

    // Device breakdown - increase limit to handle more data
    const { data: deviceData } = await supabase
      .from('page_views')
      .select('device_type')
      .gte('created_at', lastMonth.toISOString())
      .limit(100000);

    const deviceBreakdown = {
      mobile: deviceData?.filter((d: any) => d.device_type === 'mobile').length || 0,
      desktop: deviceData?.filter((d: any) => d.device_type === 'desktop').length || 0,
      tablet: deviceData?.filter((d: any) => d.device_type === 'tablet').length || 0,
    };

    const { data: monthViewsRows } = await supabase
      .from('page_views')
      .select('page_path, referrer')
      .gte('created_at', lastMonth.toISOString())
      .limit(100000);

    const { data: monthEvents } = await supabase
      .from('analytics_events')
      .select('event_name, event_data, page_path')
      .gte('created_at', lastMonth.toISOString())
      .limit(100000);

    const referrerCounts = new Map<string, number>();
    monthViewsRows?.forEach((row: any) => {
      const source = normalizeTrafficSource(row.referrer);
      referrerCounts.set(source, (referrerCounts.get(source) || 0) + 1);
    });
    const topReferrers = Array.from(referrerCounts.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const clickCounts = new Map<string, number>();
    monthEvents
      ?.filter((event: any) => event.event_name === 'button_click')
      .forEach((event: any) => {
        const label = String(event.event_data?.label || 'Onbekend').slice(0, 80);
        clickCounts.set(label, (clickCounts.get(label) || 0) + 1);
      });
    const topClicks = Array.from(clickCounts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const durationTotals = new Map<string, { total: number; count: number }>();
    monthEvents
      ?.filter((event: any) => event.event_name === 'page_duration')
      .forEach((event: any) => {
        const path = String(event.page_path || '/');
        const seconds = Number(event.event_data?.seconds) || 0;
        if (seconds <= 0 || seconds > 60 * 60 * 2) return;
        const current = durationTotals.get(path) || { total: 0, count: 0 };
        durationTotals.set(path, { total: current.total + seconds, count: current.count + 1 });
      });

    const pageViewCounts = new Map<string, number>();
    monthViewsRows?.forEach((row: any) => {
      const path = row.page_path || '/';
      pageViewCounts.set(path, (pageViewCounts.get(path) || 0) + 1);
    });

    const pageDurations = Array.from(durationTotals.entries())
      .map(([path, stats]) => ({
        path,
        avgSeconds: stats.total / stats.count,
        views: pageViewCounts.get(path) || stats.count,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);

    const { count: omkeurenSubmissions } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_name', 'omkeuren_submit')
      .gte('created_at', lastMonth.toISOString());

    return {
      success: true,
      data: {
        views: {
          today: todayViews || 0,
          yesterday: yesterdayViews || 0,
          week: weekViews || 0,
          month: monthViews || 0,
          total: totalViews || 0,
          change: yesterdayViews ? ((todayViews || 0) - yesterdayViews) / yesterdayViews * 100 : 0,
        },
        conversions: {
          contactForms: contactSubmissions || 0,
          motorAanvragen: motorAanvragen || 0,
          omkeuren: omkeurenSubmissions || 0,
          total: (contactSubmissions || 0) + (motorAanvragen || 0) + (omkeurenSubmissions || 0),
        },
        topOccasions: topOccasionsWithCounts,
        devices: deviceBreakdown,
        topReferrers,
        topClicks,
        pageDurations,
      },
    };
  } catch (error) {
    console.error('Failed to get analytics data:', error);
    return { success: false, error: 'Failed to fetch analytics' };
  }
}
