'use client';

import { useEffect, useRef } from 'react';

interface TikTokGridProps {
  size?: 'normal' | 'large';
}

export function TikTokGrid({ size = 'normal' }: TikTokGridProps) {
  const gridClass = size === 'large' 
    ? 'grid grid-cols-2 lg:grid-cols-3 gap-5' 
    : 'grid grid-cols-2 lg:grid-cols-3 gap-4';

  return (
    <div className={gridClass}>
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <TikTokVideo key={num} num={num} />
      ))}
    </div>
  );
}

function TikTokVideo({ num }: { num: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay might be blocked, that's okay
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative aspect-[9/16] rounded-lg overflow-hidden border-2 border-biker-gray hover:border-biker-yellow transition-all group">
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
        poster={`/tiktok-${num}-poster.jpg`}
      >
        <source src={`/tiktok-${num}.mp4`} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all pointer-events-none"></div>
    </div>
  );
}
