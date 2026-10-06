import {
  MASTER_BGM_CONFIG,
  SCENE_CLICK_REGISTRY,
  HOSHINEKO_VOICE_REGISTRY,
  SPECIAL_SFX_REGISTRY,
  SceneClickConfig,
  HoshinekoVoiceSlot,
} from '../data/sceneAssetRegistry';

/**
 * Interactive Web Audio SFX Engine
 * Plays the supplied master BGM as a real HTMLAudioElement and provides procedural
 * interaction SFX (chimes, clicks, meows, transitions) without an overt player UI.
 */

const PROCEDURAL_SFX_MASTER_VOLUME = 0.92;
const CUSTOM_SFX_VOLUME = 0.50;

class AcousticEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isInitialized = false;
  private isPlaying = false;

  // The master BGM is always the supplied/custom track. There is deliberately no
  // procedural-music fallback, so a missing/blocked track can never be replaced silently.
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmSourceUrl: string | null = null;
  private bgmLoadFailed = false;
  private activeEffectAudios = new Set<HTMLAudioElement>();

  // Pentatonic scale frequencies in Hz (tuned around Eb warm soothing key)
  private readonly pentatonicNotes = [
    311.13, // Eb4
    349.23, // F4
    392.00, // G4
    466.16, // Bb4
    523.25, // C5
    622.25, // Eb5
    698.46, // F5
    783.99, // G5
    932.33, // Bb5
    1046.50 // C6
  ];


  public init() {
    if (this.isInitialized) return;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(PROCEDURAL_SFX_MASTER_VOLUME, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Prepare the supplied BGM immediately so the browser can fetch/cache it before
      // the first interaction. Actual sound is attempted separately in activate().
      this.preloadBgm();

      this.isInitialized = true;
    } catch {
      // Graceful fallback for non-audio environments.
    }
  }

  /**
   * Resolve and preload the one-and-only master BGM source.
   * This method never creates procedural music.
   */
  public preloadBgm() {
    if (typeof window === 'undefined') return;

    const url = MASTER_BGM_CONFIG.customAudioUrl?.trim();
    if (!url) {
      this.isPlaying = false;
      return;
    }

    if (this.bgmAudio && this.bgmSourceUrl === url) {
      this.bgmAudio.preload = 'auto';
      if (this.bgmLoadFailed) {
        this.bgmLoadFailed = false;
        this.bgmAudio.load();
      }
      return;
    }

    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.removeAttribute('src');
      this.bgmAudio.load();
    }
    this.bgmLoadFailed = false;

    const audio = new Audio();
    audio.preload = 'auto';
    audio.autoplay = true;
    audio.loop = MASTER_BGM_CONFIG.loop !== false;
    audio.volume = CUSTOM_SFX_VOLUME;
    audio.setAttribute('playsinline', '');
    audio.src = url;

    audio.addEventListener('error', () => {
      // Do not replace the supplied track with generated audio. Keeping this state false
      // lets the next trusted user gesture retry the same custom source.
      if (this.bgmAudio === audio) {
        this.bgmLoadFailed = true;
        this.isPlaying = false;
      }
    });

    audio.addEventListener('canplay', () => {
      if (this.bgmAudio === audio) {
        this.bgmLoadFailed = false;
      }
    });

    audio.addEventListener('ended', () => {
      // Native loop is the primary mechanism. This is a defensive retry for browsers
      // that still emit an ended event for looped media under unusual lifecycle changes.
      if (this.bgmAudio === audio && audio.loop) {
        audio.currentTime = 0;
        void audio.play().then(() => {
          this.isPlaying = true;
        }).catch(() => {
          this.isPlaying = false;
        });
      }
    });

    this.bgmAudio = audio;
    this.bgmSourceUrl = url;
    audio.load();
  }

  /**
   * Attempt to start/resume the supplied master BGM. Browser autoplay policy may reject
   * the first automatic attempt; the root pointer-down handler retries from a trusted gesture.
   */
  public activate() {
    if (!this.isInitialized) {
      this.init();
    }

    this.preloadBgm();

    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume().catch(() => {});
      }

      if (this.masterGain) {
        const targetVol = PROCEDURAL_SFX_MASTER_VOLUME;
        this.masterGain.gain.setValueAtTime(targetVol, this.ctx.currentTime);
      }
    }

    void this.startConfiguredBgm();
  }

  private async startConfiguredBgm(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    this.preloadBgm();
    const audio = this.bgmAudio;
    if (!audio) {
      this.isPlaying = false;
      return false;
    }

    audio.loop = MASTER_BGM_CONFIG.loop !== false;
    audio.volume = Math.max(0, Math.min(1, MASTER_BGM_CONFIG.volume ?? 0.92));

    try {
      const playPromise = audio.play();
      if (playPromise) {
        await playPromise;
      }
      this.isPlaying = true;
      return true;
    } catch {
      // Autoplay can be rejected until a trusted user gesture. Never substitute another BGM.
      this.isPlaying = false;
      return false;
    }
  }

  public playChime(intensity = 1.0, noteOffset?: number) {
    if (!this.isInitialized) {
      this.activate();
    }
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const noteIndex = noteOffset !== undefined 
      ? Math.max(0, Math.min(this.pentatonicNotes.length - 1, noteOffset))
      : Math.floor(Math.random() * this.pentatonicNotes.length);

    const freq = this.pentatonicNotes[noteIndex];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.5, now);
    filter.Q.setValueAtTime(3, now);

    const vol = Math.min(0.24, 0.1 * intensity);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.9);
  }

  public playKawaiiPop(pitch = 1.0) {
    if (!this.isInitialized) this.activate();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const base = 480 * pitch;
    osc.frequency.setValueAtTime(base, now);
    osc.frequency.exponentialRampToValueAtTime(base * 1.8, now + 0.12);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playSqueak() {
    if (!this.isInitialized) this.activate();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.linearRampToValueAtTime(1350, now + 0.08);
    osc.frequency.linearRampToValueAtTime(1100, now + 0.16);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playMagicSparkle() {
    if (!this.isInitialized) this.activate();
    if (!this.ctx || !this.masterGain) return;

    const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    freqs.forEach((f, i) => {
      window.setTimeout(() => {
        if (!this.ctx || !this.masterGain) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.65);
      }, i * 75);
    });
  }

  public playTactileClick() {
    if (!this.isInitialized) this.activate();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.045);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playCatMeow(pitch = 1.0) {
    if (!this.isInitialized) this.activate();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200 * pitch, now);
    filter.Q.setValueAtTime(4, now);

    const startF = 620 * pitch;
    osc.frequency.setValueAtTime(startF, now);
    osc.frequency.linearRampToValueAtTime(startF * 1.55, now + 0.12);
    osc.frequency.linearRampToValueAtTime(startF * 1.25, now + 0.32);
    osc.frequency.exponentialRampToValueAtTime(startF * 0.9, now + 0.48);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.16, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  public playCatChirp() {
    if (!this.isInitialized) this.activate();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600, now);
    filter.Q.setValueAtTime(5, now);

    osc.frequency.setValueAtTime(880, now);
    osc.frequency.linearRampToValueAtTime(1450, now + 0.07);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.18);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playFrostCrack() {
    if (!this.isInitialized) this.activate();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const pitch = 2400 + Math.random() * 800;
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.5, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playCatPurr() {
    if (!this.isInitialized) this.activate();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(75, now);
    osc.frequency.linearRampToValueAtTime(85, now + 0.3);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  public playWhoosh() {
    if (!this.isInitialized) this.activate();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(2200, now + 0.18);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.4);

    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.4);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  public playDimensionalShatter() {
    if (!this.isInitialized) this.activate();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;

    const shatterPitches = [1600, 2100, 2700, 3400, 4200];
    shatterPitches.forEach((p, i) => {
      window.setTimeout(() => {
        if (!this.ctx || !this.masterGain) return;
        const subNow = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(p, subNow);
        gain.gain.setValueAtTime(0.14, subNow);
        gain.gain.exponentialRampToValueAtTime(0.001, subNow + 0.45);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(subNow);
        osc.stop(subNow + 0.5);
      }, i * 35);
    });

    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(160, now);
    subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.7);

    subGain.gain.setValueAtTime(0.25, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);

    subOsc.start(now);
    subOsc.stop(now + 0.8);
  }

  public playSeasonalShift() {
    this.playMagicSparkle();
    this.playChime(1.5, 6);
  }

  public playCrystallineShatter() {
    if (!this.isInitialized) this.activate();
    if (!this.ctx || !this.masterGain) return;

    const freqs = [1046.5, 1318.5, 1567.98, 2093.0];
    freqs.forEach((f, i) => {
      window.setTimeout(() => {
        if (!this.ctx || !this.masterGain) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now);
        osc.frequency.exponentialRampToValueAtTime(f * 0.7, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.4);
      }, i * 40);
    });
  }

  private playCustomAudio(url?: string): Promise<boolean> {
    if (!url || typeof window === 'undefined') return Promise.resolve(false);

    try {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.setAttribute('playsinline', '');
      audio.volume = CUSTOM_SFX_VOLUME;

      const cleanup = () => {
        this.activeEffectAudios.delete(audio);
        audio.removeAttribute('src');
        audio.load();
      };

      audio.addEventListener('ended', cleanup, { once: true });
      audio.addEventListener('error', cleanup, { once: true });
      this.activeEffectAudios.add(audio);
      audio.src = url;

      const playPromise = audio.play();
      if (!playPromise) return Promise.resolve(true);

      return playPromise
        .then(() => true)
        .catch(() => {
          cleanup();
          return false;
        });
    } catch {
      return Promise.resolve(false);
    }
  }

  private playProceduralSceneClick(config: SceneClickConfig) {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    switch (config.acousticType) {
      case 'crystal-tap': {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(config.basePitchHz, now);
        osc.frequency.exponentialRampToValueAtTime(config.basePitchHz * 0.45, now + 0.05);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(config.basePitchHz * 1.2, now);
        filter.Q.setValueAtTime(config.resonance, now);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        break;
      }
      case 'parchment-tick': {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(config.basePitchHz, now);
        osc.frequency.linearRampToValueAtTime(config.basePitchHz * 0.55, now + 0.04);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, now);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        break;
      }
      case 'celestial-snap': {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(config.basePitchHz, now);
        osc.frequency.exponentialRampToValueAtTime(config.basePitchHz * 0.4, now + 0.065);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(config.basePitchHz * 1.5, now);
        filter.Q.setValueAtTime(3.5, now);

        gain.gain.setValueAtTime(0.19, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        break;
      }
      case 'velvet-ping': {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(config.basePitchHz, now);
        osc.frequency.exponentialRampToValueAtTime(config.basePitchHz * 0.65, now + 0.06);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(config.basePitchHz * 1.3, now);
        filter.Q.setValueAtTime(4.2, now);

        gain.gain.setValueAtTime(0.17, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        break;
      }
      case 'starlight-droplet': {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(config.basePitchHz, now);
        osc.frequency.exponentialRampToValueAtTime(config.basePitchHz * 1.35, now + 0.035);
        osc.frequency.exponentialRampToValueAtTime(config.basePitchHz * 0.6, now + 0.07);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2800, now);

        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);
        break;
      }
      case 'sacred-bell':
      default: {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(config.basePitchHz, now);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(config.basePitchHz * 1.2, now);
        filter.Q.setValueAtTime(config.resonance, now);

        gain.gain.setValueAtTime(0.20, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        break;
      }
    }

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playSceneClick(sceneId: string) {
    if (!this.isInitialized) this.activate();

    const config = SCENE_CLICK_REGISTRY[sceneId] || SCENE_CLICK_REGISTRY.opening;
    if (config.customAudioUrl) {
      void this.playCustomAudio(config.customAudioUrl).then((played) => {
        if (!played) this.playProceduralSceneClick(config);
      });
      return;
    }

    this.playProceduralSceneClick(config);
  }

  public playMagicalGiftOpen() {
    if (!this.isInitialized) this.activate();
    if (SPECIAL_SFX_REGISTRY.giftOpenMagical.customAudioUrl) {
      void this.playCustomAudio(SPECIAL_SFX_REGISTRY.giftOpenMagical.customAudioUrl).then((played) => {
        if (played || !this.ctx || !this.masterGain) return;
        this.playProceduralGiftOpen();
      });
      return;
    }
    this.playProceduralGiftOpen();
  }

  private playProceduralGiftOpen() {
    if (!this.ctx || !this.masterGain) return;

    const freqs = SPECIAL_SFX_REGISTRY.giftOpenMagical.harmonicFrequencies;

    freqs.forEach((f, idx) => {
      window.setTimeout(() => {
        if (!this.ctx || !this.masterGain) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(f * 1.25, now);
        filter.Q.setValueAtTime(4.0, now);

        const vol = 0.16 / (1 + idx * 0.12);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 1.25);
      }, idx * 65);
    });

    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(220, now);
    subOsc.frequency.exponentialRampToValueAtTime(110, now + 0.5);

    subGain.gain.setValueAtTime(0.12, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(now);
    subOsc.stop(now + 0.65);
  }

  public playAscensionSend() {
    if (!this.isInitialized) this.activate();
    if (SPECIAL_SFX_REGISTRY.replySendAscension.customAudioUrl) {
      void this.playCustomAudio(SPECIAL_SFX_REGISTRY.replySendAscension.customAudioUrl).then((played) => {
        if (played || !this.ctx || !this.masterGain) return;
        this.playProceduralAscensionSend();
      });
      return;
    }
    this.playProceduralAscensionSend();
  }

  private playProceduralAscensionSend() {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;

    const whooshOsc = this.ctx.createOscillator();
    const whooshFilter = this.ctx.createBiquadFilter();
    const whooshGain = this.ctx.createGain();

    whooshOsc.type = 'sine';
    whooshFilter.type = 'lowpass';
    whooshFilter.frequency.setValueAtTime(240, now);
    whooshFilter.frequency.exponentialRampToValueAtTime(3200, now + 0.35);
    whooshFilter.frequency.exponentialRampToValueAtTime(400, now + 0.85);

    whooshOsc.frequency.setValueAtTime(160, now);
    whooshOsc.frequency.exponentialRampToValueAtTime(950, now + 0.38);
    whooshOsc.frequency.exponentialRampToValueAtTime(240, now + 0.85);

    whooshGain.gain.setValueAtTime(0.01, now);
    whooshGain.gain.linearRampToValueAtTime(0.22, now + 0.25);
    whooshGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    whooshOsc.connect(whooshFilter);
    whooshFilter.connect(whooshGain);
    whooshGain.connect(this.masterGain);

    whooshOsc.start(now);
    whooshOsc.stop(now + 0.95);

    const ascensionPitches = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    ascensionPitches.forEach((p, i) => {
      window.setTimeout(() => {
        if (!this.ctx || !this.masterGain) return;
        const subNow = this.ctx.currentTime;
        const sOsc = this.ctx.createOscillator();
        const sGain = this.ctx.createGain();

        sOsc.type = 'sine';
        sOsc.frequency.setValueAtTime(p, subNow);
        sGain.gain.setValueAtTime(0.001, subNow);
        sGain.gain.linearRampToValueAtTime(0.14, subNow + 0.03);
        sGain.gain.exponentialRampToValueAtTime(0.001, subNow + 0.85);

        sOsc.connect(sGain);
        sGain.connect(this.masterGain);
        sOsc.start(subNow);
        sOsc.stop(subNow + 0.9);
      }, 120 + i * 55);
    });
  }

  public playHoshinekoVoice(situation = 'greeting') {
    if (!this.isInitialized) this.activate();
    const voiceSlot = HOSHINEKO_VOICE_REGISTRY[situation] || HOSHINEKO_VOICE_REGISTRY.greeting;
    if (voiceSlot.customAudioUrl) {
      void this.playCustomAudio(voiceSlot.customAudioUrl).then((played) => {
        if (played || !this.ctx || !this.masterGain) return;
        this.playProceduralHoshinekoVoice(voiceSlot);
      });
      return;
    }
    this.playProceduralHoshinekoVoice(voiceSlot);
  }

  private playProceduralHoshinekoVoice(voiceSlot: HoshinekoVoiceSlot) {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    filter.type = 'bandpass';

    const pitch = voiceSlot.pitch || 1.15;

    switch (voiceSlot.formantFilter) {
      case 'warm-purr': {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(72 * pitch, now);
        osc.frequency.linearRampToValueAtTime(78 * pitch, now + 0.35);

        filter.frequency.setValueAtTime(350, now);
        filter.Q.setValueAtTime(2.0, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.55);
        return;
      }
      case 'cute-chirp': {
        filter.frequency.setValueAtTime(1750 * pitch, now);
        filter.Q.setValueAtTime(4.5, now);

        osc.frequency.setValueAtTime(920 * pitch, now);
        osc.frequency.linearRampToValueAtTime(1520 * pitch, now + 0.06);
        osc.frequency.exponentialRampToValueAtTime(1150 * pitch, now + 0.17);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        break;
      }
      case 'sparkle-nya': {
        filter.frequency.setValueAtTime(1450 * pitch, now);
        filter.Q.setValueAtTime(3.8, now);

        const base = 680 * pitch;
        osc.frequency.setValueAtTime(base, now);
        osc.frequency.linearRampToValueAtTime(base * 1.6, now + 0.1);
        osc.frequency.linearRampToValueAtTime(base * 1.3, now + 0.25);
        osc.frequency.exponentialRampToValueAtTime(base * 0.95, now + 0.42);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        this.playChime(1.2, 8);
        break;
      }
      case 'happy-nya':
      case 'gentle-mew':
      default: {
        filter.frequency.setValueAtTime(1300 * pitch, now);
        filter.Q.setValueAtTime(3.5, now);

        const startF = 620 * pitch;
        osc.frequency.setValueAtTime(startF, now);
        osc.frequency.linearRampToValueAtTime(startF * 1.48, now + 0.11);
        osc.frequency.linearRampToValueAtTime(startF * 1.22, now + 0.28);
        osc.frequency.exponentialRampToValueAtTime(startF * 0.9, now + 0.45);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.17, now + 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.46);
        break;
      }
    }

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  public ensureBgmPlaying() {
    if (!this.isInitialized) {
      this.init();
    }

    if (this.ctx?.state === 'suspended') {
      void this.ctx.resume().catch(() => {});
    }

    // Always retry the supplied track. There is intentionally no procedural fallback.
    void this.startConfiguredBgm();
  }

  public shiftAtmosphereTone(_tone: 'golden' | 'amber' | 'twilight') {
    // Kept as a no-op compatibility API. The project now uses the supplied master BGM
    // exclusively; no synthesized harmonic pad is mixed underneath it.
  }

  public destroy() {
    this.activeEffectAudios.forEach((audio) => {
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.removeAttribute('src');
        audio.load();
      } catch {
        // Ignore cleanup errors during unmount.
      }
    });
    this.activeEffectAudios.clear();

    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
      this.bgmAudio.removeAttribute('src');
      this.bgmAudio.load();
      this.bgmAudio = null;
    }

    this.bgmSourceUrl = null;
    this.bgmLoadFailed = false;

    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
    }
    this.masterGain = null;
    this.isInitialized = false;
    this.isPlaying = false;
  }
}

export const acousticEngine = new AcousticEngine();
