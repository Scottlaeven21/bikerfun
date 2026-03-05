'use client';

import { useEffect } from 'react';

export function WhiteBackgroundWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only on mobile
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    
    const updateBackground = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        document.body.style.backgroundColor = '#ffffff';
        document.documentElement.style.backgroundColor = '#ffffff';
      } else {
        document.body.style.backgroundColor = '#000000';
        document.documentElement.style.backgroundColor = '#000000';
      }
    };

    // Set initial state
    updateBackground(mediaQuery);

    // Listen for changes
    mediaQuery.addEventListener('change', updateBackground);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', updateBackground);
      document.body.style.backgroundColor = '#000000';
      document.documentElement.style.backgroundColor = '#000000';
    };
  }, []);

  return <>{children}</>;
}
