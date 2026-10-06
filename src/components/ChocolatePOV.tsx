import React, { useState } from 'react';
import { acousticEngine } from '../audio/acousticEngine';
import { Point2D } from '../types';
import { SeasonId, SEASONS_CONFIG } from '../data/config';
import { HoshinekoCompanion } from './HoshinekoCompanion';
import { IMAGE_ASSETS } from '../data/assets';

interface ChocolatePOVProps {
  isOpen: boolean;
  onReceiveChocolate: () => void;
  pointer: Point2D;
  season: SeasonId;
}

interface InteractiveGift {
  id: string;
  name: string;
  jpName: string;
  filename: string;
  type: 'kiyameomg' | 'identitas' | 'rimuru' | 'macaron';
  image: string;
  accent: string;
  glow: string;
  description: string;
}

const GIFTS_DATA: InteractiveGift[] = [
  {
    id: 'Serfort',
    name: 'Tsue to Tsurugi no Wistoria',
    jpName: '杖と剣のウィストリア',
    filename: 'Will.png',
    type: 'ice',
    image: IMAGE_ASSETS.kiyameongkawaii,
    accent: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.75)',
    description: 'Kamu selalu berusaha keras, karena itulah aku selalu mengagumimu',
  },
  {
    id: 'akuto',
    name: 'Ichiban Ushiro no Daimaou',
    jpName: 'いちばんうしろの大魔王',
    filename: 'Identitas.png',
    type: 'fire',
    image: IMAGE_ASSETS.identitas,
    accent: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.75)',
    description: 'Jika seluruh keberadaan ini hanyalah sebuah cerita, kau adalah bab terindah yang takkan pernah kuakhiri',
  },
  {
    id: 'rimuru',
    name: "Tensei Shitara Slime Datta Ken",
    jpName: '転生したらスライムだった件',
    filename: 'Rimuru.png',
    type: 'water',
    image: IMAGE_ASSETS.rimuru,
    accent: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.75)',
    description: 'Di tengah rumitnya dunia, kamu adalah alasan terbesarku untuk terus melangkah',
  },
  {
    id: 'anos',
    name: 'Maou Gakuin no Futekigousha: Shijou Saikyou no Maou no Shiso, Tensei shite Shison-tachi no Gakkou e Kayou',
    jpName: '魔王学院の不適合者 ～史上最強の魔王の始祖、転生して子孫たちの学校へ通う～',
    filename: 'Anos.jpg',
    type: 'destuctive',
    image: IMAGE_ASSETS.destruction,
    accent: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.75)',
    description: 'Dunia boleh menuntutmu menjadi sempurna, tapi bagiku, cukup jadilah dirimu sendiri',
  },
];

export const ChocolatePOV: React.FC<ChocolatePOVProps> = ({
  isOpen,
  onReceiveChocolate,
  pointer,
  season,
}) => {
  const [stage, setStage] = useState<'sealed' | 'unsealing' | 'pavilion'>('sealed');
  const [claimedGifts, setClaimedGifts] = useState<string[]>([]);
  const [magicRipple, setMagicRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const [isAscendingWithBird, setIsAscendingWithBird] = useState(false);

  const currentSeason = SEASONS_CONFIG[season];
  const allGiftsClaimed = claimedGifts.length === GIFTS_DATA.length;

  if (!isOpen) return null;

  // Unboxing Sequence: ONLY center emblem triggers it
  const handleBreakSeal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stage !== 'sealed') return;

    setStage('unsealing');
    acousticEngine.ensureBgmPlaying();
    acousticEngine.playSceneClick('gift');
    acousticEngine.playMagicalGiftOpen();

    setTimeout(() => {
      setStage('pavilion');
      acousticEngine.playChime(1.8, 9);
      acousticEngine.playHoshinekoVoice('giftReaction');
    }, 1100);
  };

  // Direct Image Download Mechanism
  const triggerImageDownload = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
    } catch {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle Direct Gift Click -> Magical Arcane Bloom -> Save File (NO "UNDUH" BUTTON, NO AD TOAST)
  const handleGiftClick = (e: React.MouseEvent, gift: InteractiveGift) => {
    e.stopPropagation();
    if (claimedGifts.includes(gift.id) || isAscendingWithBird) return;

    // Trigger full magical ripple at click position
    const rippleId = Date.now();
    setMagicRipple({ x: e.clientX, y: e.clientY, id: rippleId });
    setTimeout(() => setMagicRipple(null), 1000);

    // Natural, organic celestial acoustic harp & bell cascade (zero robot/AI tone)
    acousticEngine.ensureBgmPlaying();
    acousticEngine.playSceneClick('gift');
    acousticEngine.playMagicalGiftOpen();
    acousticEngine.playHoshinekoVoice('giftReaction');

    // Trigger direct file download
    triggerImageDownload(gift.image, gift.filename);

    // Apply magical ethereal curse/seal stamp
    setClaimedGifts((prev) => [...prev, gift.id]);
  };

  // Celestial Bird Click -> Fly to Reply Scene
  const handleBirdClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAscendingWithBird) return;

    setIsAscendingWithBird(true);
    acousticEngine.ensureBgmPlaying();
    acousticEngine.playSceneClick('gift');
    acousticEngine.playAscensionSend();

    setTimeout(() => {
      onReceiveChocolate();
      setIsAscendingWithBird(false);
      setStage('sealed');
      setClaimedGifts([]);
    }, 900);
  };

  return (
    <div
      id="chocolate-pov-overlay"
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-2 sm:p-4 pb-3 sm:pb-5 transition-all duration-700 select-none overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 50% 50%, rgba(15, 23, 42, 0.94) 0%, rgba(12, 74, 110, 0.96) 55%, rgba(2, 6, 23, 0.98) 100%)',
      }}
    >
      {/* Background Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${currentSeason.cardGlow} 0%, rgba(12, 74, 110, 0.4) 50%, rgba(8, 47, 73, 0.85) 100%)`,
        }}
      />

      {/* Screen-Wide Magical Arcane Shockwave Bloom upon Gift Download */}
      {magicRipple && (
        <div
          className="fixed pointer-events-none z-60 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-300 animate-ping"
          style={{
            left: magicRipple.x,
            top: magicRipple.y,
            width: '320px',
            height: '320px',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, transparent 70%)',
          }}
        />
      )}

      {/* ========================================================= */}
      {/* PHASE 1: SEALED DIMENSIONAL ALTAR */}
      {/* Real-time rotating magic seal, ONLY center emblem clickable */}
      {/* ========================================================= */}
      {stage !== 'pavilion' && (
        <div className="relative z-20 flex flex-col items-center justify-center max-w-md w-full my-auto -translate-y-2 sm:-translate-y-3 animate-fade-in">
          <div className="text-center mb-6">
            <span className="font-jp text-[11px] font-bold text-sky-200 tracking-widest block">
              星空の秘宝
            </span>
            <h2 className="font-cinzel text-xl sm:text-2xl font-black text-white tracking-widest mt-1">
              IDENTITY TREASURE
            </h2>
          </div>

          {/* REAL-TIME ROTATING MAGIC SEAL ARRAY */}
          <div className="relative w-60 h-60 sm:w-68 sm:h-68 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full border border-dashed border-amber-300/60 animate-spin pointer-events-none"
              style={{ animationDuration: '24s' }}
            />
            <div
              className="absolute inset-4 rounded-full border-2 border-white/60 animate-spin pointer-events-none"
              style={{ animationDuration: '16s', animationDirection: 'reverse' }}
            />

            {/* ONLY CENTER EMBLEM IS CLICKABLE */}
            <button
              type="button"
              id="center-gift-unboxing-emblem"
              onClick={handleBreakSeal}
              className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 shadow-[0_0_45px_rgba(251,191,36,0.95)] border-2 border-white group outline-none ${
                stage === 'unsealing' ? 'scale-130 rotate-180 filter blur-[1px]' : 'hover:scale-110 active:scale-95'
              }`}
              style={{
                background:
                  'radial-gradient(circle at 35% 30%, #fef08a 0%, #f59e0b 45%, #b45309 100%)',
              }}
            >
              <div className="absolute inset-[-6px] rounded-full border border-dashed border-amber-200 animate-spin pointer-events-none" style={{ animationDuration: '8s' }} />

              <div className="flex flex-col items-center justify-center text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                  🎁
                </span>
                <span className="font-cinzel text-[8.5px] font-black tracking-widest mt-0.5">
                  BUKA
                </span>
              </div>
            </button>
          </div>

          {/* Living Hoshineko below seal */}
          <div className="mt-5 flex flex-col items-center pointer-events-auto">
            <HoshinekoCompanion
              pointer={pointer}
              season={season}
              sceneName="gift-unboxing-cat"
              size="sm"
              showInteractivePalette={true}
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PHASE 2: OPEN CELESTIAL GIFT PAVILION */}
      {/* Diangkat lebih ke atas secara ergonomis, tidak terpotong ke bawah */}
      {/* ========================================================= */}
      {stage === 'pavilion' && (
        <div
          id="gift-pavilion-content"
          className={`relative z-20 flex flex-col items-center justify-center max-w-5xl w-full h-full my-auto -translate-y-2 sm:-translate-y-4 gap-1.5 sm:gap-2 animate-fade-in transition-all duration-700 ${
            isAscendingWithBird ? 'scale-110 opacity-0 filter blur-md' : 'scale-100 opacity-100'
          }`}
        >
          {/* Header Title */}
          <div className="text-center pt-1 pb-0.5 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 shadow-xs mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-syncopate text-[8.5px] font-bold text-white tracking-[0.2em]">
                IDENTITY REWARD
              </span>
            </div>
            <h2 className="font-jp text-base sm:text-xl font-black text-white tracking-widest drop-shadow-md">
              アイデンティティのギフト
            </h2>
            <span className="font-cinzel text-[9.5px] sm:text-[11px] text-sky-200 font-semibold tracking-wider block">
              Klik gambar untuk membuka segel
            </span>
          </div>

          {/* 4 GIFTS GRID: Compact, perfectly proportioned */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 w-full px-2 max-w-4xl shrink-0">
            {GIFTS_DATA.map((gift) => {
              const isClaimed = claimedGifts.includes(gift.id);

              return (
                <div
                  key={gift.id}
                  id={`gift-card-${gift.id}`}
                  onClick={(e) => handleGiftClick(e, gift)}
                  className={`relative rounded-[18px] sm:rounded-[22px] overflow-hidden border-2 transition-all duration-500 flex flex-col backdrop-blur-xl group ${
                    isClaimed
                      ? 'border-indigo-400/90 bg-slate-950/80 shadow-[0_0_30px_rgba(129,140,248,0.6)] cursor-default'
                      : 'border-white/90 bg-white/95 shadow-[0_8px_25px_rgba(14,165,233,0.3)] hover:scale-[1.03] cursor-pointer active:scale-95'
                  }`}
                >
                  {/* Image Container */}
                  <div className="relative w-full aspect-square max-h-28 sm:max-h-36 overflow-hidden bg-sky-100/40">
                    <img
                      src={gift.image}
                      alt={gift.name}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover object-center transition-all duration-700 ${
                        isClaimed ? 'filter contrast-125 saturate-150 brightness-90' : 'group-hover:scale-105'
                      }`}
                    />

                    {/* ========================================================= */}
                    {/* ETHEREAL STARLIGHT RUNIC CURSE / CELESTIAL SEAL STAMP */}
                    {/* ========================================================= */}
                    {isClaimed && (
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-2 bg-indigo-950/65 backdrop-blur-2xs animate-fade-in">
                        {/* Rotating Arcane Seal Circle */}
                        <div
                          className="absolute w-16 h-16 sm:w-22 sm:h-22 rounded-full border-2 border-dashed border-cyan-300/80 animate-spin pointer-events-none"
                          style={{ animationDuration: '14s' }}
                        />
                        <div
                          className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-pink-300/70 animate-spin pointer-events-none"
                          style={{ animationDuration: '10s', animationDirection: 'reverse' }}
                        />

                        {/* Traditional Kanji Seal Stamp: 封印 • TERKOLEKSI */}
                        <div className="relative z-30 px-2.5 py-0.5 sm:py-1 rounded-xl bg-indigo-950/90 border-2 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.95)] flex flex-col items-center animate-pulse">
                          <span className="font-jp text-sm sm:text-base font-black text-cyan-200 tracking-widest">
                            封印
                          </span>
                          <span className="font-cinzel text-[7.5px] sm:text-[8px] font-bold text-pink-300 tracking-wider">
                            ACQUIRED ✦
                          </span>
                        </div>

                        {/* Radiant Sparkles */}
                        <span className="absolute top-2 left-2 text-xs text-cyan-300 animate-ping">
                          ✦
                        </span>
                        <span className="absolute bottom-2 right-2 text-xs text-pink-300 animate-ping" style={{ animationDelay: '0.4s' }}>
                          ✦
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Description Footer (NO "Unduh" or download icons) */}
                  <div className="p-1.5 sm:p-2 flex flex-col justify-between flex-1">
                    <div>
                      <h3
                        className={`font-cinzel text-[10px] sm:text-[11.5px] font-bold truncate ${
                          isClaimed ? 'text-cyan-200' : 'text-sky-950'
                        }`}
                      >
                        {gift.name}
                      </h3>
                      <span className="font-jp text-[8px] sm:text-[8.5px] text-sky-600 block truncate mt-0.5">
                        {gift.jpName}
                      </span>
                    </div>

                    <div className="mt-1 pt-1 border-t border-sky-100 flex items-center justify-between">
                      <span className="font-cinzel text-[7.5px] sm:text-[8.5px] font-semibold text-sky-700">
                        {isClaimed ? '✦ Tersegel Abadi' : 'Touch'}
                      </span>
                      <span className="text-[10px] sm:text-xs">
                        {isClaimed ? '✨' : '✦'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ========================================================= */}
          {/* CENTER MAGICAL REAL-TIME PHENOMENON: THE CELESTIAL ASTRAL PHOENIX */}
          {/* Posisi tepat di tengah-tengah layar, sedikit lebih besar & dinamis smooth */}
          {/* Spanduk & tulisan telah dihapus sepenuhnya */}
          {/* ========================================================= */}
          {allGiftsClaimed ? (
            <div className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none animate-astral-bird-entrance">
              {/* Subtle Atmospheric Center Dimmer for Ethereal Focus */}
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] pointer-events-none transition-opacity duration-700" />

              <button
                type="button"
                id="celestial-astral-bird-btn"
                onClick={handleBirdClick}
                className="group relative flex flex-col items-center cursor-pointer pointer-events-auto outline-none transition-transform duration-500 hover:scale-110 active:scale-95 animate-astral-bird-hover select-none"
              >
                {/* Luminous Radiance & Pulsing Astral Auras */}
                <div className="absolute -inset-12 sm:-inset-16 rounded-full bg-radial from-cyan-400/35 via-sky-500/20 to-transparent blur-2xl pointer-events-none" />
                <div
                  className="absolute -inset-8 sm:-inset-10 rounded-full border border-dashed border-cyan-300/50 animate-spin-cw pointer-events-none"
                  style={{ animationDuration: '24s' }}
                />
                <div
                  className="absolute -inset-5 sm:-inset-7 rounded-full border border-sky-200/40 animate-spin-ccw pointer-events-none"
                  style={{ animationDuration: '18s' }}
                />
                <div className="absolute -inset-8 sm:-inset-10 rounded-full border border-cyan-300/30 animate-ping pointer-events-none opacity-30" />

                {/* ANIMATED CELESTIAL ASTRAL BIRD SVG (ENLARGED & DYNAMICALLY SMOOTH) */}
                <div className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 flex items-center justify-center filter drop-shadow-[0_0_28px_rgba(56,189,248,0.95)] group-hover:drop-shadow-[0_0_45px_rgba(251,191,36,0.95)] transition-all duration-500">
                  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="birdWingGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="40%" stopColor="#bae6fd" />
                        <stop offset="80%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#0284c7" />
                      </linearGradient>
                      <linearGradient id="birdBodyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="60%" stopColor="#e0f2fe" />
                        <stop offset="100%" stopColor="#7dd3fc" />
                      </linearGradient>
                      <linearGradient id="birdTailGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="60%" stopColor="#fde047" />
                        <stop offset="100%" stopColor="#ca8a04" />
                      </linearGradient>
                    </defs>

                    {/* Streamer Plumes / Stardust Tails (Animated Sway) */}
                    <g className="animate-astral-tail">
                      <path
                        d="M50 55 C44 72 36 90 32 98 C40 84 47 72 50 62 Z"
                        fill="url(#birdTailGrad)"
                        opacity="0.95"
                      />
                      <path
                        d="M50 55 C56 72 64 90 68 98 C60 84 53 72 50 62 Z"
                        fill="url(#birdTailGrad)"
                        opacity="0.95"
                      />
                      <path
                        d="M50 58 C48 75 49 92 50 102 C51 92 52 75 50 58 Z"
                        fill="#fef9c3"
                        opacity="0.8"
                      />
                    </g>

                    {/* Left Luminous Wing (Animated Flap) */}
                    <g className="animate-astral-wing-l">
                      <path
                        d="M50 45 C28 16 6 22 12 50 C24 45 40 46 50 48 Z"
                        fill="url(#birdWingGrad)"
                        stroke="#ffffff"
                        strokeWidth="1.4"
                      />
                      <path
                        d="M48 45 C32 25 18 30 20 48 C30 45 42 46 48 47 Z"
                        fill="#e0f2fe"
                        opacity="0.6"
                      />
                    </g>

                    {/* Right Luminous Wing (Animated Flap) */}
                    <g className="animate-astral-wing-r">
                      <path
                        d="M50 45 C72 16 94 22 88 50 C76 45 60 46 50 48 Z"
                        fill="url(#birdWingGrad)"
                        stroke="#ffffff"
                        strokeWidth="1.4"
                      />
                      <path
                        d="M52 45 C68 25 82 30 80 48 C70 45 58 46 52 47 Z"
                        fill="#e0f2fe"
                        opacity="0.6"
                      />
                    </g>

                    {/* Bird Body, Crest & Head */}
                    <ellipse cx="50" cy="50" rx="10" ry="15" fill="url(#birdBodyGrad)" stroke="#bae6fd" strokeWidth="1.4" />
                    <circle cx="50" cy="37" r="7.5" fill="#ffffff" stroke="#bae6fd" strokeWidth="1.4" />
                    
                    {/* Golden Crown Beak & Crest */}
                    <polygon points="50,31 47,24 53,24" fill="#f59e0b" />
                    <path d="M50 30 C49 22 44 17 42 15 C47 18 49 24 50 30 Z" fill="#fbbf24" />
                    <path d="M50 30 C51 22 56 17 58 15 C53 18 51 24 50 30 Z" fill="#fbbf24" />

                    {/* Celestial Eyes */}
                    <circle cx="47.5" cy="36" r="1.3" fill="#0284c7" />
                    <circle cx="52.5" cy="36" r="1.3" fill="#0284c7" />

                    {/* Divine Starlight Halo Crest */}
                    <circle cx="50" cy="37" r="12" fill="none" stroke="#fde047" strokeWidth="1.2" strokeDasharray="3,3" opacity="0.9" />
                  </svg>
                </div>
              </button>
            </div>
          ) : (
            /* BOTTOM HOSHINEKO COMPANION - ELEVATED, FULLY VISIBLE & NEVER CUT OFF */
            <div className="mt-1 sm:mt-1.5 pb-1 shrink-0 flex flex-col items-center pointer-events-auto">
              <HoshinekoCompanion
                pointer={pointer}
                season={season}
                sceneName="gift-pavilion-cat"
                size="sm"
                showInteractivePalette={true}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
