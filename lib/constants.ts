// Konstanta global — ubah di sini, berlaku di seluruh aplikasi
export const WHATSAPP_NUMBER = '6285335660159';
export const WHATSAPP_URL = (msg = 'Halo Admin karsaloka, saya ingin bertanya tentang undangan digital...') =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

export const SITE_URL = 'https://digital-invitation-rouge.vercel.app';
export const SITE_NAME = 'karsaloka';
export const SITE_DESCRIPTION =
  'Buat undangan pernikahan digital yang elegan dan modern. Kelola RSVP otomatis, amplop digital, dan bagikan momen spesial Anda dengan mudah bersama karsaloka.';
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
