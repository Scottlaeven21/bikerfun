import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { clearAdmin2faCookie } from '@/lib/auth/admin-2fa';

export async function GET() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  await clearAdmin2faCookie();
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
}
