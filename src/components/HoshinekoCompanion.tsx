import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SeasonId } from '../data/config';
import { Point2D } from '../types';
import { acousticEngine } from '../audio/acousticEngine';

export type CatMood =
  | 'happy'
  | 'starry'
  | 'winking'
  | 'purring'
  | 'sleepy'
  | 'amazed'
  | 'playful'
  | 'eating'
  | 'blushing'
  | 'regal'
  | 'groomed'
  | 'blessing';

export type CatAction =
  | 'idle'
  | 'beckoning'
  | 'pouncing'
  | 'eating'
  | 'purring'
  | 'playing-yarn'
  | 'grooming'
  | 'blessing'
  | 'happy-spin';

interface HoshinekoCompanionProps {
  pointer: Point2D;
  season: SeasonId;
  sceneName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isTriggerButton?: boolean;
  onTriggerClick?: () => void;
  showInteractivePalette?: boolean;
}

export const HoshinekoCompanion: React.FC<HoshinekoCompanionProps> = ({
  pointer,
  season,
  sceneName = 'sanctuary',
  size = 'md',
  className = '',
  isTriggerButton = false,
  onTriggerClick,
  showInteractivePalette = false,
}) => {
  const [mood, setMood] = useState<CatMood>('happy');
  const [action, setAction] = useState<CatAction>(isTriggerButton ? 'beckoning' : 'idle');
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; char: string }[]>([]);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [paletteOpen, setPaletteOpen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const eyeOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const speechTimerRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);

  // Natural Blinking
  useEffect(() => {
    let timer: number;
    const triggerBlink = () => {
      const interval = 2200 + Math.random() * 2600;
      timer = window.setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          triggerBlink();
        }, 140);
      }, interval);
    };
    triggerBlink();
    return () => clearTimeout(timer);
  }, []);

  // Autonomous Natural Idle Behaviors
  useEffect(() => {
    if (isTriggerButton) return;

    const scheduleBehavior = () => {
      idleTimerRef.current = window.setTimeout(() => {
        if (action === 'idle') {
          const rand = Math.random();
          if (rand < 0.3) {
            setAction('purring');
            setMood('purring');
            setTimeout(() => {
              setAction('idle');
              setMood('happy');
            }, 2400);
          } else if (rand < 0.6) {
            setMood('winking');
            setTimeout(() => setMood('happy'), 1600);
          } else if (rand < 0.8) {
            setMood('starry');
            setTimeout(() => setMood('happy'), 2000);
          }
        }
        scheduleBehavior();
      }, 6500 + Math.random() * 5500);
    };

    scheduleBehavior();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [action, isTriggerButton]);

  // Dynamic Eye-Tracking with Gentle Damping
  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = pointer.x - centerX;
    const dy = pointer.y - centerY;
    const dist = Math.hypot(dx, dy);

    if (dist > 0) {
      const maxOffset = 3.6;
      const factor = Math.min(1, dist / 260);
      eyeOffsetRef.current = {
        x: (dx / dist) * maxOffset * factor,
        y: (dy / dist) * maxOffset * factor,
      };
    }
  }, [pointer]);

  // Spawn visual sparkle particles
  const spawnSparkle = useCallback((x: number, y: number, char = '✨') => {
    const id = Date.now() + Math.random();
    setSparkles((prev) => [...prev.slice(-6), { id, x, y, char }]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== id));
    }, 850);
  }, []);

  // Seasonal Dialogue Matrix (Fluffy & Playful Version)
const getSeasonalSpeech = () => {
  const phrases: Record<SeasonId, string[]> = {
    semi: [
      'Mew~ Ada bunga sakura nempel di hidungmu! Biar aku ambilkan! 🌸🐾',
      'Nyaa! Kelopak bunganya melayang-layang... tangkaaaap~! 🌸✨',
      'Lihat! Bunga-bunga pada mekar! Cantik banget kayak kamu~ Mew 🌸',
      'Patter patter~ Ayo jalan-jalan keliling taman bersamaku! 🐾🌱',
    ],
    panas: [
      'Haf-haf~ Panasnya! Minta es krim semangka dong, mew~ 🍦🍉',
      'Meoow~ Angin sepoi-sepoi begini paling enak buat bobo siang~ 💤',
      'Nanti malam cari kunang-kunang bareng yuk! Pasti seru! ✨🎆',
      'Musim panas semangat! Tapi... jangan lupa minum air yaa~ 🌊💖',
    ],
    gugur: [
      'Purrrr~ Cuaca mulai dingin, boleh gulung-gulung di pangkuanmu? ☕🍁',
      'Nyaan! Daunnya gugur kayak hujan keemasan~ Tangkap satu! 🍁✨',
      'Waktunya minum cokelat hangat! Kamu mau juga? Meow~ ☕💖',
      'Anginnya kencang~ Pegangan! Nanti aku terbang gimana? Mew 🍂💨',
    ],
    dingin: [
      'Brrr~ Dinginnya! Sini, aku hangatkan pakai bulu anabulku! ❄️🤍',
      'Mew mew! Ada salju turun! Lidahku mau coba makan salju~ ❄️👅',
      'Purrr... Selimutan rapat-rapat yuk, jangan sampai sakit ya~ ☃️💖',
      'Nyaa! Ayo bikin boneka salju bentuk kucing! ☃️🐾',
    ],
  };

    const list = phrases[season] || phrases.semi;
    return list[Math.floor(Math.random() * list.length)];
  };

  // Direct Click / Petting on Cat
  const handleCatClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Trigger button mode (for sanctuary opening)
    if (isTriggerButton && onTriggerClick) {
      setAction('happy-spin');
      setMood('starry');
      acousticEngine.ensureBgmPlaying();
      acousticEngine.playSceneClick(sceneName);
      acousticEngine.playHoshinekoVoice('greeting');
      acousticEngine.playMagicSparkle();
      acousticEngine.playChime(1.8, 9);
      spawnSparkle(50, 40, '⭐');
      spawnSparkle(70, 30, '💖');
      onTriggerClick();
      return;
    }

    acousticEngine.ensureBgmPlaying();
    acousticEngine.playSceneClick(sceneName);

    // Situational Natural Feline Voicing
    if (sceneName === 'gift') {
      acousticEngine.playHoshinekoVoice('giftReaction');
      setAction('pouncing');
      setMood('starry');
    } else {
      const situations = ['happy', 'purring', 'chirp', 'happy'];
      const pick = situations[Math.floor(Math.random() * situations.length)];

      if (pick === 'purring') {
        acousticEngine.playHoshinekoVoice('purring');
        setAction('purring');
        setMood('purring');
      } else if (pick === 'chirp') {
        acousticEngine.playHoshinekoVoice('chirp');
        setAction('pouncing');
        setMood('winking');
      } else {
        acousticEngine.playHoshinekoVoice('happy');
        setAction('happy-spin');
        setMood('happy');
      }
    }

    const rect = containerRef.current?.getBoundingClientRect();
    const clickX = e.clientX - (rect?.left || 0);
    const clickY = e.clientY - (rect?.top || 0);
    spawnSparkle(clickX, clickY, Math.random() > 0.5 ? '💖' : '✦');

    setSpeechBubble(getSeasonalSpeech());
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    speechTimerRef.current = window.setTimeout(() => {
      setSpeechBubble(null);
      setAction('idle');
    }, 2800);
  };

  // Execute Cat Instruction
  const handleCommand = (cmd: 'fish' | 'yarn' | 'pet' | 'groom' | 'bless', e: React.MouseEvent) => {
    e.stopPropagation();

    acousticEngine.ensureBgmPlaying();
    acousticEngine.playSceneClick(sceneName);

    if (cmd === 'fish') {
      setAction('eating');
      setMood('eating');
      acousticEngine.playKawaiiPop(1.3);
      acousticEngine.playHoshinekoVoice('happy');
      setSpeechBubble('Nom nom nom! Ikannya lezat sekali, nyaa~! 🐟✨');
      spawnSparkle(60, 45, '🐟');
      spawnSparkle(75, 40, '⭐');
      setTimeout(() => {
        setAction('idle');
        setMood('happy');
      }, 2500);
    } else if (cmd === 'yarn') {
      setAction('playing-yarn');
      setMood('playful');
      acousticEngine.playHoshinekoVoice('chirp');
      acousticEngine.playMagicSparkle();
      setSpeechBubble('Ayo tangkap bola benang starlight ini bersama, meoow~! 🧶🐾');
      spawnSparkle(50, 40, '🧶');
      spawnSparkle(70, 35, '✨');
      setTimeout(() => {
        setAction('idle');
        setMood('happy');
      }, 2400);
    } else if (cmd === 'pet') {
      setAction('purring');
      setMood('purring');
      acousticEngine.playHoshinekoVoice('purring');
      setSpeechBubble('Purrrr... Usapanmu lembut sekali membuatku nyaman~ 💖');
      spawnSparkle(55, 30, '💖');
      spawnSparkle(80, 25, '🌸');
      setTimeout(() => {
        setAction('idle');
        setMood('happy');
      }, 2600);
    } else if (cmd === 'groom') {
      setAction('grooming');
      setMood('groomed');
      acousticEngine.playMagicSparkle();
      acousticEngine.playHoshinekoVoice('happy');
      setSpeechBubble('Bulu bintangku kini bersih, wangi, dan berkilau, nyaan~! 🪮🌟');
      spawnSparkle(60, 35, '✨');
      spawnSparkle(75, 45, '⭐');
      setTimeout(() => {
        setAction('idle');
        setMood('regal');
      }, 2400);
    } else if (cmd === 'bless') {
      setAction('blessing');
      setMood('blessing');
      acousticEngine.playHoshinekoVoice('giftReaction');
      acousticEngine.playChime(1.8, 9);
      acousticEngine.playMagicSparkle();
      setSpeechBubble('Semoga cahaya langit memberkati setiap langkah indahmu! ✦🕊️');
      spawnSparkle(60, 25, '✦');
      spawnSparkle(40, 20, '🪄');
      spawnSparkle(80, 20, '✨');
      setTimeout(() => {
        setAction('idle');
        setMood('happy');
      }, 3000);
    }

    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    speechTimerRef.current = window.setTimeout(() => {
      setSpeechBubble(null);
    }, 3500);
  };

  const sizeClasses = {
    sm: 'w-20 h-22 sm:w-22 sm:h-26',
    md: 'w-26 h-30 sm:w-30 sm:h-34',
    lg: 'w-34 h-38 sm:w-40 sm:h-44',
  };

  const { x: eyeX, y: eyeY } = eyeOffsetRef.current;

  return (
    <div
      ref={containerRef}
      id={`hoshineko-companion-${sceneName}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative select-none pointer-events-auto flex flex-col items-center justify-center ${className}`}
    >
      {/* Speech Bubble */}
      {speechBubble && (
        <div className="absolute -top-12 z-30 px-3.5 py-1.5 rounded-2xl bg-white/95 text-sky-950 font-jp text-[10px] sm:text-[11px] font-semibold border border-sky-200 shadow-md animate-fade-in pointer-events-none whitespace-nowrap">
          <span>{speechBubble}</span>
          <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-sky-200" />
        </div>
      )}

      {/* Sparkles Particle Layer */}
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="absolute text-sm pointer-events-none animate-ping z-40"
          style={{ left: s.x, top: s.y }}
        >
          {s.char}
        </span>
      ))}

      {/* Cat Body Trigger / Container */}
      <div
        onClick={handleCatClick}
        className={`relative ${sizeClasses[size]} cursor-pointer flex items-center justify-center transition-transform duration-300 ${
          action === 'happy-spin' ? 'rotate-360 scale-125' : action === 'eating' ? 'scale-105' : 'hover:scale-108 active:scale-95'
        }`}
      >
        {/* Living SVG Celestial Cat */}
        <svg
          viewBox="0 0 140 140"
          className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(56,189,248,0.45)]"
        >
          <defs>
            <radialGradient id="catFurGrad" cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="65%" stopColor="#f0f9ff" />
              <stop offset="100%" stopColor="#e0f2fe" />
            </radialGradient>
            <radialGradient id="catInnerEar" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbcfe8" />
              <stop offset="100%" stopColor="#f472b6" />
            </radialGradient>
            <radialGradient id="catEyeGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0c4a6e" />
            </radialGradient>
          </defs>

          {/* Stardust Aura Ring at base */}
          <ellipse
            cx="70"
            cy="124"
            rx="38"
            ry="9"
            fill="rgba(56, 189, 248, 0.25)"
            className="animate-pulse"
          />

          {/* Cat Tail */}
          <path
            d="M92 110 C115 105 125 80 115 65 C108 55 98 62 102 72 C108 84 98 100 86 108"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="6"
            strokeLinecap="round"
            className="origin-[92px_110px] animate-gentle-tail"
          />

          {/* Cat Body */}
          <ellipse cx="70" cy="98" rx="28" ry="24" fill="url(#catFurGrad)" stroke="#bae6fd" strokeWidth="1.6" />

          {/* White Chest Tuft */}
          <path d="M62 90 Q70 100 78 90 Q74 104 70 106 Q66 104 62 90" fill="#ffffff" />

          {/* Ears */}
          <polygon points="44,52 32,24 58,38" fill="url(#catFurGrad)" stroke="#bae6fd" strokeWidth="1.6" />
          <polygon points="43,48 36,28 54,38" fill="url(#catInnerEar)" />
          <polygon points="96,52 108,24 82,38" fill="url(#catFurGrad)" stroke="#bae6fd" strokeWidth="1.6" />
          <polygon points="97,48 104,28 86,38" fill="url(#catInnerEar)" />

          {/* Head */}
          <circle cx="70" cy="66" r="32" fill="url(#catFurGrad)" stroke="#bae6fd" strokeWidth="1.6" />

          {/* Forehead Star Marking */}
          <polygon points="70,44 72,48 76,50 72,52 70,56 68,52 64,50 68,48" fill="#38bdf8" />

          {/* EYES: Dynamically Swapping by Mood */}
          {isBlinking || mood === 'sleepy' || mood === 'purring' ? (
            // Closed / Happy Sleeping Eyes ^_^
            <g>
              <path d="M50 65 Q56 60 62 65" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M78 65 Q84 60 90 65" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </g>
          ) : mood === 'winking' ? (
            // Winking Eye ;3
            <g>
              <path d="M50 65 Q56 60 62 65" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <ellipse cx={84 + eyeX} cy={64 + eyeY} rx="8.5" ry="10" fill="url(#catEyeGrad)" />
              <ellipse cx={84 + eyeX} cy={64 + eyeY} rx="5" ry="6.5" fill="#0c4a6e" />
              <circle cx={82 + eyeX * 0.4} cy={61 + eyeY * 0.4} r="2.5" fill="#ffffff" />
            </g>
          ) : mood === 'starry' || mood === 'blessing' ? (
            // Starry Eyes ✦_✦
            <g>
              <circle cx="56" cy="64" r="9" fill="#0284c7" />
              <polygon points="56,58 58,62 62,64 58,66 56,70 54,66 50,64 54,62" fill="#fde047" />
              <circle cx="84" cy="64" r="9" fill="#0284c7" />
              <polygon points="84,58 86,62 90,64 86,66 84,70 82,66 78,64 82,62" fill="#fde047" />
            </g>
          ) : (
            // Standard Tracking Beautiful Eyes
            <g>
              <ellipse cx={56 + eyeX} cy={64 + eyeY} rx="8.5" ry="10" fill="url(#catEyeGrad)" />
              <ellipse cx={56 + eyeX} cy={64 + eyeY} rx="5" ry="6.5" fill="#0c4a6e" />
              <circle cx={54 + eyeX * 0.4} cy={61 + eyeY * 0.4} r="2.5" fill="#ffffff" />
              <circle cx={58 + eyeX * 0.4} cy={67 + eyeY * 0.4} r="1.2" fill="#ffffff" />

              <ellipse cx={84 + eyeX} cy={64 + eyeY} rx="8.5" ry="10" fill="url(#catEyeGrad)" />
              <ellipse cx={84 + eyeX} cy={64 + eyeY} rx="5" ry="6.5" fill="#0c4a6e" />
              <circle cx={82 + eyeX * 0.4} cy={61 + eyeY * 0.4} r="2.5" fill="#ffffff" />
              <circle cx={86 + eyeX * 0.4} cy={67 + eyeY * 0.4} r="1.2" fill="#ffffff" />
            </g>
          )}

          {/* Rosy Cheeks */}
          <ellipse cx="46" cy="73" rx="5" ry="3" fill="#f472b6" opacity={mood === 'blushing' ? '0.85' : '0.45'} />
          <ellipse cx="94" cy="73" rx="5" ry="3" fill="#f472b6" opacity={mood === 'blushing' ? '0.85' : '0.45'} />

          {/* Cute Nose */}
          <polygon points="68.5,70 71.5,70 70,72" fill="#f43f5e" />

          {/* Kawaii Mouth :3 */}
          <path d="M66 74 Q70 77 70 74 Q70 77 74 74" stroke="#0369a1" strokeWidth="1.3" fill="none" strokeLinecap="round" />

          {/* Whiskers */}
          <line x1="38" y1="69" x2="26" y2="67" stroke="#bae6fd" strokeWidth="1.1" strokeLinecap="round" />
          <line x1="38" y1="73" x2="25" y2="75" stroke="#bae6fd" strokeWidth="1.1" strokeLinecap="round" />
          <line x1="102" y1="69" x2="114" y2="67" stroke="#bae6fd" strokeWidth="1.1" strokeLinecap="round" />
          <line x1="102" y1="73" x2="115" y2="75" stroke="#bae6fd" strokeWidth="1.1" strokeLinecap="round" />

          {/* Front Paws */}
          <ellipse cx="60" cy="102" rx="7.5" ry="8.5" fill="#ffffff" stroke="#bae6fd" strokeWidth="1.4" />
          <g className={`origin-[80px_100px] ${isTriggerButton || isHovered ? 'animate-beckoning-paw' : ''}`}>
            <ellipse cx="80" cy="100" rx="8" ry="9" fill="#ffffff" stroke="#bae6fd" strokeWidth="1.4" />
            <circle cx="80" cy="100" r="3" fill="#fbcfe8" />
          </g>

          {/* Celestial Halo Crown */}
          <g className="animate-pulse">
            <ellipse cx="70" cy="18" rx="16" ry="3.5" fill="none" stroke="#fde047" strokeWidth="1.8" />
            <circle cx="70" cy="16" r="2" fill="#ffffff" />
          </g>
        </svg>
      </div>

      {/* ========================================================= */}
      {/* INTERACTIVE COMMANDS PALETTE (COMPACT & DYNAMIC) */}
      {/* ========================================================= */}
      {showInteractivePalette && (
        <div className="mt-1 sm:mt-1.5 flex flex-col items-center">
          <div className="flex items-center gap-1 sm:gap-1.5 p-0.5 sm:p-1 rounded-full bg-white/90 backdrop-blur-md border border-sky-200/80 shadow-xs">
            <button
              type="button"
              onClick={(e) => handleCommand('fish', e)}
              title="Beri Makan Ikan"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-800 flex items-center justify-center text-[11px] sm:text-xs shadow-2xs hover:scale-115 active:scale-90 transition-transform cursor-pointer"
            >
              🐟
            </button>
            <button
              type="button"
              onClick={(e) => handleCommand('yarn', e)}
              title="Main Benang Bintang"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-800 flex items-center justify-center text-[11px] sm:text-xs shadow-2xs hover:scale-115 active:scale-90 transition-transform cursor-pointer"
            >
              🧶
            </button>
            <button
              type="button"
              onClick={(e) => handleCommand('pet', e)}
              title="Elus Lembut"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 flex items-center justify-center text-[11px] sm:text-xs shadow-2xs hover:scale-115 active:scale-90 transition-transform cursor-pointer"
            >
              ✨
            </button>
            <button
              type="button"
              onClick={(e) => handleCommand('groom', e)}
              title="Sisir Bulu Halus"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 flex items-center justify-center text-[11px] sm:text-xs shadow-2xs hover:scale-115 active:scale-90 transition-transform cursor-pointer"
            >
              🪮
            </button>
            <button
              type="button"
              onClick={(e) => handleCommand('bless', e)}
              title="Doa Berkah Bintang"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-800 flex items-center justify-center text-[11px] sm:text-xs shadow-2xs hover:scale-115 active:scale-90 transition-transform cursor-pointer"
            >
              🪄
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
