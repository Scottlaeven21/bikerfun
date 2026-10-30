'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function RecoverySessionCatcher() {
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash.includes('access_token')) return;

    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    if (!accessToken || !refreshToken) return;

    const supabase = createClient();
    supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }).then(({ error }) => {
      if (error) return;
      window.history.replaceState(null, '', window.location.pathname);
      window.location.reload();
    });
  }, []);

  return null;
}
