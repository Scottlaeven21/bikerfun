import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function deviceFromUa(userAgent: string): string {
  if (/tablet|ipad/i.test(userAgent)) return 'tablet';
  if (/mobile/i.test(userAgent)) return 'mobile';
  return 'desktop';
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded ? forwarded.split(',')[0].trim() : realIp || 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const type = String(body?.type || '');
    const supabase = await createClient();
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = clientIp(request);

    if (type === 'view') {
      const pagePath = String(body.page_path || '').slice(0, 300);
      if (!pagePath || pagePath.startsWith('/admin')) {
        return NextResponse.json({ ok: true });
      }
      await (supabase as any).from('page_views').insert({
        page_path: pagePath,
        page_title: body.page_title ? String(body.page_title).slice(0, 200) : null,
        referrer: body.referrer ? String(body.referrer).slice(0, 500) : null,
        user_agent: userAgent,
        device_type: deviceFromUa(userAgent),
        ip_address: ipAddress,
      });
      return NextResponse.json({ ok: true });
    }

    if (type === 'event' || type === 'click' || type === 'duration') {
      const eventName =
        type === 'click' ? 'button_click' : type === 'duration' ? 'page_duration' : String(body.event_name || '');
      if (!eventName) return NextResponse.json({ ok: false }, { status: 400 });

      await (supabase as any).from('analytics_events').insert({
        event_name: eventName,
        event_data: body.event_data && typeof body.event_data === 'object' ? body.event_data : {},
        page_path: body.page_path ? String(body.page_path).slice(0, 300) : null,
        user_agent: userAgent,
        ip_address: ipAddress,
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false }, { status: 400 });
  } catch (error) {
    console.error('Analytics track failed:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
