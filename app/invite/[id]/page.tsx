'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Clock, Heart, Music, Check, X } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import WhatsAppButton from '@/components/WhatsAppButton';
import AIChatWidget from '@/components/AIChatWidget';
import PageTransition from '@/components/PageTransition';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-stone-100 animate-pulse flex items-center justify-center text-stone-400 text-xs">Memuat Peta...</div>
});

export default function InvitationView() {
  const params = useParams();
  const id = params.id as string;

  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [rsvpData, setRsvpData] = useState({ name: '', attendance: 'yes', count: '1', message: '' });

  // Mock data for the invitation
  const inviteData = {
    title: 'Pernikahan Rina & Budi',
    groomName: 'Budi Santoso',
    brideName: 'Rina Wijaya',
    date: '12 Agustus 2026',
    time: '09:00 WIB - Selesai',
    venue: 'Gedung Serbaguna Senayan',
    address: 'Jl. Pintu Satu Senayan, Jakarta Pusat',
    theme: 'elegant',
    openingGreeting: 'The Wedding Of',
    greeting: 'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan resepsi pernikahan putra-putri kami.',
    coverImage: 'https://picsum.photos/seed/wedding1/800/1200',
    groomImage: 'https://picsum.photos/seed/groom/400/400',
    brideImage: 'https://picsum.photos/seed/bride/400/400',
    gallery: [
      'https://picsum.photos/seed/gallery1/800/1200',
      'https://picsum.photos/seed/gallery2/800/1200',
      'https://picsum.photos/seed/gallery3/800/1200',
      'https://picsum.photos/seed/gallery4/800/1200',
      'https://picsum.photos/seed/gallery5/800/1200',
    ],
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsPlaying(true); // Auto-play music when opened
  };

  const submitRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setRsvpStatus('success');
    }, 1500);
  };

  // Cover Screen
  if (!isOpen) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center relative overflow-hidden font-serif text-stone-100">
          <div className="absolute inset-0 z-0 opacity-40">
          <Image 
            src={inviteData.coverImage} 
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
          <p className="text-sm tracking-[0.3em] uppercase mb-8 text-stone-300">{inviteData.openingGreeting || 'The Wedding Of'}</p>
          <h1 className="text-5xl md:text-6xl mb-4 font-light">{inviteData.brideName}</h1>
          <p className="text-3xl italic text-rose-300 mb-4">&</p>
          <h1 className="text-5xl md:text-6xl mb-12 font-light">{inviteData.groomName}</h1>
          
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

  // Main Invitation Content
  return (
    <PageTransition>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans relative pb-24"
      >
      {/* Floating Music Button */}
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-stone-600 hover:text-rose-500 transition-colors border border-stone-100"
      >
        <Music className={`w-5 h-5 ${isPlaying ? 'animate-spin-slow' : ''}`} />
      </button>

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={inviteData.coverImage} 
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
          <p className="font-serif text-lg italic text-stone-500 mb-6">Pernikahan</p>
          <h1 className="text-6xl md:text-8xl font-serif font-light text-stone-900 mb-6 leading-none">
            {inviteData.brideName} <br/> <span className="text-4xl md:text-6xl text-rose-400 italic">&</span> <br/> {inviteData.groomName}
          </h1>
          <p className="text-stone-600 tracking-[0.2em] uppercase text-sm mt-8">{inviteData.date}</p>
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
          <Heart className="w-8 h-8 text-rose-300 mx-auto mb-8" />
          <p className="text-lg md:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto mb-20 font-serif italic">
            &quot;{inviteData.greeting}&quot;
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden mb-6 border-4 border-white shadow-xl relative">
                <Image src={inviteData.brideImage} alt="Bride" fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
              <h2 className="text-3xl font-serif text-stone-900 mb-2">{inviteData.brideName}</h2>
              <p className="text-stone-500 text-sm">Putri dari Bapak Fulan & Ibu Fulanah</p>
            </div>

            <div className="text-4xl font-serif italic text-rose-300">&</div>

            <div className="flex flex-col items-center">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden mb-6 border-4 border-white shadow-xl relative">
                <Image src={inviteData.groomImage} alt="Groom" fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
              <h2 className="text-3xl font-serif text-stone-900 mb-2">{inviteData.groomName}</h2>
              <p className="text-stone-500 text-sm">Putra dari Bapak Fulan & Ibu Fulanah</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Event Details Section */}
      <section className="py-20 bg-stone-100 px-6">
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
                    <p className="text-lg font-medium text-stone-900">{inviteData.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-stone-600" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500 uppercase tracking-wider mb-1">Waktu</p>
                    <p className="text-lg font-medium text-stone-900">{inviteData.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-stone-600" />
                  </div>
                  <div className="w-full">
                    <p className="text-sm text-stone-500 uppercase tracking-wider mb-1">Lokasi</p>
                    <p className="text-lg font-medium text-stone-900 mb-1">{inviteData.venue}</p>
                    <p className="text-stone-600 leading-relaxed">{inviteData.address}</p>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(inviteData.venue + ' ' + inviteData.address)}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-block mt-3 text-sm font-medium text-rose-500 hover:text-rose-600 underline underline-offset-4 transition-colors mb-6"
                    >
                      Buka di Aplikasi Peta
                    </a>
                    
                    {/* Interactive Map */}
                    <div className="w-full h-64 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 relative z-0">
                      <LeafletMap address={inviteData.venue + ' ' + inviteData.address} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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
              {inviteData.gallery.map((img, index) => (
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
              {inviteData.gallery.map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-stone-200" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
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

      {/* Footer */}
      <footer className="text-center py-8 border-t border-stone-200">
        <p className="text-stone-500 text-sm font-serif italic mb-2">Terima Kasih</p>
        <p className="text-stone-900 font-serif text-xl">{inviteData.brideName} & {inviteData.groomName}</p>
        <p className="text-xs text-stone-400 mt-8">Dibuat dengan <Heart className="w-3 h-3 inline text-rose-400" /> oleh EternaInvite</p>
      </footer>
      <WhatsAppButton />
      <AIChatWidget />
    </motion.div>
    </PageTransition>
  );
}
