'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="w-full bg-biker-black text-white border-2 border-biker-black hover:bg-white hover:text-biker-black text-center py-3 rounded-full font-bold uppercase text-sm tracking-wider transition-all duration-300 disabled:opacity-50"
    >
      {isLoading ? 'Uitloggen...' : 'Uitloggen'}
    </button>
  );
}
