import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    // Get recent page views with IP addresses
    const { data: pageViews, error } = await (supabase as any)
      .from('page_views')
      .select('id, page_path, ip_address, created_at')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Count unique IPs
    const uniqueIPs = new Set(pageViews?.map((v: any) => v.ip_address).filter(Boolean));

    return NextResponse.json({
      success: true,
      total_views: pageViews?.length || 0,
      unique_ips: uniqueIPs.size,
      sample_data: pageViews?.slice(0, 5),
      all_ips: Array.from(uniqueIPs),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Test failed' },
      { status: 500 }
    );
  }
}
