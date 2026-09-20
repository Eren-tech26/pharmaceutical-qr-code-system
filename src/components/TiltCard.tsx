import React, { useCallback, useEffect, useRef } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Max rotation in degrees */
  maxTilt?: number;
  /** Moving specular highlight that follows the cursor */
  glare?: boolean;
}

/**
 * Subtle visionOS-style 3D tilt. The card rotates toward the cursor with a
 * light spring-back on leave. Automatically disabled on touch devices and
 * for users who prefer reduced motion. rAF-throttled → buttery smooth.
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 5,
  glare = true
}) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const enabledRef = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    enabledRef.current = fine && !reduced;
    return () => cancelAnimationFrame(frame.current);
  }, []);

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (!enabledRef.current || !innerRef.current) return;
      const rect = innerRef.current.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        if (!innerRef.current) return;
        const rx = (0.5 - py) * maxTilt * 2;
        const ry = (px - 0.5) * maxTilt * 2;
        innerRef.current.style.transition = 'transform 0.16s cubic-bezier(0.22, 1, 0.36, 1)';
        innerRef.current.style.transform = `perspective(1200px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
        if (glareRef.current) {
          glareRef.current.style.background = `radial-gradient(circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgba(255,255,255,0.34), rgba(255,255,255,0) 55%)`;
          glareRef.current.style.opacity = '1';
        }
      });
    },
    [maxTilt]
  );

  const handleLeave = useCallback(() => {
    cancelAnimationFrame(frame.current);
    if (!innerRef.current) return;
    innerRef.current.style.transition = 'transform 0.9s cubic-bezier(0.16, 1, 1, 1)';
    innerRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    if (glareRef.current) glareRef.current.style.opacity = '0';
  }, []);

  return (
    <div ref={outerRef} className={`[perspective:1200px] ${className}`}>
      <div
        ref={innerRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="relative h-full will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
        {glare && (
          <div
            ref={glareRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-700"
          />
        )}
      </div>
    </div>
  );
};

export default TiltCard;
