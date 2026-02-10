'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface AdminHeaderProps {
  userName: string;
  userEmail: string;
}

export function AdminHeader({ userName, userEmail }: AdminHeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left: Logo/Brand */}
        <div className="flex items-center space-x-4">
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-biker-yellow">BIKERFUN</span>
            <span className="px-2 py-1 bg-biker-yellow text-black text-xs font-bold rounded">
              ADMIN
            </span>
          </Link>
        </div>

        {/* Right: User Info + Logout */}
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">{userEmail}</p>
          </div>
          
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? 'Uitloggen...' : 'Uitloggen'}
          </button>
        </div>
      </div>
    </header>
  );
}
