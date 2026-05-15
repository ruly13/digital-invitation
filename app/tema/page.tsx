'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ArrowLeft, Eye, X, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import PageTransition from '@/components/PageTransition';
import { THEMES } from '@/lib/themes';
import Logo from '@/components/Logo';
import AIChatWidget from '@/components/AIChatWidget';
import WhatsAppButton from '@/components/WhatsAppButton';
import MaintenancePage from "@/app/maintence/maintence";

  const themeVariants = [
    { g: "Adrian", b: "Clarissa", photoId: "1519225421980-715cb0215aed" },
    { g: "Bima", b: "Aulia", photoId: "1511285560929-80b456fea0bc" },
    { g: "Dimas", b: "Sari", photoId: "1519741497674-611481863552" },
    { g: "Eko", b: "Dewi", photoId: "1465495976277-4387d4b0b4c6" },
    { g: "Farhan", b: "Gita", photoId: "1537633552985-df8429e8048b" },
    { g: "Gilang", b: "Hani", photoId: "1583939003579-730e3918a45a" },
    { g: "Hendra", b: "Indah", photoId: "1515934751635-c81c6bc9a2d8" },
    { g: "Irwan", b: "Jihan", photoId: "1510076857158-e4952d423deb" },
    { g: "Kevin", b: "Lala", photoId: "1520854221256-17451e0eb7e3" },
    { g: "Lukas", b: "Maya", photoId: "1469334031218-e382a71b716b" },
    { g: "Mario", b: "Nadia", photoId: "1511795409834-432f7b1728d2" },
    { g: "Nico", b: "Olive", photoId: "1522673607200-164d1f6ce362" },
    { g: "Oscar", b: "Putri", photoId: "1564020426549-fae26ad86576" },
    { g: "Panji", b: "Raisa", photoId: "1581451676678-01140954b9d0" },
    { g: "Rama", b: "Siska", photoId: "1610174092497-6a58a74e1d90" },
    { g: "Sakti", b: "Tiara", photoId: "1475715562772-763d3fd0ebd4" },
    { g: "Yudha", b: "Vania", photoId: "1464366400600-71af9914b434" },
    { g: "Zayn", b: "Anya", photoId: "1500350444315-998bd340156d" },
    { g: "Bayu", b: "Cinta", photoId: "1629734138092-2bb85fdb0e73" },
    { g: "Dika", b: "Elsa", photoId: "1622359487920-a15d2a912bb0" },
  ];

function TemplateCard({ 
  name, 
  color, 
  seed, 
  fontClass = "font-serif text-3xl",
  textColor = "text-stone-900",
  accentColor = "text-rose-500",
  dividerColor = "bg-stone-300",
  groomName = "Romeo",
  brideName = "Juliet",
  photoId = "1511285560929-80b456fea0bc",
  priority = false,
  onPreview
}: { 
  name: string, 
  color: string, 
  seed: string,
  fontClass?: string,
  textColor?: string,
  accentColor?: string,
  dividerColor?: string,
  groomName?: string,
  brideName?: string,
  photoId?: string,
  priority?: boolean,
  onPreview: () => void
}) {
  return (
    <div onClick={onPreview} className="group cursor-pointer block h-full">
      <div className={`aspect-[3/4] rounded-[2rem] ${color} border border-stone-200 mb-6 overflow-hidden relative transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-2xl group-hover:shadow-rose-200/50`}>
        <Image 
          src={`https://images.unsplash.com/photo-${photoId}?q=80&w=400&h=600&auto=format&fit=crop`} 
          alt={`Tema Undangan Digital ${name}`} 
          fill 
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover opacity-20 group-hover:opacity-40 transition-opacity"
          referrerPolicy="no-referrer"
          unoptimized
          priority={priority}
          loading={priority ? undefined : "lazy"}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center drop-shadow-xl z-10">
          <div className={`w-12 h-[1px] ${dividerColor} shadow-sm mb-6`}></div>
          <p className={`text-[10px] uppercase tracking-[0.3em] font-sans ${textColor} opacity-80 mb-4 drop-shadow-sm`}>The Wedding Of</p>
          <h4 className={`${fontClass} font-light mb-2 ${textColor} drop-shadow-md`}>{groomName}</h4>
          <p className={`text-2xl font-serif italic ${accentColor} my-2 drop-shadow-md`}>&</p>
          <h4 className={`${fontClass} font-light mb-6 ${textColor} drop-shadow-md`}>{brideName}</h4>
          <p className={`text-[10px] font-bold tracking-[0.2em] font-sans uppercase ${textColor} opacity-80 drop-shadow-sm`}>12 . 08 . 2026</p>
          <div className={`w-12 h-[1px] ${dividerColor} shadow-sm mt-6`}></div>
        </div>
        
        <div className="absolute inset-0 bg-stone-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end pb-8">
          <button className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-white text-stone-900 px-6 py-2 rounded-full font-bold text-sm shadow-xl flex items-center gap-2">
            <Eye className="w-4 h-4" /> Preview
          </button>
        </div>
      </div>
      <h3 className="text-xl font-serif font-bold text-stone-900 text-center group-hover:text-rose-500 transition-colors">{name}</h3>
    </div>
  );
}

// Komponen aslinya kita simpan dengan nama lain agar tidak hilang
function TemaPageOriginal() {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [previewSeed, setPreviewSeed] = useState<string | null>(null);

  const categories = ['Semua', 'Elegan', 'Floral', 'Modern', 'Rustic', 'Luxury', 'Tematik'];
  const filteredThemes = activeCategory === 'Semua' ? THEMES : THEMES.filter(t => (t as any).category === activeCategory);
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-rose-100 selection:text-rose-900">
        {/* Navigation */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100"
        >
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-7xl mx-auto">
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-rose-100 transition-colors shrink-0">
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 text-stone-600 group-hover:text-rose-500 transition-colors" />
              </div>
              <div className="flex items-center ml-1 sm:ml-2">
                <Logo className="text-lg sm:text-xl" />
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-10 text-sm font-medium text-stone-600">
              <Link href="/#fitur" className="hover:text-rose-600 transition-colors">Fitur</Link>
              <Link href="/#cara-kerja" className="hover:text-rose-600 transition-colors">Cara Kerja</Link>
              <Link href="/#harga" className="hover:text-rose-600 transition-colors">Harga</Link>
              <Link href="/tema" className="text-rose-600 font-bold transition-colors">Tema</Link>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <Link href="/dashboard" className="hidden sm:inline-flex bg-stone-900 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium hover:bg-rose-600 transition-all shadow-sm hover:shadow-md whitespace-nowrap">
                Mulai Buat
              </Link>
            </div>
          </div>
        </motion.nav>

        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-16"
            >
               <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-600 text-sm font-bold tracking-widest uppercase mb-6 mx-auto">
                Eksklusif & Premium
              </div>
              <h1 className="text-5xl md:text-6xl font-serif mb-6 tracking-tight">Koleksi Desain Tema</h1>
              <p className="text-stone-600 text-lg max-w-2xl mx-auto">Tersedia {THEMES.length} pilihan mahakarya estetika digital. Bebas pilih yang paling sesuai dengan kepribadian Anda dan pasangan.</p>
            </motion.div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-12">
              {categories.map((cat, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                    activeCategory === cat 
                      ? 'bg-stone-900 text-white shadow-md' 
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {filteredThemes.map((theme, index) => {
                // Find index base so the photo mapping remains consistent
                const globalIndex = THEMES.findIndex(t => t.id === theme.id);
                const variantIndex = globalIndex % themeVariants.length;
                return (
                  <motion.div 
                    key={theme.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 * ((index % 4) + 1), ease: "easeOut" }}
                  >
                    <TemplateCard 
                      name={theme.name}
                      color={theme.color}
                      seed={theme.id}
                      fontClass={theme.fontClass}
                      textColor={theme.textColor}
                      accentColor={theme.accentColor}
                      dividerColor={theme.dividerColor}
                      groomName={themeVariants[variantIndex].g}
                      brideName={themeVariants[variantIndex].b}
                      photoId={themeVariants[variantIndex].photoId}
                      priority={index < 4}
                      onPreview={() => setPreviewSeed(theme.id)}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <footer className="bg-white border-t border-stone-100 py-10 text-center">
            <p className="text-stone-400 text-sm">
              &copy; {new Date().getFullYear()} karsaloka. Semua tema dilindungi hak cipta.
            </p>
        </footer>

        <WhatsAppButton />
        <AIChatWidget />

        {/* Modal Iframe Preview */}
        <AnimatePresence>
          {previewSeed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-stone-900/80 backdrop-blur-sm"
              onClick={() => setPreviewSeed(null)}
            >
              <div 
                className="bg-white w-full max-w-sm h-full max-h-[850px] rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col border-[8px] border-stone-800"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-white border-b border-stone-800">
                  <div className="font-bold text-sm tracking-widest uppercase">Preview Interaktif</div>
                  <div className="flex gap-2">
                    <Link 
                      href={`/invite/demo?theme=${previewSeed}`} 
                      target="_blank"
                      className="p-1.5 hover:bg-stone-700 rounded-full transition-colors"
                      title="Buka Layar Penuh"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => setPreviewSeed(null)}
                      className="p-1.5 hover:bg-stone-700 rounded-full transition-colors"
                      title="Tutup Preview"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 bg-stone-100 overflow-hidden relative">
                  {/* We add a small key param to force full reload of iframe state per preview */}
                  <iframe 
                    key={previewSeed}
                    src={`/invite/demo?theme=${previewSeed}`} 
                    className="w-full h-full border-none"
                    allowFullScreen
                  />
                </div>
                <div className="p-4 bg-white text-center border-t border-stone-100 flex justify-center">
                  <Link href={`/editor/new?theme=${previewSeed}`} className="w-full bg-rose-500 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-rose-600 transition-colors">
                    Gunakan Tema Ini
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}

// Mengatur status halaman
const isMaintenance = false; // Ganti jadi 'false' jika perbaikan sudah selesai

export default function TemaPage() {
  if (isMaintenance) {
    return (
      <MaintenancePage
        statusItems={[
          { label: "Backup data selesai", status: "done" },
          { label: "Pembaruan sistem berjalan...", status: "active" },
          { label: "Pengujian akhir", status: "pending" },
        ]}
      />
    );
  }

  // Jika isMaintenance = false, halaman asli otomatis ditampilkan kembali
  return <TemaPageOriginal />;
}
