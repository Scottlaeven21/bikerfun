import { NavbarClient } from '@/components/layout/navbar-client';
import { Footer } from '@/components/layout/footer';
import { createClient } from '@/lib/supabase/server';

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    const profile = profileData as { is_admin: boolean } | null;
    isAdmin = profile?.is_admin || false;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarClient user={user} isAdmin={isAdmin} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
