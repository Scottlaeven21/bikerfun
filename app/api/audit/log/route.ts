import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getClientIp, getUserAgent } from '@/lib/audit/logger';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, resourceType, resourceId, details } = body;

    if (!action || !resourceType) {
      return NextResponse.json(
        { error: 'Missing required fields: action, resourceType' },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();
    
    const { error } = await (supabaseAdmin as any)
      .from('audit_logs')
      .insert({
        user_id: user.id,
        user_email: user.email || 'unknown',
        action,
        resource_type: resourceType,
        resource_id: resourceId || null,
        details: details || null,
        ip_address: getClientIp(request),
        user_agent: getUserAgent(request),
      });

    if (error) {
      console.error('Failed to create audit log:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Audit log error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
