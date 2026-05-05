// Konstanta global — ubah di sini, berlaku di seluruh aplikasi
export const WHATSAPP_URL = (msg = 'Halo Admin karsaloka, saya ingin bertanya tentang undangan digital...') =>
  `/api/contact?msg=${encodeURIComponent(msg)}`;

export const SITE_URL = 'https://karsaloka.site';
export const SITE_NAME = 'karsaloka';
export const SITE_DESCRIPTION =
  'Buat undangan pernikahan digital yang elegan dan modern. Kelola RSVP otomatis, amplop digital, dan bagikan momen spesial Anda dengan mudah bersama karsaloka.';
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
