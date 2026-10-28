'use client';

import { useEffect, useRef } from 'react';

interface TikTokGridProps {
  size?: 'normal' | 'large';
}

function TikTokClip({ num }: { num: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playSafe = () => {
      video.muted = true;
      const play = video.play();
      if (play) play.catch(() => {});
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          playSafe();
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.25, 0.5] }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative aspect-[9/16] rounded-lg overflow-hidden border-2 border-biker-gray hover:border-biker-yellow transition-all group">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        onMouseEnter={(e) => {
          e.currentTarget.muted = true;
          e.currentTarget.play().catch(() => {});
        }}
      >
        <source src={`/tiktok-${num}.mp4`} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
    </div>
  );
}

export function TikTokGrid({ size = 'normal' }: TikTokGridProps) {
  const gridClass =
    size === 'large' ? 'grid grid-cols-2 lg:grid-cols-3 gap-5' : 'grid grid-cols-2 lg:grid-cols-3 gap-4';

  return (
    <div className={gridClass}>
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <TikTokClip key={num} num={num} />
      ))}
    </div>
  );
}
