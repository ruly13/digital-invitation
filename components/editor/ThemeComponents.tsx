import React from 'react';
import { Eye, Check } from 'lucide-react';
import Image from 'next/image';

export const THEME_INFO = {
  vintage: {
    name: 'Vintage Classic',
    description: 'Tema elegan dengan sentuhan klasik dan ornamen vintage',
    color: 'stone',
    previewImage: '/themes/vintage.jpg',
    features: ['Ornamen Klasik', 'Tipografi Serif', 'Warna Hangat']
  },
  floral: {
    name: 'Enchanted Garden',
    description: 'Tema premium dengan nuansa taman gelap yang mewah, daun emas, dan glassmorphism',
    color: 'emerald',
    previewImage: '/themes/floral.jpg',
    features: ['Glassmorphism UI', 'Animasi Partikel Emas', 'Mode Gelap Premium']
  },
  minimalist: {
    name: 'Modern Minimalist',
    description: 'Desain bersih, modern, dan fokus pada tipografi (Segera)',
    color: 'gray',
    previewImage: '/themes/minimalist.jpg',
    features: ['Bersih & Rapi', 'Fokus Konten', 'Animasi Halus'],
    disabled: true
  }
};

export const ThemePreview = ({ themeId, isDarkMode }: { themeId: string, isDarkMode: boolean }) => {
  if (themeId === 'vintage') {
    return (
      <div className="w-full h-full bg-[#f9f8f6] relative overflow-hidden flex flex-col items-center justify-center p-4">
        {/* Dekorasi Vintage Sederhana untuk Preview */}
        <div className="absolute top-0 left-0 w-full h-16 bg-[url('/vintage-pattern.png')] opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-[url('/vintage-pattern.png')] opacity-10 rotate-180"></div>
        
        <div className="border border-[#c2b280] p-1 rounded-full w-24 h-24 mb-4 relative">
          <div className="w-full h-full rounded-full overflow-hidden bg-[#e8e4d9] border border-[#c2b280] relative">
            <Image src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400&auto=format&fit=crop" alt="Couple" fill className="object-cover" />
          </div>
        </div>
        
        <p className="font-serif text-[#8b7355] text-xs uppercase tracking-widest mb-1">The Wedding Of</p>
        <h3 className="font-serif text-2xl text-[#4a4238] mb-2 font-medium">Budi & Siti</h3>
        <p className="text-xs text-[#8b7355] border-t border-b border-[#c2b280]/50 py-1 px-4 uppercase tracking-widest">12 . 10 . 2024</p>
      </div>
    );
  }
  
  if (themeId === 'floral') {
    return (
      <div className="w-full h-full bg-[#0a110a] relative overflow-hidden flex flex-col items-center justify-center p-4">
        {/* Dekorasi Floral Sederhana untuk Preview */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#132a13] to-transparent opacity-80"></div>
        <div className="absolute top-2 right-2 w-16 h-16 opacity-30">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0 C70 30 100 50 100 50 C100 50 70 70 50 100 C30 70 0 50 0 50 C0 50 30 30 50 0 Z" fill="#d4af37" />
          </svg>
        </div>
        
        <div className="border border-[#d4af37]/30 p-1 rounded-t-full rounded-b-xl w-24 h-32 mb-4 relative z-10 backdrop-blur-sm bg-white/5 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          <div className="w-full h-full rounded-t-full rounded-b-xl overflow-hidden bg-[#1a2e1a] relative">
            <Image src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400&auto=format&fit=crop" alt="Couple" fill className="object-cover opacity-80" />
            <div className="absolute inset-0 bg-[#0a110a]/20 mix-blend-overlay"></div>
          </div>
        </div>
        
        <p className="font-serif text-[#d4af37] text-xs tracking-widest mb-1 z-10">THE WEDDING OF</p>
        <h3 className="font-serif text-2xl text-white mb-2 font-medium z-10 drop-shadow-md" style={{ fontFamily: "'Playfair Display', serif" }}>Budi & Siti</h3>
        <p className="text-xs text-[#a3b18a] py-1 px-4 uppercase tracking-widest z-10 font-light">12 • 10 • 2024</p>
      </div>
    );
  }
  
  return (
    <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-stone-900' : 'bg-stone-100'}`}>
      <p className="text-sm text-stone-500">Preview tidak tersedia</p>
    </div>
  );
};

export const ThemeCard = ({ 
  id, 
  info, 
  isSelected, 
  onSelect, 
  onPreview, 
  isDarkMode 
}: { 
  id: string, 
  info: any, 
  isSelected: boolean, 
  onSelect: () => void, 
  onPreview: () => void, 
  isDarkMode: boolean 
}) => {
  return (
    <div 
      className={`group relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
        info.disabled ? 'opacity-60 grayscale cursor-not-allowed' : 'cursor-pointer'
      } ${
        isSelected 
          ? `border-${info.color}-500 shadow-lg shadow-${info.color}-500/20` 
          : isDarkMode 
            ? 'border-stone-700 hover:border-stone-500 bg-stone-800' 
            : 'border-stone-200 hover:border-stone-300 bg-white'
      }`}
      onClick={!info.disabled ? onSelect : undefined}
    >
      {isSelected && (
        <div className={`absolute top-3 right-3 z-20 w-6 h-6 bg-${info.color}-500 rounded-full flex items-center justify-center text-white shadow-md`}>
          <Check className="w-4 h-4" />
        </div>
      )}
      
      <div className="aspect-[9/16] relative bg-stone-100 overflow-hidden">
        <ThemePreview themeId={id} isDarkMode={isDarkMode} />
        
        {!info.disabled && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 backdrop-blur-sm">
            <button 
              onClick={(e) => { e.stopPropagation(); onPreview(); }}
              className="px-4 py-2 bg-white text-stone-900 rounded-full font-medium text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
          </div>
        )}
        
        {info.disabled && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-10">
            <span className="px-3 py-1 bg-stone-800 text-stone-300 rounded-full text-xs font-medium border border-stone-600">
              Segera Hadir
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h4 className={`font-medium text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>{info.name}</h4>
        <p className={`text-xs mb-3 line-clamp-2 ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>{info.description}</p>
        
        <div className="flex flex-wrap gap-1">
          {info.features.map((feature: string, i: number) => (
            <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-stone-700 text-stone-300' : 'bg-stone-100 text-stone-600'}`}>
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
