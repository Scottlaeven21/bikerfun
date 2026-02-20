'use client';

import { usePageView } from '@/hooks/use-analytics';

interface PageTrackerProps {
  pageTitle?: string;
}

export function PageTracker({ pageTitle }: PageTrackerProps) {
  usePageView(pageTitle);
  return null;
}
