'use client';

import { useEffect } from 'react';
import { trackPageView, trackEvent, trackOccasionView } from '@/app/actions/analytics';

// Track page view on mount
export function usePageView(pageTitle?: string) {
  useEffect(() => {
    const path = window.location.pathname;
    trackPageView(path, pageTitle || document.title);
  }, [pageTitle]);
}

// Track occasion view
export function useOccasionView(occasionId: string | null) {
  useEffect(() => {
    if (occasionId) {
      trackOccasionView(occasionId);
    }
  }, [occasionId]);
}

// Export track event for manual tracking
export { trackEvent };
