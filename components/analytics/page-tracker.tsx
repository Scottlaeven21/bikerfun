'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function send(payload: Record<string, unknown>) {
  try {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // tracking must never break the site
  }
}

function buttonLabel(el: HTMLElement): string | null {
  const labelled = el.closest('a, button, [role="button"]') as HTMLElement | null;
  if (!labelled) return null;
  if (labelled.closest('[data-ignore-analytics]')) return null;

  const aria = labelled.getAttribute('aria-label')?.trim();
  const text = (labelled.innerText || labelled.textContent || '').replace(/\s+/g, ' ').trim();
  const href = labelled instanceof HTMLAnchorElement ? labelled.getAttribute('href') : null;

  if (aria) return aria.slice(0, 80);
  if (text) return text.slice(0, 80);
  if (href) return href.slice(0, 80);
  return null;
}

export function PageTracker() {
  const pathname = usePathname();
  const startedAt = useRef(Date.now());
  const lastPath = useRef<string | null>(null);
  const flushed = useRef(false);

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;

    if (lastPath.current && lastPath.current !== pathname && !flushed.current) {
      const seconds = Math.round((Date.now() - startedAt.current) / 1000);
      if (seconds >= 1) {
        send({
          type: 'duration',
          page_path: lastPath.current,
          event_data: { seconds },
        });
      }
    }

    startedAt.current = Date.now();
    lastPath.current = pathname;
    flushed.current = false;

    const referrer = document.referrer || '';
    send({
      type: 'view',
      page_path: pathname,
      page_title: document.title,
      referrer,
    });

    const flushDuration = () => {
      if (flushed.current) return;
      const seconds = Math.round((Date.now() - startedAt.current) / 1000);
      if (seconds < 1 || !lastPath.current) return;
      flushed.current = true;
      send({
        type: 'duration',
        page_path: lastPath.current,
        event_data: { seconds },
      });
    };

    const onHidden = () => {
      if (document.visibilityState === 'hidden') flushDuration();
    };

    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('pagehide', flushDuration);

    return () => {
      document.removeEventListener('visibilitychange', onHidden);
      window.removeEventListener('pagehide', flushDuration);
    };
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const label = buttonLabel(target);
      if (!label) return;
      if (window.location.pathname.startsWith('/admin')) return;
      const link = target.closest('a') as HTMLAnchorElement | null;
      send({
        type: 'click',
        page_path: window.location.pathname,
        event_data: {
          label,
          href: link?.getAttribute('href') || null,
        },
      });
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
