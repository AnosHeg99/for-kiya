import { IMAGE_ASSETS } from './assets';

export type SeasonId = 'semi' | 'panas' | 'gugur' | 'dingin';

export interface SeasonConfig {
  id: SeasonId;
  name: string;
  japanese: string;
  symbol: string;
  elementName: string;
  kanji: string;
  skyTint: string;
  rimColor: string;
  cardGlow: string;
  particleType: 'sakura' | 'firefly' | 'ginkgo' | 'snow';
  ambientFreq: number;
  sealGradient: string;
  sealBorderColor: string;
  sealGlowColor: string;
  envelopeTexture: string;
  frameBorderClass: string;
  replyPlaceholder: string;
  replyButtonText: string;
}

export const SEASONS_CONFIG: Record<SeasonId, SeasonConfig> = {
  semi: {
    id: 'semi',
    name: 'Musim Semi',
    japanese: '春',
    symbol: '🌸',
    elementName: 'ㅤ',
    kanji: '桜',
    skyTint: 'from-sky-300/25 via-pink-200/20 to-transparent',
    rimColor: 'rgba(244, 114, 182, 0.85)',
    cardGlow: 'rgba(251, 207, 232, 0.6)',
    particleType: 'sakura',
    ambientFreq: 432,
    sealGradient: 'radial-gradient(circle at 35% 30%, #fbcfe8 0%, #f472b6 45%, #db2777 100%)',
    sealBorderColor: '#fbcfe8',
    sealGlowColor: 'rgba(244, 114, 182, 0.9)',
    envelopeTexture: 'from-pink-50/95 via-rose-50/90 to-sky-100/95',
    frameBorderClass: 'border-pink-300/80 shadow-[0_0_30px_rgba(244,114,182,0.35)]',
    replyPlaceholder: '',
    replyButtonText: 'Kirim Bersama Kelopak Sakura 🌸',
  },
  panas: {
    id: 'panas',
    name: 'Musim Panas',
    japanese: '夏',
    symbol: '☀️',
    elementName: 'ㅤ',
    kanji: '陽',
    skyTint: 'from-sky-400/30 via-cyan-200/25 to-amber-200/15',
    rimColor: 'rgba(56, 189, 248, 0.9)',
    cardGlow: 'rgba(186, 230, 253, 0.7)',
    particleType: 'firefly',
    ambientFreq: 440,
    sealGradient: 'radial-gradient(circle at 35% 30%, #fef08a 0%, #f59e0b 50%, #b45309 100%)',
    sealBorderColor: '#fef08a',
    sealGlowColor: 'rgba(245, 158, 11, 0.9)',
    envelopeTexture: 'from-sky-50/95 via-amber-50/90 to-sky-100/95',
    frameBorderClass: 'border-amber-300/80 shadow-[0_0_30px_rgba(245,158,11,0.35)]',
    replyPlaceholder: '',
    replyButtonText: 'Kirim Melintasi Cakrawala Surya ☀️',
  },
  gugur: {
    id: 'gugur',
    name: 'Musim Gugur',
    japanese: '秋',
    symbol: '🍁',
    elementName: 'ㅤ',
    kanji: '秋',
    skyTint: 'from-sky-300/25 via-amber-200/20 to-orange-200/15',
    rimColor: 'rgba(251, 191, 36, 0.85)',
    cardGlow: 'rgba(254, 240, 138, 0.6)',
    particleType: 'ginkgo',
    ambientFreq: 396,
    sealGradient: 'radial-gradient(circle at 35% 30%, #fed7aa 0%, #ea580c 50%, #7c2d12 100%)',
    sealBorderColor: '#fed7aa',
    sealGlowColor: 'rgba(234, 88, 12, 0.9)',
    envelopeTexture: 'from-amber-50/95 via-orange-50/90 to-stone-100/95',
    frameBorderClass: 'border-amber-400/80 shadow-[0_0_30px_rgba(217,119,6,0.35)]',
    replyPlaceholder: '',
    replyButtonText: 'Kirim Lewat Angin Senja Musim Gugur 🍁',
  },
  dingin: {
    id: 'dingin',
    name: 'Musim Dingin',
    japanese: '冬',
    symbol: '❄️',
    elementName: 'ㅤ',
    kanji: '冬',
    skyTint: 'from-sky-400/35 via-indigo-200/20 to-white/20',
    rimColor: 'rgba(224, 242, 254, 0.95)',
    cardGlow: 'rgba(199, 210, 254, 0.7)',
    particleType: 'snow',
    ambientFreq: 528,
    sealGradient: 'radial-gradient(circle at 35% 30%, #e0f2fe 0%, #38bdf8 50%, #0369a1 100%)',
    sealBorderColor: '#e0f2fe',
    sealGlowColor: 'rgba(56, 189, 248, 0.95)',
    envelopeTexture: 'from-cyan-50/95 via-sky-50/90 to-indigo-100/95',
    frameBorderClass: 'border-cyan-300/90 shadow-[0_0_35px_rgba(56,189,248,0.45)]',
    replyPlaceholder: '',
    replyButtonText: 'Kirim Menembus Badai Aurora Salju ❄️',
  },
};

export const APP_CONFIG = {
  // Nomor tujuan WhatsApp (Ganti nomor ini sesuai kebutuhan, format internasional tanpa tanda + atau spasi)
  whatsappNumber: '6282341867205',

  // Nama penerima & pengirim
  recipientName: 'Kamu',
  senderName: 'Seseorang yang Selalu Mengagumimu',

  // Aset latar langit & karakter utama (Bisa diganti dengan link URL foto, GIF, atau asset lokal)
  assets: {
    skyBackground: IMAGE_ASSETS.softSkyblueAnimeSky,
    animeCharacter: IMAGE_ASSETS.goldenHourAnimeGirl,
    magicalGift: IMAGE_ASSETS.magicalSkyGiftBox,
    luxuryChocolate: IMAGE_ASSETS.rimuru,
  },

  // Teks Surat Cahaya Pertama (Tahap 1) - Didesain pas di layar tanpa scroll vertikal
  letter: {
    title: 'Surat Dari Identitas',
    japaneseTitle: 'アイデンティティの法則からの手紙',
    paragraphs: [
      'Untukmu yang senantiasa melangkah dengan keteguhan hati di setiap detak waktu...',
      'Terkadang dunia berlari teramat cepat, namun saat langit biru membentang jernih, ada ketenangan murni yang selalu menanti langkahmu. Sama seperti lagu favoritmu di balik headphone dan hembusan angin sejuk, kuharap kamu tahu bahwa senyuman dan keberadaanmu adalah anugerah terindah.',
      'Sebuah bingkisan istimewa telah tersimpan rapi di balik cakrawala ini, dipersembahkan khusus untukmu.',
    ],
    sealNotice: 'Ketuk segel cahaya untuk membuka Identity Treasure',
  },

  // Identity Treasure / Hadiah Kado Dinamis CGI & POV 3D
  // Bisa diganti placeholdernya dengan gambar kado, boneka, cincin, cokelat, atau animasi GIF
  gift: {
    badge: 'HADIAH SPESIAL',
    announcement: 'Selamat, ini hadiah istimewa untukmu...',
    japaneseAnnouncement: '特別な贈り物 • Tokubetsu na Okurimono',
    title: 'Boutique Artisanal Chocolates & Celestial Treasure',
    japaneseTitle: '贅沢なショコラ • Zeitaku na Shokora',
    description: 'Sebuah kado mewah buatan tangan dengan taburan lelehan cokelat artisanal premium dan taburan kilau emas murni untuk meluluhkan segala lelahmu.',
    mediaType: 'image' as const,
    mediaUrl: IMAGE_ASSETS.rimuru,
    giftBoxCover: IMAGE_ASSETS.magicalSkyGiftBox,
    receivePrompt: 'Terima Hadiah 🎁',
  },

  // Halaman Balasan Surat ke WhatsApp (Tahap 3)
  reply: {
    header: 'Balasan h3he',
    japaneseHeader: '返信のひとこと',
    subHeader: 'Ungkapkan isi hatimu di bawah lembaran biru ini, dan terbangkan langsung ke WhatsApp.',
    defaultPlaceholder: 'Terima kasih atas kejutannya yang begitu indah... Aku sangat menyukainya...',
    sendButton: 'Kirimkan Surat Melintasi Langit 🕊️',
  },

  // Halaman Akhir Tersegel & Arigatou (Tahap 4)
  arigatou: {
    japanese: '心からありがとう',
    romaji: 'Kokoro kara arigatou',
    title: 'Surat & Hadiah Telah Tersegel Identitas',
    subtitle: 'Pesanmu telah melayang indah melintasi langit biru keemasan...',
    prayer: 'Selamat ulang tahun yahh kiya, semoga urusanmu dilancarkan tahun ini, and I hope we can grow together for a long time',
  },
};
