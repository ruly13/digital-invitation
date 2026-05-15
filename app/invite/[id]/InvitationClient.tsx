'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Clock, Heart, Music, Check, X, Copy, Gift, HeartHandshake, MessageSquare, Home, Map, Lock as LockIcon } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import WhatsAppButton from '@/components/WhatsAppButton';
import AIChatWidget from '@/components/AIChatWidget';
import PageTransition from '@/components/PageTransition';
import { getInvitationBase, submitRsvpAction } from './actions';
import { THEMES } from '@/lib/themes';
import VogueTheme from '@/components/themes/Vogue/VogueTheme';
import JavaneseClassicTheme from '@/components/themes/JavaneseClassic/JavaneseClassicTheme';
import VintageClassicTheme from '@/components/vintage-classic/page';
import SpesialFloral from '@/components/themes/floral/specialfloral';


const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-stone-100 animate-pulse flex items-center justify-center text-stone-400 text-xs">Memuat Peta...</div>
});

export default function InvitationClientPage({ id: propId }: { id?: string } = {}) {
  const params = useParams();
  const id = propId || (params.id as string);
  const searchParams = useSearchParams();
  const themeQuery = searchParams.get('theme') || null;

  // effectiveTheme: URL ?theme= takes priority (for editor preview), falls back to DB value
  // This is resolved AFTER dbInviteData loads, so we use a derived value in render
  const selectedTheme = THEMES.find(t => t.id === (themeQuery || 'elegant')) || THEMES[0];
  let mockBgClass = selectedTheme.color;
  let mockFontClass = selectedTheme.fontClass;
  let mockTextClass = selectedTheme.textColor || 'text-stone-800';
  let mockAccentClass = selectedTheme.accentColor || 'text-rose-500';
  let mockCover = 'https://images.unsplash.com/photo-1542042161784-26ab9e041e89?q=80&w=1200&auto=format&fit=crop';

  // Specific cover images for test themes
  const previewTheme = themeQuery || '';
  if (previewTheme.startsWith('floral')) {
    mockCover = 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop';
  } else if (previewTheme === 'modern') {
    mockCover = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop';
  } else if (previewTheme === 'rustic') {
    mockCover = 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop';
  } else if (previewTheme === 'army') {
    mockCover = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop';
  }

  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      // Some browsers block autoplay until user interacts; we already gated
      // behind the "Buka Undangan" click so this should be allowed.
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Audio play was prevented:", err);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);
  const [rsvpStatus, setRsvpStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [rsvpData, setRsvpData] = useState({ name: '', attendance: 'yes', count: '1', message: '' });
  const [captcha, setCaptcha] = useState({ a: 0, b: 0 });
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  useEffect(() => {
    setCaptcha({ a: Math.floor(Math.random() * 8) + 1, b: Math.floor(Math.random() * 8) + 1 });
  }, []);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [dbInviteData, setDbInviteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const fetchInvite = async (pwd?: string) => {
    if (!pwd) setLoading(true); // only show global loading on first fetch
    
    // === DEMO MODE: bypass database completely ===
    if (id === 'demo') {
      setDbInviteData(null);
      setIsBlocked(false);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await getInvitationBase(id as string, pwd);
      setPasswordError('');

      if (data) {
        if (data.requiresPassword && !pwd) {
          setDbInviteData(data); // Will trigger password UI
        } else if (data.requiresPassword) {
          // If we tried with a password and it still requires it, it's incorrect.
          setPasswordError('Kata sandi salah. Silakan coba lagi.');
        } else if (data.payment_status === 'unpaid') {
          setIsBlocked(true);
        } else {
          setDbInviteData(data);
        }
      } else {
        console.warn("No data or error:", error);
      }
    } catch (err) {
      console.error("Error fetching invitation", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInvite(passwordInput);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(id);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  // Mock data for the invitation
  const inviteData = {
    title: 'Pernikahan Adrian & Clarissa',
    groomName: 'Adrian Pratama',
    brideName: 'Clarissa Maharani',
    date: '12 September 2026',
    time: '18:00 WIB - Selesai',
    venue: 'The Ritz-Carlton Jakarta, Pacific Place',
    address: 'Sudirman Central Business District (SCBD), Jl. Jend. Sudirman Kav 52-53, Jakarta Selatan',
    theme: themeQuery,
    customBgClass: mockBgClass,
    customFontClass: mockFontClass,
    customTextClass: mockTextClass,
    customAccentClass: mockAccentClass,
    openingGreeting: 'The Wedding Of',
    openingPrayer: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
    quranicVerse: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir. (QS. Ar-Rum: 21)",
    greeting: 'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir pada perayaan pernikahan kami.',
    videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
    musicUrl: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3',
    coverImage: mockCover,
    groomImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
    brideImage: 'https://images.unsplash.com/photo-1595986630530-969786ad1cb8?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1000&auto=format&fit=crop',
    ],
    enableRSVP: true,
    bankAccounts: [
      { bank: 'BCA', accountName: 'Adrian Pratama', accountNumber: '0123 4567 89' }
    ],
    digitalWallets: [
      { ewallet: 'GoPay', accountName: 'Clarissa Maharani', accountNumber: '0812 3456 7890' }
    ],
    shippingAddress: 'The Haven Residence, Tower A Unit 1205, Jakarta Selatan 12345 (Penerima: Adrian / 081234567890)',
    loveStories: [
      { year: 'September 2021', title: 'Awal Bertemu', story: 'Semesta mempertemukan kami di sebuah proyek kolaborasi di Bali. Obrolan singkat membuahkan pertemanan yang hangat dan kesamaan visi.', imageUrl: '' },
      { year: 'Februari 2024', title: 'Lamaran', story: 'Di bawah langit malam Tokyo, disaksikan rintik salju yang turun pelan, ia berlutut dan menautkan janji untuk melangkah bersama selamanya.', imageUrl: '' },
      { year: 'Agustus 2025', title: 'Sebuah Komitmen', story: 'Dihadapan kedua belah pihak keluarga besar, kami mengikat janji pertunangan untuk secara resmi melangkah ke pelaminan.', imageUrl: '' }
    ],
    enableGuestbook: true,
    guestbookEntries: [
      { id: 1, name: 'Anastasya', attendance: 'yes', message: 'Selamat menikah Adrian & Clarissa! Semoga cinta dan kebahagiaan selalu menyertai perjalanan keluarga baru kalian.', timestamp: '1 Jam yang lalu' },
      { id: 2, name: 'Budi Santoso', attendance: 'yes', message: 'Lancar sampai hari H ya, can\'t wait for the beautiful wedding.', timestamp: '3 Jam yang lalu' }
    ]
  };

  // Use fetched data if available, otherwise use default/mock data
  const finalInviteData: typeof inviteData = dbInviteData?.details ? { 
    ...inviteData, 
    ...dbInviteData.details,
    brideName: dbInviteData.bride_name || dbInviteData.details.brideName || inviteData.brideName,
    groomName: dbInviteData.groom_name || dbInviteData.details.groomName || inviteData.groomName,
    date: dbInviteData.event_date ? new Date(dbInviteData.event_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : (dbInviteData.details.date || inviteData.date),
    venue: dbInviteData.venue_name || dbInviteData.details.venue || inviteData.venue,
    address: dbInviteData.venue_address || dbInviteData.details.address || inviteData.address,
  } as typeof inviteData : inviteData;

  // effectiveTheme: URL ?theme= param takes priority (editor preview mode),
  // otherwise use the theme saved in the database
  const effectiveTheme = themeQuery || finalInviteData.theme || 'elegant';

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsPlaying(true); // Auto-play music when opened
  };

  const submitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpStatus('submitting');
    
    if (parseInt(captchaAnswer) !== captcha.a + captcha.b) {
      alert('Jawaban CAPTCHA salah. Silakan coba lagi.');
      setCaptchaAnswer('');
      setCaptcha({ a: Math.floor(Math.random() * 8) + 1, b: Math.floor(Math.random() * 8) + 1 });
      setRsvpStatus('idle');
      return;
    }
    
    try {
      if (id === 'demo') {
        // Just simulate for demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRsvpStatus('success');
        return;
      }

      const res = await submitRsvpAction({
        invitation_id: dbInviteData?.id,
        name: rsvpData.name,
        status: rsvpData.attendance === 'yes' ? 'Hadir' : 'Tidak Hadir',
        count: parseInt(rsvpData.count) || 1,
        message: rsvpData.message,
        captchaAnswer: captchaAnswer,
        expectedCaptcha: captcha.a + captcha.b
      });

      if (res.error) throw new Error(res.error);
      setRsvpStatus('success');
    } catch (err: any) {
      console.error("Error submitting RSVP:", err);
      alert(err.message || 'Gagal mengirim konfirmasi. Silakan coba lagi.');
      setCaptcha({ a: Math.floor(Math.random() * 8) + 1, b: Math.floor(Math.random() * 8) + 1 });
      setCaptchaAnswer('');
      setRsvpStatus('idle');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-stone-900/10 text-stone-500 font-serif animate-pulse">Memuat undangan...</div>;
  }

  if (isBlocked) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center font-serif text-stone-100 px-6 text-center">
        <Heart className="w-16 h-16 text-rose-500 mb-6 opacity-80" />
        <h1 className="text-3xl md:text-5xl font-light mb-4">Undangan Belum Aktif</h1>
        <p className="text-stone-400 mb-8 max-w-md mx-auto">
          Silakan selesaikan pembayaran dan konfirmasi melalui WhatsApp Admin agar tautan undangan ini dapat dibagikan kepada tamu Anda.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
          <p className="text-stone-500 font-serif italic">Menyiapkan Undangan...</p>
        </div>
      </div>
    );
  }

  if (!inviteData) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 text-center">
        <div>
          <Heart className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h1 className="text-2xl font-serif text-stone-800 mb-2">Undangan Tidak Ditemukan</h1>
          <p className="text-stone-500 max-w-xs mx-auto">Mohon maaf, link undangan yang Anda tuju tidak valid atau telah dihapus.</p>
        </div>
      </div>
    );
  }

  // Password Protection Screen
  if (dbInviteData?.requiresPassword) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center font-serif text-stone-100 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image 
            src={mockCover} 
            alt="Wedding Cover" 
            fill 
            className="object-cover blur-sm"
          />
        </div>
        <div className="relative z-10 max-w-sm w-full bg-stone-800/80 backdrop-blur p-8 rounded-3xl border border-stone-700 shadow-2xl">
          <LockIcon className="w-10 h-10 text-rose-400 mx-auto mb-6" />
          <h1 className="text-2xl font-light mb-2">Undangan Terkunci</h1>
          <p className="text-stone-400 text-sm mb-6">Undangan ini dilindungi kata sandi.</p>
          <form onSubmit={handlePasswordSubmit}>
            <input 
              type="password" 
              value={passwordInput}
              onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(''); }}
              placeholder="Masukkan Kata Sandi"
              className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl mb-4 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 text-center"
              required
            />
            {passwordError && <p className="text-rose-400 text-xs mb-4">{passwordError}</p>}
            <button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-3 rounded-xl transition-colors">
              Buka Undangan
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ===== SPECIAL THEME OVERRIDES =====
  // Uses effectiveTheme (URL param takes priority for editor preview, else DB value)

  // Floral Theme Family (floral, floral-lavender, floral-sage)
  if (effectiveTheme === 'floral' || effectiveTheme === 'floral-lavender' || effectiveTheme === 'floral-sage') {
    // Merge the effective theme into data so SpesialFloral can read it if needed
    const floralData = { ...finalInviteData, theme: effectiveTheme };
    return (
      <PageTransition>
        <SpesialFloral 
          data={floralData} 
          isOpen={isOpen} 
          handleOpen={handleOpen}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          rsvpData={rsvpData}
          setRsvpData={setRsvpData}
          submitRsvp={submitRsvp}
          rsvpStatus={rsvpStatus}
          copiedBank={copiedBank}
          copyToClipboard={copyToClipboard}
        />
        <audio 
          ref={audioRef} 
          src={finalInviteData.musicUrl || 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3'} 
          loop
          preload="auto"
        />
      </PageTransition>
    );
  }

  // Vogue Theme Override
  if (effectiveTheme === 'vogue') {
    return (
      <PageTransition>
        <VogueTheme 
          data={finalInviteData} 
          isOpen={isOpen} 
          handleOpen={handleOpen}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          rsvpData={rsvpData}
          setRsvpData={setRsvpData}
          submitRsvp={submitRsvp}
          rsvpStatus={rsvpStatus}
          copiedBank={copiedBank}
          copyToClipboard={copyToClipboard}
        />
        {finalInviteData.musicUrl && (
          <audio ref={audioRef} src={finalInviteData.musicUrl} loop />
        )}
      </PageTransition>
    );
  }

  // Javanese Classic Theme Override
  if (effectiveTheme === 'javanese-classic') {
    return (
      <PageTransition>
        <JavaneseClassicTheme 
          data={finalInviteData} 
          isOpen={isOpen} 
          handleOpen={handleOpen}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          rsvpData={rsvpData}
          setRsvpData={setRsvpData}
          submitRsvp={submitRsvp}
          rsvpStatus={rsvpStatus}
          copiedBank={copiedBank}
          copyToClipboard={copyToClipboard}
        />
        {finalInviteData.musicUrl && (
          <audio ref={audioRef} src={finalInviteData.musicUrl} loop />
        )}
      </PageTransition>
    );
  }

  // Vintage Classic Theme Override
  if (effectiveTheme === 'vintage-classic') {
    return (
      <PageTransition>
        <VintageClassicTheme 
          data={finalInviteData} 
          isOpen={isOpen} 
          handleOpen={handleOpen}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          rsvpData={rsvpData}
          setRsvpData={setRsvpData}
          submitRsvp={submitRsvp}
          rsvpStatus={rsvpStatus}
          copiedBank={copiedBank}
          copyToClipboard={copyToClipboard}
        />
      </PageTransition>
    );
  }

  // Cover Screen
  if (!isOpen) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center relative overflow-hidden font-serif text-stone-100">
          <div className="absolute inset-0 z-0 opacity-40">
          <Image 
            src={finalInviteData.coverImage || 'https://images.unsplash.com/photo-1542042161784-26ab9e041e89?q=80&w=1200'} 
            alt="Wedding Cover" 
            fill 
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-stone-900/60"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="z-10 text-center px-6 max-w-md w-full"
        >
          <p className="text-sm tracking-[0.3em] uppercase mb-8 text-stone-300">{finalInviteData.openingGreeting || 'The Wedding Of'}</p>
          <h1 className="text-5xl md:text-6xl mb-4 font-light">{finalInviteData.brideName}</h1>
          <p className="text-3xl italic text-rose-300 mb-4">&</p>
          <h1 className="text-5xl md:text-6xl mb-12 font-light">{finalInviteData.groomName}</h1>
          
          <div className="mb-12">
            <p className="text-sm text-stone-300 mb-2">Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <p className="text-xl font-medium border-b border-stone-500 pb-2 inline-block px-8">Tamu Undangan</p>
          </div>

          <button 
            onClick={handleOpen}
            className="bg-white text-stone-900 px-8 py-3 rounded-full text-sm font-medium tracking-wider uppercase hover:bg-stone-200 transition-colors flex items-center gap-2 mx-auto"
          >
            <Heart className="w-4 h-4 text-rose-500" />
            Buka Undangan
          </button>
        </motion.div>
      </div>
      </PageTransition>
    );
  }

  const bgCls = finalInviteData.customBgClass || 'bg-[#FDFBF7]';
  const textCls = finalInviteData.customTextClass || 'text-stone-900';
  const fontCls = finalInviteData.customFontClass?.split(' ')[0] || 'font-serif';
  const accentCls = finalInviteData.customAccentClass || 'text-rose-400';

  // Main Invitation Content
  return (
    <PageTransition>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`min-h-screen relative pb-24 ${bgCls} ${textCls} ${fontCls}`}
      >
      {/* Floating Music Button */}
      {finalInviteData.musicUrl && (
        <audio 
           ref={audioRef}
           src={finalInviteData.musicUrl} 
           loop 
        />
      )}
      {/* Music Control is now inside Floating Nav */}

      {/* Hero Section */}
      <section id="home" className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={finalInviteData.coverImage || 'https://images.unsplash.com/photo-1542042161784-26ab9e041e89?q=80&w=1200'} 
            alt="Wedding Hero" 
            fill 
            className="object-cover opacity-30"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FDFBF7]"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="z-10 text-center px-6"
        >
          <p className={`${fontCls} text-lg italic opacity-70 mb-6`}>Pernikahan</p>
          <h1 className={`text-5xl sm:text-6xl md:text-8xl ${fontCls} font-light mb-6 leading-none`}>
            {finalInviteData.brideName} <br/> <span className={`text-3xl sm:text-4xl md:text-6xl ${accentCls} italic`}>&</span> <br/> {finalInviteData.groomName}
          </h1>
          <p className="opacity-60 tracking-[0.2em] font-sans uppercase text-sm mt-8">{finalInviteData.date}</p>
        </motion.div>
      </section>

      {/* Greeting & Couple Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Heart className={`w-8 h-8 ${accentCls} mx-auto mb-8`} />

          {finalInviteData.openingPrayer && (
            <h3 className={`text-2xl ${fontCls} font-medium mb-6`}>{finalInviteData.openingPrayer}</h3>
          )}
          
          {finalInviteData.quranicVerse && (
            <div className="mb-12 max-w-2xl mx-auto">
              <p className={`text-sm md:text-base opacity-75 leading-relaxed ${fontCls} italic mb-4 text-balance`}>
                &quot;{finalInviteData.quranicVerse}&quot;
              </p>
            </div>
          )}

          <p className={`text-lg md:text-xl opacity-80 leading-relaxed max-w-2xl mx-auto mb-20 ${fontCls}`}>
            {finalInviteData.greeting}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 md:gap-24">
            <div className="flex flex-col items-center">
              <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full overflow-hidden mb-6 border-4 border-white shadow-xl relative">
                <Image src={finalInviteData.brideImage} alt="Bride" fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mb-2">{finalInviteData.brideName}</h2>
              <p className="text-stone-500 text-sm text-center">Putri dari Bapak Fulan & Ibu Fulanah</p>
            </div>

            <div className="text-3xl sm:text-4xl font-serif italic text-rose-300">&</div>

            <div className="flex flex-col items-center">
              <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full overflow-hidden mb-6 border-4 border-white shadow-xl relative">
                <Image src={finalInviteData.groomImage} alt="Groom" fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mb-2">{finalInviteData.groomName}</h2>
              <p className="text-stone-500 text-sm text-center">Putra dari Bapak Fulan & Ibu Fulanah</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Event Details Section */}
      <section id="event" className="py-20 bg-stone-100 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-serif text-stone-900 mb-16">Detail Acara</h2>
            
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-stone-200 max-w-2xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-rose-400"></div>
              
              <h3 className="text-2xl font-serif text-stone-900 mb-8 border-b border-stone-100 pb-6">Resepsi Pernikahan</h3>
              
              <div className="space-y-8 text-left">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-stone-600" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500 uppercase tracking-wider mb-1">Tanggal</p>
                    <p className="text-lg font-medium text-stone-900">{finalInviteData.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-stone-600" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500 uppercase tracking-wider mb-1">Waktu</p>
                    <p className="text-lg font-medium text-stone-900">{finalInviteData.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-stone-600" />
                  </div>
                  <div className="w-full">
                    <p className="text-sm text-stone-500 uppercase tracking-wider mb-1">Lokasi</p>
                    <p className="text-lg font-medium text-stone-900 mb-1">{finalInviteData.venue}</p>
                    <p className="text-stone-600 leading-relaxed">{finalInviteData.address}</p>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(finalInviteData.venue + ' ' + finalInviteData.address)}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-block mt-3 text-sm font-medium text-rose-500 hover:text-rose-600 underline underline-offset-4 transition-colors mb-6"
                    >
                      Buka di Aplikasi Peta
                    </a>
                    
                    {/* Interactive Map */}
                    <div className="w-full h-64 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 relative z-0">
                      <LeafletMap 
                        address={finalInviteData.venue + ' ' + finalInviteData.address} 
                        mapCoordinates={(finalInviteData as any).mapCoordinates}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Love Story Section */}
      {finalInviteData.loveStories && finalInviteData.loveStories.length > 0 && (
      <section className="py-24 bg-[#FDFBF7] px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <HeartHandshake className="w-8 h-8 text-rose-300 mx-auto mb-4" />
            <h2 className="text-4xl font-serif text-stone-900 mb-4">Kisah Cinta</h2>
            <p className="text-stone-500 italic font-serif">Awal mula perjalanan kami</p>
          </motion.div>

          <div className="space-y-12 sm:space-y-16 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-rose-200 before:to-transparent">
            {finalInviteData.loveStories.map((story, idx) => (
              <motion.div 
                key={idx}
                initial={{ 
                  opacity: 0, 
                  x: idx % 2 === 0 ? -50 : 50,
                  scale: 0.9
                }}
                whileInView={{ 
                  opacity: 1, 
                  x: 0,
                  scale: 1 
                }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 1, 
                  delay: idx * 0.2,
                  ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for smoother feel
                }}
                className="relative flex items-start gap-4 md:gap-0 md:items-center md:justify-normal md:odd:flex-row-reverse group"
              >
                {/* Timeline Icon with Pulse Effect */}
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-white bg-rose-100 text-rose-500 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform duration-500 group-hover:scale-125 group-hover:bg-rose-500 group-hover:text-white">
                  <Heart className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                </div>

                {/* Content Card with Hover Lift */}
                <div className="flex-1 md:flex-none md:w-[calc(50%-2.5rem)] bg-white p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-stone-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group-hover:border-rose-200 overflow-hidden">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-4 shadow-sm ${idx % 2 === 0 ? 'bg-rose-500 text-white' : 'bg-stone-900 text-white'}`}>
                    {story.year}
                  </span>

                  {story.imageUrl && (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6 group-hover:shadow-md transition-all duration-500">
                      <Image 
                        src={story.imageUrl} 
                        alt={story.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <h3 className="text-2xl font-serif text-stone-900 mb-3 group-hover:text-rose-600 transition-colors">{story.title}</h3>
                  <div className="w-12 h-0.5 bg-rose-200 mb-4 transition-all duration-500 group-hover:w-24 group-hover:bg-rose-500"></div>
                  <p className="text-stone-600 leading-relaxed text-sm italic font-serif opacity-80 group-hover:opacity-100 transition-opacity">
                    &quot;{story.story}&quot;
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Gallery Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif text-stone-900 mb-4">Galeri Momen</h2>
            <p className="text-stone-500 italic font-serif">Kisah cinta kami dalam bingkai foto</p>
          </motion.div>

          <div className="relative group">
            <div className="flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory scrollbar-hide no-scrollbar scroll-smooth">
              {finalInviteData.gallery.map((img, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="min-w-[280px] md:min-w-[400px] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-xl snap-center relative"
                >
                  <Image 
                    src={img} 
                    alt={`Gallery ${index + 1}`} 
                    fill 
                    className="object-cover hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              ))}
            </div>
            
            {/* Carousel Indicators/Hints */}
            <div className="flex justify-center gap-2 mt-4">
              {finalInviteData.gallery.map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-stone-200" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic Video Section */}
      {finalInviteData.videoUrl && (
        <section className={`py-24 px-6 relative overflow-hidden text-stone-100 ${accentCls.replace('text-', 'bg-') || 'bg-stone-900'}`}>
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
          <div className="absolute inset-0 bg-stone-900/40"></div>
          
          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className={`text-4xl ${fontCls} text-white mb-4`}>Video Sinematik</h2>
              <p className={`text-white/70 italic ${fontCls}`}>Kisah indah yang terekam dalam sebuah karya visual</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10"
            >
              <iframe 
                src={finalInviteData.videoUrl} 
                title="Cinematic Wedding Video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </motion.div>
          </div>
        </section>
      )}

      {/* Amplop Digital Section */}
      <section className="py-24 bg-rose-50 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Gift className="w-8 h-8 text-rose-400 mx-auto mb-4" />
            <h2 className="text-4xl font-serif text-stone-900 mb-4">Amplop Digital</h2>
            <p className="text-stone-600 max-w-2xl mx-auto mb-12">Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {finalInviteData.bankAccounts?.map((bank, index) => (
                <div key={`bank-${index}`} className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Gift className="w-24 h-24" />
                  </div>
                  <p className="text-sm font-bold text-rose-500 uppercase tracking-widest mb-1">{bank.bank}</p>
                  <p className="text-2xl font-mono text-stone-800 tracking-wider mb-2">{bank.accountNumber}</p>
                  <p className="text-sm text-stone-500 mb-6 font-medium">a.n. {bank.accountName}</p>
                  
                  <button 
                    onClick={() => copyToClipboard(bank.accountNumber, `bank-${index}`)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-stone-50 hover:bg-stone-100 text-stone-700 rounded-xl font-medium transition-colors text-sm border border-stone-200"
                  >
                    {copiedBank === `bank-${index}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copiedBank === `bank-${index}` ? 'Berhasil Disalin!' : 'Salin No. Rekening'}
                  </button>
                </div>
              ))}
              
              {finalInviteData.digitalWallets?.map((wallet, index) => (
                <div key={`wallet-${index}`} className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Gift className="w-24 h-24" />
                  </div>
                  <p className="text-sm font-bold text-rose-500 uppercase tracking-widest mb-1">{wallet.ewallet}</p>
                  <p className="text-2xl font-mono text-stone-800 tracking-wider mb-2">{wallet.accountNumber}</p>
                  <p className="text-sm text-stone-500 mb-6 font-medium">a.n. {wallet.accountName}</p>
                  
                  <button 
                    onClick={() => copyToClipboard(wallet.accountNumber, `wallet-${index}`)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-stone-50 hover:bg-stone-100 text-stone-700 rounded-xl font-medium transition-colors text-sm border border-stone-200"
                  >
                    {copiedBank === `wallet-${index}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copiedBank === `wallet-${index}` ? 'Berhasil Disalin!' : 'Salin Nomor'}
                  </button>
                </div>
              ))}
            </div>
            
            {finalInviteData.shippingAddress && (
              <div className="bg-white mt-6 p-6 md:p-8 rounded-2xl shadow-sm border border-rose-100 max-w-3xl mx-auto text-left flex items-start gap-4">
                <MapPin className="w-6 h-6 text-rose-400 shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-2">Kirim Kado Secara Fisik</p>
                  <p className="text-stone-600 leading-relaxed text-sm mb-4">{finalInviteData.shippingAddress}</p>
                  <button 
                    onClick={() => copyToClipboard(inviteData.shippingAddress, 'address')}
                    className="flex items-center gap-2 text-rose-500 hover:text-rose-600 font-medium text-sm transition-colors py-1"
                  >
                    {copiedBank === 'address' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedBank === 'address' ? 'Alamat Tersalin' : 'Salin Alamat Lengkap'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* RSVP Section */}
      {finalInviteData.enableRSVP && (
      <section id="rsvp" className="py-24 px-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-stone-100 text-center"
        >
          <h2 className="text-4xl font-serif text-stone-900 mb-4">RSVP</h2>
          <p className="text-stone-600 mb-10">Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.</p>

          <AnimatePresence mode="wait">
            {rsvpStatus === 'success' ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <Check className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-serif text-stone-900 mb-2">Terima Kasih!</h3>
                <p className="text-stone-600">Konfirmasi kehadiran Anda telah kami terima.</p>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={submitRsvp} 
                className="text-left space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required
                    value={rsvpData.name}
                    onChange={(e) => setRsvpData({...rsvpData, name: e.target.value})}
                    className="w-full px-5 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all"
                    placeholder="Masukkan nama Anda"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Apakah Anda akan hadir?</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${rsvpData.attendance === 'yes' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'}`}>
                      <input type="radio" name="attendance" value="yes" className="hidden" checked={rsvpData.attendance === 'yes'} onChange={() => setRsvpData({...rsvpData, attendance: 'yes'})} />
                      <span className="font-medium">Ya, Saya Hadir</span>
                    </label>
                    <label className={`flex items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${rsvpData.attendance === 'no' ? 'border-stone-500 bg-stone-200 text-stone-800' : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'}`}>
                      <input type="radio" name="attendance" value="no" className="hidden" checked={rsvpData.attendance === 'no'} onChange={() => setRsvpData({...rsvpData, attendance: 'no'})} />
                      <span className="font-medium">Maaf, Tidak Bisa</span>
                    </label>
                  </div>
                </div>

                <AnimatePresence>
                  {rsvpData.attendance === 'yes' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <label className="block text-sm font-medium text-stone-700 mb-2 mt-2">Jumlah Kehadiran</label>
                      <select 
                        value={rsvpData.count}
                        onChange={(e) => setRsvpData({...rsvpData, count: e.target.value})}
                        className="w-full px-5 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all appearance-none"
                      >
                        <option value="1">1 Orang</option>
                        <option value="2">2 Orang</option>
                        <option value="3">3 Orang</option>
                        <option value="4">4 Orang</option>
                      </select>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Pesan & Doa</label>
                  <textarea 
                    rows={4}
                    value={rsvpData.message}
                    onChange={(e) => setRsvpData({...rsvpData, message: e.target.value})}
                    className="w-full px-5 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all resize-none"
                    placeholder="Tuliskan pesan dan doa untuk kedua mempelai..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Keamanan: Berapa hasil {captcha.a} + {captcha.b} ?
                  </label>
                  <input 
                    type="number" 
                    required
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    className="w-full px-5 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all"
                    placeholder="Jawaban"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={rsvpStatus === 'submitting'}
                  className="w-full bg-stone-900 text-white py-4 rounded-xl font-medium hover:bg-stone-800 transition-colors disabled:opacity-70 flex items-center justify-center"
                >
                  {rsvpStatus === 'submitting' ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Kirim Konfirmasi'
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
      )}

      {/* Guestbook Section */}
      {finalInviteData.enableGuestbook && (
      <section id="guestbook" className="py-24 bg-stone-100 px-6 border-t border-stone-200">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <MessageSquare className="w-8 h-8 text-stone-400 mx-auto mb-4" />
            <h2 className="text-4xl font-serif text-stone-900 mb-4">Buku Tamu</h2>
            <p className="text-stone-500 italic font-serif">Kumpulan doa & pesan hangat dari kerabat</p>
          </div>
          
          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-stone-200">
            <div className="max-h-[500px] overflow-y-auto pr-4 space-y-4 scrollbar-thin scrollbar-thumb-stone-200">
              {finalInviteData.guestbookEntries?.map((entry) => (
                <div key={entry.id} className="p-5 border border-stone-100 rounded-2xl bg-stone-50/50 hover:bg-stone-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm uppercase shadow-sm">
                        {entry.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-stone-900 text-sm">{entry.name}</p>
                        <p className="text-[10px] text-stone-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {entry.timestamp}
                        </p>
                      </div>
                    </div>
                    {entry.attendance === 'yes' ? (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><Check className="w-3 h-3" /> Hadir</span>
                    ) : (
                      <span className="px-2.5 py-1 bg-rose-100 text-rose-700 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><X className="w-3 h-3" /> Tidak Hadir</span>
                    )}
                  </div>
                  <p className="text-stone-600 text-sm mt-4 leading-relaxed break-words pl-[52px]">{entry.message}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
      )}

      {/* Footer */}
      <footer className="text-center py-8 border-t border-stone-200">
        <p className="text-stone-500 text-sm font-serif italic mb-2">Terima Kasih</p>
        <p className="text-stone-900 font-serif text-xl">{finalInviteData.brideName} & {finalInviteData.groomName}</p>
        <p className="text-xs text-stone-400 mt-8">Dibuat dengan <Heart className="w-3 h-3 inline text-rose-400" /> oleh karsaloka</p>
      </footer>

      {/* Floating Navigation Menu (Glassmorphism) */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-md pb-safe"
          >
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-full p-2 flex items-center justify-around gap-1 group relative overflow-hidden">
              {/* Highlight background effect */}
              <div className="absolute inset-x-0 h-px top-0 bg-gradient-to-r from-transparent via-rose-300 to-transparent opacity-50"></div>
              
              <button 
                onClick={() => scrollToSection('home')}
                className="flex flex-col items-center justify-center w-12 h-12 rounded-full text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300 group"
                title="Beranda"
              >
                <Home className="w-5 h-5" />
                <span className="text-[8px] font-bold uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Home</span>
              </button>

              <button 
                onClick={() => scrollToSection('event')}
                className="flex flex-col items-center justify-center w-12 h-12 rounded-full text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300 group"
                title="Detail Acara"
              >
                <Map className="w-5 h-5" />
                <span className="text-[8px] font-bold uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Maps</span>
              </button>

              <button 
                onClick={() => scrollToSection('rsvp')}
                className="flex flex-col items-center justify-center w-14 h-14 bg-rose-500 text-white rounded-full shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-all duration-300 transform hover:scale-110 -mt-2 group"
                title="Konfirmasi Kehadiran"
              >
                <HeartHandshake className="w-6 h-6" />
                <span className="text-[8px] font-bold uppercase mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">RSVP</span>
              </button>

              <button 
                onClick={() => scrollToSection('guestbook')}
                className="flex flex-col items-center justify-center w-12 h-12 rounded-full text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300 group"
                title="Buku Tamu"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="text-[8px] font-bold uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Guest</span>
              </button>

              {/* Music Minimalist Control */}
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300 group ${isPlaying ? 'text-rose-500 hover:bg-rose-50' : 'text-stone-300 hover:bg-stone-50'}`}
                title={isPlaying ? "Matikan Musik" : "Putar Musik"}
              >
                {isPlaying ? (
                  <Music className="w-5 h-5 animate-pulse" />
                ) : (
                  <Music className="w-5 h-5 opacity-50" />
                )}
                <span className="text-[8px] font-bold uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Audio</span>
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      <WhatsAppButton />
      <AIChatWidget />
    </motion.div>
    </PageTransition>
  );
}
