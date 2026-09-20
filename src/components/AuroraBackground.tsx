import React, { useEffect, useRef } from 'react';

/**
 * Fixed, GPU-friendly ambient backdrop behind the frosted glass UI.
 * Soft "aurora" light orbs drifting slowly + subtle dot grid + scroll parallax.
 * Pure transform/opacity animation so it stays at 60fps.
 */
export const AuroraBackground: React.FC = () => {
  const layerRef = useRef<HTMLDivElement>(null);

  // Gentle scroll parallax on the whole orb layer
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (layerRef.current) {
          const y = window.scrollY;
          layerRef.current.style.transform = `translate3d(0, ${y * -0.05}px, 0)`;
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #f7faf9 0%, #eef4f2 38%, #e9f1f4 72%, #f2f6f3 100%)'
        }}
      />

      {/* Drifting aurora orbs */}
      <div ref={layerRef} className="absolute inset-0 will-change-transform">
        <div
          className="absolute -top-[12%] -left-[8%] w-[46vw] h-[46vw] rounded-full animate-float-a will-change-transform"
          style={{
            background:
              'radial-gradient(circle at 35% 35%, rgba(52, 211, 153, 0.4), rgba(52, 211, 153, 0) 68%)',
            filter: 'blur(48px)'
          }}
        />
        <div
          className="absolute top-[16%] -right-[10%] w-[42vw] h-[42vw] rounded-full animate-float-b will-change-transform"
          style={{
            background:
              'radial-gradient(circle at 60% 40%, rgba(56, 189, 248, 0.34), rgba(56, 189, 248, 0) 66%)',
            filter: 'blur(52px)'
          }}
        />
        <div
          className="absolute bottom-[-18%] left-[22%] w-[48vw] h-[48vw] rounded-full animate-float-c will-change-transform"
          style={{
            background:
              'radial-gradient(circle at 45% 55%, rgba(45, 212, 191, 0.3), rgba(167, 139, 250, 0.14) 55%, rgba(45, 212, 191, 0) 70%)',
            filter: 'blur(56px)'
          }}
        />
        <div
          className="absolute top-[52%] left-[4%] w-[26vw] h-[26vw] rounded-full animate-float-b will-change-transform"
          style={{
            background:
              'radial-gradient(circle, rgba(163, 230, 53, 0.22), rgba(163, 230, 53, 0) 64%)',
            filter: 'blur(44px)'
          }}
        />
      </div>

      {/* Faint dot grid — gives the glass something to refract */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: 'radial-gradient(rgba(6, 78, 59, 0.075) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage:
            'radial-gradient(ellipse 90% 70% at 50% 22%, black 25%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 90% 70% at 50% 22%, black 25%, transparent 78%)'
        }}
      />

      {/* Fine grain for that premium anti-banding finish */}
      <div
        className="absolute inset-0 opacity-[0.16] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")"
        }}
      />
    </div>
  );
};

export default AuroraBackground;
