import React, { useState } from 'react';
import { SeasonId, SEASONS_CONFIG, APP_CONFIG } from '../data/config';
import { acousticEngine } from '../audio/acousticEngine';
import { HoshinekoCompanion } from './HoshinekoCompanion';
import { Point2D } from '../types';

interface ReplyLetterModalProps {
  isOpen: boolean;
  currentSeason: SeasonId;
  onSelectSeason: (season: SeasonId) => void;
  onSendComplete: () => void;
  pointer: Point2D;
}

interface TypingParticle {
  id: number;
  x: number;
  y: number;
  char: string;
}

export const ReplyLetterModal: React.FC<ReplyLetterModalProps> = ({
  isOpen,
  currentSeason,
  onSelectSeason,
  onSendComplete,
  pointer,
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [particles, setParticles] = useState<TypingParticle[]>([]);

  if (!isOpen) return null;

  const seasonsList: SeasonId[] = ['semi', 'panas', 'gugur', 'dingin'];
  const cfg = SEASONS_CONFIG[currentSeason];

  // Dynamic Seasonal Elements Matrix
  const getSeasonalElementalData = () => {
    switch (currentSeason) {
      case 'semi':
        return {
          particlePool: ['🌸', '✿', '❀', '✨'],
          cardBg: 'from-pink-50/95 via-rose-50/95 to-sky-50/95',
          borderClass: 'border-pink-300 shadow-[0_0_35px_rgba(244,114,182,0.4)]',
          inputBg: 'bg-white/95 border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-300/50',
          runes: '🌸 ✿ ❀ 桜 • 薫風',
          frostEffect: false,
          buttonClass:
            'bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-300 hover:to-rose-300',
          buttonBorder: 'border-2 border-pink-200 shadow-[0_0_24px_rgba(244,114,182,0.85)]',
          buttonRingColor: 'border-pink-300',
          buttonLeftIcon: '🌸',
          buttonRightIcon: '✨',
          buttonAura: 'from-pink-300/40 via-rose-300/30 to-transparent',
        };
      case 'panas':
        return {
          particlePool: ['☀️', '✦', '✨', '⚡'],
          cardBg: 'from-sky-50/95 via-amber-50/95 to-white/95',
          borderClass: 'border-amber-300 shadow-[0_0_35px_rgba(245,158,11,0.4)]',
          inputBg: 'bg-white/95 border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-300/50',
          runes: '☀️ ✦ ✧ 陽 • 碧空',
          frostEffect: false,
          buttonClass:
            'bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 hover:from-amber-300 hover:to-orange-300',
          buttonBorder: 'border-2 border-amber-200 shadow-[0_0_26px_rgba(245,158,11,0.9)]',
          buttonRingColor: 'border-amber-300',
          buttonLeftIcon: '☀️',
          buttonRightIcon: '⚡',
          buttonAura: 'from-amber-300/40 via-yellow-300/30 to-transparent',
        };
      case 'gugur':
        return {
          particlePool: ['🍁', '🍂', '✨', '☕'],
          cardBg: 'from-amber-50/95 via-orange-50/95 to-stone-50/95',
          borderClass: 'border-orange-400 shadow-[0_0_35px_rgba(234,88,12,0.4)]',
          inputBg: 'bg-white/95 border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-300/50',
          runes: '🍁 🍂 ☕ 秋 • 夕暮れ',
          frostEffect: false,
          buttonClass:
            'bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 hover:from-amber-500 hover:to-orange-400',
          buttonBorder: 'border-2 border-orange-200 shadow-[0_0_24px_rgba(234,88,12,0.85)]',
          buttonRingColor: 'border-orange-400',
          buttonLeftIcon: '🍁',
          buttonRightIcon: '🍂',
          buttonAura: 'from-orange-400/40 via-amber-400/30 to-transparent',
        };
      case 'dingin':
      default:
        return {
          particlePool: ['❄️', '❅', '❆', '💎'],
          cardBg: 'from-cyan-50/95 via-sky-50/95 to-indigo-50/95',
          borderClass: 'border-cyan-300 shadow-[0_0_40px_rgba(56,189,248,0.5)]',
          inputBg: 'bg-sky-50/90 border-cyan-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/50',
          runes: '❄️ ❅ ❆ 冬 • 氷晶オーロラ',
          frostEffect: true,
          buttonClass:
            'bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 hover:from-cyan-300 hover:to-sky-400',
          buttonBorder: 'border-2 border-cyan-200 shadow-[0_0_28px_rgba(56,189,248,0.9)]',
          buttonRingColor: 'border-cyan-300',
          buttonLeftIcon: '❄️',
          buttonRightIcon: '💎',
          buttonAura: 'from-cyan-300/40 via-sky-300/30 to-transparent',
        };
    }
  };

  const elem = getSeasonalElementalData();

  const handleSeasonChange = (id: SeasonId) => {
    onSelectSeason(id);
    acousticEngine.playSceneClick('reply');
    acousticEngine.playSeasonalShift();
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Audio by season (Winter typing has unique frost crystal crackle!)
    if (currentSeason === 'dingin') {
      acousticEngine.playFrostCrack();
    } else if (currentSeason === 'semi') {
      acousticEngine.playKawaiiPop(1.35);
    } else if (currentSeason === 'panas') {
      acousticEngine.playMagicSparkle();
    } else {
      acousticEngine.playTactileClick();
    }

    // Dynamic seasonal typing particles spawning near textarea
    const particleId = Date.now() + Math.random();
    const randomChar = elem.particlePool[Math.floor(Math.random() * elem.particlePool.length)];
    const newParticle: TypingParticle = {
      id: particleId,
      x: 30 + Math.random() * 260,
      y: 45 + Math.random() * 50,
      char: randomChar,
    };

    setParticles((prev) => [...prev.slice(-5), newParticle]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== particleId));
    }, 650);
  };

  const handleSend = () => {
    if (isSending) return;
    setIsSending(true);
    acousticEngine.ensureBgmPlaying();
    acousticEngine.playSceneClick('reply');
    acousticEngine.playAscensionSend(); // Natural dimensional starlight soaring whoosh & chord
    acousticEngine.playMagicSparkle();

    const replyText = message.trim() || 'Arigatou Gozaimasu';
const cleanPhone = APP_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');

const replyLetter = [
  '┌',
  `  “ ${safeText} ”`,
  '└',
  '',
  '✦ キアリア',
].join('\n');
  const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(replyLetter)}`;


    setTimeout(() => {
      try {
        window.open(waUrl, '_blank');
      } catch {
        window.location.href = waUrl;
      }

      // Confirmation chime when message takes flight
      acousticEngine.playChime(1.9, 10);
      acousticEngine.playHoshinekoVoice('happy');

      setTimeout(() => {
        onSendComplete();
        setIsSending(false);
      }, 700);
    }, 1200);
  };

  return (
    <div
      id="reply-letter-scene"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 select-none pointer-events-auto transition-all duration-700 animate-fade-in overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 50% 50%, rgba(15, 23, 42, 0.94) 0%, rgba(12, 74, 110, 0.96) 55%, rgba(2, 6, 23, 0.98) 100%)',
      }}
    >
      {/* Dynamic Seasonal Atmosphere Radiance */}
      <div
        className="absolute w-[680px] h-[680px] rounded-full blur-[130px] pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${cfg.rimColor} 0%, ${cfg.cardGlow} 45%, transparent 75%)`,
        }}
      />

      {/* Main Reply Card with Complete Structural Seasonal Transformation */}
      <div
        id="reply-station-card"
        className={`relative w-full max-w-[470px] max-h-[calc(100dvh-20px)] sm:max-h-[calc(100vh-32px)] flex flex-col rounded-[28px] sm:rounded-[32px] overflow-hidden border-2 bg-gradient-to-b ${elem.cardBg} ${elem.borderClass} shadow-2xl z-10 transition-all duration-700 backdrop-blur-2xl my-auto ${
          isSending ? 'scale-75 -translate-y-80 opacity-0 rotate-6 filter blur-md' : 'scale-100 opacity-100'
        }`}
      >
        {/* Header Bar */}
        <div className="shrink-0 px-4 sm:px-5 py-2.5 sm:py-3 border-b border-sky-200/60 bg-white/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">{cfg.symbol}</span>
            <span className="font-jp text-xs text-sky-950 font-extrabold tracking-wider">
              {cfg.japanese} • {cfg.elementName}
            </span>
          </div>
          <span className="font-cinzel text-xs font-bold text-sky-900 tracking-wider">
            {APP_CONFIG.reply.header}
          </span>
        </div>

        {/* Text Area with Elemental Typing Effect (Including Ice Magic for Winter) */}
        <div className="p-3.5 sm:p-4.5 flex flex-col gap-2 sm:gap-2.5 relative overflow-y-auto min-h-0 flex-1">
          {/* Typing Particles Floating on Screen */}
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute text-base pointer-events-none animate-ping opacity-90 z-20"
              style={{ left: p.x, top: p.y }}
            >
              {p.char}
            </span>
          ))}

          {/* Elemental Cryptography Rune Bar */}
          <div className="flex items-center justify-between px-1 text-[10px] font-jp font-semibold text-sky-800/80">
            <span>{elem.runes}</span>
            <span className="font-cinzel tracking-widest">{cfg.kanji} IDENTITAS </span>
          </div>

          <div className="relative">
            {/* Ice Frost / Elemental Shiver Vignette */}
            {elem.frostEffect && (
              <div className="absolute inset-0 rounded-2xl border-2 border-cyan-300/60 pointer-events-none animate-pulse" />
            )}

            <textarea
              id="reply-message-input"
              value={message}
              onChange={handleTyping}
              rows={3}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              className={`w-full p-3.5 rounded-2xl ${elem.inputBg} border text-slate-900 text-[14px] sm:text-[16px] tracking-wide leading-relaxed focus:outline-none resize-none transition-all shadow-inner font-normal`}
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontWeight: 'normal',
              }}
            />
          </div>

          {/* REAL-TIME 4-SEASON SELECTOR (Changes all elements instantly even while writing!) */}
          <div className="mt-1 pt-2 sm:pt-2.5 border-t border-sky-200/60 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-sky-950">
              <span className="font-jp tracking-wider">四季の選択:</span>
              <span className="font-cinzel text-sky-800">{cfg.name}</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 w-full">
              {seasonsList.map((id) => {
                const s = SEASONS_CONFIG[id];
                const isSelected = currentSeason === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleSeasonChange(id)}
                    className={`relative py-1.5 sm:py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-white border-sky-400 shadow-md scale-[1.03] ring-2 ring-sky-400'
                        : 'bg-white/60 hover:bg-white/85 border-sky-100 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <span className="text-base">{s.symbol}</span>
                    <span className="font-cinzel text-[9.5px] font-black text-sky-950 leading-none">
                      {s.name.replace('Musim ', '')}
                    </span>
                    <span className="font-jp text-[8px] text-sky-700 leading-none">
                      {s.kanji}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer with Living Hoshineko & Dynamic Send Button */}
        <div className="shrink-0 px-3.5 sm:px-5 py-2.5 sm:py-3 border-t border-sky-200/60 bg-white/95 backdrop-blur-md flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink">
            <HoshinekoCompanion
              pointer={pointer}
              season={currentSeason}
              sceneName="reply-companion"
              size="sm"
              showInteractivePalette={true}
            />
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-[11px] sm:text-xs font-bold text-sky-950 font-cinzel tracking-wider flex items-center gap-1 truncate">
                <span>‎ </span>
                <span className="text-sky-500 text-[10px]">✦</span>
              </span>
            </div>
          </div>

          {/* DYNAMIC SEASONAL SEND BUTTON (PROPORTIONALLY SCALED & NEVER CUT OFF) */}
          <button
            type="button"
            id="send-reply-letter-btn"
            onClick={handleSend}
            disabled={isSending}
            aria-label="Kirim Surat Balasan"
            className={`group relative flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full ${elem.buttonClass} ${elem.buttonBorder} hover:scale-[1.02] active:scale-95 text-white font-bold font-cinzel text-xs sm:text-sm tracking-wider transition-all duration-300 cursor-pointer pointer-events-auto overflow-hidden select-none shrink-0 shadow-md`}
          >
            {/* Ambient Elemental Glow Aura */}
            <div
              className={`absolute inset-[-4px] rounded-full border pointer-events-none animate-ping opacity-30 ${elem.buttonRingColor}`}
            />

            {/* Traveling Starlight / Glass Sheen Reflection */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

            {/* Dynamic Elemental Left Icon with Gentle Animation */}
            <span className="text-sm sm:text-base transition-transform duration-300 group-hover:scale-110 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              {elem.buttonLeftIcon}
            </span>

            {/* STRICT SINGLE WORD TEXT: 'Kirim' (OR 'Mengirim...' WHILE TRANSMITTING) */}
            <span className="relative z-10 font-cinzel font-black tracking-widest text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] whitespace-nowrap">
              {isSending ? 'Mengirim...' : 'Kirim'}
            </span>

            {/* Dynamic Elemental Right Spark */}
            <span className="text-xs sm:text-sm transition-transform duration-300 group-hover:scale-110 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              {elem.buttonRightIcon}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
