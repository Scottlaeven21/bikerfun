'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

// Track page view
export async function trackPageView(pagePath: string, pageTitle?: string) {
  try {
    const supabase = await createClient();
    const headersList = await headers();
    
    const userAgent = headersList.get('user-agent') || '';
    const referrer = headersList.get('referer') || '';
    
    // Determine device type from user agent
    const deviceType = /mobile/i.test(userAgent) ? 'mobile' : 
                      /tablet/i.test(userAgent) ? 'tablet' : 'desktop';

    await supabase.from('page_views').insert({
      page_path: pagePath,
      page_title: pageTitle,
      referrer,
      user_agent: userAgent,
      device_type: deviceType,
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

    await supabase.from('analytics_events').insert({
      event_name: eventName,
      event_data: eventData || {},
      user_agent: userAgent,
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

    await supabase.from('occasion_views').insert({
      occasion_id: occasionId,
      user_agent: userAgent,
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
    const supabase = await createClient();
    
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

    // Most viewed occasions
    const { data: topOccasions } = await supabase
      .from('occasion_views')
      .select('occasion_id, occasions(brand, model, main_image)')
      .gte('created_at', lastMonth.toISOString())
      .limit(5);

    // Count views per occasion
    const occasionViewCounts: Record<string, number> = {};
    topOccasions?.forEach((view: any) => {
      const id = view.occasion_id;
      occasionViewCounts[id] = (occasionViewCounts[id] || 0) + 1;
    });

    // Sort by view count
    const topOccasionsWithCounts = Object.entries(occasionViewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
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

    // Device breakdown
    const { data: deviceData } = await supabase
      .from('page_views')
      .select('device_type')
      .gte('created_at', lastMonth.toISOString());

    const deviceBreakdown = {
      mobile: deviceData?.filter(d => d.device_type === 'mobile').length || 0,
      desktop: deviceData?.filter(d => d.device_type === 'desktop').length || 0,
      tablet: deviceData?.filter(d => d.device_type === 'tablet').length || 0,
    };

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
          total: (contactSubmissions || 0) + (motorAanvragen || 0),
        },
        topOccasions: topOccasionsWithCounts,
        devices: deviceBreakdown,
      },
    };
  } catch (error) {
    console.error('Failed to get analytics data:', error);
    return { success: false, error: 'Failed to fetch analytics' };
  }
}
