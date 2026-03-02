import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

/**
 * Admin Supabase client with SERVICE_ROLE key
 * 
 * ⚠️ WARNING: This client bypasses Row Level Security (RLS)!
 * Only use for:
 * - Server-side operations (API routes, cron jobs)
 * - Admin tasks that need full access
 * - WooCommerce sync operations
 * 
 * NEVER expose this client to the browser!
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase credentials. Please add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local'
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
