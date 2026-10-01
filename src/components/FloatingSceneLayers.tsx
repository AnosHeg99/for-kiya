import React, { useState, useEffect, useRef } from 'react';
import { Point2D } from '../types';
import { SeasonId, SEASONS_CONFIG, APP_CONFIG } from '../data/config';
import { acousticEngine } from '../audio/acousticEngine';
import { HoshinekoCompanion } from './HoshinekoCompanion';

interface FloatingSceneLayersProps {
  pointer: Point2D;
  normalizedPointer: Point2D;
  season: SeasonId;
  onOpenLetter: () => void;
  isOpeningLetter: boolean;
}

export const FloatingSceneLayers: React.FC<FloatingSceneLayersProps> = ({
  pointer,
  normalizedPointer,
  season,
  onOpenLetter,
  isOpeningLetter,
}) => {
  const [isActivating, setIsActivating] = useState(false);

  // Parallax Inertial Coordinates
  const lerpRef = useRef({
    charX: 0,
    charY: 0,
    bgX: 0,
    bgY: 0,
    textParamX: 0,
  });

  const animTimeRef = useRef<number>(0);
  const normalizedPointerRef = useRef<Point2D>(normalizedPointer);
  const [, setFrameTick] = useState<number>(0);

  useEffect(() => {
    normalizedPointerRef.current = normalizedPointer;
  }, [normalizedPointer]);

  const currentSeason = SEASONS_CONFIG[season];

  useEffect(() => {
    let animId: number;

    const updateParallax = (t: number) => {
      animTimeRef.current = t;
      const currentPointer = normalizedPointerRef.current;

      const targetCharX = currentPointer.x * 14;
      const targetCharY = currentPointer.y * 8;

      const targetBgX = -currentPointer.x * 7;
      const targetBgY = -currentPointer.y * 4;

      lerpRef.current.charX += (targetCharX - lerpRef.current.charX) * 0.08;
      lerpRef.current.charY += (targetCharY - lerpRef.current.charY) * 0.08;

      lerpRef.current.bgX += (targetBgX - lerpRef.current.bgX) * 0.06;
      lerpRef.current.bgY += (targetBgY - lerpRef.current.bgY) * 0.06;

      lerpRef.current.textParamX += (-currentPointer.x * 10 - lerpRef.current.textParamX) * 0.05;

      setFrameTick(t);
      animId = requestAnimationFrame(updateParallax);
    };

    animId = requestAnimationFrame(updateParallax);
    return () => cancelAnimationFrame(animId);
  }, []);

  const t = animTimeRef.current;
  const { charX, charY, bgX, bgY, textParamX } = lerpRef.current;

  // Japanese Light Novel subtle breathing & micro-tilt
  const charBreatheY = Math.sin(t * 0.0016) * 3;
  const charTiltX = -normalizedPointer.y * 2.0;
  const charTiltY = normalizedPointer.x * 2.5;

  const handleTriggerCat = () => {
    if (isOpeningLetter || isActivating) return;

    setIsActivating(true);
    acousticEngine.ensureBgmPlaying();
    acousticEngine.playSceneClick('sanctuary');
    acousticEngine.playHoshinekoVoice('happy');
    acousticEngine.playMagicSparkle();
    acousticEngine.playChime(1.8, 8);

    setTimeout(() => {
      onOpenLetter();
      setIsActivating(false);
    }, 700);
  };

  return (
    <div
      id="main-canvas"
      className="canvas-container relative w-full h-[100dvh] overflow-hidden select-none flex items-center justify-center pointer-events-none"
    >
      {/* Subtle Dot Matrix Overlay & Visual Framing */}
      <div className="canvas-dot-overlay absolute inset-0 z-10 pointer-events-none opacity-30" />
      <div className="ui-corner-bracket top-left z-30" />
      <div className="ui-corner-bracket bottom-right z-30" />

      {/* Atmospheric Background Running Watermark Text */}
      <div
        className="nihility-bg-text absolute top-1/2 left-0 -translate-y-1/2 z-5 pointer-events-none opacity-35"
        style={{
          transform: `translate3d(${textParamX}px, -50%, 0)`,
          transition: 'transform 0.1s linear',
        }}
      >
        AOZORA NOVEL SERIES • ETHEREAL SKY SANCTUARY • VOL. 04
      </div>

      {/* LAYER 0: Anime Sky Backdrop with Parallax */}
      <div
        className="absolute inset-[-25px] pointer-events-none transition-transform duration-700 ease-out z-0"
        style={{
          transform: `translate3d(${bgX}px, ${bgY}px, 0) scale(1.04)`,
        }}
      >
        <img
          src={APP_CONFIG.assets.skyBackground}
          alt="Soft sky-blue anime sky"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-100 contrast-100"
        />

        {/* Dynamic seasonal atmosphere wash */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${currentSeason.skyTint} transition-colors duration-1000 mix-blend-soft-light`}
        />

        {/* Luminous Sunburst Halo */}
        <div
          className="absolute rounded-full pointer-events-none transition-all duration-1000 ease-out blur-[85px]"
          style={{
            top: '25%',
            left: `${50 + normalizedPointer.x * 7}%`,
            width: '560px',
            height: '560px',
            background: currentSeason.rimColor,
            opacity: 0.42 + Math.sin(t * 0.001) * 0.06,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* ========================================================= */}
{/* LEFT EDITORIAL PANEL: OFFICIAL JAPANESE LIGHT NOVEL COVER */}
{/* ========================================================= */}
<section
  id="left-light-novel-cover-panel"
  className="absolute left-4 sm:left-7 top-6 bottom-16 z-30 pointer-events-none hidden md:flex flex-col justify-between max-w-[260px] lg:max-w-[290px]"
>
  {/* Top Publisher & Novel Series Crest */}
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-xs bg-sky-500 shadow-[0_0_8px_#38bdf8] rotate-45" />
      <span className="font-syncopate text-[9px] font-bold text-sky-800 tracking-[0.25em]">
        THE LAW OF IDENTITY
      </span>
    </div>
  </div>
</section>

      {/* ========================================================= */}
      {/* RIGHT EDITORIAL PANEL: TATEGAKI VERTICAL JAPANESE SCRIPT */}
      {/* ========================================================= */}
      <aside
        id="right-light-novel-cover-panel"
        className="absolute right-4 sm:right-7 top-6 bottom-16 z-30 pointer-events-none hidden md:flex flex-col justify-between items-end"
      >
        <div className="font-cinzel text-[9.5px] font-bold tracking-[0.25em] text-sky-900 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-sky-200/80 shadow-2xs">
          SPECIAL EDITION
        </div>

        <div className="my-auto py-5 px-3 rounded-2xl bg-white/45 backdrop-blur-md border border-white/80 shadow-xs flex flex-col items-center gap-3">
          <span className="text-amber-500 text-xs animate-spin-cw" style={{ animationDuration: '10s' }}>
            ✦
          </span>
          <span className="font-jp text-base lg:text-lg font-black text-sky-950 [writing-mode:vertical-rl] tracking-[0.3em] drop-shadow-2xs">
            愛するあなたへ
          </span>
          <span className="w-[1.5px] h-6 bg-gradient-to-b from-sky-400 to-transparent" />
          <span className="font-jp text-xs lg:text-sm font-bold text-sky-800/90 [writing-mode:vertical-rl] tracking-[0.2em]">
            キアリア
          </span>

          <div className="w-6 h-6 rounded-md border-2 border-red-500/80 bg-red-500/10 flex items-center justify-center mt-1">
            <span className="font-jp text-[8px] text-red-600 font-bold leading-none">
              キア
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5 text-[8.5px] font-syncopate font-semibold text-sky-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>THE LAW OF IDENTITY</span>
          </div>
          <span className="font-jp text-[9px] text-sky-800/80 font-bold bg-white/70 px-2 py-0.5 rounded-md">
            あなたが大好きです。
          </span>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* CENTER ART PANEL: HEROINE KEY VISUAL */}
      {/* ========================================================= */}
      <section
        id="center-art-panel"
        className="center-panel relative max-w-[310px] sm:max-w-[370px] md:max-w-[420px] w-full max-h-[78dvh] aspect-[3/4.2] z-20 pointer-events-auto flex flex-col items-center"
        style={{
          transform: `perspective(1200px) rotateX(${charTiltX}deg) rotateY(${charTiltY}deg) translate3d(${charX}px, ${charY + charBreatheY}px, 0)`,
        }}
      >
        {/* Large Ambient Kanji Watermark Behind Character */}
        <div className="art-window absolute inset-0 pointer-events-none flex items-center justify-center">
          <span className="large-bg-kanji font-jp text-[170px] sm:text-[230px] font-black text-sky-400/15 select-none -translate-y-8 pointer-events-none">
            空
          </span>
        </div>

        {/* Heroine Card Container */}
        <div
          id="character-inner-card"
          className="relative w-full flex-1 rounded-[32px] overflow-hidden border-2 border-white/90 bg-gradient-to-b from-sky-100/40 via-white/60 to-sky-200/45 shadow-[0_25px_65px_rgba(14,165,233,0.3)] backdrop-blur-xs group"
        >
          <img
            src={APP_CONFIG.assets.animeCharacter}
            alt="Anime heroine in soft sky-blue light"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.015]"
          />

          {/* Specular Rim Light Mask following pointer */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-screen"
            style={{
              background: `radial-gradient(circle at ${60 + normalizedPointer.x * 25}% ${35 + normalizedPointer.y * 20}%, rgba(255, 255, 255, 0.45) 0%, transparent 60%)`,
              opacity: 0.85,
            }}
          />

          {/* Bottom Vignette */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-sky-950/40 via-transparent to-white/10" />

          {/* Ornate Corner Framing Brackets */}
          <div className="absolute top-3.5 left-3.5 w-4 h-4 border-t-2 border-l-2 border-white/90 rounded-tl-xs pointer-events-none" />
          <div className="absolute top-3.5 right-3.5 w-4 h-4 border-t-2 border-r-2 border-white/90 rounded-tr-xs pointer-events-none" />
          <div className="absolute bottom-3.5 left-3.5 w-4 h-4 border-b-2 border-l-2 border-white/90 rounded-bl-xs pointer-events-none" />
          <div className="absolute bottom-3.5 right-3.5 w-4 h-4 border-b-2 border-r-2 border-white/90 rounded-br-xs pointer-events-none" />
        </div>

        {/* ========================================================= */}
        {/* BOTTOM CENTER: LIVING HOSHINEKO AS THE NATURAL TRIGGER */}
        {/* User Request: NO BORDERS, NO BALL/ICE BUTTON, NO AD NOTIFS */}
        {/* Pure living celestial cat beckoning to be clicked */}
        {/* ========================================================= */}
        <div
          id="center-bottom-living-cat-trigger"
          className="relative w-full mt-1.5 flex flex-col items-center justify-center z-40 pointer-events-auto"
        >
          {/* Subtle Japanese Novel Series Tag */}
          <div className="flex items-center gap-2 mb-1 opacity-90 animate-ethereal-drift">
            <span className="text-sky-500 text-xs">✦</span>
            <span className="font-jp text-xs sm:text-sm font-black text-sky-950 tracking-[0.2em] drop-shadow-2xs">
              キアリア • KIYA
            </span>
            <span className="text-sky-500 text-xs">✦</span>
          </div>

          {/* THE NATURAL HOSHINEKO CAT TRIGGER (No border, no frame, natural beckoning) */}
          <div className="relative flex flex-col items-center cursor-pointer group">
            <HoshinekoCompanion
              pointer={pointer}
              season={season}
              sceneName="sanctuary-trigger"
              size="md"
              isTriggerButton={true}
              onTriggerClick={handleTriggerCat}
              className={`transition-all duration-500 ${
                isActivating ? 'scale-125 filter drop-shadow-[0_0_35px_#38bdf8]' : 'hover:scale-110 active:scale-95'
              }`}
            />
          </div>
        </div>
      </section>

      {/* Dynamic Starlight Transition Bloom before switching to Letter Scene */}
      {isActivating && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center animate-fade-in">
          <div
            className="w-[800px] h-[800px] rounded-full blur-2xl animate-ping"
            style={{
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(186, 230, 253, 0.8) 45%, transparent 75%)',
            }}
          />
          <div className="absolute w-[360px] h-[360px] rounded-full border-2 border-white/90 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
      )}
    </div>
  );
};
