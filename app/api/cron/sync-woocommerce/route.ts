import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { executeWooCommerceFullSync } from '@/lib/woocommerce/full-sync';

/**
 * Vercel Cron: volledige WooCommerce-sync (03:00).
 * Zelfde logica als admin handmatige sync.
 */
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 });
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    console.log('🔄 [CRON] Starting WooCommerce sync...\n');

    const result = await executeWooCommerceFullSync(supabase);

    console.log('\n✅ [CRON] Sync completed!');

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ [CRON] Sync failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
