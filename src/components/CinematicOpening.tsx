import React, { useState } from 'react';
import { acousticEngine } from '../audio/acousticEngine';

interface CinematicOpeningProps {
  onComplete: () => void;
}

export const CinematicOpening: React.FC<CinematicOpeningProps> = ({ onComplete }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleEnterSanctuary = (e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation();
    if (isOpening) return;

    setIsOpening(true);
    acousticEngine.ensureBgmPlaying();
    acousticEngine.playSceneClick('opening');
    acousticEngine.playMagicSparkle();
    acousticEngine.playChime(1.8, 9);

    setTimeout(() => {
      onComplete();
    }, 950);
  };

  return (
    <div
      id="cinematic-opening-gate"
      className={`fixed inset-0 z-70 flex flex-col items-center justify-between py-10 px-6 select-none overflow-hidden transition-opacity duration-1000 ease-out pointer-events-auto ${
        isOpening ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background:
          'radial-gradient(ellipse at 50% 45%, #f0f9ff 0%, #e0f2fe 35%, #bae6fd 70%, #38bdf8 100%)',
      }}
    >
      {/* Expanding celestial white-gold radiance aperture upon click */}
      <div
        className={`absolute rounded-full pointer-events-none blur-[60px] transition-all duration-1000 ease-out ${
          isOpening
            ? 'w-[200vw] h-[200vw] scale-150 opacity-100'
            : 'w-[450px] h-[450px] scale-100 opacity-80'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(224, 242, 254, 0.95) 45%, rgba(56, 189, 248, 0.5) 75%, transparent 100%)',
        }}
      />

      {/* Rotating Sacred Runic Rings */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
          className={`w-[320px] sm:w-[460px] h-[320px] sm:h-[460px] rounded-full border border-sky-300/50 border-dashed animate-spin transition-all duration-1000 ${
            isOpening ? 'scale-180 opacity-0' : 'scale-100 opacity-80'
          }`}
          style={{ animationDuration: '36s' }}
        />
        <div
          className={`absolute w-[240px] sm:w-[340px] h-[240px] sm:h-[340px] rounded-full border-2 border-white/70 animate-spin transition-all duration-1000 ${
            isOpening ? 'scale-150 rotate-90 opacity-0' : 'scale-100 opacity-70'
          }`}
          style={{ animationDuration: '24s', animationDirection: 'reverse' }}
        />
      </div>

      {/* Atmospheric Background Watermark Kanji */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <span className="font-jp text-[220px] sm:text-[340px] font-black text-sky-400/10 select-none pointer-events-none">
          氷
        </span>
      </div>

      {/* TOP: Japanese Editorial Crest & Series Badge */}
      <div className="relative z-10 flex flex-col items-center gap-1.5 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/85 backdrop-blur-md border border-white/90 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
          <span className="font-syncopate text-[9px] sm:text-[10.5px] font-bold text-sky-900 tracking-[0.25em]">
            THE LAW OF IDENTITY
          </span>
        </div>
        <span className="font-jp text-[10px] text-sky-800/80 tracking-[0.3em] font-medium">
          アイデンティティの法則
        </span>
      </div>

      {/* CENTER: Breathtaking Main Japanese & Cinzel Typography with Portal Core */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-lg my-auto pointer-events-none">
        {/* Large Kanji Display */}
        <h1 className="font-jp text-5xl sm:text-7xl text-sky-950 font-black tracking-[0.25em] drop-shadow-sm">
          キアリア
        </h1>

        {/* Cinzel English Title */}
        <h2 className="font-cinzel text-base sm:text-xl text-sky-900 font-extrabold tracking-[0.4em] mt-3 drop-shadow-2xs">
          KIYA
        </h2>

        {/* Subtle Decorative Gold-Sky Line */}
        <div className="mt-4 flex items-center justify-center gap-3 text-[10px] sm:text-[11px] font-medium text-sky-800/80 tracking-[0.3em] font-cinzel">
          <span className="w-10 sm:w-16 h-[1.5px] bg-gradient-to-r from-transparent to-sky-500/60" />
          <span></span>
          <span className="w-10 sm:w-16 h-[1.5px] bg-gradient-to-l from-transparent to-sky-500/60" />
        </div>

        {/* THE SACRED PORTAL CORE (ONLY THIS ELEMENT IS CLICKABLE!) */}
        <div className="mt-8 sm:mt-10 relative flex flex-col items-center pointer-events-auto">
          <button
            type="button"
            id="sacred-portal-core-btn"
            onClick={handleEnterSanctuary}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-700 shadow-[0_0_45px_rgba(56,189,248,0.95)] border-2 border-white outline-none ${
              isOpening
                ? 'scale-150 rotate-180 filter blur-[1px]'
                : isHovered
                ? 'scale-115'
                : 'hover:scale-110 active:scale-95'
            }`}
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #ffffff 0%, #e0f2fe 35%, #38bdf8 75%, #0284c7 100%)',
            }}
          >
            {/* Outward pulsing ripple ring */}
            <div className="absolute inset-[-8px] rounded-full border border-sky-300/60 animate-ping pointer-events-none" />
            <div
              className="absolute inset-[-4px] rounded-full border border-dashed border-white/80 animate-spin pointer-events-none"
              style={{ animationDuration: '10s' }}
            />

            {/* Glowing Celestial Compass Star */}
            <span className="text-3xl sm:text-4xl text-white filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.35)] group-hover:rotate-45 transition-transform duration-500">
              ✦
            </span>
          </button>

          {/* Minimalist Japanese Whisper Label */}
          <div className="mt-4 flex items-center gap-1.5 opacity-85 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="font-jp text-[11px] text-sky-900 font-semibold tracking-[0.25em]">
              MEONGく
            </span>
            <span className="text-xs text-sky-600">🐈</span>
          </div>
        </div>
      </div>

      {/* BOTTOM: Minimalist Light Novel Editorial Footer */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-md px-4 text-sky-800/70 font-cinzel text-[9px] tracking-widest border-t border-sky-200/50 pt-3 pointer-events-none">
        <span>IDENTITAS</span>
        <span className="font-jp text-[9.5px]">あなたが大好きです。</span>
        <span>IDENTITY</span>
      </div>
    </div>
  );
};
