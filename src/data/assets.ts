/**
 * =========================================================================================
 * 🎨 HUKUM IDENTITAS • MASTER ASSET REGISTRY
 * =========================================================================================
 */

// 1. IMAGE ASSETS
import identitas from '../assets/images/1.png';
import goldenHourAnimeGirl from '../assets/images/sword.png';
import goldenHourSky from '../assets/images/wistoria.jpg';
import goldenWaxSealedLetter from '../assets/images/LawOfIdentityDKDAct5.png';
import destruction from '../assets/images/2.jpg';
import kiyameongkawaii from '../assets/images/3.png';
import rimuru from '../assets/images/4.png';
import magicalSkyGiftBox from '../assets/images/magical_sky_gift_box_1788940999827.jpg';
import softSkyblueAnimeSky from '../assets/images/wistoria.jpg';

import masterBgmAsset from '../../sounds/Invisible_String.mp3';

export const IMAGE_ASSETS = {
  identitas,
  goldenHourAnimeGirl,
  goldenHourSky,
  goldenWaxSealedLetter,
  destruction,
  kiyameongkawaii,
  rimuru,
  magicalSkyGiftBox,
  softSkyblueAnimeSky,

  
} as const;

// 2. CUSTOM AUDIO ASSETS
// BGM utama dibundle oleh Vite dari folder sounds di root project.
// Untuk mengganti musik default tanpa mengubah struktur kode, cukup ganti file sounds/Something.mp3
// dengan file MP3 valid lain menggunakan nama yang sama.
export const AUDIO_ASSETS = {
  masterBgm: masterBgmAsset,

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
} as const;
