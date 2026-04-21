import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });

  const jobId = request.nextUrl.searchParams.get('jobId');
  if (!jobId) return NextResponse.json({ error: 'Geen jobId' }, { status: 400 });

  const supabase = createAdminClient();

  // Zoek het meest recente audit_log record voor dit jobId
  const { data, error } = await (supabase as any)
    .from('audit_logs')
    .select('details, created_at')
    .eq('action', 'sync_woocommerce')
    .eq('resource_type', 'system')
    .filter('details->>jobId', 'eq', jobId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Zoek het completed record
  const completed = data?.find((r: any) =>
    r.details?.status === 'completed' || r.details?.status === 'completed_with_errors'
  );

  if (completed) {
    return NextResponse.json({ status: 'completed', details: completed.details });
  }

  return NextResponse.json({ status: 'running' });
}
