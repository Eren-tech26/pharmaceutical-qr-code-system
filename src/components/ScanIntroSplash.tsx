import React, { useEffect, useState } from 'react';
import { QrCode, ArrowRight, ScanLine } from 'lucide-react';

interface ScanIntroSplashProps {
  formName: string;
  onContinue: () => void;
  /** Auto-advance duration in ms. Default 2200. */
  autoAdvanceMs?: number;
}

/**
 * Full-screen frosted-glass intro shown immediately after a QR code is scanned.
 * The aurora backdrop glows through the blur while the PharmaQR brand springs
 * into place, then everything melts away into the dosage form information.
 */
export const ScanIntroSplash: React.FC<ScanIntroSplashProps> = ({
  formName,
  onContinue,
  autoAdvanceMs = 2200
}) => {
  const [fadingOut, setFadingOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 20);
    const fadeTimer = window.setTimeout(() => setFadingOut(true), autoAdvanceMs);
    const doneTimer = window.setTimeout(() => onContinue(), autoAdvanceMs + 500);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, [autoAdvanceMs, onContinue]);

  return (
    <div
      role="dialog"
      aria-live="polite"
      onClick={() => {
        setFadingOut(true);
        window.setTimeout(() => onContinue(), 350);
      }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 cursor-pointer transition-all duration-500 [transition-timing-function:var(--ease-apple)] ${
        fadingOut ? 'opacity-0 scale-[1.04]' : mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'
      }`}
      style={{
        background:
          'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.72), rgba(238,244,242,0.6) 55%, rgba(233,241,244,0.65))',
        WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
        backdropFilter: 'blur(40px) saturate(1.8)'
      }}
    >
      {/* Ambient glows behind the logo */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vmin] h-[60vmin] rounded-full animate-glow-pulse pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(52, 211, 153, 0.3), rgba(56, 189, 248, 0.12) 55%, transparent 72%)',
          filter: 'blur(40px)'
        }}
      />

      {/* Logo block */}
      <div
        className={`relative flex flex-col items-center transition-all duration-1000 [transition-timing-function:var(--ease-out-expo)] ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="animate-splash-pop">
          <div className="glass rounded-[2.5rem] p-8 relative">
            <img
              src="/images/sveri-cobp.png"
              alt="SVERI CO&P"
              className="relative w-44 h-44 sm:w-56 sm:h-56 object-contain drop-shadow-xl"
            />
            {/* Specular sweep across the glass tile */}
            <div
              aria-hidden
              className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none"
            >
              <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-sheen" />
            </div>
          </div>
        </div>

        <h1 className="mt-8 text-4xl sm:text-6xl font-bold tracking-tighter text-slate-900 text-center">
          Pharma<span className="text-gradient">QR</span>
        </h1>
        <p className="mt-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.32em] text-emerald-700">
          Pharmaceutical Dosage Guide
        </p>

        {/* Scanned indicator */}
        <div className="mt-9 flex items-center gap-3 glass rounded-full px-6 py-3">
          <ScanLine className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold text-slate-700">
            Opening <span className="font-bold text-slate-900">{formName}</span>
          </span>
          <span className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                style={{ animationDelay: `${i * 220}ms` }}
              />
            ))}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-7 w-60 sm:w-72 h-1.5 bg-white/50 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-teal-500 to-sky-500 rounded-full origin-left shadow-sm shadow-emerald-500/40"
            style={{ animation: `pharmaqr-progress ${autoAdvanceMs}ms var(--ease-smooth, cubic-bezier(0.22,1,0.36,1)) forwards` }}
          />
        </div>
      </div>

      {/* Footer hint */}
      <div
        className={`absolute bottom-10 flex items-center gap-2 text-xs text-slate-500 font-medium transition-opacity duration-1000 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <QrCode className="w-3.5 h-3.5" />
        <span>Tap anywhere to continue</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>

      <style>{`
        @keyframes pharmaqr-progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
};
