'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
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
  Type
} from 'lucide-react';
import Image from 'next/image';
import WhatsAppButton from '@/components/WhatsAppButton';
import AIChatWidget from '@/components/AIChatWidget';
import PageTransition from '@/components/PageTransition';

export default function Home() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FDFBF7] text-stone-900 selection:bg-rose-100 selection:text-rose-900">
        {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100"
      >
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight">EternaInvite</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-medium text-stone-600">
            <Link href="#fitur" className="hover:text-rose-600 transition-colors">Fitur</Link>
            <Link href="#cara-kerja" className="hover:text-rose-600 transition-colors">Cara Kerja</Link>
            <Link href="#harga" className="hover:text-rose-600 transition-colors">Harga</Link>
          </div>
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/login" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors hidden sm:block">Masuk</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/dashboard" className="bg-stone-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-rose-600 transition-all shadow-sm hover:shadow-md">
                Mulai Buat
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Split Layout */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold tracking-wider uppercase mb-6 w-fit"
            >
              <Sparkles className="w-3 h-3" />
              <span>Rayakan Cinta dengan Elegan</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-serif leading-[0.88] text-stone-900 mb-8 tracking-tighter"
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
              <Link href="/dashboard" className="w-full sm:w-auto bg-stone-900 text-white px-10 py-5 rounded-full text-lg font-medium hover:bg-rose-600 transition-all hover:scale-105 flex items-center justify-center gap-2 group shadow-xl shadow-stone-200">
                Mulai Buat Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#contoh" className="w-full sm:w-auto bg-white text-stone-900 border border-stone-200 px-10 py-5 rounded-full text-lg font-medium hover:bg-stone-50 transition-all flex items-center justify-center gap-2">
                Lihat Inspirasi Tema
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="mt-12 flex items-center gap-6"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-stone-200 overflow-hidden">
                    <Image 
                      src={`https://picsum.photos/seed/user${i}/100/100`} 
                      alt="User" 
                      width={40} 
                      height={40} 
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-stone-500 font-medium">
                Dipercaya oleh <span className="text-stone-900 font-bold">5,000+</span> pasangan di seluruh Indonesia
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
              <Image 
                src="https://picsum.photos/seed/wedding-hero/1200/1500" 
                alt="Wedding Invitation Preview" 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
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
      <section className="py-16 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-white"></div>
          <div className="absolute top-0 left-2/4 w-px h-full bg-white"></div>
          <div className="absolute top-0 left-3/4 w-px h-full bg-white"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around gap-12 relative z-10">
          <div className="text-center">
            <p className="text-5xl font-serif font-bold mb-1">15k+</p>
            <p className="text-xs uppercase tracking-widest text-stone-400">Kisah Cinta Terukir</p>
          </div>
          <div className="text-center">
            <p className="text-5xl font-serif font-bold mb-1">1M+</p>
            <p className="text-xs uppercase tracking-widest text-stone-400">Tamu Terkesan</p>
          </div>
          <div className="text-center">
            <p className="text-5xl font-serif font-bold mb-1">4.95</p>
            <p className="text-xs uppercase tracking-widest text-stone-400">Bintang Kepuasan</p>
          </div>
          <div className="text-center">
            <p className="text-5xl font-serif font-bold mb-1">100%</p>
            <p className="text-xs uppercase tracking-widest text-stone-400">Ramah Lingkungan</p>
          </div>
        </div>
      </section>

      {/* How it Works Section - Brutalist/Creative */}
      <section id="cara-kerja" className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-[0.9] tracking-tighter">
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
      <section id="fitur" className="py-32 bg-stone-50 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl md:text-6xl font-serif mb-8 tracking-tight">Fitur yang Memudahkan Segalanya</h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">Lebih dari sekadar undangan, EternaInvite adalah asisten pribadi untuk manajemen tamu Anda.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="md:col-span-8 bg-white p-12 rounded-[3rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row gap-12 items-center group"
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
                  src="https://picsum.photos/seed/rsvp/600/600" 
                  alt="RSVP Feature" 
                  fill 
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
              className="md:col-span-4 bg-stone-900 text-white p-12 rounded-[3rem] flex flex-col justify-between group"
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
              className="md:col-span-4 bg-white p-12 rounded-[3rem] border border-stone-100 shadow-sm hover:shadow-lg transition-all group"
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
              className="md:col-span-4 bg-rose-500 text-white p-12 rounded-[3rem] flex flex-col justify-between group"
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
              className="md:col-span-4 bg-white p-12 rounded-[3rem] border border-stone-100 shadow-sm hover:shadow-lg transition-all group"
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
      <section id="contoh" className="py-32 bg-white px-6 overflow-hidden">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            >
              <TemplateCard name="Elegan Klasik" color="bg-stone-100" seed="elegant" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <TemplateCard name="Bunga Musim Semi" color="bg-rose-50" seed="floral" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <TemplateCard name="Modern Minimalis" color="bg-slate-100" seed="modern" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <TemplateCard name="Rustic Alam" color="bg-amber-50" seed="rustic" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              <TemplateCard name="Militer Tentara" color="bg-[#4b5320]" seed="army" />
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="text-center mt-24"
          >
            <Link href="/dashboard" className="inline-flex items-center justify-center bg-stone-900 text-white px-12 py-5 rounded-full text-lg font-medium hover:bg-rose-600 transition-all shadow-2xl shadow-stone-200">
              Jelajahi 50+ Tema Eksklusif
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-[#FDFBF7] px-6 relative">
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
                  src="https://picsum.photos/seed/happy-couple/1000/1000" 
                  alt="Happy Couple" 
                  fill 
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
                <p className="text-stone-700 text-lg italic mb-6 leading-relaxed">&quot;EternaInvite membuat persiapan pernikahan kami jauh lebih ringan. Desainnya sangat berkelas!&quot;</p>
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
                />
                <TestimonialItem 
                  quote="Saya sangat suka betapa mudahnya menyesuaikan font dan warna. Undangan kami terasa sangat personal."
                  author="Maya & Aris"
                />
                <TestimonialItem 
                  quote="Pelayanan yang sangat profesional. Tim support-nya sangat membantu saat saya bingung memilih lagu."
                  author="Dina & Reza"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="harga" className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-serif mb-8 tracking-tight">Investasi untuk Kenangan Indah</h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">Pilih paket yang paling sesuai dengan skala perayaan Anda. Tanpa biaya tersembunyi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <PricingCard 
              title="Essential" 
              price="Gratis" 
              description="Sempurna untuk perayaan intim dan sederhana."
              features={[
                "Hingga 50 tamu undangan",
                "3 Pilihan tema elegan",
                "Manajemen RSVP standar",
                "Tautan undangan standar",
                "Masa aktif 1 bulan"
              ]}
              buttonText="Mulai Sekarang"
              buttonLink="/dashboard"
            />
            <PricingCard 
              title="Signature" 
              price="Rp 149k" 
              description="Pilihan terpopuler untuk pernikahan yang berkesan."
              isPopular
              features={[
                "Hingga 500 tamu undangan",
                "Akses semua tema premium",
                "Manajemen RSVP & Buku Tamu",
                "Galeri foto (20 foto)",
                "Musik latar kustom",
                "Tautan undangan kustom",
                "Masa aktif 6 bulan"
              ]}
              buttonText="Pilih Paket Ini"
              buttonLink="/dashboard"
            />
            <PricingCard 
              title="Prestige" 
              price="Rp 299k" 
              description="Layanan eksklusif tanpa batas untuk kemewahan total."
              features={[
                "Tamu undangan tak terbatas",
                "Desain tema kustom eksklusif",
                "Manajemen RSVP & QR Code",
                "Galeri foto & video tak terbatas",
                "Kirim via WhatsApp Otomatis",
                "Dukungan prioritas 24/7",
                "Masa aktif selamanya"
              ]}
              buttonText="Pilih Prestige"
              buttonLink="/dashboard"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto bg-stone-900 rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden shadow-2xl">
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
            <Link href="/dashboard" className="inline-flex items-center justify-center bg-rose-500 text-white px-16 py-6 rounded-full text-2xl font-bold hover:bg-rose-600 transition-all hover:scale-105 shadow-2xl shadow-rose-500/40">
              Mulai Buat Undangan — Gratis
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-100 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-serif font-bold tracking-tight">EternaInvite</span>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed">
              Platform undangan pernikahan digital terpercaya untuk momen paling berharga dalam hidup Anda.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Tautan Cepat</h4>
            <ul className="space-y-4 text-sm text-stone-500">
              <li><Link href="#fitur" className="hover:text-rose-500 transition-colors">Fitur</Link></li>
              <li><Link href="#cara-kerja" className="hover:text-rose-500 transition-colors">Cara Kerja</Link></li>
              <li><Link href="#harga" className="hover:text-rose-500 transition-colors">Harga</Link></li>
              <li><Link href="#contoh" className="hover:text-rose-500 transition-colors">Contoh Tema</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Bantuan</h4>
            <ul className="space-y-4 text-sm text-stone-500">
              <li><Link href="#" className="hover:text-rose-500 transition-colors">Pusat Bantuan</Link></li>
              <li><a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="hover:text-rose-500 transition-colors">Chat Admin</a></li>
              <li><Link href="#" className="hover:text-rose-500 transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="#" className="hover:text-rose-500 transition-colors">Syarat & Ketentuan</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Ikuti Kami</h4>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-rose-500 hover:text-white transition-all cursor-pointer">
                <Users className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-rose-500 hover:text-white transition-all cursor-pointer">
                <Music className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-rose-500 hover:text-white transition-all cursor-pointer">
                <Smartphone className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-stone-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-stone-400 text-sm">
            &copy; {new Date().getFullYear()} EternaInvite. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-8 text-stone-400 text-sm">
            <Link href="#" className="hover:text-stone-600">Indonesia</Link>
            <Link href="#" className="hover:text-stone-600">English</Link>
          </div>
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

function TestimonialItem({ quote, author }: { quote: string, author: string }) {
  return (
    <div className="flex gap-6 items-start">
      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 shrink-0">
        <Heart className="w-6 h-6 fill-current" />
      </div>
      <div>
        <p className="text-lg text-stone-700 mb-2 leading-relaxed">&quot;{quote}&quot;</p>
        <p className="font-bold text-stone-900">— {author}</p>
      </div>
    </div>
  );
}

function TemplateCard({ name, color, seed }: { name: string, color: string, seed: string }) {
  return (
    <div className="group cursor-pointer">
      <div className={`aspect-[3/4] rounded-[2rem] ${color} border border-stone-200 mb-6 overflow-hidden relative transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-2xl group-hover:shadow-rose-200/50`}>
        <Image 
          src={`https://picsum.photos/seed/${seed}/600/800`} 
          alt={name} 
          fill 
          className="object-cover opacity-20 group-hover:opacity-40 transition-opacity"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-12 h-[1px] bg-stone-300 mb-6"></div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-4">The Wedding Of</p>
          <h4 className="text-3xl font-serif font-light mb-2 text-stone-900">Romeo</h4>
          <p className="text-2xl italic text-rose-500 my-2">&</p>
          <h4 className="text-3xl font-serif font-light mb-6 text-stone-900">Juliet</h4>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400">12 . 08 . 2026</p>
          <div className="w-12 h-[1px] bg-stone-300 mt-6"></div>
        </div>
        
        <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <h3 className="text-xl font-serif font-bold text-stone-900 text-center group-hover:text-rose-500 transition-colors">{name}</h3>
    </div>
  );
}

function PricingCard({ 
  title, 
  price, 
  description, 
  features, 
  buttonText, 
  buttonLink, 
  isPopular = false 
}: { 
  title: string, 
  price: string, 
  description: string, 
  features: string[], 
  buttonText: string, 
  buttonLink: string,
  isPopular?: boolean
}) {
  return (
    <div className={`relative p-10 rounded-[2.5rem] border ${isPopular ? 'border-rose-500 shadow-2xl bg-white scale-105 z-10' : 'border-stone-100 bg-stone-50'} flex flex-col h-full transition-all duration-300 hover:shadow-xl`}>
      {isPopular && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-rose-500 text-white px-6 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg">
          Paling Populer
        </div>
      )}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-stone-900 mb-4">{title}</h3>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-5xl font-serif font-bold text-stone-900">{price}</span>
          {price !== 'Gratis' && <span className="text-stone-500 font-medium">/acara</span>}
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
