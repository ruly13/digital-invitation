export interface ThemeConfig {
  id: string; // Digunakan sebagai seed gambar gambar dan parameter query 'theme'
  name: string;
  color: string;
  fontClass?: string;
  textColor?: string;
  accentColor?: string;
  dividerColor?: string;
  category: string;
  /** Override manual - jika diisi, dipakai langsung tanpa auto-detect */
  thumbnailBg?: string;
  imageOpacity?: number;
  overlay?: string;
}

// ─────────────────────────────────────────────────────────────────
// AUTO THUMBNAIL ENGINE
// Membaca field `color` → deteksi gelap/terang → hasilkan thumbnail
// otomatis. Tidak perlu isi thumbnailBg manual untuk tema baru.
// ─────────────────────────────────────────────────────────────────

/** Map Tailwind class ke nilai hex (hanya kelas gelap yang perlu didaftar) */
const TAILWIND_HEX_MAP: Record<string, string> = {
  'bg-stone-900': '#1c1917', 'bg-stone-800': '#292524',
  'bg-slate-900': '#0f172a',  'bg-slate-800': '#1e293b',
  'bg-gray-900':  '#111827',  'bg-gray-800':  '#1f2937',
  'bg-zinc-900':  '#18181b',  'bg-zinc-800':  '#27272a',
  'bg-neutral-900':'#171717', 'bg-neutral-800':'#262626',
  'bg-black':     '#000000',
  'bg-rose-950':  '#4c0519',  'bg-rose-900':  '#881337',
  'bg-indigo-950':'#1e1b4b',  'bg-indigo-900':'#312e81',
  'bg-violet-950':'#2e1065',  'bg-purple-950':'#3b0764',
  'bg-blue-950':  '#172554',  'bg-teal-950':  '#042f2e',
  'bg-emerald-950':'#022c22',
  'bg-amber-950': '#451a03',
};

/** Ambil warna hex dari class Tailwind (arbitrary atau preset) */
function extractHex(colorClass: string): string | null {
  // Arbitrary: bg-[#rrggbb] atau bg-[#rgb]
  const m = colorClass.match(/bg-\[#([0-9a-fA-F]{3,8})\]/);
  if (m) {
    const raw = m[1];
    // Expand 3-digit shorthand: abc → aabbcc
    return raw.length === 3
      ? `#${raw[0]}${raw[0]}${raw[1]}${raw[1]}${raw[2]}${raw[2]}`
      : `#${raw.slice(0, 6)}`;
  }
  // Preset Tailwind classes
  for (const [cls, hex] of Object.entries(TAILWIND_HEX_MAP)) {
    if (colorClass.includes(cls)) return hex;
  }
  return null;
}

/** Hitung luminance relatif (0=hitam, 1=putih) */
function luminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Buat hex rgba-style overlay dari hex + alpha (0–1) */
function hexWithAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Lighten hex sedikit untuk efek gradient */
function lightenHex(hex: string, amount = 20): string {
  const clamp = (n: number) => Math.min(255, n + amount);
  const r = clamp(parseInt(hex.slice(1, 3), 16)).toString(16).padStart(2, '0');
  const g = clamp(parseInt(hex.slice(3, 5), 16)).toString(16).padStart(2, '0');
  const b = clamp(parseInt(hex.slice(5, 7), 16)).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

export interface ResolvedThumbnail {
  thumbnailBg: string | undefined;
  imageOpacity: number;
  overlay: string | undefined;
}

/**
 * Otomatis menghitung tampilan thumbnail yang cocok dengan tema.
 * - Jika theme.thumbnailBg sudah diisi manual → pakai itu (override).
 * - Jika tidak → parse color, deteksi gelap/terang, generate otomatis.
 *
 * Untuk membuat tema baru cukup isi `color` saja — tidak perlu
 * menambahkan thumbnailBg/imageOpacity/overlay secara manual.
 */
export function resolveThemeThumbnail(theme: ThemeConfig): ResolvedThumbnail {
  // 1. Manual override → prioritas tertinggi
  if (theme.thumbnailBg) {
    return {
      thumbnailBg: theme.thumbnailBg,
      imageOpacity: theme.imageOpacity ?? 15,
      overlay: theme.overlay,
    };
  }

  // 2. Auto-detect dari color field
  const hex = extractHex(theme.color);

  if (!hex) {
    // Tidak bisa parse warna (misal: gradient Tailwind) → default light
    return { thumbnailBg: undefined, imageOpacity: 20, overlay: undefined };
  }

  const lum = luminance(hex);

  if (lum < 0.08) {
    // ── SANGAT GELAP (lum < 0.08) ──────────────────────────────
    // Contoh: #0D1B14, #0f172a, #3b0918, #181136
    const lighter = lightenHex(hex, 18);
    return {
      thumbnailBg: `linear-gradient(160deg, ${hex} 0%, ${lighter} 100%)`,
      imageOpacity: 10,
      overlay: hexWithAlpha(hex, 0.65),
    };
  }

  if (lum < 0.25) {
    // ── GELAP SEDANG (0.08–0.25) ────────────────────────────────
    // Contoh: #1a1c20, #4b5320
    const lighter = lightenHex(hex, 24);
    return {
      thumbnailBg: `linear-gradient(160deg, ${hex} 0%, ${lighter} 100%)`,
      imageOpacity: 12,
      overlay: hexWithAlpha(hex, 0.55),
    };
  }

  // ── TERANG (lum ≥ 0.25) → default, tidak perlu special treatment ──
  return { thumbnailBg: undefined, imageOpacity: 20, overlay: undefined };
}

export const THEMES: ThemeConfig[] = [
  // --- ELEGANT CLASSIC ---
  {
    id: 'elegant',
    name: 'Elegan Klasik',
    color: 'bg-stone-100',
    fontClass: 'font-[family:var(--font-cormorant)] text-3xl',
    category: 'Elegan',
  },
  {
    id: 'elegant-dark',
    name: 'Midnight Elegance',
    color: 'bg-[#1a1c20]',
    textColor: 'text-stone-100',
    accentColor: 'text-stone-300',
    fontClass: 'font-[family:var(--font-cormorant)] text-3xl',
    dividerColor: 'bg-stone-700',
    category: 'Elegan',
    thumbnailBg: 'linear-gradient(160deg, #1a1c20 0%, #2a2d33 100%)',
    imageOpacity: 12,
    overlay: 'rgba(20,22,28,0.6)',
  },
  {
    id: 'elegant-champagne',
    name: 'Champagne Spark',
    color: 'bg-[#faf6f0]',
    textColor: 'text-stone-900',
    accentColor: 'text-[#d4af37]', // Gold/Champagne
    fontClass: 'font-[family:var(--font-cormorant)] text-3xl',
    dividerColor: 'bg-[#e8decb]',
    category: 'Elegan',
  },
  
  // --- FLORAL / ROMANTIC ---
  {
    id: 'floral',
    name: 'Bunga Musim Semi',
    color: 'bg-rose-50',
    fontClass: 'font-[family:var(--font-great-vibes)] text-4xl',
    category: 'Floral',
    thumbnailBg: 'radial-gradient(ellipse at 50% 30%, #1A3028 0%, #0D1B14 70%)',
    imageOpacity: 15,
    overlay: 'rgba(13,27,20,0.6)',
    textColor: 'text-[#F0E8D6]',
    accentColor: 'text-[#C9A84C]',
    dividerColor: 'bg-[#C9A84C]',
  },
  {
    id: 'floral-lavender',
    name: 'Lavender Dream',
    color: 'bg-[#f4f0f8]',
    textColor: 'text-[#4a3b52]',
    accentColor: 'text-[#9b7eac]',
    fontClass: 'font-[family:var(--font-great-vibes)] text-4xl',
    dividerColor: 'bg-[#e0d6e8]',
    category: 'Floral',
    thumbnailBg: 'linear-gradient(135deg, #f4f0f8 0%, #e8dcf0 100%)',
    imageOpacity: 25,
    overlay: 'rgba(74,59,82,0.15)',
  },
  {
    id: 'floral-sage',
    name: 'Sage Botanical',
    color: 'bg-[#f0f3eb]',
    textColor: 'text-[#2a3826]',
    accentColor: 'text-[#7e906b]',
    fontClass: 'font-[family:var(--font-great-vibes)] text-4xl',
    dividerColor: 'bg-[#d2dcc6]',
    category: 'Floral',
    thumbnailBg: 'linear-gradient(160deg, #f0f3eb 0%, #d8e4cc 100%)',
    imageOpacity: 20,
    overlay: 'rgba(42,56,38,0.12)',
  },

  // --- MODERN / SANS-SERIF ---
  {
    id: 'modern',
    name: 'Modern Minimalis',
    color: 'bg-slate-100',
    fontClass: 'font-[family:var(--font-montserrat)] text-xl font-bold uppercase tracking-[0.2em]',
    category: 'Modern',
  },
  {
    id: 'modern-monochrome',
    name: 'Monochrome Bold',
    color: 'bg-white',
    textColor: 'text-black',
    accentColor: 'text-stone-500',
    fontClass: 'font-[family:var(--font-montserrat)] text-2xl font-black uppercase tracking-widest',
    dividerColor: 'bg-black',
    category: 'Modern',
  },
  {
    id: 'modern-navy',
    name: 'Navy Geometric',
    color: 'bg-[#0f172a]',
    textColor: 'text-slate-100',
    accentColor: 'text-blue-400',
    fontClass: 'font-[family:var(--font-montserrat)] text-xl font-semibold uppercase tracking-widest',
    dividerColor: 'bg-[#334155]',
    category: 'Modern',
    thumbnailBg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    imageOpacity: 12,
    overlay: 'rgba(15,23,42,0.65)',
  },

  // --- RUSTIC / VINTAGE ---
  {
    id: 'rustic',
    name: 'Rustic Alam',
    color: 'bg-amber-50',
    fontClass: 'font-[family:var(--font-lora)] text-3xl',
    category: 'Rustic',
  },
  {
    id: 'rustic-terracotta',
    name: 'Terracotta Sunset',
    color: 'bg-[#fff6f0]',
    textColor: 'text-[#5c2e1f]',
    accentColor: 'text-[#d67a58]',
    fontClass: 'font-[family:var(--font-lora)] text-3xl font-medium',
    dividerColor: 'bg-[#f0d4c6]',
    category: 'Rustic',
  },
  {
    id: 'vintage',
    name: 'Vintage Romance',
    color: 'bg-[#f4ebd0]',
    textColor: 'text-stone-800',
    accentColor: 'text-[#8b5a2b]',
    fontClass: 'font-serif text-3xl',
    dividerColor: 'bg-[#d2b48c]',
    category: 'Rustic',
  },

  // --- LUXURY / MEGAH ---
  {
    id: 'vogue',
    name: 'Vogue Editorial',
    color: 'bg-stone-100',
    textColor: 'text-stone-900',
    accentColor: 'text-stone-500',
    fontClass: 'font-[family:var(--font-cormorant)] text-3xl',
    dividerColor: 'bg-black',
    category: 'Luxury (Premium)',
    thumbnailBg: 'linear-gradient(160deg, #f5f5f4 0%, #e7e5e4 100%)',
    imageOpacity: 18,
    overlay: 'rgba(28,25,23,0.08)',
  },
  {
    id: 'luxury',
    name: 'Royal Premiere',
    color: 'bg-stone-900 border-amber-900/50',
    textColor: 'text-amber-50',
    accentColor: 'text-amber-500',
    fontClass: 'font-[family:var(--font-cinzel)] text-2xl',
    dividerColor: 'bg-amber-900/50',
    category: 'Luxury',
    thumbnailBg: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)',
    imageOpacity: 10,
    overlay: 'rgba(28,25,23,0.7)',
  },
  {
    id: 'luxury-ruby',
    name: 'Ruby Majestic',
    color: 'bg-[#3b0918]',
    textColor: 'text-rose-50',
    accentColor: 'text-rose-300',
    fontClass: 'font-[family:var(--font-cinzel)] text-3xl',
    dividerColor: 'bg-[#7a1b38]',
    category: 'Luxury',
    thumbnailBg: 'linear-gradient(135deg, #3b0918 0%, #5c1228 100%)',
    imageOpacity: 10,
    overlay: 'rgba(59,9,24,0.65)',
  },
  {
    id: 'luxury-emerald',
    name: 'Emerald Royale',
    color: 'bg-[#06211c]',
    textColor: 'text-[#e0f2fe]',
    accentColor: 'text-[#34d399]',
    fontClass: 'font-[family:var(--font-cinzel)] text-3xl',
    dividerColor: 'bg-[#0f766e]',
    category: 'Luxury',
    thumbnailBg: 'linear-gradient(135deg, #06211c 0%, #0a3028 100%)',
    imageOpacity: 10,
    overlay: 'rgba(6,33,28,0.65)',
  },

  // --- UNIQUE / THEMATIC ---
  {
    id: 'army',
    name: 'Militer Tentara',
    color: 'bg-[#4b5320] text-amber-100',
    textColor: 'text-amber-100',
    accentColor: 'text-amber-400',
    fontClass: 'font-[family:var(--font-montserrat)] font-bold uppercase tracking-widest',
    dividerColor: 'bg-amber-800',
    category: 'Tematik',
    thumbnailBg: 'linear-gradient(160deg, #3a4118 0%, #4b5320 100%)',
    imageOpacity: 12,
    overlay: 'rgba(40,46,15,0.65)',
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    color: 'bg-blue-50',
    textColor: 'text-blue-900',
    accentColor: 'text-blue-500',
    fontClass: 'font-[family:var(--font-cormorant)] text-3xl',
    dividerColor: 'bg-blue-200',
    category: 'Tematik',
  },
  {
    id: 'starlight',
    name: 'Magical Starlight',
    color: 'bg-[#181136]', // Dark purple/blue
    textColor: 'text-indigo-50',
    accentColor: 'text-violet-300',
    fontClass: 'font-[family:var(--font-great-vibes)] text-4xl',
    dividerColor: 'bg-[#4338ca]',
    category: 'Tematik',
    thumbnailBg: 'radial-gradient(ellipse at 40% 30%, #2d1f6e 0%, #181136 70%)',
    imageOpacity: 10,
    overlay: 'rgba(24,17,54,0.7)',
  },
  {
    id: 'autumn',
    name: 'Autumn Leaves',
    color: 'bg-[#fffbf5]',
    textColor: 'text-[#451f14]',
    accentColor: 'text-[#d97706]', // amber-600
    fontClass: 'font-[family:var(--font-lora)] text-3xl',
    dividerColor: 'bg-[#fcd34d]',
    category: 'Tematik',
  },
  {
    id: 'celestial',
    name: 'Celestial Dawn',
    color: 'bg-gradient-to-br from-indigo-50 to-pink-50',
    textColor: 'text-indigo-900',
    accentColor: 'text-pink-500',
    fontClass: 'font-[family:var(--font-cormorant)] text-3xl',
    dividerColor: 'bg-pink-200',
    category: 'Tematik',
  },
  // --- NUSANTARA ---
  {
    id: 'javanese-classic',
    name: 'Javanese Classic',
    color: 'bg-[#FDF6E3]',
    textColor: 'text-[#2C1810]',
    accentColor: 'text-[#D4A017]',
    fontClass: 'font-[family:var(--font-cinzel)] text-2xl',
    dividerColor: 'bg-[#D4A017]',
    category: 'Nusantara',
  },
  {
    id: 'vintage-classic',
    name: 'Vintage Classic',
    color: 'bg-[#F9F4EC]',
    textColor: 'text-[#2C1E0F]',
    accentColor: 'text-[#C9A96E]',
    fontClass: 'font-[family:var(--font-cormorant)] text-2xl',
    dividerColor: 'bg-[#DDD0B8]',
    category: 'Rustic',
  }
];
