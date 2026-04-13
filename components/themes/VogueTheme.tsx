'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Heart, Music, Check, Copy } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { ssr: false });

export default function VogueTheme({ 
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

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center font-[family:var(--font-cormorant)] text-stone-900 overflow-hidden relative">
        <div className="absolute top-10 left-10 text-[10px] uppercase tracking-[0.4em] font-sans font-bold">Karsaloka Editorial</div>
        <div className="absolute bottom-10 right-10 text-[10px] uppercase tracking-[0.4em] font-sans font-bold">Vol. 1</div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-[300px] md:w-[400px] aspect-[3/4] mb-12 shadow-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700"
        >
          <Image 
            src={data.coverImage} 
            alt="Cover" 
            fill 
            className="object-cover"
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center z-10"
        >
          <h1 className="text-6xl md:text-8xl italic font-light tracking-tighter mb-2">{data.brideName}</h1>
          <p className="text-sm uppercase tracking-[0.5em] font-sans font-bold mb-2">&</p>
          <h1 className="text-6xl md:text-8xl italic font-light tracking-tighter mb-12">{data.groomName}</h1>
          
          <button 
            onClick={handleOpen}
            className="bg-black text-white px-10 py-4 uppercase text-xs tracking-widest hover:bg-stone-800 transition-colors"
          >
            Read The Story
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-[family:var(--font-cormorant)] selection:bg-black selection:text-white">
      {/* Editorial Floating Nav */}
      <nav className="fixed top-0 w-full p-6 mix-blend-difference text-white z-50 flex justify-between items-center pointer-events-none">
        <div className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold pointer-events-auto">Karsaloka</div>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center pointer-events-auto hover:bg-white hover:text-black transition-colors"
        >
          <Music className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
        </button>
      </nav>

      {/* Hero Spread */}
      <section className="h-screen w-full flex flex-col md:flex-row relative">
        <div className="flex-1 flex flex-col justify-center p-8 md:p-20 z-10 bg-stone-100">
          <motion.p 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-xs uppercase font-sans tracking-[0.4em] mb-8 font-bold border-l-2 border-black pl-4"
          >
            {data.openingGreeting}
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-7xl md:text-9xl tracking-tighter italic font-light leading-[0.8] mb-6"
          >
            {data.brideName} <br/> <span className="font-sans text-xl md:text-3xl font-black not-italic">&</span> <br/> {data.groomName}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="font-sans text-xs uppercase tracking-widest max-w-xs leading-loose"
          >
            {data.greeting}
          </motion.p>
        </div>
        <div className="flex-1 relative border-l border-stone-200">
          <Image src={data.groomImage} alt="Groom" fill className="object-cover grayscale" />
        </div>
      </section>

      {/* Details - Big Typography */}
      <section className="py-32 bg-black text-white px-6 md:px-20 text-center">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-sans uppercase tracking-[0.4em] text-stone-400 mb-12">The Details</p>
          <h3 className="text-5xl md:text-7xl font-light italic mb-8">{data.date}</h3>
          <p className="font-sans text-sm tracking-widest uppercase mb-12">{data.time}</p>
          
          <div className="max-w-xl mx-auto">
            <h4 className="text-3xl mb-4">{data.venue}</h4>
            <p className="font-sans text-xs text-stone-400 leading-loose mb-10">{data.address}</p>
            <div className="h-64 w-full grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500 rounded-none overflow-hidden">
               <LeafletMap address={data.venue + " " + data.address} mapCoordinates={data.mapCoordinates} editable={false} />
            </div>
            
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.venue + ' ' + data.address)}`} 
              target="_blank" 
              className="inline-block mt-8 border border-white px-8 py-3 font-sans text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
            >
              Open Maps
            </a>
          </div>
        </motion.div>
      </section>

      {/* Gallery Asymmetric */}
      {data.gallery && data.gallery.length > 0 && (
        <section className="py-32 px-6 md:px-20 bg-stone-100">
           <p className="text-xs font-sans uppercase tracking-[0.4em] font-bold mb-20 text-center">The Exhibition</p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
             {data.gallery.map((img: string, i: number) => (
               <motion.div 
                 key={i} 
                 initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                 className={`relative w-full aspect-[4/5] ${i % 2 !== 0 ? 'md:mt-32' : ''}`}
               >
                 <Image src={img} alt="Gallery" fill className="object-cover filter sepia-[0.2]" />
               </motion.div>
             ))}
           </div>
        </section>
      )}

      {/* RSVP Minimalist */}
      {data.enableRSVP && (
        <section className="py-32 bg-stone-200 px-6">
          <div className="max-w-xl mx-auto">
            <h3 className="text-5xl italic font-light mb-12 text-center text-black">RSVP</h3>
            <form onSubmit={submitRsvp} className="space-y-8 font-sans">
              <input 
                type="text" required placeholder="Full Name"
                className="w-full bg-transparent border-b border-black py-4 placeholder:text-stone-500 focus:outline-none uppercase text-xs tracking-widest text-black"
                value={rsvpData.name} onChange={e => setRsvpData({...rsvpData, name: e.target.value})}
              />
              <select 
                className="w-full bg-transparent border-b border-black py-4 focus:outline-none uppercase text-xs tracking-widest text-black"
                value={rsvpData.attendance} onChange={e => setRsvpData({...rsvpData, attendance: e.target.value})}
              >
                <option value="yes">Joyfully Accept</option>
                <option value="no">Regretfully Decline</option>
              </select>
              <textarea 
                placeholder="Message or Wishes" rows={3}
                className="w-full bg-transparent border-b border-black py-4 placeholder:text-stone-500 focus:outline-none uppercase text-xs tracking-widest text-black resize-none"
                value={rsvpData.message} onChange={e => setRsvpData({...rsvpData, message: e.target.value})}
              ></textarea>
              <button disabled={rsvpStatus === 'submitting'} className="w-full bg-black text-white py-5 uppercase text-xs tracking-[0.3em] hover:bg-stone-800 disabled:opacity-50 transition-colors">
                {rsvpStatus === 'submitting' ? 'Sending...' : 'Send Confimation'}
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Gift */}
      {(data.bankAccounts?.length > 0 || data.digitalWallets?.length > 0) && (
        <section className="py-32 bg-white px-6 text-center">
          <h3 className="text-4xl italic font-light mb-16">Wedding Gift</h3>
          <div className="max-w-md mx-auto space-y-8 font-sans">
            {data.bankAccounts?.map((bank:any, i:number) => (
              <div key={i} className="border border-stone-200 p-8">
                <p className="text-xs uppercase tracking-widest mb-4 font-bold">{bank.bank}</p>
                <p className="text-2xl font-light mb-2">{bank.accountNumber}</p>
                <p className="text-xs text-stone-500 mb-6">{bank.accountName}</p>
                <button onClick={() => copyToClipboard(bank.accountNumber, `bank-${i}`)} className="text-[10px] uppercase tracking-widest border border-black px-6 py-2 hover:bg-black hover:text-white transition-colors">
                  {copiedBank === `bank-${i}` ? 'Copied' : 'Copy Number'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
      
      <footer className="py-10 bg-black text-white text-center font-sans">
        <p className="text-[10px] uppercase tracking-[0.5em] text-stone-600">Created via Karsaloka</p>
      </footer>
    </div>
  );
}
