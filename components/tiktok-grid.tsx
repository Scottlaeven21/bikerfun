'use client';

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
        <div 
          key={num}
          className="relative aspect-[9/16] rounded-lg overflow-hidden border-2 border-biker-gray hover:border-biker-yellow transition-all group"
        >
          <video
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
          >
            <source src={`/tiktok-${num}.mp4`} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all pointer-events-none"></div>
        </div>
      ))}
    </div>
  );
}
