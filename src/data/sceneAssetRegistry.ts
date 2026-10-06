/**
 * =========================================================================================
 * 🌌 AOZORA REVERIE • MASTER SCENE & ASSET REGISTRY (INTERNAL CODE ARCHITECTURE)
 * =========================================================================================
 * Dokumen konfigurasi terpadu internal untuk seluruh Scene, Aset Audio (BGM, Sound Effect,
 * Sound Click per Scene, Suara Alami Hoshineko), Animasi HD Smooth 60fps, Tipografi, dan Teks.
 * 
 * CATATAN PENGEMBANG:
 * - Seluruh pengaturan di sini murni berjalan di balik layar (tidak ditampilkan di UI).
 * - Untuk mengganti file audio, gunakan satu-satunya panel edit `AUDIO_FILE_OVERRIDES` di bagian
 *   paling atas. Isi '' untuk mempertahankan sumber terbundel dari `./assets.ts`.
 * - Resolver hanya memilih override jika nilainya tidak kosong; registry dan seluruh referensi scene
 *   tetap memakai struktur lama sehingga perubahan sumber audio tidak perlu menyentuh scene.
 * =========================================================================================
 */

import { AUDIO_ASSETS, IMAGE_ASSETS } from './assets';
// =========================================================================================
// 0. QUICK AUDIO OVERRIDE PANEL
// -----------------------------------------------------------------------------------------
// EDIT AUDIO DI SINI SAJA.
// - Isi ''  -> tetap memakai file terbundel dari ./assets.ts.
// - Isi path/URL -> memakai sumber tersebut sebagai override runtime.
// Contoh: masterBgm: './sounds/ulang-tahun.mp3'
// =========================================================================================
export interface AudioFileOverrideConfig {
  masterBgm: string;

  hoshineko: {
    greeting: string;
    happy: string;
    purring: string;
    chirp: string;
    giftReaction: string;
    sleepy: string;
  };

  sceneClick: {
    opening: string;
    sanctuary: string;
    letter: string;
    gift: string;
    reply: string;
    arigatou: string;
  };

  specialSfx: {
    giftOpenMagical: string;
    replySendAscension: string;
    waxSealBreak: string;
    seasonalShift: string;
  };
}

export const AUDIO_FILE_OVERRIDES: AudioFileOverrideConfig = {
  masterBgm: '',

  hoshineko: {
    greeting: '',
    happy: '',
    purring: '',
    chirp: '',
    giftReaction: '',
    sleepy: '',
  },

  sceneClick: {
    opening: '',
    sanctuary: '',
    letter: '',
    gift: '',
    reply: '',
    arigatou: '',
  },

  specialSfx: {
    giftOpenMagical: '',
    replySendAscension: '',
    waxSealBreak: '',
    seasonalShift: '',
  },
};

function resolveAudioUrl(overrideUrl: string, assetUrl: string): string {
  const cleanOverrideUrl = overrideUrl.trim();
  return cleanOverrideUrl !== '' ? cleanOverrideUrl : assetUrl;
}

// Semua referensi AUDIO_ASSETS sengaja dipusatkan di sini.
// Registry di bawahnya tidak perlu tahu lokasi file fisik.
export const AUDIO_SOURCES = {
  masterBgm: resolveAudioUrl(
    AUDIO_FILE_OVERRIDES.masterBgm,
    AUDIO_ASSETS.masterBgm,
  ),

  hoshineko: {
    greeting: resolveAudioUrl(
      AUDIO_FILE_OVERRIDES.hoshineko.greeting,
      AUDIO_ASSETS.hoshineko.greeting,
    ),
    happy: resolveAudioUrl(
      AUDIO_FILE_OVERRIDES.hoshineko.happy,
      AUDIO_ASSETS.hoshineko.happy,
    ),
    purring: resolveAudioUrl(
      AUDIO_FILE_OVERRIDES.hoshineko.purring,
      AUDIO_ASSETS.hoshineko.purring,
    ),
    chirp: resolveAudioUrl(
      AUDIO_FILE_OVERRIDES.hoshineko.chirp,
      AUDIO_ASSETS.hoshineko.chirp,
    ),
    giftReaction: resolveAudioUrl(
      AUDIO_FILE_OVERRIDES.hoshineko.giftReaction,
      AUDIO_ASSETS.hoshineko.giftReaction,
    ),
    sleepy: resolveAudioUrl(
      AUDIO_FILE_OVERRIDES.hoshineko.sleepy,
      AUDIO_ASSETS.hoshineko.sleepy,
    ),
  },

  sceneClick: {
    opening: resolveAudioUrl(
      AUDIO_FILE_OVERRIDES.sceneClick.opening,
      AUDIO_ASSETS.sceneClick.opening,
    ),
    sanctuary: resolveAudioUrl(
      AUDIO_FILE_OVERRIDES.sceneClick.sanctuary,
      AUDIO_ASSETS.sceneClick.sanctuary,
    ),
    letter: resolveAudioUrl(
      AUDIO_FILE_OVERRIDES.sceneClick.letter,
      AUDIO_ASSETS.sceneClick.letter,
    ),
    gift: resolveAudioUrl(
      AUDIO_FILE_OVERRIDES.sceneClick.gift,
      AUDIO_ASSETS.sceneClick.gift,
    ),
    reply: resolveAudioUrl(
      AUDIO_FILE_OVERRIDES.sceneClick.reply,
      AUDIO_ASSETS.sceneClick.reply,
    ),
    arigatou: resolveAudioUrl(
      AUDIO_FILE_OVERRIDES.sceneClick.arigatou,
      AUDIO_ASSETS.sceneClick.arigatou,
    ),
  },

  specialSfx: {
    giftOpenMagical: resolveAudioUrl(
      AUDIO_FILE_OVERRIDES.specialSfx.giftOpenMagical,
      AUDIO_ASSETS.specialSfx.giftOpenMagical,
    ),
    replySendAscension: resolveAudioUrl(
      AUDIO_FILE_OVERRIDES.specialSfx.replySendAscension,
      AUDIO_ASSETS.specialSfx.replySendAscension,
    ),
    waxSealBreak: resolveAudioUrl(
      AUDIO_FILE_OVERRIDES.specialSfx.waxSealBreak,
      AUDIO_ASSETS.specialSfx.waxSealBreak,
    ),
    seasonalShift: resolveAudioUrl(
      AUDIO_FILE_OVERRIDES.specialSfx.seasonalShift,
      AUDIO_ASSETS.specialSfx.seasonalShift,
    ),
  },
} as const;


// =========================================================================================
// 1. MASTER AUDIO & BGM REGISTRY (BERLAKU DI SELURUH SCENE SECARA KONSISTEN)
// =========================================================================================
export interface AudioAssetConfig {
  id: string;
  name: string;
  description: string;
  customAudioUrl?: string; // Isi path relatif misal: './sounds/my_click.mp3' atau link URL
  baseFrequency?: number;
  harmonicNotes?: number[];
  durationMs: number;
  volume: number;
}

export const MASTER_BGM_CONFIG = {
  id: 'aozora-ambient-bgm',
  trackTitle: 'Aozora Reverie • Ethereal Celestial Soundscape',
  composer: 'Custom Master Audio Track',
  // Sumber utama berasal dari AUDIO_SOURCES.masterBgm. Isi override di atas hanya bila perlu mengganti URL/sumber runtime.
  customAudioUrl: AUDIO_SOURCES.masterBgm, 
  // Balanced cinematic level: BGM stays present as an atmosphere, while clicks/SFX remain clearly audible.
  volume: 0.25,
  loop: true,
  fadeInDurationSec: 3.5,
  fadeOutDurationSec: 2.0,
  proceduralChords: [
    { name: 'Ebmaj9', notes: [155.56, 311.13, 392.00, 466.16, 587.33] },
    { name: 'Gm7',    notes: [196.00, 293.66, 349.23, 440.00, 523.25] },
    { name: 'Fm9',    notes: [174.61, 261.63, 349.23, 415.30, 523.25] },
    { name: 'Abmaj7', notes: [207.65, 311.13, 392.00, 466.16, 622.25] },
  ],
  atmosphereToneFrequencies: {
    goldenHour: 432, // Hz
    solarMidday: 528, // Hz
    autumnDusk: 396,  // Hz
    glacialAurora: 639, // Hz
  },
};

// =========================================================================================
// 2. SUARA ALAMI KUCING HOSHINEKO (NATURAL & CUTE, NON-ROBOTIK / BUKAN SUARA AI)
// =========================================================================================
export interface HoshinekoVoiceSlot {
  situation: string;
  customAudioUrl: string; // Bisa diisi file audio .mp3/.wav kustom
  description: string;
  pitch: number;
  formantFilter: 'warm-purr' | 'cute-chirp' | 'happy-nya' | 'gentle-mew' | 'sparkle-nya';
}

export const HOSHINEKO_VOICE_REGISTRY: Record<string, HoshinekoVoiceSlot> = {
  greeting: {
    situation: 'Saat pertama kali disentuh / menyapa di pembukaan',
    customAudioUrl: AUDIO_SOURCES.hoshineko.greeting,
    description: 'Suara meow ramah bernada ganda alami (mew-nyaa~)',
    pitch: 1.15,
    formantFilter: 'gentle-mew',
  },
  happy: {
    situation: 'Saat dielus atau menerima aksi bermain',
    customAudioUrl: AUDIO_SOURCES.hoshineko.happy,
    description: 'Suara ceria riang dengan harmonik lembut (nyaaan~)',
    pitch: 1.25,
    formantFilter: 'happy-nya',
  },
  purring: {
    situation: 'Saat kucing santai mendengkur di pangkuan',
    customAudioUrl: AUDIO_SOURCES.hoshineko.purring,
    description: 'Dengkuran tenggorokan kucing organik 72Hz yang menenangkan',
    pitch: 0.85,
    formantFilter: 'warm-purr',
  },
  chirp: {
    situation: 'Saat kucing kaget bahagia / mengejar bintang',
    customAudioUrl: AUDIO_SOURCES.hoshineko.chirp,
    description: 'Kicauan pendek menggemaskan (chirp-nya!)',
    pitch: 1.35,
    formantFilter: 'cute-chirp',
  },
  giftReaction: {
    situation: 'Saat berada di dekat kotak hadiah langit',
    customAudioUrl: AUDIO_SOURCES.hoshineko.giftReaction,
    description: 'Dengkuran manja berhias starlight chime alami',
    pitch: 1.20,
    formantFilter: 'sparkle-nya',
  },
  sleepy: {
    situation: 'Saat berdiam santai di malam hari',
    customAudioUrl: AUDIO_SOURCES.hoshineko.sleepy,
    description: 'Helaan nafas dengkuran lembut kucing mengantuk',
    pitch: 0.95,
    formantFilter: 'warm-purr',
  },
};

// =========================================================================================
// 3. SOUND CLICK INDIVIDUAL PER SCENE (DISESUAIKAN DENGAN KARAKTER TIAP SCENE)
// =========================================================================================
export interface SceneClickConfig {
  sceneId: string;
  sceneName: string;
  clickName: string;
  customAudioUrl: string; // Bisa diganti dengan path audio eksternal
  acousticType: 'crystal-tap' | 'parchment-tick' | 'celestial-snap' | 'velvet-ping' | 'starlight-droplet' | 'sacred-bell';
  basePitchHz: number;
  resonance: number;
  description: string;
}

export const SCENE_CLICK_REGISTRY: Record<string, SceneClickConfig> = {
  opening: {
    sceneId: 'opening',
    sceneName: 'Scene 1: Gerbang Masuk Kinematik (Cinematic Gate)',
    clickName: 'Celestial Portal Chime-Click',
    customAudioUrl: AUDIO_SOURCES.sceneClick.opening,
    acousticType: 'crystal-tap',
    basePitchHz: 1560,
    resonance: 1.8,
    description: 'Klik kristal murni beresonansi tinggi membangkitkan portal langit',
  },
  sanctuary: {
    sceneId: 'sanctuary',
    sceneName: 'Scene 2: Cover Light Novel Interaktif (Sanctuary)',
    clickName: 'Parchment Tactile Snap & Cat Bell',
    customAudioUrl: AUDIO_SOURCES.sceneClick.sanctuary,
    acousticType: 'parchment-tick',
    basePitchHz: 1420,
    resonance: 1.5,
    description: 'Sentuhan taktil seperti membuka sampul buku novel berkualitas tinggi',
  },
  letter: {
    sceneId: 'letter',
    sceneName: 'Scene 3: Amplop Segel & Naskah Surat Surgawi',
    clickName: 'Sacred Wax Fracture & Soft Velvet Tap',
    customAudioUrl: AUDIO_SOURCES.sceneClick.letter,
    acousticType: 'celestial-snap',
    basePitchHz: 1280,
    resonance: 2.1,
    description: 'Retakan segel lilin magis berpadu pendaran lonceng angin surga',
  },
  gift: {
    sceneId: 'gift',
    sceneName: 'Scene 4: Paviliun Hadiah & Cokelat Surgawi',
    clickName: 'Velvet Ribbon Silk Ping & Pure Glass Sparkle',
    customAudioUrl: AUDIO_SOURCES.sceneClick.gift,
    acousticType: 'velvet-ping',
    basePitchHz: 1680,
    resonance: 2.4,
    description: 'Bunyi manis membuka pita sutra dengan kelembutan akustik alami',
  },
  reply: {
    sceneId: 'reply',
    sceneName: 'Scene 5: Terminal Surat Balasan Langit',
    clickName: 'Starlight Droplet & Ink Feather Quill Tap',
    customAudioUrl: AUDIO_SOURCES.sceneClick.reply,
    acousticType: 'starlight-droplet',
    basePitchHz: 1350,
    resonance: 1.6,
    description: 'Ketukan tetesan embun bintang saat mengetik surat balasan',
  },
  arigatou: {
    sceneId: 'arigatou',
    sceneName: 'Scene 6: Epilog Sanctum Abadi (Arigatou Scene)',
    clickName: 'Eternal Sanctuary Resonant Bell',
    customAudioUrl: AUDIO_SOURCES.sceneClick.arigatou,
    acousticType: 'sacred-bell',
    basePitchHz: 1046,
    resonance: 2.8,
    description: 'Dentingan lonceng kuil langit yang bergaung lembut dalam damai',
  },
};

// =========================================================================================
// 4. SOUND EFFECT KHUSUS (EFEK MAGIS ALAMI: HADIAH, PENGIRIMAN, TRANSISI)
// =========================================================================================
export const SPECIAL_SFX_REGISTRY = {
  giftOpenMagical: {
    id: 'gift-open-magical',
    name: 'Magical Gift Unboxing Harmonic Chime',
    customAudioUrl: AUDIO_SOURCES.specialSfx.giftOpenMagical, // Ganti file jika diinginkan
    description: 'Arpeggio harpa langit 5 nada berantai dengan glockenspiel organik tanpa kesan robot/AI',
    harmonicFrequencies: [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98],
  },
  replySendAscension: {
    id: 'reply-send-ascension',
    name: 'Dimensional Soaring Ascension Whoosh',
    customAudioUrl: AUDIO_SOURCES.specialSfx.replySendAscension, // Ganti file jika diinginkan
    description: 'Desau lembut angin dimensi melesatkan surat menembus cakrawala biru keemasan',
    durationMs: 1400,
  },
  waxSealBreak: {
    id: 'wax-seal-break',
    name: 'Elemental Seal Fracture & Chime Bloom',
    customAudioUrl: AUDIO_SOURCES.specialSfx.waxSealBreak,
    description: 'Pecahan segel lilin elemen empat musim yang melepaskan partikel cahaya',
    durationMs: 900,
  },
  seasonalShift: {
    id: 'seasonal-shift',
    name: 'Four Season Elemental Flux Chord',
    customAudioUrl: AUDIO_SOURCES.specialSfx.seasonalShift,
    description: 'Transisi nada harmonik saat mengubah musim semi, panas, gugur, dan dingin',
    durationMs: 800,
  },
};

// =========================================================================================
// 5. MASTER SCENE BLUEPRINTS (PENGATURAN INDIVIDUAL LENGKAP TIAP SCENE)
// =========================================================================================
export interface SceneBlueprint {
  id: string;
  order: number;
  name: string;
  japaneseTitle: string;
  
  // 1. SOUND EFFECT YANG DIGUNAKAN
  soundEffects: {
    primarySfx: string;
    ambientAmbience: string;
    triggerEffect: string;
  };

  // 2. ANIMASI & TRANSISI (HD SMOOTH & NATURAL)
  animation: {
    transitionEasing: string;
    durationMs: number;
    enterEffect: string;
    exitEffect: string;
    hoverSpringPhysics: string;
  };

  // 3. SOUND CLICK YANG DIGUNAKAN
  soundClick: {
    clickType: string;
    pitchScale: number;
    tactileHapticFeedback: boolean;
  };

  // 4. BG MUSIC YANG AKTIF
  bgMusic: {
    trackKey: string;
    volumeBalance: number;
    harmonicPadMode: 'gentle' | 'luminous' | 'warm' | 'crystal';
  };

  // 5. FONT YANG DIGUNAKAN
  typography: {
    displayHeadingFont: string;
    japaneseKanjiFont: string;
    bodyContentFont: string;
    trackingClass: string;
  };

  // 6. TEKS & KONTEN SCENE
  textContent: {
    heading: string;
    subheading: string;
    bodySummary?: string;
  };

  // 7. ASET VISUAL UTAMA
  visualAssets: {
    primaryVisual: string;
    accentGradients: string;
    haloColor: string;
  };
}

export const MASTER_SCENES: Record<string, SceneBlueprint> = {
  // ---------------------------------------------------------------------------------------
  // SCENE 1: CINEMATIC OPENING GATE
  // ---------------------------------------------------------------------------------------
  opening: {
    id: 'opening',
    order: 1,
    name: 'Gerbang Cahaya Pembuka',
    japaneseTitle: 'アイデンティティの法則 (Aidentiti no Hōsoku)',
    soundEffects: {
      primarySfx: 'celestial-portal-open',
      ambientAmbience: 'ethereal-wind-whisper',
      triggerEffect: 'golden-ping-radiance',
    },
    animation: {
      transitionEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      durationMs: 950,
      enterEffect: 'fade-scale-in',
      exitEffect: 'portal-aperture-burst',
      hoverSpringPhysics: 'scale-105 duration-500',
    },
    soundClick: {
      clickType: 'crystal-tap',
      pitchScale: 1.56,
      tactileHapticFeedback: true,
    },
    bgMusic: {
      trackKey: MASTER_BGM_CONFIG.id,
      volumeBalance: 0.88,
      harmonicPadMode: 'luminous',
    },
    typography: {
      displayHeadingFont: 'Cinzel, serif',
      japaneseKanjiFont: 'Zen Kaku Gothic New, sans-serif',
      bodyContentFont: 'Plus Jakarta Sans, sans-serif',
      trackingClass: 'tracking-[0.4em]',
    },
    textContent: {
      heading: 'AOZORA REVERIE',
      subheading: 'キアリア • Sentuh untuk Membuka Cakrawala',
      bodySummary: 'Gerbang pembuka berputar dengan cincin konsentris bercahaya keemasan.',
    },
    visualAssets: {
      primaryVisual: IMAGE_ASSETS.softSkyblueAnimeSky,
      accentGradients: 'from-sky-100 via-sky-200 to-sky-400',
      haloColor: 'rgba(255, 255, 255, 0.95)',
    },
  },

  // ---------------------------------------------------------------------------------------
  // SCENE 2: LIGHT NOVEL COVER & SANCTUARY
  // ---------------------------------------------------------------------------------------
  sanctuary: {
    id: 'sanctuary',
    order: 2,
    name: 'KIYA MEONG',
    japaneseTitle: '青空の便り • Aozora Sanctuary',
    soundEffects: {
      primarySfx: 'novel-cover-tilt-breathe',
      ambientAmbience: 'golden-hour-warm-whisper',
      triggerEffect: 'hoshineko-chime-beckon',
    },
    animation: {
      transitionEasing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      durationMs: 700,
      enterEffect: 'cinematic-depth-drift',
      exitEffect: 'cover-fade-ascension',
      hoverSpringPhysics: 'transform-perspective-1000 rotate-tilt',
    },
    soundClick: {
      clickType: 'parchment-tick',
      pitchScale: 1.42,
      tactileHapticFeedback: true,
    },
    bgMusic: {
      trackKey: MASTER_BGM_CONFIG.id,
      volumeBalance: 0.92,
      harmonicPadMode: 'warm',
    },
    typography: {
      displayHeadingFont: 'Cinzel, serif',
      japaneseKanjiFont: 'Noto Sans JP, serif',
      bodyContentFont: 'Plus Jakarta Sans, sans-serif',
      trackingClass: 'tracking-[0.25em]',
    },
    textContent: {
      heading: 'AOZORA REVERIE • VOL. 04',
      subheading: 'Sentuh Hoshineko di tengah untuk membuka naskah',
      bodySummary: 'Sampul light novel bertekstur emas dengan kucing Hoshineko yang responsif mengikuti kursor.',
    },
    visualAssets: {
      primaryVisual: IMAGE_ASSETS.goldenHourAnimeGirl,
      accentGradients: 'from-sky-300/30 via-amber-200/20 to-transparent',
      haloColor: 'rgba(254, 240, 138, 0.5)',
    },
  },

  // ---------------------------------------------------------------------------------------
  // SCENE 3: CELESTIAL LETTER & ELEVATED MANUSCRIPT
  // ---------------------------------------------------------------------------------------
  letter: {
    id: 'letter',
    order: 3,
    name: 'Naskah Surat Tersegel Langit',
    japaneseTitle: '親愛なる君へ • Sacred Celestial Manuscript',
    soundEffects: {
      primarySfx: 'elemental-wax-snap',
      ambientAmbience: 'sacred-parchment-flutter',
      triggerEffect: 'crystal-harmonic-revelation',
    },
    animation: {
      transitionEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      durationMs: 800,
      enterEffect: 'manuscript-unfurl-up',
      exitEffect: 'smooth-card-ascend',
      hoverSpringPhysics: 'scale-102 transition-smooth',
    },
    soundClick: {
      clickType: 'celestial-snap',
      pitchScale: 1.28,
      tactileHapticFeedback: true,
    },
    bgMusic: {
      trackKey: MASTER_BGM_CONFIG.id,
      volumeBalance: 0.94,
      harmonicPadMode: 'crystal',
    },
    typography: {
      displayHeadingFont: 'Cinzel, serif',
      japaneseKanjiFont: 'Zen Kaku Gothic New, sans-serif',
      bodyContentFont: 'Plus Jakarta Sans, sans-serif',
      trackingClass: 'tracking-wider',
    },
    textContent: {
      heading: 'Surat Dari Identitas',
      subheading: '親愛なる君へ • TO MY CHERISHED ONE',
      bodySummary: 'Surat bersegel elemen 4 musim yang membuka naskah hangat penuh apresiasi tulus.',
    },
    visualAssets: {
      primaryVisual: IMAGE_ASSETS.softSkyblueAnimeSky,
      accentGradients: 'from-sky-900/90 via-sky-800/95 to-indigo-950/98',
      haloColor: 'rgba(56, 189, 248, 0.65)',
    },
  },

  // ---------------------------------------------------------------------------------------
  // SCENE 4: CELESTIAL GIFT PAVILION & SACRED CHOCOLATE
  // ---------------------------------------------------------------------------------------
  gift: {
    id: 'gift',
    order: 4,
    name: 'Paviliun Hadiah & Cokelat Surgawi',
    japaneseTitle: '蒼穹の贈り物 • Celestial Gift Pavilion',
    soundEffects: {
      primarySfx: 'gift-open-magical', // Harpa 5-nada alami
      ambientAmbience: 'sky-wind-bell-drift',
      triggerEffect: 'celestial-bird-ascension',
    },
    animation: {
      transitionEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Natural spring
      durationMs: 850,
      enterEffect: 'altar-unveil-zoom',
      exitEffect: 'bird-feather-ascend',
      hoverSpringPhysics: 'hover:scale-105 active:scale-95 duration-400',
    },
    soundClick: {
      clickType: 'velvet-ping',
      pitchScale: 1.68,
      tactileHapticFeedback: true,
    },
    bgMusic: {
      trackKey: MASTER_BGM_CONFIG.id,
      volumeBalance: 0.95,
      harmonicPadMode: 'gentle',
    },
    typography: {
      displayHeadingFont: 'Cinzel, serif',
      japaneseKanjiFont: 'Zen Kaku Gothic New, sans-serif',
      bodyContentFont: 'Plus Jakarta Sans, sans-serif',
      trackingClass: 'tracking-widest',
    },
    textContent: {
      heading: 'IDENTITY REWARD',
      subheading: 'KLIK GAMBAR UNTUK MEMBUKA SEGEL',
      bodySummary: 'Koleksi 4 harta IDENTITAS: Royal Truffle, Sky Macaron, Starlight Praline, Celestial Gem.',
    },
    visualAssets: {
      primaryVisual: IMAGE_ASSETS.magicalSkyGiftBox,
      accentGradients: 'from-amber-400 via-sky-300 to-indigo-400',
      haloColor: 'rgba(251, 191, 36, 0.75)',
    },
  },

  // ---------------------------------------------------------------------------------------
  // SCENE 5: SACRED REPLY TERMINAL
  // ---------------------------------------------------------------------------------------
  reply: {
    id: 'reply',
    order: 5,
    name: 'Terminal Balasan Surat Langit',
    japaneseTitle: '返信の誓い • Aozora Reply Parchment',
    soundEffects: {
      primarySfx: 'reply-send-ascension',
      ambientAmbience: 'quill-typing-crystal',
      triggerEffect: 'dimensional-whatsapp-bridge',
    },
    animation: {
      transitionEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      durationMs: 750,
      enterEffect: 'parchment-bloom',
      exitEffect: 'starlight-soar-up',
      hoverSpringPhysics: 'scale-105 transition-smooth',
    },
    soundClick: {
      clickType: 'starlight-droplet',
      pitchScale: 1.35,
      tactileHapticFeedback: true,
    },
    bgMusic: {
      trackKey: MASTER_BGM_CONFIG.id,
      volumeBalance: 0.92,
      harmonicPadMode: 'warm',
    },
    typography: {
      displayHeadingFont: 'Cinzel, serif',
      japaneseKanjiFont: 'Zen Kaku Gothic New, sans-serif',
      bodyContentFont: 'Plus Jakarta Sans, sans-serif',
      trackingClass: 'tracking-wider',
    },
    textContent: {
      heading: 'Tuliskan Pesan Hangatmu',
      subheading: 'KIRIM • Hanya Satu Kata Dinamis Sesuai Musim',
      bodySummary: 'Pengaturan 4 musim dinamis mengubah bentuk tombol Kirim secara menakjubkan.',
    },
    visualAssets: {
      primaryVisual: IMAGE_ASSETS.softSkyblueAnimeSky,
      accentGradients: 'from-white/95 via-sky-50/90 to-cyan-50/95',
      haloColor: 'rgba(56, 189, 248, 0.7)',
    },
  },

  // ---------------------------------------------------------------------------------------
  // SCENE 6: EPILOGUE SANCTUM (ARIGATOU)
  // ---------------------------------------------------------------------------------------
  arigatou: {
    id: 'arigatou',
    order: 6,
    name: 'Sanctum Terima Kasih Abadi',
    japaneseTitle: 'ありがとう • Eternal Reverie Sanctum',
    soundEffects: {
      primarySfx: 'sacred-bell-harmony',
      ambientAmbience: 'eternal-sunset-glow',
      triggerEffect: 'sacred-chains-resonance',
    },
    animation: {
      transitionEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      durationMs: 1200,
      enterEffect: 'celestial-white-bloom-fade',
      exitEffect: 'sanctuary-loop-fade',
      hoverSpringPhysics: 'scale-105 transition-spring',
    },
    soundClick: {
      clickType: 'sacred-bell',
      pitchScale: 1.05,
      tactileHapticFeedback: true,
    },
    bgMusic: {
      trackKey: MASTER_BGM_CONFIG.id,
      volumeBalance: 0.98,
      harmonicPadMode: 'luminous',
    },
    typography: {
      displayHeadingFont: 'Cinzel, serif',
      japaneseKanjiFont: 'Zen Kaku Gothic New, sans-serif',
      bodyContentFont: 'Plus Jakarta Sans, sans-serif',
      trackingClass: 'tracking-[0.3em]',
    },
    textContent: {
      heading: 'ARIGATOU GOZAIMASU',
      subheading: '心からの感謝 • Terima Kasih Atas Segalanya',
      bodySummary: 'Sanctum epilog yang mengabadikan kenangan hangat menembus waktu.',
    },
    visualAssets: {
      primaryVisual: IMAGE_ASSETS.softSkyblueAnimeSky,
      accentGradients: 'from-amber-400/20 via-sky-300/30 to-indigo-900/50',
      haloColor: 'rgba(255, 255, 255, 0.9)',
    },
  },
};
