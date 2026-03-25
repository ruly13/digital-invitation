export interface ThemeConfig {
  id: string; // Digunakan sebagai seed gambar gambar dan parameter query 'theme'
  name: string;
  color: string;
  fontClass?: string;
  textColor?: string;
  accentColor?: string;
  dividerColor?: string;
}

export const THEMES: ThemeConfig[] = [
  // --- ELEGANT CLASSIC ---
  {
    id: 'elegant',
    name: 'Elegan Klasik',
    color: 'bg-stone-100',
    fontClass: 'font-[family:var(--font-cormorant)] text-3xl',
  },
  {
    id: 'elegant-dark',
    name: 'Midnight Elegance',
    color: 'bg-[#1a1c20]',
    textColor: 'text-stone-100',
    accentColor: 'text-stone-300',
    fontClass: 'font-[family:var(--font-cormorant)] text-3xl',
    dividerColor: 'bg-stone-700',
  },
  {
    id: 'elegant-champagne',
    name: 'Champagne Spark',
    color: 'bg-[#faf6f0]',
    textColor: 'text-stone-900',
    accentColor: 'text-[#d4af37]', // Gold/Champagne
    fontClass: 'font-[family:var(--font-cormorant)] text-3xl',
    dividerColor: 'bg-[#e8decb]',
  },
  
  // --- FLORAL / ROMANTIC ---
  {
    id: 'floral',
    name: 'Bunga Musim Semi',
    color: 'bg-rose-50',
    fontClass: 'font-[family:var(--font-great-vibes)] text-4xl',
  },
  {
    id: 'floral-lavender',
    name: 'Lavender Dream',
    color: 'bg-[#f4f0f8]',
    textColor: 'text-[#4a3b52]',
    accentColor: 'text-[#9b7eac]',
    fontClass: 'font-[family:var(--font-great-vibes)] text-4xl',
    dividerColor: 'bg-[#e0d6e8]',
  },
  {
    id: 'floral-sage',
    name: 'Sage Botanical',
    color: 'bg-[#f0f3eb]',
    textColor: 'text-[#2a3826]',
    accentColor: 'text-[#7e906b]',
    fontClass: 'font-[family:var(--font-great-vibes)] text-4xl',
    dividerColor: 'bg-[#d2dcc6]',
  },

  // --- MODERN / SANS-SERIF ---
  {
    id: 'modern',
    name: 'Modern Minimalis',
    color: 'bg-slate-100',
    fontClass: 'font-[family:var(--font-montserrat)] text-xl font-bold uppercase tracking-[0.2em]',
  },
  {
    id: 'modern-monochrome',
    name: 'Monochrome Bold',
    color: 'bg-white',
    textColor: 'text-black',
    accentColor: 'text-stone-500',
    fontClass: 'font-[family:var(--font-montserrat)] text-2xl font-black uppercase tracking-widest',
    dividerColor: 'bg-black',
  },
  {
    id: 'modern-navy',
    name: 'Navy Geometric',
    color: 'bg-[#0f172a]',
    textColor: 'text-slate-100',
    accentColor: 'text-blue-400',
    fontClass: 'font-[family:var(--font-montserrat)] text-xl font-semibold uppercase tracking-widest',
    dividerColor: 'bg-[#334155]',
  },

  // --- RUSTIC / VINTAGE ---
  {
    id: 'rustic',
    name: 'Rustic Alam',
    color: 'bg-amber-50',
    fontClass: 'font-[family:var(--font-lora)] text-3xl',
  },
  {
    id: 'rustic-terracotta',
    name: 'Terracotta Sunset',
    color: 'bg-[#fff6f0]',
    textColor: 'text-[#5c2e1f]',
    accentColor: 'text-[#d67a58]',
    fontClass: 'font-[family:var(--font-lora)] text-3xl font-medium',
    dividerColor: 'bg-[#f0d4c6]',
  },
  {
    id: 'vintage',
    name: 'Vintage Romance',
    color: 'bg-[#f4ebd0]',
    textColor: 'text-stone-800',
    accentColor: 'text-[#8b5a2b]',
    fontClass: 'font-serif text-3xl',
    dividerColor: 'bg-[#d2b48c]',
  },

  // --- LUXURY / MEGAH ---
  {
    id: 'luxury',
    name: 'Royal Premiere',
    color: 'bg-stone-900 border-amber-900/50',
    textColor: 'text-amber-50',
    accentColor: 'text-amber-500',
    fontClass: 'font-[family:var(--font-cinzel)] text-2xl',
    dividerColor: 'bg-amber-900/50',
  },
  {
    id: 'luxury-ruby',
    name: 'Ruby Majestic',
    color: 'bg-[#3b0918]',
    textColor: 'text-rose-50',
    accentColor: 'text-rose-300',
    fontClass: 'font-[family:var(--font-cinzel)] text-3xl',
    dividerColor: 'bg-[#7a1b38]',
  },
  {
    id: 'luxury-emerald',
    name: 'Emerald Royale',
    color: 'bg-[#06211c]',
    textColor: 'text-[#e0f2fe]',
    accentColor: 'text-[#34d399]',
    fontClass: 'font-[family:var(--font-cinzel)] text-3xl',
    dividerColor: 'bg-[#0f766e]',
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
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    color: 'bg-blue-50',
    textColor: 'text-blue-900',
    accentColor: 'text-blue-500',
    fontClass: 'font-[family:var(--font-cormorant)] text-3xl',
    dividerColor: 'bg-blue-200',
  },
  {
    id: 'starlight',
    name: 'Magical Starlight',
    color: 'bg-[#181136]', // Dark purple/blue
    textColor: 'text-indigo-50',
    accentColor: 'text-violet-300',
    fontClass: 'font-[family:var(--font-great-vibes)] text-4xl',
    dividerColor: 'bg-[#4338ca]',
  },
  {
    id: 'autumn',
    name: 'Autumn Leaves',
    color: 'bg-[#fffbf5]',
    textColor: 'text-[#451f14]',
    accentColor: 'text-[#d97706]', // amber-600
    fontClass: 'font-[family:var(--font-lora)] text-3xl',
    dividerColor: 'bg-[#fcd34d]',
  },
  {
    id: 'celestial',
    name: 'Celestial Dawn',
    color: 'bg-gradient-to-br from-indigo-50 to-pink-50',
    textColor: 'text-indigo-900',
    accentColor: 'text-pink-500',
    fontClass: 'font-[family:var(--font-cormorant)] text-3xl',
    dividerColor: 'bg-pink-200',
  }
];
