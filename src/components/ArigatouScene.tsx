import React, { useEffect } from 'react';
import { APP_CONFIG, SeasonId, SEASONS_CONFIG } from '../data/config';
import { acousticEngine } from '../audio/acousticEngine';
import { IMAGE_ASSETS } from '../data/assets';

interface ArigatouSceneProps {
  isOpen: boolean;
  season: SeasonId;
}

export const ArigatouScene: React.FC<ArigatouSceneProps> = ({ isOpen, season }) => {
  const currentSeasonConfig = SEASONS_CONFIG[season];

  useEffect(() => {
    if (isOpen) {
      acousticEngine.ensureBgmPlaying();
      acousticEngine.playSceneClick('arigatou');
      acousticEngine.playChime(1.5, 7);
      const timer = setTimeout(() => {
        acousticEngine.playHoshinekoVoice('purring');
        acousticEngine.playChime(1.2, 4);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Seasonal Chain & Seal Palette
  const getSeasonalAura = () => {
    switch (season) {
      case 'semi':
        return {
          chainStroke: '#f472b6',
          anchorBg: 'bg-pink-400 border-pink-200 shadow-[0_0_15px_rgba(244,114,182,0.8)]',
          cardBorder: 'border-pink-300 shadow-[0_30px_75px_rgba(244,114,182,0.45)]',
          cardBg: 'from-white/95 via-pink-50/95 to-sky-50/95',
          floatingParticles: ['🌸', '✿', '🌸'],
        };
      case 'panas':
        return {
          chainStroke: '#fbbf24',
          anchorBg: 'bg-amber-400 border-yellow-200 shadow-[0_0_15px_rgba(245,158,11,0.8)]',
          cardBorder: 'border-amber-300 shadow-[0_30px_75px_rgba(245,158,11,0.45)]',
          cardBg: 'from-white/95 via-amber-50/95 to-sky-50/95',
          floatingParticles: ['☀️', '✦', '✨'],
        };
      case 'gugur':
        return {
          chainStroke: '#ea580c',
          anchorBg: 'bg-orange-500 border-orange-200 shadow-[0_0_15px_rgba(234,88,12,0.8)]',
          cardBorder: 'border-orange-400 shadow-[0_30px_75px_rgba(234,88,12,0.45)]',
          cardBg: 'from-white/95 via-orange-50/95 to-stone-50/95',
          floatingParticles: ['🍁', '🍂', '✨'],
        };
      case 'dingin':
      default:
        return {
          chainStroke: '#38bdf8',
          anchorBg: 'bg-sky-400 border-white shadow-[0_0_18px_rgba(56,189,248,0.9)]',
          cardBorder: 'border-cyan-300 shadow-[0_30px_80px_rgba(56,189,248,0.5)]',
          cardBg: 'from-white/95 via-sky-50/95 to-indigo-50/95',
          floatingParticles: ['❄️', '❅', '💎'],
        };
    }
  };

  const aura = getSeasonalAura();

  return (
    <div
      id="arigatou-sealed-scene"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 select-none pointer-events-auto transition-all duration-1000 animate-fade-in overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 50% 50%, rgba(15, 23, 42, 0.94) 0%, rgba(12, 74, 110, 0.96) 55%, rgba(2, 6, 23, 0.98) 100%)',
      }}
    >
      {/* Radiant Celestial Halo matching the season chosen in the reply scene */}
      <div
        className="absolute w-[680px] h-[680px] rounded-full blur-[130px] pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${currentSeasonConfig.rimColor} 0%, ${currentSeasonConfig.cardGlow} 45%, transparent 75%)`,
        }}
      />

      {/* Subtle Floating Seasonal Runes (Gentle, magical micro-movement without excessive motion) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-15">
        {aura.floatingParticles.map((pt, i) => (
          <span
            key={i}
            className="absolute text-base opacity-40 animate-gentle-breathe"
            style={{
              top: `${20 + i * 28}%`,
              left: `${15 + i * 32}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: '6s',
            }}
          >
            {pt}
          </span>
        ))}
      </div>

      {/* ========================================================= */}
      {/* SACRED MAGICAL CHAINS - DYNAMICALLY STYLED BY SEASON */}
      {/* ========================================================= */}
      <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
        {/* TOP CHAIN */}
        <div className="absolute top-0 flex flex-col items-center animate-chain-float">
          <svg width="24" height="120" viewBox="0 0 24 120" style={{ filter: `drop-shadow(0 0 8px ${aura.chainStroke})` }}>
            <path
              d="M12,0 L12,120"
              stroke={aura.chainStroke}
              strokeWidth="4"
              strokeDasharray="8,6"
              strokeLinecap="round"
            />
          </svg>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[8px] text-white font-bold ${aura.anchorBg}`}>
            ✦
          </div>
        </div>

        {/* BOTTOM CHAIN */}
        <div className="absolute bottom-0 flex flex-col-reverse items-center animate-chain-float">
          <svg width="24" height="120" viewBox="0 0 24 120" style={{ filter: `drop-shadow(0 0 8px ${aura.chainStroke})` }}>
            <path
              d="M12,0 L12,120"
              stroke={aura.chainStroke}
              strokeWidth="4"
              strokeDasharray="8,6"
              strokeLinecap="round"
            />
          </svg>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[8px] text-white font-bold ${aura.anchorBg}`}>
            ✦
          </div>
        </div>

        {/* LEFT CHAIN */}
        <div className="absolute left-0 hidden sm:flex items-center animate-chain-float">
          <svg width="140" height="24" viewBox="0 0 140 24" style={{ filter: `drop-shadow(0 0 8px ${aura.chainStroke})` }}>
            <path
              d="M0,12 L140,12"
              stroke={aura.chainStroke}
              strokeWidth="4"
              strokeDasharray="8,6"
              strokeLinecap="round"
            />
          </svg>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[8px] text-white font-bold ${aura.anchorBg}`}>
            ✦
          </div>
        </div>

        {/* RIGHT CHAIN */}
        <div className="absolute right-0 hidden sm:flex flex-row-reverse items-center animate-chain-float">
          <svg width="140" height="24" viewBox="0 0 140 24" style={{ filter: `drop-shadow(0 0 8px ${aura.chainStroke})` }}>
            <path
              d="M0,12 L140,12"
              stroke={aura.chainStroke}
              strokeWidth="4"
              strokeDasharray="8,6"
              strokeLinecap="round"
            />
          </svg>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[8px] text-white font-bold ${aura.anchorBg}`}>
            ✦
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MAIN SPIRITUAL SANCTUM CARD - GENTLE SUBTLE MAGIC MOVEMENT */}
      {/* ========================================================= */}
      <div
        className={`relative w-full max-w-[450px] flex flex-col items-center text-center p-6 sm:p-8 rounded-[36px] border-2 bg-gradient-to-b ${aura.cardBg} ${aura.cardBorder} z-30 backdrop-blur-2xl animate-gentle-breathe`}
      >
        {/* Luminous Wax Sealed Illustration Crest */}
        <div
          className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 shadow-lg mb-3 p-1 bg-white"
          style={{ borderColor: aura.chainStroke }}
        >
          <img
            src={IMAGE_ASSETS.goldenWaxSealedLetter}
            alt="Wax sealed crest"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center rounded-full filter brightness-105"
          />
          <div
            className="absolute inset-0 rounded-full border animate-ping opacity-40 pointer-events-none"
            style={{ borderColor: aura.chainStroke }}
          />
        </div>

        {/* Japanese Light Novel Ending Calligraphy */}
        <span className="font-jp text-xs sm:text-sm text-sky-800 tracking-[0.3em] font-bold">
          {APP_CONFIG.arigatou.japanese} • {currentSeasonConfig.kanji}
        </span>

        <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-sky-950 tracking-wider mt-0.5 mb-1 drop-shadow-xs">
          {APP_CONFIG.arigatou.romaji}
        </h1>

        <div
          className="w-20 h-[1.5px] my-2"
          style={{
            background: `linear-gradient(to right, transparent, ${aura.chainStroke}, transparent)`,
          }}
        />

        <h3 className="font-cinzel text-xs sm:text-sm font-semibold text-sky-900 tracking-wide mb-1.5">
          {APP_CONFIG.arigatou.title}
        </h3>

        <p className="text-xs sm:text-[12.5px] text-sky-950/85 font-normal leading-relaxed max-w-sm">
          {APP_CONFIG.arigatou.prayer}
        </p>

        {/* Ambient Japanese blessings banner */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-bold text-sky-900 font-jp tracking-widest bg-white/85 px-4 py-1.5 rounded-full border border-sky-200/90 shadow-xs">
          <span>永遠の安らぎ</span>
          <span>•</span>
          <span>{currentSeasonConfig.japanese}</span>
          <span>•</span>
          <span className="font-cinzel">IDENTITAS</span>
        </div>
      </div>
    </div>
  );
};
