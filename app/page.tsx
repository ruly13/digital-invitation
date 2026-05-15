'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  CalendarHeart, 
  Users, 
  Music, 
  Smartphone, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Camera,
  Share2,
  Clock,
  LayoutTemplate,
  Type,
  ChevronDown,
  Instagram,
  Lock
} from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import AIChatWidget from '@/components/AIChatWidget';
import PageTransition from '@/components/PageTransition';
import { THEMES } from '@/lib/themes';
import Logo from '@/components/Logo';
import { useState, useEffect } from 'react';
import { WHATSAPP_URL } from '@/lib/constants';

export default function Home() {
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined);
  useEffect(() => {
    // Only load 4K video on desktop devices to save mobile bandwidth
    const timer = setTimeout(() => {
      if (window.innerWidth > 768) {
        setVideoSrc("https://videos.pexels.com/video-files/3200057/3200057-uhd_2160_4096_25fps.mp4");
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "karsaloka Digital Invitation",
    "description": "Platform pembuat undangan pernikahan digital elegan dengan RSVP otomatis dan amplop digital.",
    "brand": {
      "@type": "Brand",
      "name": "karsaloka"
    },
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "0",
      "highPrice": "299000",
      "priceCurrency": "IDR",
      "offerCount": "3"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1050"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Sarah & Kevin"
        },
        "datePublished": "2025-08-15",
        "reviewBody": "karsaloka membuat persiapan pernikahan kami jauh lebih ringan. Desainnya sangat berkelas!",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Rina & Budi"
        },
        "datePublished": "2025-09-10",
        "reviewBody": "Fitur RSVP otomatisnya sangat membantu kami mengatur katering dengan presisi. Benar-benar menghemat waktu!",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        }
      }
    ]
  };

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "karsaloka",
    "image": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200",
    "description": "Layanan undangan pernikahan digital premium di Indonesia.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Jakarta",
      "addressRegion": "DKI Jakarta",
      "addressCountry": "ID"
    },
    "url": "https://digital-invitation-rouge.vercel.app"
  };

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

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
      />
      <div className="min-h-screen bg-[#FDFBF7] text-stone-900 selection:bg-rose-100 selection:text-rose-900">
        {/* Navigation */}
        <Navbar />

      {/* Hero Section - Split Layout */}
      <section className="relative pt-24 md:pt-32 pb-12 md:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold tracking-wider mb-6 w-fit shadow-sm"
            >
              <span className="text-amber-500 text-lg leading-none mb-0.5">★★★★★</span>
              <span>4.9/5 DARI 1.000+ PASANGAN</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-5xl sm:text-6xl md:text-8xl font-serif leading-[0.88] text-stone-900 mb-8 tracking-tighter"
            >
              Sampaikan <br />
              <span className="italic text-rose-500">Kabar Bahagia</span> <br />
              Penuh Gaya.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl text-stone-600 mb-10 max-w-lg leading-relaxed"
            >
              Ubah momen sakral Anda menjadi undangan digital yang memukau. Tanpa kertas, tanpa batas, hanya keindahan yang bisa dibagikan dalam satu sentuhan.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link href={WHATSAPP_URL()} target="_blank" className="w-full sm:w-auto bg-stone-900 text-white px-10 py-5 rounded-full text-lg font-medium hover:bg-rose-600 transition-all hover:scale-105 flex items-center justify-center gap-2 group shadow-xl shadow-stone-200">
                Pesan Undangan Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/invite/demo" target="_blank" className="w-full sm:w-auto bg-white text-stone-900 border border-stone-200 px-10 py-5 rounded-full text-lg font-medium hover:bg-stone-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                Lihat Demo Undangan
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="mt-12 flex items-center gap-6"
            >
              <div className="flex -space-x-3">
                {['A', 'R', 'D', 'S'].map((initial, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-xs">
                    {initial}
                  </div>
                ))}
              </div>
              <p className="text-sm text-stone-500 font-medium">
                Dipercaya oleh <span className="text-stone-900 font-bold">1,000+</span> pasangan di seluruh Indonesia
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-stone-100">
              <video 
                src={videoSrc} 
                poster="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop"
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10 text-white">
                <p className="text-xs uppercase tracking-widest mb-2 opacity-80">The Wedding Of</p>
                <h3 className="text-4xl font-serif mb-2">Adrian & Clarissa</h3>
                <p className="text-sm font-light tracking-widest">12 SEPTEMBER 2026</p>
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 flex items-center gap-3 z-10"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-medium">RSVP Terkonfirmasi</p>
                <p className="text-sm font-bold">Budi Santoso Hadir</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 flex items-center gap-3 z-10"
            >
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-medium">Lagu Favorit</p>
                <p className="text-sm font-bold">Perfect - Ed Sheeran</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-white"></div>
          <div className="absolute top-0 left-2/4 w-px h-full bg-white"></div>
          <div className="absolute top-0 left-3/4 w-px h-full bg-white"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 relative z-10">
          <div className="text-center">
            <p className="text-4xl sm:text-5xl font-serif font-bold mb-1">500+</p>
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-stone-400">Undangan Dibuat</p>
          </div>
          <div className="text-center">
            <p className="text-4xl sm:text-5xl font-serif font-bold mb-1">50K+</p>
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-stone-400">Tamu Menerima Undangan</p>
          </div>
          <div className="text-center">
            <p className="text-4xl sm:text-5xl font-serif font-bold mb-1">4.9★</p>
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-stone-400">Rating Pengguna</p>
          </div>
          <div className="text-center">
            <p className="text-4xl sm:text-5xl font-serif font-bold mb-1">100%</p>
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-stone-400">Ramah Lingkungan</p>
          </div>
        </div>
      </section>

      {/* How it Works Section - Brutalist/Creative */}
      <section id="cara-kerja" className="py-16 md:py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif mb-8 leading-[0.9] tracking-tighter">
                Wujudkan Undangan <br />
                <span className="italic text-rose-500">Hanya Dalam 3 Menit.</span>
              </h2>
            </div>
            <p className="text-stone-500 text-lg max-w-sm mb-2 leading-relaxed">
              Kami menyederhanakan proses yang rumit menjadi pengalaman yang menyenangkan. Fokuslah pada hari bahagia Anda, biar kami yang urus undangannya.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            <StepCard 
              number="01"
              title="Pilih Estetika"
              description="Temukan tema yang paling mewakili kepribadian Anda. Dari minimalis modern hingga floral romantis."
              icon={<LayoutTemplate className="w-8 h-8" />}
            />
            <StepCard 
              number="02"
              title="Personalisasi"
              description="Isi detail acara, unggah momen pre-wedding terbaik, dan pilih lagu yang paling bermakna bagi Anda."
              icon={<Type className="w-8 h-8" />}
            />
            <StepCard 
              number="03"
              title="Sebarkan Cinta"
              description="Dapatkan tautan eksklusif dan bagikan ke seluruh orang tersayang melalui WhatsApp dengan satu klik."
              icon={<Share2 className="w-8 h-8" />}
            />
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid Style */}
      <section id="fitur" className="py-16 md:py-32 bg-stone-50 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12 md:mb-24"
          >
            <h2 className="text-5xl md:text-6xl font-serif mb-8 tracking-tight">Fitur yang Memudahkan Segalanya</h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">Lebih dari sekadar undangan, karsaloka adalah asisten pribadi untuk manajemen tamu Anda.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="md:col-span-8 bg-white p-8 sm:p-12 rounded-3xl sm:rounded-[3rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row gap-8 md:gap-12 items-center group"
            >
              <div className="flex-1">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-8 group-hover:scale-110 transition-transform">
                  <CalendarHeart className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold mb-6">RSVP Tanpa Ribet</h3>
                <p className="text-stone-600 text-lg leading-relaxed">
                  Lupakan catatan manual. Pantau siapa yang hadir secara real-time. Tamu Anda bisa mengonfirmasi kehadiran dan memberikan ucapan doa langsung dari ponsel mereka.
                </p>
              </div>
              <div className="w-full md:w-80 aspect-square bg-stone-50 rounded-[2.5rem] overflow-hidden relative border border-stone-100 shadow-inner">
                <Image 
                  src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=600&auto=format&fit=crop" 
                  alt="RSVP Feature" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="md:col-span-4 bg-stone-900 text-white p-8 sm:p-12 rounded-3xl sm:rounded-[3rem] flex flex-col justify-between group"
            >
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-rose-400 mb-8 group-hover:rotate-12 transition-transform">
                <Music className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-6">Harmoni Musik</h3>
                <p className="text-stone-400 text-lg leading-relaxed">
                  Ciptakan suasana yang tepat dengan lagu favorit. Perpustakaan musik kami siap menemani tamu saat membaca undangan Anda.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="md:col-span-4 bg-white p-8 sm:p-12 rounded-3xl sm:rounded-[3rem] border border-stone-100 shadow-sm hover:shadow-lg transition-all group"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-8 group-hover:translate-y-[-4px] transition-transform">
                <Smartphone className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold mb-6">Akses Mobile</h3>
              <p className="text-stone-600 text-lg leading-relaxed">
                Tampilan yang sangat responsif dan ringan. Memastikan setiap tamu mendapatkan pengalaman terbaik, apa pun perangkatnya.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="md:col-span-4 bg-rose-500 text-white p-8 sm:p-12 rounded-3xl sm:rounded-[3rem] flex flex-col justify-between group"
            >
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                <Camera className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-6">Galeri Abadi</h3>
                <p className="text-rose-100 text-lg leading-relaxed">
                  Bagikan keindahan foto pre-wedding Anda dalam resolusi tinggi dengan tampilan galeri yang sangat estetik.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="md:col-span-4 bg-white p-8 sm:p-12 rounded-3xl sm:rounded-[3rem] border border-stone-100 shadow-sm hover:shadow-lg transition-all group"
            >
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-8 group-hover:rotate-[-12deg] transition-transform">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold mb-6">Privasi Total</h3>
              <p className="text-stone-600 text-lg leading-relaxed">
                Keamanan data adalah prioritas kami. Gunakan fitur proteksi password untuk memastikan undangan hanya dilihat oleh orang yang Anda tuju.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Examples Section - Horizontal Scroll/Grid */}
      <section id="contoh" className="py-16 md:py-32 bg-white px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl md:text-6xl font-serif mb-8 tracking-tight">Karya Seni Digital untuk Anda</h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">Setiap tema dirancang dengan penuh cinta dan perhatian pada detail terkecil.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-10 max-w-5xl mx-auto">
            {THEMES.slice(0, 3).map((theme, index) => (
              <motion.div 
                key={theme.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.1 * ((index % 4) + 1), ease: "easeOut" }}
                className="max-w-[280px] sm:max-w-none mx-auto w-full"
              >
                <TemplateCard 
                  name={theme.name}
                  color={theme.color}
                  seed={theme.id}
                  fontClass={theme.fontClass}
                  textColor={theme.textColor}
                  accentColor={theme.accentColor}
                  dividerColor={theme.dividerColor}
                  groomName={themeVariants[index].g}
                  brideName={themeVariants[index].b}
                  photoId={themeVariants[index].photoId}
                  priority={true}
                />
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="text-center mt-24 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href={WHATSAPP_URL()} target="_blank" className="inline-flex items-center justify-center bg-stone-900 text-white px-12 py-5 rounded-full text-lg font-medium hover:bg-rose-600 transition-all shadow-2xl shadow-stone-200 w-full sm:w-auto">
              Pesan Tema Eksklusif Ini
            </Link>
            <Link href="/invite/demo" target="_blank" className="inline-flex items-center justify-center bg-rose-50 border border-rose-200 text-rose-600 px-12 py-5 rounded-full text-lg font-bold hover:bg-rose-100 transition-all shadow-xl shadow-rose-100/50 w-full sm:w-auto">
              Lihat Demo Interaktif
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-32 bg-[#FDFBF7] px-6 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl relative border-[12px] border-white">
                <Image 
                  src="https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?q=80&w=1000&auto=format&fit=crop" 
                  alt="Happy Couple" 
                  fill 
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-10 -right-10 bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-sm border border-stone-100"
              >
                <div className="flex text-amber-400 mb-6">
                  {[1, 2, 3, 4, 5].map(i => <Sparkles key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-stone-700 text-lg italic mb-6 leading-relaxed">&quot;karsaloka membuat persiapan pernikahan kami jauh lebih ringan. Desainnya sangat berkelas!&quot;</p>
                <p className="font-bold text-stone-900 text-xl">— Sarah & Kevin</p>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-5xl md:text-7xl font-serif mb-12 leading-[0.9] tracking-tighter">Cerita Bahagia <br /><span className="text-rose-500 italic">Dari Mereka.</span></h2>
              <div className="space-y-12">
                <TestimonialItem 
                  quote="Fitur RSVP otomatisnya sangat membantu kami mengatur katering dengan presisi. Benar-benar menghemat waktu!"
                  author="Rina & Budi"
                  role="Menikah Sep 2025 · Tema Elegant"
                  initials="RB"
                  color="bg-rose-100 text-rose-600"
                />
                <TestimonialItem 
                  quote="Saya sangat suka betapa mudahnya menyesuaikan font dan warna. Undangan kami terasa sangat personal."
                  author="Maya & Aris"
                  role="Menikah Nov 2025 · Tema Floral"
                  initials="MA"
                  color="bg-violet-100 text-violet-600"
                />
                <TestimonialItem 
                  quote="Pelayanan yang sangat profesional. Tim support-nya sangat membantu saat saya bingung memilih lagu."
                  author="Dina & Reza"
                  role="Menikah Jan 2026 · Tema Rustic"
                  initials="DR"
                  color="bg-amber-100 text-amber-600"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="harga" className="pt-16 md:pt-32 pb-12 md:pb-16 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-24">
            <h2 className="text-5xl md:text-6xl font-serif mb-8 tracking-tight">Investasi untuk Kenangan Indah</h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">Pilih paket yang paling sesuai dengan skala perayaan Anda. Tanpa biaya tersembunyi.</p>
          </div>

          <PricingSection />
          
          <div className="mt-16 pt-10 border-t border-stone-100 max-w-4xl mx-auto text-center">
            <p className="text-stone-500 font-medium mb-6 text-sm uppercase tracking-widest">Metode Pembayaran yang Didukung</p>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 hover:opacity-100">
              <span className="font-black text-xl lg:text-2xl text-stone-900 border-[3px] border-stone-900 px-4 py-1.5 rounded-lg tracking-wider">QRIS</span>
              <span className="font-extrabold text-xl lg:text-2xl text-blue-800 italic px-4 py-1.5 rounded-lg">BCA</span>
              <span className="font-bold text-xl lg:text-2xl text-amber-500 px-4 py-1.5 rounded-lg">Mandiri</span>
              <span className="font-bold text-xl lg:text-2xl text-green-500 px-4 py-1.5 rounded-lg">GoPay</span>
              <span className="font-bold text-xl lg:text-2xl text-purple-600 px-4 py-1.5 rounded-lg italic">OVO</span>
              <span className="font-bold text-xl lg:text-2xl text-orange-500 px-4 py-1.5 rounded-lg">ShopeePay</span>
            </div>
            <p className="text-stone-400 text-xs mt-6">Transaksi terenkripsi aman dan diproses konfirmasi otomatis 24/7</p>
          </div>
        </div>
      </section>

      {/* Trust Badges + FAQ Section */}
      <section className="pt-8 md:pt-12 pb-12 md:pb-20 bg-stone-50 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-12 md:mb-20 pb-10 md:pb-16 border-b border-stone-200">
            {[
              { icon: <Lock className="w-5 h-5" />, label: 'SSL 256-bit', sub: 'Data terenkripsi penuh' },
              { icon: <ShieldCheck className="w-5 h-5" />, label: 'Aman & Terpercaya', sub: 'Dijaga Supabase Auth' },
              { icon: <CheckCircle2 className="w-5 h-5" />, label: 'Tanpa Biaya Tersembunyi', sub: 'Harga transparan' },
              { icon: <Heart className="w-5 h-5" />, label: '500+ Pasangan', sub: 'Sudah mempercayai kami' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-4 text-stone-600 bg-white sm:bg-transparent p-4 sm:p-0 rounded-2xl sm:rounded-none shadow-sm sm:shadow-none border border-stone-100 sm:border-none">
                <div className="w-12 h-12 sm:w-10 sm:h-10 shrink-0 bg-rose-50 sm:bg-white rounded-xl flex items-center justify-center sm:shadow-sm sm:border sm:border-stone-100 text-rose-500">
                  {badge.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-900">{badge.label}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{badge.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif mb-4 tracking-tight">Pertanyaan Umum</h2>
            <p className="text-stone-500">Semua yang perlu Anda ketahui sebelum memulai.</p>
          </div>
          <FAQSection />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-32 px-6">
        <div className="max-w-7xl mx-auto bg-stone-900 rounded-[2.5rem] md:rounded-[4rem] p-8 sm:p-16 md:p-32 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-96 h-96 border border-white rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] border border-white rounded-full"></div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-8xl font-serif text-white mb-10 leading-[0.9] tracking-tighter">
              Waktunya Mengukir <br />
              <span className="italic text-rose-400 text-6xl md:text-9xl">Kisah Anda.</span>
            </h2>
            <p className="text-stone-400 text-xl md:text-2xl mb-16 max-w-2xl mx-auto leading-relaxed">
              Jangan biarkan momen berharga Anda berlalu begitu saja. Buat undangan yang akan dikenang selamanya.
            </p>
            <Link href={WHATSAPP_URL()} target="_blank" className="inline-flex items-center justify-center w-full sm:w-auto bg-rose-500 text-white px-6 sm:px-8 md:px-16 py-4 md:py-6 rounded-full text-base sm:text-xl md:text-2xl font-bold hover:bg-rose-600 transition-all hover:scale-105 shadow-2xl shadow-rose-500/40">
              Konsultasikan Undangan Anda Bersama Kami
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-100 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              <Logo className="text-xl" />
            </div>
            <p className="text-stone-500 text-sm leading-relaxed">
              Platform undangan pernikahan digital terpercaya untuk momen paling berharga dalam hidup Anda.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Tautan Cepat</h4>
            <ul className="space-y-4 text-sm text-stone-500">
              <li><Link href="/about" className="hover:text-rose-500 transition-colors">Tentang Kami</Link></li>
              <li><Link href="#fitur" className="hover:text-rose-500 transition-colors">Fitur</Link></li>
              <li><Link href="#cara-kerja" className="hover:text-rose-500 transition-colors">Cara Kerja</Link></li>
              <li><Link href="#harga" className="hover:text-rose-500 transition-colors">Harga</Link></li>
              <li><Link href="#contoh" className="hover:text-rose-500 transition-colors">Contoh Tema</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Bantuan</h4>
            <ul className="space-y-4 text-sm text-stone-500">
              <li><Link href="/privacy" className="hover:text-rose-500 transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/terms" className="hover:text-rose-500 transition-colors">Syarat & Ketentuan</Link></li>
              <li><a href="/api/contact" target="_blank" rel="noopener noreferrer" className="hover:text-rose-500 transition-colors">Chat Admin</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Ikuti Kami</h4>
            <div className="flex gap-3">
              <a 
                href="https://instagram.com/karsaloka" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-rose-500 hover:text-white transition-all"
                title="Instagram karsaloka"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://tiktok.com/@karsaloka" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-900 hover:text-white transition-all text-xs font-bold"
                title="TikTok karsaloka"
              >
                TT
              </a>
              <a 
                href={WHATSAPP_URL()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-green-500 hover:text-white transition-all text-xs font-bold"
                title="WhatsApp karsaloka"
              >
                WA
              </a>
            </div>
            <p className="text-xs text-stone-400 mt-4">Dapatkan inspirasi undangan terbaru!</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-stone-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-stone-400 text-sm">
            &copy; {new Date().getFullYear()} karsaloka. Hak Cipta Dilindungi.
          </p>
          <p className="text-stone-400 text-sm">
            Dibuat dengan <Heart className="w-3 h-3 inline text-rose-400" /> untuk para pasangan di seluruh Indonesia.
          </p>
        </div>
      </footer>
      <WhatsAppButton />
      <AIChatWidget />
    </div>
    </PageTransition>
  );
}

function StepCard({ number, title, description, icon }: { number: string, title: string, description: string, icon: React.ReactNode }) {
  return (
    <div className="group">
      <div className="flex items-center gap-4 mb-6">
        <span className="text-5xl font-serif font-bold text-stone-200 group-hover:text-rose-200 transition-colors">{number}</span>
        <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-stone-600 leading-relaxed">{description}</p>
    </div>
  );
}

function TestimonialItem({ quote, author, role = 'Pengguna karsaloka', initials, color = 'bg-rose-100 text-rose-600' }: { 
  quote: string, 
  author: string,
  role?: string,
  initials: string,
  color?: string
}) {
  return (
    <div className="flex gap-6 items-start group">
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center font-bold text-sm shrink-0 shadow-sm`}>
        {initials}
      </div>
      <div>
        <p className="text-lg text-stone-700 mb-3 leading-relaxed">&quot;{quote}&quot;</p>
        <div>
          <p className="font-bold text-stone-900">— {author}</p>
          <p className="text-xs text-stone-400 mt-0.5">{role}</p>
        </div>
      </div>
    </div>
  );
}

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
  priority = false
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
  priority?: boolean
}) {
  return (
    <Link href={`/invite/demo?theme=${seed}`} target="_blank" className="group cursor-pointer block">
      <div className={`aspect-[3/4] rounded-[2rem] ${color} border border-stone-200 mb-6 overflow-hidden relative transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-2xl group-hover:shadow-rose-200/50`}>
        <Image 
          src={`https://images.unsplash.com/photo-${photoId}?q=80&w=400&h=600&auto=format&fit=crop`} 
          alt={name} 
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
        
        <div className="absolute inset-0 bg-stone-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <h3 className="text-xl font-serif font-bold text-stone-900 text-center group-hover:text-rose-500 transition-colors">{name}</h3>
    </Link>
  );
}

function PricingCard({ 
  title, 
  price, 
  originalPrice,
  description, 
  features, 
  buttonText, 
  buttonLink, 
  isPopular = false 
}: { 
  title: string, 
  price: string, 
  originalPrice?: string,
  description: string, 
  features: string[], 
  buttonText: string, 
  buttonLink: string,
  isPopular?: boolean
}) {
  return (
    <div className={`relative p-8 md:p-10 rounded-[2.5rem] border ${isPopular ? 'border-rose-500 shadow-xl md:shadow-2xl bg-white z-10' : 'border-stone-100 bg-stone-50'} flex flex-col h-full transition-all duration-300 hover:shadow-xl`}>
      {isPopular && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-rose-500 text-white px-6 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg whitespace-nowrap">
          Penawaran Spesial
        </div>
      )}
      <div className="mb-10 text-center">
        <h3 className="text-2xl font-bold text-stone-900 mb-4">{title}</h3>
        <div className="flex flex-col items-center mb-4">
          {originalPrice && (
            <span className="text-lg text-stone-400 line-through decoration-rose-500/60 decoration-2 mb-1">{originalPrice}</span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-serif font-bold text-stone-900">{price}</span>
            {price !== 'Gratis' && <span className="text-stone-500 font-medium">/acara</span>}
          </div>
        </div>
        <p className="text-stone-600 leading-relaxed">{description}</p>
      </div>
      
      <ul className="space-y-5 mb-10 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-4">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isPopular ? 'bg-rose-100 text-rose-500' : 'bg-stone-200 text-stone-500'}`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-stone-700 text-sm font-medium">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Link 
        href={buttonLink} 
        className={`w-full py-5 rounded-full text-center text-lg font-bold transition-all ${
          isPopular 
            ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-xl shadow-rose-200' 
            : 'bg-stone-900 text-white hover:bg-stone-800'
        }`}
      >
        {buttonText}
      </Link>
    </div>
  );
}

const FAQ_ITEMS = [
  { q: 'Apa yang terjadi dengan undangan saya setelah masa aktif habis?', a: 'Undangan Anda akan otomatis disembunyikan dari publik begitu masa aktifnya berakhir, namun kami tetap menjaga data Anda dengan aman. Anda bisa mengajukan perpanjangan masa aktif kapan saja.' },
  { q: 'Apakah bisa menggunakan domain kustom sendiri?', a: 'Untuk saat ini, undangan tersedia di karsaloka.id/nama-anda. Dukungan custom domain penuh disediakan khusus untuk pilihan paket tertinggi sesuai syarat & ketentuan.' },
  { q: 'Bagaimana cara pembayaran paket berbayar?', a: 'Kami mendukung transfer bank, GoPay, OVO, DANA, dan kartu kredit/debit. Setelah memilih paket, Anda akan diarahkan ke halaman pembayaran aman dan konfirmasi dikirim via email.' },
  { q: 'Apakah ada kebijakan refund?', a: 'Garansi uang kembali 7 hari apabila produk tidak berfungsi sesuai yang dijanjikan. Hubungi tim kami via WhatsApp untuk proses refund dalam 1x24 jam.' },
  { q: 'Berapa jumlah tamu yang bisa melihat undangan?', a: 'Halaman undangan dapat diakses siapa saja yang punya link tanpa batasan pengunjung. Angka di paket adalah kapasitas konfirmasi RSVP.' },
  { q: 'Apakah data tamu dan RSVP saya aman?', a: 'Ya. Data dienkripsi SSL 256-bit dan disimpan di server Supabase tersertifikasi SOC 2. Kami tidak pernah menjual atau membagikan data Anda.' },
  { q: 'Bisa diubah setelah undangan dikirim ke tamu?', a: 'Tentu! Semua konten bisa diedit kapan saja. Perubahan langsung tampil ke tamu tanpa perlu mengirim link baru.' },
  { q: 'Apakah undangan bisa diakses di HP?', a: 'Semua undangan karsaloka dirancang mobile-first. Tamu tidak perlu mengunduh aplikasi apapun.' },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
          <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between px-6 py-5 text-left">
            <span className="font-semibold text-stone-900 pr-4 text-sm sm:text-base">{item.q}</span>
            <ChevronDown className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-rose-500' : ''}`} />
          </button>
          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div key="c" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                <p className="px-6 pb-5 pt-3 text-stone-600 text-sm leading-relaxed border-t border-stone-50">{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

const PRICING_PLANS = [
  {
    id: 'premium',
    title: 'All-in-One Premium',
    originalPrice: 'Rp 200k',
    price: 'Rp 149k',
    description: 'Satu paket lengkap untuk seluruh fitur tanpa batasan.',
    features: [
      "Tamu undangan tanpa batas",
      "Akses bebas semua tema eksklusif",
      "Manajemen RSVP & Buku Tamu",
      "Galeri s/d 20 Foto & Integrasi Video YouTube",
      "Musik latar kustom",
      "Tautan undangan kustom",
      "Masa aktif 6 Bulan (Cukup untuk persiapan & hari H)"
    ],
    buttonText: 'Pesan Sekarang',
    buttonLink: '/dashboard',
    isPopular: true
  }
];

function PricingSection() {
  const plan = PRICING_PLANS[0];
  
  return (
    <div className="max-w-md mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full h-full"
      >
        <PricingCard 
          title={plan.title} 
          price={plan.price} 
          originalPrice={plan.originalPrice}
          description={plan.description} 
          features={plan.features} 
          buttonText={plan.buttonText} 
          buttonLink={plan.buttonLink} 
          isPopular={plan.isPopular} 
        />
      </motion.div>
    </div>
  );
}
