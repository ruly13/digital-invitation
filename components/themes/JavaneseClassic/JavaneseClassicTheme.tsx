'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Music } from 'lucide-react';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { ssr: false });

function KawungOrnament({ className }: { className?: string }) {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" className={className}>
      <g fill="none" stroke="#8B6914" strokeWidth="0.8" opacity="0.35">
        <ellipse cx="40" cy="40" rx="28" ry="18"/>
        <ellipse cx="40" cy="40" rx="18" ry="28"/>
        <ellipse cx="120" cy="40" rx="28" ry="18"/>
        <ellipse cx="120" cy="40" rx="18" ry="28"/>
        <ellipse cx="40" cy="120" rx="28" ry="18"/>
        <ellipse cx="40" cy="120" rx="18" ry="28"/>
        <ellipse cx="120" cy="120" rx="28" ry="18"/>
        <ellipse cx="120" cy="120" rx="18" ry="28"/>
        <ellipse cx="80" cy="80" rx="28" ry="18"/>
        <ellipse cx="80" cy="80" rx="18" ry="28"/>
      </g>
    </svg>
  )
}

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-10">
      <div className="h-px w-24 bg-[#D4A017]"/>
      <svg width="24" height="24" viewBox="0 0 24 24">
        <polygon points="12,2 14,10 22,12 14,14 12,22 10,14 2,12 10,10" 
                 fill="#D4A017" opacity="0.9"/>
      </svg>
      <div className="h-px w-24 bg-[#D4A017]"/>
    </div>
  )
}

export default function JavaneseClassicTheme({ 
  data, 
  isOpen, 
  handleOpen, 
  isPlaying, 
  setIsPlaying, 
  rsvpData, 
  setRsvpData, 
  submitRsvp, 
  rsvpStatus, 
  copiedBank, 
  copyToClipboard 
}: any) {

  // ── COVER ──────────────────────────────────────────────
  if (!isOpen) {
    return (
      <div className="min-h-screen bg-[#FDF6E3] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ornamen kawung di 4 sudut */}
        <KawungOrnament className="absolute top-0 left-0"/>
        <KawungOrnament className="absolute top-0 right-0 rotate-90"/>
        <KawungOrnament className="absolute bottom-0 left-0 -rotate-90"/>
        <KawungOrnament className="absolute bottom-0 right-0 rotate-180"/>

        {/* Label atas */}
        <p className="absolute top-8 text-[10px] uppercase tracking-[0.5em] text-[#8B6914] font-[family:var(--font-cinzel)]">
          Undangan Pernikahan
        </p>

        {/* Foto cover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative w-64 h-80 mb-10 border-2 border-[#D4A017] p-1"
        >
          <div className="relative w-full h-full border border-[#D4A017]/40">
            <Image src={data.coverImage} alt="Cover" fill className="object-cover"/>
          </div>
        </motion.div>

        {/* Nama pengantin */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center"
        >
          <h1 className="font-[family:var(--font-cinzel)] text-5xl md:text-7xl italic font-light text-[#2C1810] tracking-wide">
            {data.brideName}
          </h1>
          <GoldDivider/>
          <h1 className="font-[family:var(--font-cinzel)] text-5xl md:text-7xl italic font-light text-[#2C1810] tracking-wide">
            {data.groomName}
          </h1>
          <p className="mt-8 text-[10px] uppercase tracking-[0.4em] text-[#8B6914] font-[family:var(--font-cinzel)]">
            {data.date}
          </p>
        </motion.div>

        {/* Tombol buka */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={handleOpen}
          className="mt-12 px-12 py-4 bg-[#3D2B1F] text-[#D4A017] font-[family:var(--font-cinzel)] text-xs uppercase tracking-[0.4em] hover:bg-[#2C1810] transition-colors"
        >
          Buka Undangan
        </motion.button>
      </div>
    );
  }

  // ── UNDANGAN TERBUKA ───────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FDF6E3] text-[#2C1810] font-[family:var(--font-cormorant)]">

      {/* Nav */}
      <nav className="fixed top-0 w-full px-6 py-4 z-50 flex justify-between items-center bg-[#FDF6E3]/90 backdrop-blur-sm border-b border-[#D4A017]/30">
        <span className="text-[10px] uppercase tracking-[0.4em] font-[family:var(--font-cinzel)] text-[#8B6914]">Karsaloka</span>
        <button onClick={() => setIsPlaying(!isPlaying)} className="w-9 h-9 border border-[#D4A017] flex items-center justify-center hover:bg-[#D4A017]/10 transition-colors">
          <Music className={`w-4 h-4 text-[#8B6914] ${isPlaying ? 'animate-pulse' : ''}`}/>
        </button>
      </nav>

      {/* Section 1: Couple */}
      <section className="pt-24 pb-20 px-6 text-center relative">
        <KawungOrnament className="absolute top-0 left-0 opacity-50"/>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-xs uppercase tracking-[0.5em] text-[#8B6914] font-[family:var(--font-cinzel)] mb-6">
          {data.openingGreeting}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-3xl mx-auto">
          {/* Bride */}
          <div className="text-center">
            <div className="relative w-40 h-52 mx-auto mb-4 border-2 border-[#D4A017] p-1">
              <Image src={data.brideImage} alt={data.brideName} fill className="object-cover"/>
            </div>
            <h2 className="font-[family:var(--font-cinzel)] text-2xl italic">{data.brideFullName}</h2>
            <p className="text-sm text-[#8B6914] mt-1">{data.brideParents}</p>
          </div>
          {/* Divider & */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-px h-16 bg-[#D4A017] hidden md:block"/>
            <span className="font-[family:var(--font-great-vibes)] text-5xl text-[#D4A017]">&</span>
            <div className="w-px h-16 bg-[#D4A017] hidden md:block"/>
          </div>
          {/* Groom */}
          <div className="text-center">
            <div className="relative w-40 h-52 mx-auto mb-4 border-2 border-[#D4A017] p-1">
              <Image src={data.groomImage} alt={data.groomName} fill className="object-cover"/>
            </div>
            <h2 className="font-[family:var(--font-cinzel)] text-2xl italic">{data.groomFullName}</h2>
            <p className="text-sm text-[#8B6914] mt-1">{data.groomParents}</p>
          </div>
        </motion.div>
        <GoldDivider/>
        <p className="max-w-xl mx-auto text-base leading-loose text-[#3D2B1F]">{data.greeting}</p>
      </section>

      {/* Section 2: Event */}
      <section className="py-24 bg-[#3D2B1F] text-center px-6 relative">
        <KawungOrnament className="absolute top-0 right-0 opacity-20 rotate-180"/>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs uppercase tracking-[0.5em] text-[#D4A017] font-[family:var(--font-cinzel)] mb-8">Waktu & Tempat</p>
          <h3 className="font-[family:var(--font-cinzel)] text-4xl md:text-6xl italic font-light text-[#FDF6E3] mb-4">{data.date}</h3>
          <p className="font-[family:var(--font-cinzel)] text-sm uppercase tracking-widest text-[#D4A017] mb-10">{data.time}</p>
          <div className="max-w-lg mx-auto">
            <h4 className="font-[family:var(--font-cinzel)] text-2xl text-[#FDF6E3] mb-2">{data.venue}</h4>
            <p className="text-sm text-[#D4A017]/70 leading-loose mb-8">{data.address}</p>
            <div className="h-56 w-full overflow-hidden border border-[#D4A017]/30 grayscale">
              <LeafletMap address={data.venue + ' ' + data.address} mapCoordinates={data.mapCoordinates} editable={false}/>
            </div>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.venue + ' ' + data.address)}`}
               target="_blank"
               className="inline-block mt-6 border border-[#D4A017] text-[#D4A017] px-8 py-3 text-xs uppercase tracking-widest font-[family:var(--font-cinzel)] hover:bg-[#D4A017] hover:text-[#3D2B1F] transition-colors">
              Buka Maps
            </a>
          </div>
        </motion.div>
      </section>

      {/* Section 3: Gallery */}
      {data.gallery && data.gallery.length > 0 && (
        <section className="py-24 px-6 bg-[#FDF6E3]">
          <p className="text-xs uppercase tracking-[0.5em] text-[#8B6914] font-[family:var(--font-cinzel)] text-center mb-16">Galeri Foto</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {data.gallery.map((img: string, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="relative aspect-[4/5] border-2 border-[#D4A017] p-1">
                <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover sepia-[0.15]"/>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Section 4: Gift */}
      {(data.bankAccounts?.length > 0 || data.digitalWallets?.length > 0) && (
        <section className="py-24 bg-[#F5EDD0] px-6 text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-[#8B6914] font-[family:var(--font-cinzel)] mb-4">Amplop Digital</p>
          <GoldDivider/>
          <div className="max-w-md mx-auto space-y-6 font-[family:var(--font-cinzel)]">
            {data.bankAccounts?.map((bank: any, i: number) => (
              <div key={i} className="border border-[#D4A017] p-6">
                <p className="text-xs uppercase tracking-widest text-[#8B6914] mb-3">{bank.bank}</p>
                <p className="text-2xl font-light mb-1 text-[#2C1810]">{bank.accountNumber}</p>
                <p className="text-xs text-[#8B6914] mb-4">{bank.accountName}</p>
                <button onClick={() => copyToClipboard(bank.accountNumber, `bank-${i}`)}
                  className="text-[10px] uppercase tracking-widest border border-[#8B6914] px-6 py-2 hover:bg-[#8B6914] hover:text-[#FDF6E3] transition-colors text-[#8B6914]">
                  {copiedBank === `bank-${i}` ? 'Tersalin ✓' : 'Salin Nomor'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 5: RSVP */}
      {data.enableRSVP && (
        <section className="py-24 bg-[#3D2B1F] px-6">
          <div className="max-w-lg mx-auto">
            <p className="text-xs uppercase tracking-[0.5em] text-[#D4A017] font-[family:var(--font-cinzel)] text-center mb-2">Konfirmasi Kehadiran</p>
            <GoldDivider/>
            <form onSubmit={submitRsvp} className="space-y-6 font-[family:var(--font-cinzel)]">
              <input type="text" required placeholder="Nama Lengkap"
                className="w-full bg-transparent border-b border-[#D4A017]/50 py-3 text-[#FDF6E3] placeholder:text-[#D4A017]/40 focus:outline-none text-sm tracking-wider focus:border-[#D4A017]"
                value={rsvpData.name} onChange={e => setRsvpData({...rsvpData, name: e.target.value})}/>
              <select className="w-full bg-[#3D2B1F] border-b border-[#D4A017]/50 py-3 text-[#FDF6E3] focus:outline-none text-sm tracking-wider focus:border-[#D4A017]"
                value={rsvpData.attendance} onChange={e => setRsvpData({...rsvpData, attendance: e.target.value})}>
                <option value="yes">Hadir dengan Bahagia</option>
                <option value="no">Mohon Maaf Tidak Dapat Hadir</option>
              </select>
              <textarea placeholder="Pesan & Doa" rows={3}
                className="w-full bg-transparent border-b border-[#D4A017]/50 py-3 text-[#FDF6E3] placeholder:text-[#D4A017]/40 focus:outline-none text-sm tracking-wider resize-none focus:border-[#D4A017]"
                value={rsvpData.message} onChange={e => setRsvpData({...rsvpData, message: e.target.value})}/>
              <button disabled={rsvpStatus === 'submitting'}
                className="w-full py-4 bg-[#D4A017] text-[#2C1810] font-[family:var(--font-cinzel)] text-xs uppercase tracking-[0.3em] hover:bg-[#B8860B] disabled:opacity-50 transition-colors">
                {rsvpStatus === 'submitting' ? 'Mengirim...' : 'Kirim Konfirmasi'}
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-10 bg-[#2C1810] text-center">
        <KawungOrnament className="mx-auto mb-4 opacity-30"/>
        <p className="text-[10px] uppercase tracking-[0.5em] text-[#D4A017]/60 font-[family:var(--font-cinzel)]">Dibuat dengan Karsaloka</p>
      </footer>
    </div>
  );
}
