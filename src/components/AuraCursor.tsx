import React, { useState, useEffect } from 'react';
import { Point2D } from '../types';
import { SeasonId, SEASONS_CONFIG } from '../data/config';

interface AuraCursorProps {
  pointer: Point2D;
  isPointerActive: boolean;
  season: SeasonId;
}

interface CursorClickRipple {
  id: number;
  x: number;
  y: number;
}

export const AuraCursor: React.FC<AuraCursorProps> = ({
  pointer,
  isPointerActive,
  season,
}) => {
  const [ripples, setRipples] = useState<CursorClickRipple[]>([]);
  const currentConfig = SEASONS_CONFIG[season];

  useEffect(() => {
    const handleDown = (e: PointerEvent) => {
      const id = Date.now() + Math.random();
      const newRipple: CursorClickRipple = {
        id,
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev.slice(-2), newRipple]);

      // Strictly clear each ripple after 450ms so none can persist
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 450);
    };

    window.addEventListener('pointerdown', handleDown);
    return () => window.removeEventListener('pointerdown', handleDown);
  }, []);

  if (!isPointerActive && pointer.x <= 0 && pointer.y <= 0) return null;

  // Seasonal cursor talisman glyphs
  const renderSeasonalGlyph = () => {
    switch (season) {
      case 'semi':
        // Sakura petal / blossom
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-pink-400 drop-shadow-[0_0_6px_rgba(244,114,182,0.8)]" fill="currentColor">
            <path d="M12 2C13.5 5.5 16 8 19 9C16 11 13.5 13 12 17C10.5 13 8 11 5 9C8 8 10.5 5.5 12 2Z" />
          </svg>
        );
      case 'panas':
        // Sunburst / Solar star
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" fill="currentColor">
            <polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" />
          </svg>
        );
      case 'gugur':
        // Japanese Maple Leaf / Autumn talisman
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-orange-400 drop-shadow-[0_0_6px_rgba(251,146,60,0.8)]" fill="currentColor">
            <path d="M12 2L14 7L19 5L17 10L22 12L17 14L19 19L14 17L12 22L10 17L5 19L7 14L2 12L7 10L5 5L10 7Z" />
          </svg>
        );
      case 'dingin':
      default:
        // Ice Snowflake crystal
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-200 drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="2" x2="12" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="5" y1="19" x2="19" y2="5" />
            <circle cx="12" cy="12" r="2" fill="white" />
          </svg>
        );
    }
  };

  return (
    <>
      {/* Click Visual Ripples */}
      {ripples.map((rp) => (
        <div
          key={rp.id}
          className="fixed pointer-events-none z-50 rounded-full animate-ping"
          style={{
            left: `${rp.x}px`,
            top: `${rp.y}px`,
            width: '28px',
            height: '28px',
            transform: 'translate(-50%, -50%)',
            border: `2px solid ${currentConfig.rimColor}`,
            boxShadow: `0 0 12px ${currentConfig.rimColor}`,
            animationDuration: '500ms',
          }}
        />
      ))}

      {/* Direct 1:1 Instant Tracking Cursor */}
      <div
        className="fixed pointer-events-none z-50 select-none"
        style={{
          left: `${pointer.x}px`,
          top: `${pointer.y}px`,
          transform: 'translate(-50%, -50%)',
          opacity: isPointerActive ? 1 : 0,
          transition: 'opacity 0.15s ease-out',
        }}
      >
        {/* Soft Ambient Seasonal Halo */}
        <div
          className="w-16 h-16 rounded-full -translate-x-1/2 -translate-y-1/2 blur-sm pointer-events-none absolute top-1/2 left-1/2"
          style={{
            background: `radial-gradient(circle, ${currentConfig.rimColor} 0%, transparent 70%)`,
          }}
        />

        {/* Dynamic Seasonal Talisman Icon */}
        <div className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
          {renderSeasonalGlyph()}

          {/* Micro precise center spark */}
          <div className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
        </div>
      </div>
    </>
  );
};
