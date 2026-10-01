import React, { useEffect, useState } from 'react';

interface CgiTransitionPortalProps {
  isActive: boolean;
  onTransitionComplete?: () => void;
}

export const CgiTransitionPortal: React.FC<CgiTransitionPortalProps> = ({
  isActive,
  onTransitionComplete,
}) => {
  const [phase, setPhase] = useState<'idle' | 'gather' | 'peak' | 'settle'>('idle');

  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      return;
    }

    // Stage 1: Gather energy & dimensional distortion (0 - 250ms)
    setPhase('gather');

    // Stage 2: Peak illumination & dimensional warp horizon (250ms - 650ms)
    const tPeak = setTimeout(() => {
      setPhase('peak');
    }, 280);

    // Stage 3: Settle & dissolve into new scene (650ms - 1000ms)
    const tSettle = setTimeout(() => {
      setPhase('settle');
    }, 680);

    const tComplete = setTimeout(() => {
      setPhase('idle');
      if (onTransitionComplete) onTransitionComplete();
    }, 1050);

    return () => {
      clearTimeout(tPeak);
      clearTimeout(tSettle);
      clearTimeout(tComplete);
    };
  }, [isActive, onTransitionComplete]);

  if (!isActive && phase === 'idle') return null;

  return (
    <div
      id="world-transition-portal"
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden select-none"
    >
      {/* 1. Atmospheric Dimensional Color Shift */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          phase === 'peak' ? 'opacity-85' : phase === 'gather' ? 'opacity-40' : 'opacity-0'
        }`}
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(224, 242, 254, 0.95) 0%, rgba(186, 230, 253, 0.75) 45%, rgba(56, 189, 248, 0.4) 75%, transparent 100%)',
        }}
      />

      {/* 2. Expanding Concentric Celestial Runic Arrays */}
      <div
        className={`relative w-[400px] sm:w-[650px] h-[400px] sm:h-[650px] flex items-center justify-center transition-all duration-700 ease-out ${
          phase === 'gather'
            ? 'scale-75 opacity-70 rotate-12'
            : phase === 'peak'
            ? 'scale-125 opacity-100 rotate-45'
            : 'scale-150 opacity-0 rotate-90'
        }`}
      >
        {/* Outer Rune Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/90 shadow-[0_0_50px_rgba(56,189,248,0.9)] animate-spin-cw" />

        {/* Counter-Rotating Sacred Glyph Ring */}
        <div className="absolute inset-10 rounded-full border border-sky-300/80 animate-spin-ccw flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 text-white/70" fill="none" stroke="currentColor" strokeWidth="1.2">
            <polygon points="50,5 93,80 7,80" />
            <polygon points="50,95 93,20 7,20" />
          </svg>
        </div>

        {/* Inner Light Core */}
        <div
          className={`w-32 h-32 rounded-full bg-white blur-md transition-all duration-500 shadow-[0_0_80px_#38bdf8] ${
            phase === 'peak' ? 'scale-150 opacity-100' : 'scale-75 opacity-50'
          }`}
        />
      </div>

      {/* 3. Horizontal Prismatic Light Horizon Beam */}
      <div
        className={`absolute w-[140vw] h-[3px] bg-gradient-to-r from-transparent via-white to-transparent transition-all duration-500 ${
          phase === 'peak'
            ? 'opacity-100 scale-y-150 shadow-[0_0_20px_#ffffff]'
            : phase === 'gather'
            ? 'opacity-50 scale-y-100'
            : 'opacity-0 scale-y-0'
        }`}
      />

      {/* 4. Vertical Lens Flare Piercing Column */}
      <div
        className={`absolute w-[2px] h-[140vh] bg-gradient-to-b from-transparent via-sky-200 to-transparent transition-all duration-500 ${
          phase === 'peak' ? 'opacity-85' : 'opacity-0'
        }`}
      />

      {/* 5. Japanese World Shifting Watermark */}
      <div
        className={`absolute bottom-16 text-center font-jp text-xs sm:text-sm font-light text-sky-950/80 tracking-[0.35em] transition-opacity duration-300 ${
          phase === 'peak' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        青空の彼方へ • DIMENSIONAL SHIFT
      </div>
    </div>
  );
};
