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
    <header className="bg-gradient-to-r from-black to-gray-900 border-b-2 border-biker-yellow sticky top-0 z-50 shadow-lg">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left: Logo/Brand */}
        <div className="flex items-center space-x-4">
          <Link href="/admin" className="flex items-center space-x-3 group">
            <div className="relative">
              <span className="text-2xl font-bold text-biker-yellow font-['Inter'] tracking-wider">BIKERFUN</span>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-biker-yellow transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            </div>
            <span className="px-3 py-1 bg-biker-yellow text-black text-xs font-bold rounded uppercase tracking-wider shadow-md">
              ADMIN
            </span>
          </Link>
        </div>

        {/* Right: User Info + Logout */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-biker-yellow/20 border-2 border-biker-yellow flex items-center justify-center">
              <svg className="w-5 h-5 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-white">{userName}</p>
              <p className="text-xs text-gray-400">{userEmail}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>{isLoggingOut ? 'Uitloggen...' : 'Uitloggen'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
