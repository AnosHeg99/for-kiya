import React from 'react';
import { SeasonId, SEASONS_CONFIG } from '../data/config';
import { acousticEngine } from '../audio/acousticEngine';

interface SeasonSelectorProps {
  currentSeason: SeasonId;
  onSelectSeason: (season: SeasonId) => void;
  variant?: 'floating-dock' | 'inline-horizontal';
  className?: string;
}

export const SeasonSelector: React.FC<SeasonSelectorProps> = ({
  currentSeason,
  onSelectSeason,
  variant = 'floating-dock',
  className = '',
}) => {
  const seasons: SeasonId[] = ['semi', 'panas', 'gugur', 'dingin'];

  const handleSelect = (id: SeasonId) => {
    if (id === currentSeason) return;
    onSelectSeason(id);
    acousticEngine.ensureBgmPlaying();
    acousticEngine.playSceneClick('sanctuary');
    acousticEngine.playSeasonalShift();
  };

  const getActiveThemeStyle = (id: SeasonId) => {
    switch (id) {
      case 'semi':
        return 'bg-gradient-to-r from-pink-400 via-rose-400 to-sky-400 text-white shadow-[0_0_20px_rgba(244,114,182,0.65)] border-pink-200';
      case 'panas':
        return 'bg-gradient-to-r from-amber-400 via-sky-400 to-sky-500 text-white shadow-[0_0_20px_rgba(251,191,36,0.65)] border-amber-200';
      case 'gugur':
        return 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-400 text-white shadow-[0_0_20px_rgba(249,115,22,0.65)] border-amber-300';
      case 'dingin':
        return 'bg-gradient-to-r from-sky-400 via-indigo-400 to-slate-400 text-white shadow-[0_0_20px_rgba(56,189,248,0.65)] border-sky-200';
    }
  };

  if (variant === 'inline-horizontal') {
    return (
      <div
        id="season-selector-inline"
        className={`w-full flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white/85 backdrop-blur-md border border-white/90 shadow-xs ${className}`}
      >
        <div className="flex items-center justify-between w-full px-2 text-[10px] text-sky-800 font-cinzel font-bold">
          <span className="flex items-center gap-1.5">
            <span className="text-amber-500"></span>
            <span>PILIH TEMA MUSIM SURAT</span>
          </span>
          <span className="font-jp text-[9px] text-sky-600">四季の調律 • SEASON SELECT</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 w-full">
          {seasons.map((id) => {
            const cfg = SEASONS_CONFIG[id];
            const isActive = currentSeason === id;

            return (
              <button
                key={id}
                type="button"
                id={`season-inline-tab-${id}`}
                onClick={() => handleSelect(id)}
                className={`group relative flex flex-col sm:flex-row items-center justify-center gap-1 py-1.5 px-2 rounded-xl transition-all duration-300 cursor-pointer border ${
                  isActive
                    ? `${getActiveThemeStyle(id)} scale-[1.03] font-bold`
                    : 'bg-white/70 text-sky-900/80 hover:bg-sky-50 border-sky-100 hover:border-sky-200 font-medium'
                }`}
              >
                <span className="text-sm">{cfg.symbol}</span>
                <span className="font-jp text-[10.5px] tracking-wider whitespace-nowrap">
                  {cfg.japanese.split('•')[0].trim()}
                </span>
                <span className="font-cinzel text-[9px] tracking-wider hidden sm:inline whitespace-nowrap opacity-90">
                  {cfg.name.replace('Musim ', '')}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <nav
      id="season-selector-dock"
      aria-label="Pemilih 4 Musim Aozora"
      className={`fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 pointer-events-auto select-none px-2 w-auto ${className}`}
      style={{ maxWidth: '98vw' }}
    >
      <div className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full bg-white/90 backdrop-blur-2xl border-2 border-white/95 shadow-[0_12px_35px_rgba(14,165,233,0.3)]">
        {/* Season brand label */}
        <div className="hidden md:flex items-center pl-3 pr-2.5 border-r border-sky-200/80 text-sky-900">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse mr-1.5" />
          <span className="font-jp text-[10.5px] font-bold tracking-widest">
            
          </span>
        </div>

        {seasons.map((id) => {
          const cfg = SEASONS_CONFIG[id];
          const isActive = currentSeason === id;

          return (
            <button
              key={id}
              type="button"
              id={`season-tab-${id}`}
              onClick={() => handleSelect(id)}
              className={`group relative flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full transition-all duration-300 cursor-pointer outline-none border ${
                isActive
                  ? `${getActiveThemeStyle(id)} scale-105 font-bold`
                  : 'text-sky-950/75 hover:text-sky-950 hover:bg-sky-100/60 border-transparent font-medium'
              }`}
            >
              <span className="text-xs sm:text-sm">{cfg.symbol}</span>
              <span className="font-jp text-[11px] sm:text-xs tracking-wider whitespace-nowrap font-bold">
                {cfg.japanese.split('•')[0].trim()}
              </span>
              <span className="font-cinzel text-[10px] sm:text-xs tracking-wider hidden xs:inline whitespace-nowrap">
                {cfg.name.replace('Musim ', '')}
              </span>

              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff] animate-ping ml-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
