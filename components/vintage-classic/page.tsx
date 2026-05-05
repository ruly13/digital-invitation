'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, MapPin, Youtube, Instagram, Play, Copy, Check, CheckCircle2, Home, User, BookOpen, Volume2, VolumeX, Mail } from 'lucide-react';
import { Cormorant_Garamond, Inter } from 'next/font/google';

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

// --- Corner Bracket Ornament ---
const CornerBrackets = () => (
  <>
    {/* Top Left */}
    <svg className="absolute top-6 left-6 w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 48V0H48" stroke="#C9A96E" strokeWidth="1" />
      <path d="M4 44V4H44" stroke="#C9A96E" strokeWidth="0.5" />
    </svg>
    {/* Top Right */}
    <svg className="absolute top-6 right-6 w-12 h-12 transform rotate-90" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 48V0H48" stroke="#C9A96E" strokeWidth="1" />
      <path d="M4 44V4H44" stroke="#C9A96E" strokeWidth="0.5" />
    </svg>
    {/* Bottom Right */}
    <svg className="absolute bottom-6 right-6 w-12 h-12 transform rotate-180" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 48V0H48" stroke="#C9A96E" strokeWidth="1" />
      <path d="M4 44V4H44" stroke="#C9A96E" strokeWidth="0.5" />
    </svg>
    {/* Bottom Left */}
    <svg className="absolute bottom-6 left-6 w-12 h-12 transform -rotate-90" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 48V0H48" stroke="#C9A96E" strokeWidth="1" />
      <path d="M4 44V4H44" stroke="#C9A96E" strokeWidth="0.5" />
    </svg>
  </>
);

// --- Section Title ---
const SectionTitle = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center gap-4 mb-10 w-full max-w-sm mx-auto">
    <div className="h-px bg-[#C9A96E] flex-1"></div>
    <h2 className="text-[10px] tracking-[0.2em] uppercase text-[#8B6A3A] font-medium whitespace-nowrap">
      {title}
    </h2>
    <div className="h-px bg-[#C9A96E] flex-1"></div>
  </div>
);

export default function VintageClassicApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const [activeTab, setActiveTab] = useState<'akad' | 'resepsi'>('akad');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // RSVP State
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpAttendance, setRsvpAttendance] = useState('ya');
  const [rsvpCount, setRsvpCount] = useState('1');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Parse URL for guest name
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) setGuestName(to);
  }, []);

  // Countdown logic
  useEffect(() => {
    const targetDate = new Date('2026-09-12T09:00:00').getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance < 0) {
        clearInterval(interval);
        return;
      }
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed', e));
    }
    // smooth scroll to top of main content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(captcha) !== 8) {
      alert("Jawaban perhitungan salah. Silakan coba lagi.");
      return;
    }
    setRsvpSuccess(true);
    setTimeout(() => setRsvpSuccess(false), 3000);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 1. COVER SECTION
  if (!isOpen) {
    return (
      <div className={`min-h-screen bg-[#2C1E0F] flex flex-col items-center justify-center relative overflow-hidden ${inter.className}`}>
        <CornerBrackets />
        
        <div className="absolute top-20 text-center w-full px-6">
          <p className="text-[10px] text-[#C9A96E] uppercase tracking-[0.2em] mb-4">Kepada Yth.</p>
          <p className={`text-[#F5ECD7] text-xl ${cormorant.className} italic`}>{guestName}</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center text-center z-10"
        >
          <p className="text-[10px] text-[#C9A96E] uppercase tracking-[0.2em] mb-8">The Wedding of</p>
          
          <div className="w-16 h-16 rounded-full border border-[#C9A96E] flex items-center justify-center mb-8">
            <span className={`${cormorant.className} text-[#C9A96E] text-2xl`}>C & A</span>
          </div>

          <div className="w-12 h-px bg-[#C9A96E] mb-8"></div>

          <h1 className={`${cormorant.className} text-[#F5ECD7] text-[26px] font-medium leading-tight mb-8`}>
            Clarissa Maharani
            <br/>
            <span className="text-[#C9A96E] text-lg mx-2">&</span>
            <br/>
            Adrian Pratama
          </h1>

          <div className="w-12 h-px bg-[#C9A96E] mb-8"></div>

          <p className="text-[10px] text-[#C9A96E] uppercase tracking-[0.2em] mb-12">12 · 09 · 2026</p>

          <button 
            onClick={handleOpen}
            className={`${cormorant.className} bg-transparent border border-[#C9A96E] text-[#C9A96E] px-6 py-2 text-lg hover:bg-[#C9A96E] hover:text-[#2C1E0F] transition-colors`}
          >
            Buka Undangan
          </button>
        </motion.div>
      </div>
    );
  }

  // MAIN CONTENT
  return (
    <div className={`min-h-screen bg-[#F9F4EC] text-[#2C1E0F] pb-20 ${inter.className}`}>
      
      {/* Background Audio */}
      <audio ref={audioRef} loop>
        <source src="https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tchaikovsky/Romeo_and_Juliet/Tchaikovsky_-_Romeo_and_Juliet.mp3" type="audio/mpeg" />
      </audio>

      {/* 2. OPENING */}
      <section id="opening" className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className={`${cormorant.className} text-2xl text-[#8B6A3A] mb-8 italic`}>Assalamu&apos;alaikum Warahmatullahi Wabarakatuh</h2>
          
          <div className="max-w-md mx-auto mb-8">
            <p className={`${cormorant.className} text-[#2C1E0F] italic text-lg leading-relaxed mb-4`}>
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu 
              isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa 
              tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."
            </p>
            <p className="text-[10px] text-[#C9A96E] uppercase tracking-widest">(QS. Ar-Rum: 21)</p>
          </div>

          <p className="text-sm text-[#8B6A3A] max-w-md mx-auto leading-relaxed">
            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang 
            Bapak/Ibu/Saudara/i untuk hadir pada perayaan pernikahan kami.
          </p>
        </motion.div>
      </section>

      {/* 3. MEMPELAI */}
      <section id="mempelai" className="py-20 px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionTitle title="Mempelai" />
          
          <div className="flex flex-col items-center gap-12 max-w-md mx-auto">
            {/* Bride */}
            <div className="flex flex-col items-center bg-white p-8 rounded-sm shadow-sm border border-[#DDD0B8] w-full relative">
              <div className="w-[80px] h-[100px] bg-[#2C1E0F]/10 rounded-[2px] mb-6 flex items-center justify-center border border-[#C9A96E]/50">
                <span className="text-[#8B6A3A] text-xs italic">Foto</span>
              </div>
              <h3 className={`${cormorant.className} text-[22px] mb-2`}>Clarissa Maharani</h3>
              <p className="text-[11px] text-[#8B6A3A] text-center mb-4">
                Putri dari Bapak [Nama Ayah] & Ibu [Nama Ibu]
              </p>
              <a href="#" className="text-[#C9A96E] hover:text-[#8B6A3A]"><Instagram size={16} /></a>
            </div>

            <div className={`${cormorant.className} text-4xl text-[#C9A96E]`}>&</div>

            {/* Groom */}
            <div className="flex flex-col items-center bg-white p-8 rounded-sm shadow-sm border border-[#DDD0B8] w-full relative">
              <div className="w-[80px] h-[100px] bg-[#2C1E0F]/10 rounded-[2px] mb-6 flex items-center justify-center border border-[#C9A96E]/50">
                <span className="text-[#8B6A3A] text-xs italic">Foto</span>
              </div>
              <h3 className={`${cormorant.className} text-[22px] mb-2`}>Adrian Pratama</h3>
              <p className="text-[11px] text-[#8B6A3A] text-center mb-4">
                Putra dari Bapak [Nama Ayah] & Ibu [Nama Ibu]
              </p>
              <a href="#" className="text-[#C9A96E] hover:text-[#8B6A3A]"><Instagram size={16} /></a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4. COUNTDOWN TIMER */}
      <section className="py-20 px-6 bg-white border-y border-[#DDD0B8]">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <SectionTitle title="Menuju Hari Bahagia" />
          <p className="text-center text-sm text-[#8B6A3A] mb-8">Sabtu, 12 September 2026</p>
          
          <div className="flex justify-center gap-3 max-w-sm mx-auto">
            {[
              { label: 'Hari', value: timeLeft.days },
              { label: 'Jam', value: timeLeft.hours },
              { label: 'Menit', value: timeLeft.minutes },
              { label: 'Detik', value: timeLeft.seconds }
            ].map((time, idx) => (
              <div key={idx} className="bg-[#2C1E0F] rounded-[4px] w-16 h-16 flex flex-col items-center justify-center">
                <span className={`${cormorant.className} text-2xl text-[#C9A96E]`}>{time.value}</span>
                <span className="text-[9px] uppercase tracking-widest text-[#8B6A3A] mt-1">{time.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 5. DETAIL ACARA */}
      <section id="acara" className="py-20 px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionTitle title="Detail Acara" />

          <div className="max-w-md mx-auto">
            {/* Tabs */}
            <div className="flex justify-center border-b border-[#DDD0B8] mb-8">
              <button 
                onClick={() => setActiveTab('akad')}
                className={`pb-3 px-6 text-sm transition-colors relative ${activeTab === 'akad' ? 'text-[#C9A96E]' : 'text-[#8B6A3A]'}`}
              >
                Akad Nikah
                {activeTab === 'akad' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C9A96E]"></div>}
              </button>
              <button 
                onClick={() => setActiveTab('resepsi')}
                className={`pb-3 px-6 text-sm transition-colors relative ${activeTab === 'resepsi' ? 'text-[#C9A96E]' : 'text-[#8B6A3A]'}`}
              >
                Resepsi Pernikahan
                {activeTab === 'resepsi' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C9A96E]"></div>}
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white p-8 border border-[#DDD0B8] text-center shadow-sm">
              <div className="inline-block border border-[#C9A96E] px-3 py-1 mb-6">
                <span className="text-[10px] uppercase tracking-[0.1em] text-[#C9A96E]">
                  {activeTab === 'akad' ? 'Akad Nikah' : 'Resepsi Pernikahan'}
                </span>
              </div>

              <h4 className={`${cormorant.className} text-[17px] text-[#2C1E0F] mb-2`}>Sabtu, 12 September 2026</h4>
              <p className="text-sm text-[#8B6A3A] mb-8">
                {activeTab === 'akad' ? '09:00 WIB' : '18:00 WIB — Selesai'}
              </p>

              <p className="font-semibold text-[15px] text-[#2C1E0F] mb-2">
                {activeTab === 'akad' ? '[Nama Masjid]' : 'The Ritz-Carlton Jakarta, Pacific Place'}
              </p>
              <p className="text-xs text-[#8B6A3A] leading-relaxed mb-8">
                {activeTab === 'akad' 
                  ? '[Alamat lengkap masjid tempat akad berlangsung]' 
                  : 'Sudirman Central Business District (SCBD), Jl. Jend. Sudirman Kav 52-53, Jakarta Selatan'}
              </p>

              <button className="border border-[#C9A96E] text-[#C9A96E] px-6 py-2 text-sm hover:bg-[#C9A96E] hover:text-[#2C1E0F] transition-colors inline-flex items-center gap-2">
                <MapPin size={14} />
                Buka di Maps
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 6. LIVE STREAMING */}
      <section className="py-20 px-6 bg-white border-y border-[#DDD0B8]">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionTitle title="Live Streaming" />
          
          <div className="max-w-md mx-auto text-center">
            <p className="text-sm text-[#8B6A3A] leading-relaxed mb-8">
              Bagi yang tidak dapat hadir, kami mengundang untuk menyaksikan 
              momen sakral kami secara langsung melalui:
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button disabled className="border border-[#E24B4A] text-[#E24B4A] px-6 py-3 text-sm flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                <Youtube size={16} />
                <div className="flex flex-col items-start">
                  <span>YouTube Live</span>
                  <span className="text-[9px]">Segera tersedia</span>
                </div>
              </button>
              <button disabled className="border border-[#7F77DD] text-[#7F77DD] px-6 py-3 text-sm flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                <Instagram size={16} />
                <div className="flex flex-col items-start">
                  <span>Instagram Live</span>
                  <span className="text-[9px]">Segera tersedia</span>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 7. KISAH CINTA */}
      <section className="py-20 px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionTitle title="Kisah Cinta" />

          <div className="max-w-md mx-auto relative pl-6 border-l border-[#C9A96E]/30 space-y-12">
            {[
              {
                date: 'September 2021',
                title: 'Awal Bertemu',
                desc: 'Semesta punya cara tersendiri mempertemukan dua jiwa. Di [tempat/situasi], tanpa rencana dan tanpa dugaan, kami berkenalan. Obrolan pertama yang sederhana — tentang [topik] — pelan-pelan berubah menjadi keberanian untuk saling mengenal lebih jauh.'
              },
              {
                date: '[Bulan Tahun]',
                title: 'Mulai Berpacaran',
                desc: 'Setelah [durasi] saling mengenal, rasa yang selama ini kami jaga dalam diam akhirnya menemukan jalannya. Kami memilih untuk melangkah lebih jauh — bukan sekadar berteman, tapi saling menjaga, saling menguatkan, dan saling memilih setiap harinya.'
              },
              {
                date: '[Bulan Tahun]',
                title: 'Lamaran Resmi',
                desc: 'Di hadapan kedua keluarga yang kami cintai, dengan tawa hangat dan doa yang khusyuk, kami resmi mengikat janji pertunangan. [Nama pria] menyampaikan niat mulianya, cincin disematkan, dan restu pun dipeluk erat. Sebuah langkah kecil yang bermakna besar.'
              },
              {
                date: 'September 2026',
                title: 'Menuju Pernikahan',
                desc: 'Dan kini, dengan penuh rasa syukur atas setiap perjalanan yang telah Allah tuliskan, kami siap menyempurnakan separuh diin. Dari pertemuan yang sederhana, tumbuh cinta yang membawa kami ke momen paling sakral — bersama jiwa yang Allah pilihkan, untuk selamanya.'
              }
            ].map((milestone, i) => (
              <div key={i} className="relative">
                {/* Dot */}
                <div className="absolute -left-[30px] top-1 w-[10px] h-[10px] bg-[#C9A96E] rounded-full border-[2px] border-[#F9F4EC]"></div>
                
                <p className="text-[10px] uppercase tracking-[0.1em] text-[#C9A96E] mb-1">{milestone.date}</p>
                <h4 className={`${cormorant.className} text-[18px] font-medium text-[#2C1E0F] mb-3`}>{milestone.title}</h4>
                <p className="text-[12px] text-[#8B6A3A] italic leading-[1.8]">{milestone.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 8. GALERI FOTO */}
      <section className="py-20 px-6 bg-white border-y border-[#DDD0B8]">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionTitle title="Galeri Momen" />
          <p className="text-center text-sm text-[#8B6A3A] mb-10 italic">Kisah cinta kami dalam bingkai foto</p>

          <div className="max-w-xl mx-auto columns-2 gap-4 space-y-4">
            {[1,2,3,4,5,6].map((img, i) => (
              <div 
                key={i} 
                className={`bg-[#DDD0B8] flex items-center justify-center cursor-pointer border border-[#C9A96E]/50 ${i%2===0 ? 'h-48' : 'h-64'}`}
                onClick={() => setLightboxImg('placeholder')}
              >
                <div className="text-center text-[#8B6A3A]">
                  <span className="text-xs italic block">Foto {img}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxImg(null)}
          >
            <div className="bg-[#DDD0B8] w-full max-w-lg aspect-[3/4] flex items-center justify-center text-[#8B6A3A]">
              Full Foto
            </div>
            <button className="absolute top-6 right-6 text-white text-xl border border-white px-3 py-1">X</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 9. VIDEO SINEMATIK */}
      <section className="py-20 px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionTitle title="Video Sinematik" />
          <p className="text-center text-sm text-[#8B6A3A] mb-10 italic">Kisah indah yang terekam dalam sebuah karya visual</p>

          <div className="max-w-2xl mx-auto aspect-video bg-[#2C1E0F] relative flex items-center justify-center border border-[#C9A96E]/50 group cursor-pointer">
            <div className="w-16 h-16 rounded-full border border-[#C9A96E] flex items-center justify-center text-[#C9A96E] group-hover:bg-[#C9A96E] group-hover:text-[#2C1E0F] transition-colors">
              <Play className="ml-1" fill="currentColor" />
            </div>
            <p className="absolute bottom-4 right-4 text-[10px] text-[#C9A96E] uppercase tracking-widest">[Video Placeholder]</p>
          </div>
        </motion.div>
      </section>

      {/* 10. AMPLOP DIGITAL */}
      <section className="py-20 px-6 bg-white border-y border-[#DDD0B8]">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionTitle title="Amplop Digital" />
          
          <div className="max-w-md mx-auto text-center mb-10">
            <p className="text-sm text-[#8B6A3A] leading-relaxed">
              Doa restu Anda merupakan karunia yang sangat berarti bagi kami. 
              Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat 
              memberi kado secara cashless.
            </p>
          </div>

          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-6 mb-10">
            {/* BCA Card */}
            <div className="flex-1 border border-[#DDD0B8] p-6 text-center bg-[#F9F4EC]">
              <p className="font-semibold text-[#2C1E0F] mb-4">BCA</p>
              <p className="text-xl tracking-widest text-[#2C1E0F] mb-1">0123 4567 89</p>
              <p className="text-xs text-[#8B6A3A] mb-6">Adrian Pratama</p>
              <button 
                onClick={() => copyToClipboard('0123456789', 'bca')}
                className="text-[10px] uppercase tracking-widest border border-[#C9A96E] text-[#C9A96E] px-4 py-2 hover:bg-[#C9A96E] hover:text-white transition-colors w-full flex justify-center items-center gap-2"
              >
                {copiedText === 'bca' ? <><Check size={12}/> Tersalin!</> : <><Copy size={12}/> Salin No. Rek</>}
              </button>
            </div>

            {/* GoPay Card */}
            <div className="flex-1 border border-[#DDD0B8] p-6 text-center bg-[#F9F4EC]">
              <p className="font-semibold text-[#2C1E0F] mb-4">GoPay</p>
              <p className="text-xl tracking-widest text-[#2C1E0F] mb-1">0812 3456 7890</p>
              <p className="text-xs text-[#8B6A3A] mb-6">Clarissa Maharani</p>
              <button 
                onClick={() => copyToClipboard('081234567890', 'gopay')}
                className="text-[10px] uppercase tracking-widest border border-[#C9A96E] text-[#C9A96E] px-4 py-2 hover:bg-[#C9A96E] hover:text-white transition-colors w-full flex justify-center items-center gap-2"
              >
                {copiedText === 'gopay' ? <><Check size={12}/> Tersalin!</> : <><Copy size={12}/> Salin No. HP</>}
              </button>
            </div>
          </div>

          <div className="max-w-md mx-auto border border-[#DDD0B8] p-6 text-center">
            <p className="font-medium text-[#2C1E0F] mb-3">Kirim Kado Secara Fisik</p>
            <p className="text-xs text-[#8B6A3A] leading-relaxed mb-6 italic">
              [Alamat lengkap penerima kado fisik. Jl. Contoh Alamat No. 123, Kelurahan, Kecamatan, Kota, Kode Pos]
            </p>
            <button 
                onClick={() => copyToClipboard('[Alamat]', 'alamat')}
                className="text-[10px] uppercase tracking-widest border border-[#C9A96E] text-[#C9A96E] px-6 py-2 hover:bg-[#C9A96E] hover:text-white transition-colors flex justify-center items-center gap-2 mx-auto"
              >
                {copiedText === 'alamat' ? <><Check size={12}/> Tersalin!</> : <><Copy size={12}/> Salin Alamat</>}
              </button>
          </div>
        </motion.div>
      </section>

      {/* 11. RSVP */}
      <section id="rsvp" className="py-20 px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionTitle title="RSVP" />
          
          <div className="max-w-md mx-auto">
            <p className="text-center text-sm text-[#8B6A3A] leading-relaxed mb-8">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila 
              Bapak/Ibu/Saudara/i berkenan hadir.
            </p>

            <form onSubmit={handleRsvpSubmit} className="space-y-4">
              <input 
                type="text" 
                placeholder="Nama Lengkap" 
                required
                value={rsvpName}
                onChange={e => setRsvpName(e.target.value)}
                className="w-full border border-[#DDD0B8] bg-white p-3 text-sm outline-none focus:border-[#C9A96E]"
              />

              <div className="flex gap-4">
                <label className="flex-1 border border-[#DDD0B8] bg-white p-3 text-sm cursor-pointer flex items-center gap-2">
                  <input type="radio" name="attendance" value="ya" checked={rsvpAttendance === 'ya'} onChange={() => setRsvpAttendance('ya')} className="accent-[#C9A96E]"/>
                  Ya, Saya Hadir
                </label>
                <label className="flex-1 border border-[#DDD0B8] bg-white p-3 text-sm cursor-pointer flex items-center gap-2">
                  <input type="radio" name="attendance" value="tidak" checked={rsvpAttendance === 'tidak'} onChange={() => setRsvpAttendance('tidak')} className="accent-[#C9A96E]"/>
                  Maaf, Tidak Bisa
                </label>
              </div>

              {rsvpAttendance === 'ya' && (
                <select 
                  value={rsvpCount}
                  onChange={e => setRsvpCount(e.target.value)}
                  className="w-full border border-[#DDD0B8] bg-white p-3 text-sm outline-none focus:border-[#C9A96E]"
                >
                  <option value="1">1 Orang</option>
                  <option value="2">2 Orang</option>
                  <option value="3">3 Orang</option>
                  <option value="4">4 Orang</option>
                </select>
              )}

              <textarea 
                placeholder="Pesan & Doa" 
                rows={4}
                required
                value={rsvpMessage}
                onChange={e => setRsvpMessage(e.target.value)}
                className="w-full border border-[#DDD0B8] bg-white p-3 text-sm outline-none focus:border-[#C9A96E] resize-none"
              ></textarea>

              <div className="border border-[#DDD0B8] bg-white p-3 flex items-center justify-between">
                <span className="text-sm text-[#8B6A3A]">Berapa hasil 5 + 3?</span>
                <input 
                  type="number" 
                  required
                  value={captcha}
                  onChange={e => setCaptcha(e.target.value)}
                  className="w-16 border border-[#DDD0B8] p-1 text-center outline-none focus:border-[#C9A96E]"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#2C1E0F] text-[#F9F4EC] py-3 text-sm tracking-widest uppercase hover:bg-[#C9A96E] transition-colors"
              >
                Kirim Konfirmasi
              </button>

              {rsvpSuccess && (
                <div className="bg-green-50 text-green-700 p-3 text-sm flex items-center gap-2 border border-green-200">
                  <CheckCircle2 size={16} />
                  Terima kasih! Konfirmasi kehadiran Anda telah tersimpan.
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </section>

      {/* 12. BUKU TAMU */}
      <section id="tamu" className="py-20 px-6 bg-white border-t border-[#DDD0B8]">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionTitle title="Buku Tamu" />
          <p className="text-center text-sm text-[#8B6A3A] mb-10 italic">Kumpulan doa & pesan hangat dari kerabat</p>

          <div className="max-w-md mx-auto space-y-4">
            {/* Entry 1 */}
            <div className="border border-[#DDD0B8] p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C9A96E] text-white flex items-center justify-center font-serif text-lg shrink-0">
                  A
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-[#2C1E0F]">Anastasya</span>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Hadir</span>
                  </div>
                  <p className="text-[10px] text-[#8B6A3A] mb-2">1 Jam yang lalu</p>
                  <p className="text-sm text-[#8B6A3A] italic leading-relaxed">
                    "Selamat menikah Adrian & Clarissa! Semoga cinta dan kebahagiaan selalu menyertai perjalanan keluarga baru kalian."
                  </p>
                </div>
              </div>
            </div>

            {/* Entry 2 */}
            <div className="border border-[#DDD0B8] p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C9A96E] text-white flex items-center justify-center font-serif text-lg shrink-0">
                  B
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-[#2C1E0F]">Budi Santoso</span>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Hadir</span>
                  </div>
                  <p className="text-[10px] text-[#8B6A3A] mb-2">3 Jam yang lalu</p>
                  <p className="text-sm text-[#8B6A3A] italic leading-relaxed">
                    "Lancar sampai hari H ya, can't wait for the beautiful wedding."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 13. FOOTER */}
      <footer className="bg-[#2C1E0F] py-20 px-6 text-center">
        <div className="w-16 h-16 rounded-full border border-[#C9A96E] flex items-center justify-center mb-8 mx-auto">
          <span className={`${cormorant.className} text-[#C9A96E] text-2xl`}>C & A</span>
        </div>
        
        <h2 className={`${cormorant.className} text-[#F5ECD7] text-[22px] mb-6`}>Clarissa & Adrian</h2>
        
        <div className="w-12 h-px bg-[#C9A96E] mx-auto mb-8"></div>

        <p className="text-sm text-[#8B6A3A] max-w-md mx-auto leading-relaxed mb-12">
          Merupakan kehormatan dan kebahagiaan bagi kami, apabila 
          Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. 
          Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.
        </p>

        <p className="text-[10px] text-[#8B6A3A] tracking-widest uppercase">
          Dibuat dengan ♥ oleh karsaloka
        </p>
      </footer>

      {/* BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#F9F4EC] border-t border-[#C9A96E]/50 flex justify-around items-center py-3 px-2 z-50">
        <button onClick={() => scrollTo('opening')} className="flex flex-col items-center text-[#8B6A3A] hover:text-[#C9A96E]">
          <Home size={20} strokeWidth={1.5} />
        </button>
        <button onClick={() => scrollTo('acara')} className="flex flex-col items-center text-[#8B6A3A] hover:text-[#C9A96E]">
          <MapPin size={20} strokeWidth={1.5} />
        </button>
        <button onClick={() => scrollTo('rsvp')} className="flex flex-col items-center text-[#8B6A3A] hover:text-[#C9A96E]">
          <Mail size={20} strokeWidth={1.5} />
        </button>
        <button onClick={() => scrollTo('tamu')} className="flex flex-col items-center text-[#8B6A3A] hover:text-[#C9A96E]">
          <BookOpen size={20} strokeWidth={1.5} />
        </button>
        <button onClick={toggleAudio} className="flex flex-col items-center text-[#8B6A3A] hover:text-[#C9A96E]">
          {isPlaying ? <Volume2 size={20} strokeWidth={1.5} /> : <VolumeX size={20} strokeWidth={1.5} />}
        </button>
      </div>

    </div>
  );
}
