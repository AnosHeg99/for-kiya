import React, { useEffect, useRef, useState } from 'react';
import { APP_CONFIG, SeasonId, SEASONS_CONFIG } from '../data/config';
import { acousticEngine } from '../audio/acousticEngine';
import { HoshinekoCompanion } from './HoshinekoCompanion';
import { ElementalWaxSeal } from './ElementalWaxSeal';
import { Point2D } from '../types';

interface LetterModalProps {
  isOpen: boolean;
  onProceed: () => void;
  pointer: Point2D;
  season: SeasonId;
  onSeasonChange: (newSeason: SeasonId) => void;
}

interface SeasonalLetterContent {
  eyebrow: string;
  paragraphOne: string;
  paragraphTwo: string;
  textClass: string;
  borderClass: string;
  softBgClass: string;
}

const SEASONAL_LETTER_CONTENT: Record<SeasonId, SeasonalLetterContent> = {

  semi: {
    eyebrow: 'Untuk hari yang terasa ringan',

    paragraphOne:
      'Semoga tahun ini kamu lebih sering dapet hari yang menyenangkan.',

    paragraphTwo:
      'Nggak harus selalu ada sesuatu yang besar. Hal kecil juga boleh bikin senang, meong 🌸🌸🌸',

    textClass: 'text-rose-950',
    borderClass: 'border-rose-200/80',
    softBgClass: 'bg-rose-50/35',
  },

  panas: {
    eyebrow: 'Untuk hari yang penuh cahaya',

    paragraphOne:
      'Semoga tahun ini banyak hal baik yang tiba-tiba aja datang, yang bikin senyum dan meong h3he',

    paragraphTwo:
      'Kata identitas hari ini santai aja h3he, nikmatin dulu ulang tahunnya. Urusan yang lain tunda bentar h3he ✨☀️🌻',

    textClass: 'text-amber-950',
    borderClass: 'border-amber-200/80',
    softBgClass: 'bg-amber-50/35',
  },

  gugur: {
    eyebrow: 'Untuk halaman baru',

    paragraphOne:
      'Semoga tahun ini apa yang kamu inginkan dari dulu bisa terwujud yahh',

    paragraphTwo:
      'Semoga setelah ini kamu ketemu lebih banyak hal yang bikin kamu nyaman meongg 🍁🍂🍁',

    textClass: 'text-orange-950',
    borderClass: 'border-orange-200/80',
    softBgClass: 'bg-orange-50/35',
  },

  dingin: {
    eyebrow: 'Untuk hari yang tenang',

    paragraphOne:
      'Semoga tahun ini kamu nggak terlalu sibuk sampai lupa istirahat.',

    paragraphTwo:
      'Selamat ulang tahun yahh. Semoga banyak yang baik baik datang ke kamu ❄️❄️❄️ ',

    textClass: 'text-slate-800',
    borderClass: 'border-sky-200/80',
    softBgClass: 'bg-sky-50/35',
  },
};

const SEASON_IDS: SeasonId[] = ['semi', 'panas', 'gugur', 'dingin'];

export const LetterModal: React.FC<LetterModalProps> = ({
  isOpen,
  onProceed,
  pointer,
  season,
  onSeasonChange,
}) => {
  const [letterStage, setLetterStage] = useState<'sealed' | 'unsealing' | 'opened'>('sealed');
  const [isProceeding, setIsProceeding] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const currentSeasonConfig = SEASONS_CONFIG[season];
  const currentLetter = SEASONAL_LETTER_CONTENT[season];

  const clearTimers = () => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  };

  const schedule = (callback: () => void, delay: number) => {
    const timer = setTimeout(callback, delay);
    timersRef.current.push(timer);
    return timer;
  };

  useEffect(() => {
    if (!isOpen) {
      clearTimers();
      return;
    }

    setLetterStage('sealed');
    setIsProceeding(false);

    return clearTimers;
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBreakSeal = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (letterStage !== 'sealed' || isProceeding) return;

    setLetterStage('unsealing');
    acousticEngine.ensureBgmPlaying();
    acousticEngine.playSceneClick('letter');
    acousticEngine.playChime(1.5, 6);

    schedule(() => {
      acousticEngine.playMagicSparkle();
      acousticEngine.playChime(1.8, 9);
    }, 400);

    schedule(() => {
      setLetterStage('opened');
      acousticEngine.playKawaiiPop(1.15);
    }, 900);
  };

  const handleProceedClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (isProceeding) return;

    setIsProceeding(true);
    acousticEngine.ensureBgmPlaying();
    acousticEngine.playSceneClick('letter');
    acousticEngine.playMagicSparkle();
    acousticEngine.playChime(1.7, 8);

    schedule(() => {
      onProceed();
    }, 700);
  };

  const handleSeasonSelect = (nextSeason: SeasonId, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (nextSeason === season || isProceeding) return;

    acousticEngine.playSceneClick('letter');
    acousticEngine.playSeasonalShift();
    onSeasonChange(nextSeason);
  };

  return (
    <div
      id="magical-letter-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Surat ulang tahun"
      className={[
        'fixed inset-0 z-50 h-[100dvh] w-full overflow-hidden',
        'flex flex-col px-2.5 py-2.5 sm:px-4 sm:py-3',
        'select-none transition-all duration-700',
        isProceeding ? 'scale-[1.015] opacity-100' : 'scale-100 opacity-100',
      ].join(' ')}
      style={{
        background:
          'radial-gradient(circle at 50% 45%, rgba(15,23,42,0.92) 0%, rgba(12,74,110,0.96) 56%, rgba(2,6,23,0.99) 100%)',
        paddingTop: 'max(10px, env(safe-area-inset-top))',
        paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
      }}
    >
      {/* Seasonal atmosphere. Decorative only so it never blocks interaction. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[min(72vw,760px)] w-[min(72vw,760px)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px] transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${currentSeasonConfig.cardGlow} 0%, ${currentSeasonConfig.rimColor} 42%, transparent 74%)`,
          opacity: 0.75,
        }}
      />

      {/* Header: compact on phones, balanced on larger screens. */}
      <header className="relative z-30 flex w-full shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-center justify-center gap-2 sm:justify-start">
          <span className="text-sm text-sky-300" aria-hidden="true">
            ✦
          </span>
          <span className="truncate font-jp text-[10px] font-bold tracking-[0.16em] text-white/90 sm:text-xs sm:tracking-[0.2em]">
            {currentSeasonConfig.japanese} • {currentSeasonConfig.elementName}
          </span>
        </div>

        <nav
          aria-label="Pilih suasana musim"
          className="mx-auto flex w-fit max-w-full items-center gap-0.5 overflow-x-auto rounded-full border border-white/20 bg-white/10 p-1 shadow-lg backdrop-blur-xl sm:mx-0 sm:gap-1"
        >
          {SEASON_IDS.map((seasonId) => {
            const seasonConfig = SEASONS_CONFIG[seasonId];
            const isActive = seasonId === season;

            return (
              <button
                key={seasonId}
                type="button"
                aria-pressed={isActive}
                onClick={(event) => handleSeasonSelect(seasonId, event)}
                className={[
                  'flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5',
                  'text-[10px] font-semibold transition-all duration-300',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80',
                  isActive
                    ? 'bg-white text-sky-950 shadow-sm'
                    : 'text-white/75 hover:bg-white/10 hover:text-white',
                ].join(' ')}
              >
                <span aria-hidden="true">{seasonConfig.symbol}</span>
                <span className="font-jp sm:text-[11px]">
                  {seasonConfig.name.replace('Musim ', '')}
                </span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main area owns vertical space, preventing the card from being pushed under the footer. */}
      <main className="relative z-20 flex min-h-0 flex-1 w-full items-center justify-center overflow-x-visible overflow-y-auto px-1 py-2 sm:px-2 sm:py-3">
        {letterStage !== 'opened' && (
          <div className="grid w-full max-w-[800px] grid-cols-1 items-center justify-items-center gap-2 overflow-visible sm:grid-cols-[minmax(0,1fr)_220px] sm:gap-5">
            <div
              id="sealed-celestial-envelope"
              className={[
                'relative flex w-full max-w-[345px] flex-col items-center justify-center overflow-hidden',
                'aspect-[4/3] rounded-[26px] border-2 p-5 sm:max-w-[400px] sm:rounded-[30px] sm:p-6',
                'bg-gradient-to-b shadow-[0_22px_55px_rgba(0,0,0,0.28)]',
                'transition-[border-color,box-shadow,transform] duration-700',
                currentSeasonConfig.envelopeTexture,
                currentSeasonConfig.frameBorderClass,
                letterStage === 'unsealing' ? 'scale-[0.985]' : 'scale-100',
              ].join(' ')}
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1.5 transition-colors duration-700"
                style={{ background: currentSeasonConfig.rimColor }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-4 rounded-2xl border border-dashed border-sky-400/30 sm:inset-5"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-45"
              >
                <svg
                  viewBox="0 0 400 120"
                  className="h-full w-full text-sky-400/45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M0 0L200 100L400 0" />
                </svg>
              </div>

              <div className="relative z-20 flex flex-col items-center justify-center">
                <ElementalWaxSeal
                  season={season}
                  isUnsealing={letterStage === 'unsealing'}
                  onClick={handleBreakSeal}
                  size="lg"
                />

                <div className="mt-3 text-center">
                  <span className="block font-jp text-[10px] font-bold tracking-[0.16em] text-sky-950 sm:text-xs">
                    {currentSeasonConfig.kanji}の手紙 • {currentSeasonConfig.elementName}
                  </span>
                  <span
                    className="mt-1 block text-[10px] font-medium tracking-wide text-sky-800/80"
                    aria-live="polite"
                  >
                    {letterStage === 'unsealing' ? 'Membuka segel…' : 'Sentuh segelnya'}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-30 flex w-full min-w-0 items-center justify-center overflow-visible px-1 sm:w-[220px] sm:px-0">
              <HoshinekoCompanion
                pointer={pointer}
                season={season}
                sceneName="envelope-companion"
                size="md"
                showInteractivePalette={true}
              />
            </div>
          </div>
        )}

        {letterStage === 'opened' && (
          <section
            id="magical-letter-card"
            className={[
              'relative flex w-full max-w-[520px] min-h-0 max-h-full flex-col overflow-visible',
              'rounded-[22px] border-2 shadow-[0_24px_70px_rgba(0,0,0,0.30)]',
              'bg-gradient-to-b backdrop-blur-2xl animate-fade-in',
              currentSeasonConfig.envelopeTexture,
              currentSeasonConfig.frameBorderClass,
            ].join(' ')}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-3 rounded-t-[20px] border-b border-sky-200/60 bg-white/90 px-4 py-2.5 sm:px-5">
              <div className="flex min-w-0 items-center gap-2">
                <span className="text-sm" aria-hidden="true">
                  {currentSeasonConfig.symbol}
                </span>
                <span className="truncate font-jp text-[9.5px] font-bold tracking-[0.14em] text-sky-950 sm:text-[11px] sm:tracking-[0.18em]">
                  {APP_CONFIG.letter.japaneseTitle} • {currentSeasonConfig.japanese}
                </span>
              </div>
              <span className="shrink-0 text-[9px] font-medium tracking-[0.12em] text-sky-700/70">
                {currentLetter.eyebrow}
              </span>
            </div>

            {/* Scroll only the letter copy. The cat is outside the scroll viewport so its pop-up text cannot be clipped by overflow-y-auto. */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-5 sm:py-3.5">
              <div className="text-center">
                <span className="block font-jp text-[9px] font-semibold tracking-[0.16em] text-sky-700">
                  お誕生日おめでとう • HAPPY BIRTHDAY
                </span>
                <h2 className="mt-1 font-cinzel text-[15px] font-bold tracking-[0.06em] text-sky-950 sm:text-base">
                  {APP_CONFIG.letter.title}
                </h2>
              </div>

              <div
                className={[
                  'mt-3 rounded-2xl border px-3.5 py-3 sm:px-4 sm:py-3.5',
                  currentLetter.borderClass,
                  currentLetter.softBgClass,
                ].join(' ')}
              >
                <p className={`text-[12px] leading-5 sm:text-[12.5px] sm:leading-5 ${currentLetter.textClass}`}>
                  {currentLetter.paragraphOne}
                </p>
                <p
                  className={`mt-2.5 border-t pt-2.5 text-[12px] leading-5 sm:text-[12.5px] sm:leading-5 ${currentLetter.textClass} ${currentLetter.borderClass}`}
                >
                  {currentLetter.paragraphTwo}
                </p>
              </div>
            </div>

            {/* Companion safe zone: deliberately outside the scrolling region so its speech/text bubble has room to render in full. */}
            <div className="relative z-40 shrink-0 px-4 pb-2.5 pt-1 sm:px-5 sm:pb-3">
              <div className="relative flex min-h-[58px] w-full items-center overflow-visible rounded-2xl border border-sky-200/75 bg-white/80 p-2.5 shadow-sm sm:min-h-[64px] sm:p-3">
                <div className="relative z-50 flex w-full items-center justify-center overflow-visible">
                  <HoshinekoCompanion
                    pointer={pointer}
                    season={season}
                    sceneName="letter-nook"
                    size="sm"
                    showInteractivePalette={true}
                  />
                </div>

                <div className="pointer-events-none absolute right-3 hidden min-w-0 sm:block">
                  <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-sky-950">
                    <span>MEONG</span>
                    <span aria-hidden="true">{currentSeasonConfig.symbol}</span>
                  </div>
                  <p className="mt-0.5 text-right text-[9.5px] leading-4 text-sky-800/80">
                    Teman kecil untuk hari spesialmu.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer / single action */}
            <div className="flex shrink-0 items-center justify-between gap-3 rounded-b-[20px] border-t border-sky-200/70 bg-white/95 px-4 py-2.5 sm:px-5">
              <div className="flex shrink-0 items-center gap-1.5 text-[9px] font-semibold tracking-[0.12em] text-sky-800 sm:text-[10px]">
                <span className="text-sky-500" aria-hidden="true">
                  ✦
                </span>
                <span>KIYA</span>
              </div>

              <button
                type="button"
                id="ke-scene-berikutnya-btn"
                onClick={handleProceedClick}
                disabled={isProceeding}
                className={[
                  'group relative flex shrink-0 items-center gap-2 overflow-hidden rounded-full',
                  'border border-white/90 bg-gradient-to-r from-sky-500 via-indigo-600 to-sky-500',
                  'bg-[length:200%_auto] px-3.5 py-2 text-[10px] font-bold tracking-[0.08em] text-white',
                  'shadow-[0_0_14px_rgba(56,189,248,0.45)] transition-all duration-300 sm:px-4 sm:text-[11px]',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/90',
                  isProceeding
                    ? 'cursor-wait opacity-80'
                    : 'hover:bg-right hover:shadow-[0_0_20px_rgba(99,102,241,0.65)] active:scale-[0.98]',
                ].join(' ')}
              >
                <span className="relative z-10">{isProceeding ? 'Sebentar…' : 'Lanjut'}</span>
                <span className="relative z-10 text-[11px] font-black" aria-hidden="true">
                  →
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                />
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="relative z-10 mt-1 shrink-0 text-center text-[7.5px] font-medium tracking-[0.18em] text-white/55 sm:text-[9px]">
        A LITTLE BIRTHDAY NOTE • KIYA
      </footer>
    </div>
  );
};
