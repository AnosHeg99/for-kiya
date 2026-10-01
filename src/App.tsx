import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point2D } from './types';
import { SeasonId } from './data/config';
import { ParticlePhysicsCanvas } from './components/ParticlePhysicsCanvas';
import { FloatingSceneLayers } from './components/FloatingSceneLayers';
import { SeasonSelector } from './components/SeasonSelector';
import { AuraCursor } from './components/AuraCursor';
import { CinematicOpening } from './components/CinematicOpening';
import { CgiTransitionPortal } from './components/CgiTransitionPortal';
import { LetterModal } from './components/LetterModal';
import { ChocolatePOV } from './components/ChocolatePOV';
import { ReplyLetterModal } from './components/ReplyLetterModal';
import { ArigatouScene } from './components/ArigatouScene';
import { acousticEngine } from './audio/acousticEngine';

// =========================================================
// REQUIREMENT 30: EXPLICIT ARCHITECTURAL SCENE STATE MACHINE
// =========================================================
export const SCENE = {
  INTRO: 'intro',
  SANCTUARY: 'sanctuary',
  LETTER: 'letter',
  GIFT: 'gift',
  REPLY: 'reply',
  ARIGATOU: 'arigatou',
} as const;

export type SceneType = typeof SCENE[keyof typeof SCENE];

export default function App() {
  const [pointer, setPointer] = useState<Point2D>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  });
  const [normalizedPointer, setNormalizedPointer] = useState<Point2D>({ x: 0, y: 0 });
  const [isPointerActive, setIsPointerActive] = useState<boolean>(false);
  const [season, setSeason] = useState<SeasonId>('semi');
  const [currentScene, setCurrentScene] = useState<SceneType>(SCENE.SANCTUARY);
  const [hasOpenedIntro, setHasOpenedIntro] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const transitionTimersRef = useRef<number[]>([]);

  // BGM strategy: attempt autoplay on mount, then retry from a trusted pointer gesture.
  // The configured custom track is the only BGM source; there is no generated fallback.
  const activateAudioFromGesture = useCallback(() => {
    acousticEngine.activate();
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setIsPointerActive(true);

      const x = e.clientX;
      const y = e.clientY;
      setPointer({ x, y });

      const normX = (x / window.innerWidth) * 2 - 1;
      const normY = (y / window.innerHeight) * 2 - 1;
      setNormalizedPointer({
        x: Math.max(-1, Math.min(1, normX)),
        y: Math.max(-1, Math.min(1, normY)),
      });
    },
    []
  );

  const handlePointerDown = useCallback(() => {
    // Capture-phase activation runs before child click handlers, so every first-interaction
    // SFX has a trusted user-gesture-created AudioContext available.
    activateAudioFromGesture();
  }, [activateAudioFromGesture]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        activateAudioFromGesture();
      }
    },
    [activateAudioFromGesture],
  );

  const handlePointerLeave = useCallback(() => {
    setIsPointerActive(false);
    setNormalizedPointer({ x: 0, y: 0 });
  }, []);

  // Strict World Transition with Guard
  const transitionTo = useCallback(
    (nextScene: SceneType) => {
      if (isTransitioning || nextScene === currentScene) return;

      setIsTransitioning(true);
      acousticEngine.ensureBgmPlaying();
      acousticEngine.playSceneClick(nextScene);
      acousticEngine.playMagicSparkle();

      const sceneTimer = window.setTimeout(() => {
        setCurrentScene(nextScene);
        const settleTimer = window.setTimeout(() => {
          setIsTransitioning(false);
        }, 550);
        transitionTimersRef.current.push(settleTimer);
      }, 550);
      transitionTimersRef.current.push(sceneTimer);
    },
    [isTransitioning, currentScene]
  );

  useEffect(() => {
    return () => {
      transitionTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      transitionTimersRef.current = [];
    };
  }, []);

  // Audio preload/autoplay attempt + gyroscope / device orientation for mobile tilting.
  // Orientation changes are intentionally NOT treated as a user gesture because browsers
  // may fire them without a trusted activation event.
  useEffect(() => {
    acousticEngine.preloadBgm();

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const normX = Math.max(-1, Math.min(1, e.gamma / 35));
        const normY = Math.max(-1, Math.min(1, (e.beta - 45) / 35));
        setNormalizedPointer({ x: normX, y: normY });
      }
    };

    const handleVisibility = () => {
      if (!document.hidden) {
        acousticEngine.ensureBgmPlaying();
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      document.removeEventListener('visibilitychange', handleVisibility);
      acousticEngine.destroy();
    };
  }, []);

  return (
    <div
      id="aozora-root-sanctuary"
      onPointerMove={handlePointerMove}
      onPointerDownCapture={handlePointerDown}
      onKeyDownCapture={handleKeyDown}
      onPointerLeave={handlePointerLeave}
      className="relative w-screen h-[100dvh] overflow-hidden select-none bg-sky-100 text-sky-950"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Background Multi-Season Particle Physics Canvas */}
      <ParticlePhysicsCanvas
        pointer={pointer}
        isPointerActive={isPointerActive}
        season={season}
        ripplePoint={null}
      />

      {/* Opening Scene (Sanctuary): Japanese Light Novel Cover x Kinetic Visual */}
      <FloatingSceneLayers
        pointer={pointer}
        normalizedPointer={normalizedPointer}
        season={season}
        onOpenLetter={() => transitionTo(SCENE.LETTER)}
        isOpeningLetter={isTransitioning}
      />

      {/* Season Selector: Always accessible across sanctuary, letter, gift */}
      {currentScene !== SCENE.ARIGATOU && (
        <SeasonSelector
          currentSeason={season}
          onSelectSeason={(newSeason) => setSeason(newSeason)}
        />
      )}

      {/* Stage 1: Magical Light Novel Letter */}
      <LetterModal
        isOpen={currentScene === SCENE.LETTER}
        onProceed={() => transitionTo(SCENE.GIFT)}
        pointer={pointer}
        season={season}
        onSeasonChange={(newSeason) => setSeason(newSeason)}
      />

      {/* Stage 2: Identity Treasure / Celestial Gift Pavilion */}
      <ChocolatePOV
        isOpen={currentScene === SCENE.GIFT}
        onReceiveChocolate={() => transitionTo(SCENE.REPLY)}
        pointer={pointer}
        season={season}
      />

      {/* Stage 3: Sacred Parchment Reply Letter */}
      <ReplyLetterModal
        isOpen={currentScene === SCENE.REPLY}
        currentSeason={season}
        onSelectSeason={(newSeason) => setSeason(newSeason)}
        onSendComplete={() => transitionTo(SCENE.ARIGATOU)}
        pointer={pointer}
      />

      {/* Stage 4: Epilogue Sanctum & Sacred Chains Seal (Adapts to last selected season) */}
      <ArigatouScene
        isOpen={currentScene === SCENE.ARIGATOU}
        season={season}
      />

      {/* CGI World Transition Portal */}
      <CgiTransitionPortal isActive={isTransitioning} />

      {/* Grand Initial Cinematic Opening */}
      {!hasOpenedIntro && (
        <CinematicOpening onComplete={() => setHasOpenedIntro(true)} />
      )}

      {/* Dynamic Seasonal Aura Cursor */}
      <AuraCursor
        pointer={pointer}
        isPointerActive={isPointerActive}
        season={season}
      />
    </div>
  );
}
