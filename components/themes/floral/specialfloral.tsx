"use client";
import { useEffect, useState, useCallback, memo } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { FloralCorner, FloralDivider, SectionOrnament, BismillahOrnament } from "./ornamen";

function useCountdown(targetDate: string) {
  const [time, setTime] = useState({ d: "--", h: "--", m: "--", s: "--" });
  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const tick = () => {
      let d = new Date();
      if (targetDate) { const p = new Date(targetDate); if (!isNaN(p.getTime())) d = p; }
      const diff = d.getTime() - Date.now();
      if (diff <= 0) { setTime({ d:"00",h:"00",m:"00",s:"00" }); return; }
      setTime({ d:pad(Math.floor(diff/86400000)), h:pad(Math.floor((diff%86400000)/3600000)), m:pad(Math.floor((diff%3600000)/60000)), s:pad(Math.floor((diff%60000)/1000)) });
    };
    tick(); const id = setInterval(tick,1000); return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

const CountdownDisplay = memo(function CountdownDisplay({ targetDate }: { targetDate: string }) {
  const c = useCountdown(targetDate);
  return (
    <div className="sf-cd-grid">
      {[{val:c.d,lbl:"Hari"},{val:c.h,lbl:"Jam"},{val:c.m,lbl:"Menit"},{val:c.s,lbl:"Detik"}].map(({val,lbl}) => (
        <div key={lbl} className="sf-cd-box"><span className="sf-cd-num">{val}</span><span className="sf-cd-lbl">{lbl}</span></div>
      ))}
    </div>
  );
});

function Reveal({ children, delay=0, y=30 }: { children: React.ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div initial={{opacity:0,y}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-50px"}} transition={{duration:0.8,delay,ease:[0.22,1,0.36,1]}}>
      {children}
    </motion.div>
  );
}

const SPARKLES = Array.from({length:18}).map((_,i) => ({
  size:2+(i%4), left:(i*5.5+2)%100, top:(i*7+5)%88,
  dur:3+(i*0.3)%4, delay:(i*0.4)%5, floatY:-6-(i%6)*2, opacity:0.3+(i%5)*0.1
}));

const FloatingPetals = memo(function FloatingPetals() {
  const [m,setM] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setM(true));
    return () => cancelAnimationFrame(id);
  }, []);
  if (!m) return null;
  return (
    <div style={{pointerEvents:"none",position:"fixed",inset:0,zIndex:10,overflow:"hidden"}}>
      {SPARKLES.map((s,i) => (
        <motion.div key={i} style={{position:"absolute",left:`${s.left}%`,top:`${s.top}%`,width:s.size,height:s.size,borderRadius:"50%",background:"#C9A84C",boxShadow:`0 0 ${s.size*3}px ${s.size}px rgba(201,168,76,0.6)`,willChange:"transform,opacity"}}
          animate={{y:[0,s.floatY,0],opacity:[s.opacity,s.opacity*0.3,s.opacity],scale:[1,1.4,1]}}
          transition={{duration:s.dur,delay:s.delay,repeat:Infinity,ease:"easeInOut"}} />
      ))}
    </div>
  );
});

function useToast() {
  const [msg,setMsg] = useState(""); const [show,setShow] = useState(false);
  const toast = useCallback((m:string)=>{ setMsg(m); setShow(true); setTimeout(()=>setShow(false),3000); },[]);
  return {msg,show,toast};
}

export default function SpesialFloral({ data, isOpen, handleOpen, isPlaying, setIsPlaying, rsvpData, setRsvpData, submitRsvp, rsvpStatus, copiedBank, copyToClipboard }: any) {
  const {
    groomName="Groom", brideName="Bride", groomFullName="Groom", brideFullName="Bride",
    groomParents="Bapak & Ibu Groom", brideParents="Bapak & Ibu Bride",
    groomImage, brideImage, coverImage, guestName="Tamu Undangan",
    date="", time="08:00", venue="Gedung Pernikahan", address="Jl. Contoh No. 123",
    receptionDate="", receptionTime="", receptionVenue="", receptionAddress="",
    saveTheDateDate="", saveTheDateDescription="",
    loveStories=[], gallery=[], bankAccounts=[], digitalWallets=[], shippingAddress,
    musicUrl, brandName="karsaloka", brideInstagram="", groomInstagram="",
  } = data;

  const primaryDate = saveTheDateDate || date || "2026-08-16";

  const {msg,show,toast} = useToast();
  const [activeTab,setActiveTab] = useState<"akad"|"resepsi">("akad");
  const [lightbox,setLightbox] = useState<string|null>(null);

  const getCoverDate = () => {
    if (!primaryDate) return "TANGGAL BELUM DITENTUKAN";
    const d = new Date(primaryDate);
    if (isNaN(d.getTime())) return "TANGGAL BELUM DITENTUKAN";
    return d.toLocaleDateString("id-ID",{day:"2-digit",month:"2-digit",year:"numeric"}).replace(/\//g," · ");
  };

  const getLongDate = (dString: string) => {
    if (!dString) return "Tanggal Belum Ditentukan";
    const d = new Date(dString);
    if (isNaN(d.getTime())) return "Tanggal Belum Ditentukan";
    return d.toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"});
  };

  const copyText = async (text:string, id:string) => { copyToClipboard(text,id); toast("✓ Nomor berhasil disalin!"); };
  const scrollTo = (id:string) => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  return (
    <>
      {lightbox && (
        <div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Image src={lightbox} alt="Gallery" width={400} height={500} style={{maxWidth:"90vw",maxHeight:"85vh",objectFit:"contain"}} />
        </div>
      )}

      <div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",background:"#2C1A0E",color:"#FDF8F2",fontSize:11,letterSpacing:"0.1em",padding:"10px 20px",opacity:show?1:0,transition:"opacity 0.3s",pointerEvents:"none",zIndex:999}}>{msg}</div>

      <div className="sf-page-wrapper">
        <FloatingPetals />
        <div className="sf-root">

        {/* COVER */}
        <section className="sf-cover" id="cover">
          <motion.div animate={{rotate:[0,2,-2,0]}} transition={{duration:12,repeat:Infinity,ease:"easeInOut"}}><FloralCorner position="tl" size={170} opacity={0.8} /></motion.div>
          <motion.div animate={{rotate:[0,-2,2,0]}} transition={{duration:14,repeat:Infinity,ease:"easeInOut"}}><FloralCorner position="tr" size={170} opacity={0.8} /></motion.div>
          <motion.div animate={{rotate:[0,-2,2,0]}} transition={{duration:13,repeat:Infinity,ease:"easeInOut"}}><FloralCorner position="bl" size={140} opacity={0.7} /></motion.div>
          <motion.div animate={{rotate:[0,2,-2,0]}} transition={{duration:15,repeat:Infinity,ease:"easeInOut"}}><FloralCorner position="br" size={140} opacity={0.7} /></motion.div>

          <div className="sf-cover-inner" style={{opacity:isOpen?0:1,display:isOpen?"none":"flex",transition:"opacity 1s ease"}}>
            <motion.p initial={{opacity:0,letterSpacing:"0.1em"}} animate={{opacity:1,letterSpacing:"0.35em"}} transition={{duration:1.5}} className="sf-the-wedding">The Wedding of</motion.p>
            <motion.div initial={{opacity:0,scale:0.8,rotate:-5}} animate={{opacity:1,scale:1,rotate:0}} transition={{duration:1.2,delay:0.3}} className="sf-cover-ring">
              {coverImage ? <Image src={coverImage} alt="couple" width={120} height={120} style={{width:"100%",height:"100%",objectFit:"cover"}} /> : <div className="sf-cover-ring-placeholder">📷</div>}
            </motion.div>
            <motion.div initial={{opacity:0,width:0}} animate={{opacity:1,width:"100%"}} transition={{duration:1,delay:0.6}} className="sf-cover-ornament">
              <span className="sf-orn-line"/><span className="sf-orn-diamond"/><span className="sf-orn-line"/>
            </motion.div>
            <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:1,delay:0.8}} className="sf-cover-names">
              {brideName}<span className="sf-cover-amp">&</span>{groomName}
            </motion.h1>
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:1,delay:1}}>
              <div className="sf-cover-ornament" style={{marginTop:"0.75rem"}}><span className="sf-orn-line"/><span className="sf-orn-diamond"/><span className="sf-orn-line"/></div>
              <p className="sf-cover-date">{getCoverDate()}</p>
            </motion.div>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1,delay:1.2}} style={{marginTop:"2rem"}}>
              <p className="sf-cover-to">Kepada Yth.</p>
              <p className="sf-cover-guest">{guestName}</p>
              <button className="sf-cover-btn" onClick={handleOpen}>✉ Buka Undangan</button>
            </motion.div>
          </div>
        </section>

        {isOpen && (
          <div className="sf-content">

            {/* OPENING */}
            <section className="sf-section sf-section-cream" id="opening">
              <Reveal>
                <BismillahOrnament />
                <p className="sf-salam">Assalamu&apos;alaikum Warahmatullahi Wabarakatuh</p>
                <blockquote className="sf-ayat">&quot;Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat kebesaran Allah.&quot;</blockquote>
                <p className="sf-ayat-source">QS. Az-Zariyat : 49</p>
                <FloralDivider />
                <p className="sf-body-text" style={{marginTop:"1rem"}}>Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.</p>
              </Reveal>
            </section>

            {/* MEMPELAI */}
            <section className="sf-section" id="mempelai">
              <Reveal>
                <SectionOrnament /><p className="sf-badge">Mempelai</p>
                <h2 className="sf-section-title">Dua Hati, <em>Satu Ikatan</em></h2>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="sf-couple-card">
                  <div className="sf-couple-img">{brideImage?<Image src={brideImage} alt={brideFullName} width={72} height={90} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span>📷</span>}</div>
                  <div className="sf-couple-info">
                    <h3 className="sf-couple-name">{brideName}</h3>
                    <p className="sf-couple-parents">{brideParents}</p>
                    {brideInstagram&&<a href={`https://instagram.com/${brideInstagram}`} target="_blank" rel="noreferrer" className="sf-ig-link">📷 @{brideInstagram}</a>}
                  </div>
                </div>
                <div className="sf-couple-amp">&</div>
                <div className="sf-couple-card">
                  <div className="sf-couple-img">{groomImage?<Image src={groomImage} alt={groomFullName} width={72} height={90} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span>📷</span>}</div>
                  <div className="sf-couple-info">
                    <h3 className="sf-couple-name">{groomName}</h3>
                    <p className="sf-couple-parents">{groomParents}</p>
                    {groomInstagram&&<a href={`https://instagram.com/${groomInstagram}`} target="_blank" rel="noreferrer" className="sf-ig-link">📷 @{groomInstagram}</a>}
                  </div>
                </div>
              </Reveal>
            </section>

            {/* SAVE THE DATE */}
            <section className="sf-section sf-section-cream" id="savedate">
              <Reveal>
                <SectionOrnament /><p className="sf-badge">Save The Date</p>
                <h2 className="sf-section-title">{getLongDate(primaryDate)}</h2>
                <p className="sf-body-text" style={{marginBottom:"1rem"}}>{saveTheDateDescription || "Kami menanti kehadiran dan doa restu Anda."}</p>
                <CountdownDisplay targetDate={primaryDate} />
              </Reveal>
              <Reveal delay={0.15}>
                <div className="sf-tabs">
                  <button className={`sf-tab ${activeTab==="akad"?"active":""}`} onClick={()=>setActiveTab("akad")}>Akad Nikah</button>
                  <button className={`sf-tab ${activeTab==="resepsi"?"active":""}`} onClick={()=>setActiveTab("resepsi")}>Resepsi</button>
                </div>
                <div className="sf-event-card">
                  <p className="sf-event-type">{activeTab==="akad"?"Akad Nikah":"Resepsi Pernikahan"}</p>
                  <p className="sf-event-date">{activeTab==="akad" ? getLongDate(date || primaryDate) : getLongDate(receptionDate || date || primaryDate)}</p>
                  <p className="sf-event-time">Pukul {activeTab==="akad" ? time : (receptionTime || time)}</p>
                  <p className="sf-event-venue">{activeTab==="akad" ? venue : (receptionVenue || venue)}</p>
                  <p className="sf-event-addr">{activeTab==="akad" ? address : (receptionAddress || address)}</p>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeTab==="akad"?`${venue} ${address}`:`${receptionVenue||venue} ${receptionAddress||address}`)}`} target="_blank" rel="noreferrer" className="sf-map-btn">📍 Lihat Lokasi</a>
                </div>
              </Reveal>
            </section>

            {/* LOVE STORY */}
            <section className="sf-section" id="story">
              <Reveal>
                <SectionOrnament /><p className="sf-badge">Kisah Cinta</p>
                <h2 className="sf-section-title">Perjalanan <em>Menuju Sini</em></h2>
              </Reveal>
              <div className="sf-ls-wrap">
                {loveStories.map((item:any,i:number)=>(
                  <Reveal key={i} delay={i*0.1}>
                    <div className={`sf-ls-item ${i===loveStories.length-1?"last":""}`}>
                      <div className="sf-ls-left">
                        <div className="sf-ls-circle">{item.imageUrl?<Image src={item.imageUrl} alt={item.title} width={40} height={40} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/>:<span style={{fontSize:16}}>💐</span>}</div>
                        {i<loveStories.length-1&&<div className="sf-ls-line"/>}
                      </div>
                      <div className="sf-ls-content">
                        <p className="sf-ls-date">{item.year}</p>
                        <h3 className="sf-ls-title">{item.title}</h3>
                        <p className="sf-ls-text">{item.story}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* GALLERY */}
            {gallery.length>0&&(
              <section className="sf-section sf-section-cream" id="galeri">
                <Reveal>
                  <SectionOrnament /><p className="sf-badge">Galeri Foto</p>
                  <h2 className="sf-section-title">Momen <em>Berharga Kami</em></h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <div className="sf-gallery-grid">
                    {gallery.slice(0,6).map((src:string,i:number)=>(
                      <div key={i} className={`sf-gallery-item ${i===0?"tall":""}`} onClick={()=>setLightbox(src)}>
                        <Image src={src} alt={`Gallery ${i+1}`} fill style={{objectFit:"cover"}}/>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </section>
            )}

            {/* AMPLOP DIGITAL */}
            <section className="sf-section" id="amplop">
              <Reveal>
                <SectionOrnament /><p className="sf-badge">Amplop Digital</p>
                <h2 className="sf-section-title">Kirim <em>Doa &amp; Kasih</em></h2>
                <p className="sf-body-text">Doa restu Anda merupakan karunia yang sangat berarti. Jika ingin memberi kado, Anda dapat mengirimnya secara cashless.</p>
              </Reveal>
              <div className="sf-amplop-list">
                {bankAccounts.map((acc:any,i:number)=>(
                  <Reveal key={i} delay={i*0.08}>
                    <div className="sf-amplop-card" style={{background:"linear-gradient(135deg,#2C1A0E 0%,#5C3A20 100%)"}}>
                      <div className="sf-amplop-glow"/>
                      <p className="sf-amplop-bank">{acc.bankName||acc.bank}</p>
                      <p className="sf-amplop-num">{acc.accountNumber}</p>
                      <p className="sf-amplop-name">a.n. {acc.accountName}</p>
                      <button className="sf-amplop-copy" onClick={()=>copyText(acc.accountNumber.replace(/\s/g,""),`bank-${i}`)}>
                        {copiedBank===`bank-${i}`?"Tersalin ✓":"📋 Salin Nomor"}
                      </button>
                    </div>
                  </Reveal>
                ))}
                {digitalWallets.map((acc:any,i:number)=>(
                  <Reveal key={`ew-${i}`} delay={i*0.08}>
                    <div className="sf-amplop-card" style={{background:"linear-gradient(135deg,#1A3A2A 0%,#2A5A3A 100%)"}}>
                      <div className="sf-amplop-glow"/>
                      <p className="sf-amplop-bank">{acc.ewallet}</p>
                      <p className="sf-amplop-num">{acc.accountNumber}</p>
                      <p className="sf-amplop-name">a.n. {acc.accountName}</p>
                      <button className="sf-amplop-copy" onClick={()=>copyText(acc.accountNumber.replace(/\s/g,""),`ew-${i}`)}>
                        {copiedBank===`ew-${i}`?"Tersalin ✓":"📋 Salin Nomor"}
                      </button>
                    </div>
                  </Reveal>
                ))}
                {shippingAddress&&(
                  <Reveal delay={0.2}><div className="sf-gift-address"><p className="sf-badge" style={{marginBottom:"0.5rem"}}>Kirim Hadiah Fisik</p><p className="sf-body-text" style={{fontSize:12}}>{shippingAddress}</p></div></Reveal>
                )}
              </div>
            </section>

            {/* RSVP */}
            <section className="sf-section sf-section-cream" id="rsvp">
              <Reveal>
                <SectionOrnament /><p className="sf-badge">RSVP</p>
                <h2 className="sf-section-title">Konfirmasi <em>Kehadiran</em></h2>
                <p className="sf-body-text">Merupakan suatu kehormatan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.</p>
              </Reveal>
              <Reveal delay={0.1}>
                {rsvpStatus==="success"?(
                  <div style={{textAlign:"center",padding:"2rem 0"}}>
                    <p style={{fontSize:32,marginBottom:"0.5rem"}}>✓</p>
                    <p className="sf-section-title">Terima Kasih!</p>
                    <p className="sf-body-text">Konfirmasi kehadiran Anda telah kami terima.</p>
                  </div>
                ):(
                  <form className="sf-rsvp-form" onSubmit={submitRsvp}>
                    <input required className="sf-input" placeholder="Nama Lengkap" value={rsvpData.name} onChange={(e)=>setRsvpData({...rsvpData,name:e.target.value})}/>
                    <div className="sf-radio-row">
                      <button type="button" className={`sf-radio ${rsvpData.attendance==="yes"?"active":""}`} onClick={()=>setRsvpData({...rsvpData,attendance:"yes"})}>✓ Ya, Saya Hadir</button>
                      <button type="button" className={`sf-radio ${rsvpData.attendance==="no"?"active":""}`} onClick={()=>setRsvpData({...rsvpData,attendance:"no"})}>✗ Maaf, Tidak Bisa</button>
                    </div>
                    {rsvpData.attendance==="yes"&&(
                      <select className="sf-input" value={rsvpData.count} onChange={(e)=>setRsvpData({...rsvpData,count:e.target.value})}>
                        <option value="1">1 Orang</option><option value="2">2 Orang</option><option value="3">3 Orang</option><option value="4">4 Orang</option>
                      </select>
                    )}
                    <textarea required className="sf-input sf-textarea" placeholder="Pesan &amp; Doa untuk Kami..." rows={3} value={rsvpData.message} onChange={(e)=>setRsvpData({...rsvpData,message:e.target.value})}/>
                    <button type="submit" className="sf-submit" disabled={rsvpStatus==="submitting"}>{rsvpStatus==="submitting"?"Mengirim...":"Kirim Konfirmasi"}</button>
                  </form>
                )}
              </Reveal>
            </section>

            {/* FOOTER */}
            <footer className="sf-footer">
              <Reveal>
                <div style={{position:"relative"}}><FloralCorner position="tl" size={100} opacity={0.5}/><FloralCorner position="tr" size={100} opacity={0.5}/></div>
                <BismillahOrnament/>
                <h2 className="sf-footer-names">{brideName} <em>&</em> {groomName}</h2>
                <FloralDivider color="#C4785A"/>
                <p className="sf-footer-text">Merupakan kehormatan dan kebahagiaan bagi kami,<br/>apabila Bapak/Ibu/Saudara/i berkenan hadir<br/>dan memberikan doa restu.<br/><br/><strong>Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh.</strong></p>
                <p className="sf-footer-brand">Made with ♥ by {brandName}</p>
              </Reveal>
            </footer>

            {/* BOTTOM NAV */}
            <nav className="sf-bottom-nav">
              {[
                {icon:"🏠",label:"Home",action:()=>scrollTo("cover")},
                {icon:"📍",label:"Maps",action:()=>scrollTo("savedate")},
                {icon:"✉️",label:"RSVP",action:()=>scrollTo("rsvp")},
                {icon:"📖",label:"Tamu",action:()=>scrollTo("rsvp")},
                {icon:isPlaying?"🎵":"🔇",label:isPlaying?"Mute":"Audio",action:()=>setIsPlaying(!isPlaying)},
              ].map(({icon,label,action})=>(
                <button key={label} className="sf-nav-item" onClick={action}>
                  <span className="sf-nav-icon">{icon}</span><span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
        :root{--sf-bg:#0D1B14;--sf-bg2:#111F18;--sf-surface:rgba(255,255,255,0.04);--sf-border:rgba(201,168,76,0.18);--sf-gold:#C9A84C;--sf-gold2:#E8D5A3;--sf-text:#F0E8D6;--sf-muted:rgba(240,232,214,0.5);--sf-glow:rgba(201,168,76,0.15);}
        *{box-sizing:border-box;}
        .sf-page-wrapper{
          min-height:100vh;
          background:radial-gradient(ellipse at 50% 30%,#1A3028 0%,#0D1B14 70%);
          display:flex;
          justify-content:center;
          align-items:flex-start;
          position:relative;
          overflow-x:hidden;
        }
        .sf-root{background:var(--sf-bg);color:var(--sf-text);font-family:'Jost',sans-serif;width:100%;max-width:430px;min-height:100vh;position:relative;}
        .sf-cover{background:radial-gradient(ellipse at 50% 30%,#1A3028 0%,#0D1B14 70%);min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;padding:2rem 1.5rem;}
        .sf-cover::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 100%,rgba(201,168,76,0.08) 0%,transparent 60%);}
        .sf-cover-inner{display:flex;flex-direction:column;align-items:center;text-align:center;position:relative;z-index:1;}
        .sf-the-wedding{font-size:10px;letter-spacing:0.45em;color:var(--sf-gold);text-transform:uppercase;font-weight:300;margin-bottom:1.5rem;}
        .sf-cover-ring{width:130px;height:130px;border-radius:50%;background:#1A2E22;border:1px solid var(--sf-gold);box-shadow:0 0 0 5px rgba(201,168,76,0.08),0 0 40px rgba(201,168,76,0.12);overflow:hidden;display:flex;align-items:center;justify-content:center;margin-bottom:1.75rem;font-size:28px;}
        .sf-cover-ring-placeholder{font-size:28px;}
        .sf-cover-ornament{display:flex;align-items:center;gap:8px;margin:0.75rem 0;}
        .sf-orn-line{display:block;width:50px;height:0.5px;background:linear-gradient(90deg,transparent,var(--sf-gold),transparent);}
        .sf-orn-diamond{display:block;width:5px;height:5px;background:var(--sf-gold);transform:rotate(45deg);box-shadow:0 0 6px var(--sf-gold);}
        .sf-cover-names{font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:300;color:var(--sf-text);line-height:1.1;text-shadow:0 0 40px rgba(201,168,76,0.2);}
        .sf-cover-amp{color:var(--sf-gold);font-style:italic;font-size:32px;display:block;margin:0.2rem 0;}
        .sf-cover-date{font-size:10px;letter-spacing:0.3em;color:var(--sf-muted);text-transform:uppercase;margin:1rem 0 0.25rem;}
        .sf-cover-to{font-size:10px;color:var(--sf-muted);}
        .sf-cover-guest{font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--sf-gold2);margin-bottom:1.75rem;}
        .sf-cover-btn{background:transparent;color:var(--sf-gold);border:1px solid var(--sf-gold);padding:13px 32px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;font-family:'Jost',sans-serif;cursor:pointer;transition:all 0.35s;position:relative;overflow:hidden;}
        .sf-cover-btn::before{content:'';position:absolute;inset:0;background:var(--sf-gold);transform:scaleX(0);transform-origin:left;transition:transform 0.35s ease;z-index:-1;}
        .sf-cover-btn:hover{color:#0D1B14;}.sf-cover-btn:hover::before{transform:scaleX(1);}
        .sf-section{padding:3.5rem 1.5rem;background:var(--sf-bg);}
        .sf-section-cream{background:var(--sf-bg2);}
        .sf-badge{font-size:9px;letter-spacing:0.35em;text-transform:uppercase;color:var(--sf-gold);border-bottom:0.5px solid rgba(201,168,76,0.4);padding-bottom:3px;margin-bottom:0.75rem;display:inline-block;}
        .sf-section-title{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:300;color:var(--sf-text);line-height:1.2;margin-bottom:0.75rem;}
        .sf-section-title em{color:var(--sf-gold);font-style:italic;}
        .sf-body-text{font-size:13px;color:var(--sf-muted);line-height:1.9;}
        .sf-salam{font-size:13px;letter-spacing:0.05em;color:var(--sf-gold);margin-bottom:1rem;font-weight:400;text-align:center;}
        .sf-ayat{font-family:'Cormorant Garamond',serif;font-size:15px;font-style:italic;color:var(--sf-text);line-height:1.9;text-align:center;margin-bottom:0.5rem;opacity:0.85;}
        .sf-ayat-source{font-size:10px;letter-spacing:0.2em;color:var(--sf-gold);text-transform:uppercase;text-align:center;}
        .sf-couple-card{display:flex;gap:16px;align-items:flex-start;margin-bottom:1rem;background:var(--sf-surface);border:1px solid var(--sf-border);padding:16px;backdrop-filter:blur(12px);border-radius:4px;}
        .sf-couple-img{width:72px;height:90px;background:#1A2E22;flex-shrink:0;border-radius:2px;overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:20px;border:1px solid var(--sf-border);}
        .sf-couple-info{flex:1;}
        .sf-couple-name{font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--sf-text);}
        .sf-couple-parents{font-size:11px;color:var(--sf-muted);line-height:1.7;margin-top:4px;}
        .sf-ig-link{font-size:10px;color:var(--sf-gold);margin-top:6px;display:inline-block;text-decoration:none;}
        .sf-couple-amp{text-align:center;font-family:'Cormorant Garamond',serif;font-size:40px;color:var(--sf-gold);font-style:italic;padding:0.25rem 0;}
        .sf-cd-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:1.5rem 0;}
        .sf-cd-box{background:var(--sf-surface);border:1px solid var(--sf-border);padding:14px 4px;text-align:center;backdrop-filter:blur(8px);position:relative;overflow:hidden;}
        .sf-cd-box::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--sf-gold),transparent);}
        .sf-cd-num{font-family:'Cormorant Garamond',serif;font-size:28px;color:var(--sf-gold);display:block;}
        .sf-cd-lbl{font-size:8px;letter-spacing:0.15em;color:var(--sf-muted);text-transform:uppercase;}
        .sf-tabs{display:flex;border-bottom:1px solid var(--sf-border);}
        .sf-tab{flex:1;padding:10px;font-size:12px;color:var(--sf-muted);background:none;border:none;cursor:pointer;border-bottom:2px solid transparent;font-family:'Jost',sans-serif;transition:all 0.2s;}
        .sf-tab.active{color:var(--sf-gold);border-bottom-color:var(--sf-gold);}
        .sf-event-card{background:var(--sf-surface);border:1px solid var(--sf-border);border-top:none;padding:18px;margin-bottom:1rem;backdrop-filter:blur(8px);}
        .sf-event-type{font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:var(--sf-gold);margin-bottom:6px;}
        .sf-event-date{font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--sf-text);margin-bottom:2px;}
        .sf-event-time{font-size:12px;color:var(--sf-muted);margin-bottom:6px;}
        .sf-event-venue{font-size:13px;font-weight:500;color:var(--sf-text);margin-bottom:2px;}
        .sf-event-addr{font-size:11px;color:var(--sf-muted);line-height:1.6;margin-bottom:10px;}
        .sf-map-btn{display:inline-flex;align-items:center;gap:4px;font-size:10px;letter-spacing:0.15em;color:var(--sf-gold);border:1px solid rgba(201,168,76,0.4);padding:7px 16px;text-transform:uppercase;cursor:pointer;text-decoration:none;transition:all 0.2s;}
        .sf-map-btn:hover{background:var(--sf-glow);border-color:var(--sf-gold);}
        .sf-ls-wrap{margin-top:1.5rem;}
        .sf-ls-item{display:flex;gap:16px;position:relative;}
        .sf-ls-left{display:flex;flex-direction:column;align-items:center;flex-shrink:0;}
        .sf-ls-circle{width:42px;height:42px;border-radius:50%;background:#1A2E22;border:1px solid var(--sf-gold);box-shadow:0 0 12px rgba(201,168,76,0.2);overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px;}
        .sf-ls-line{width:1px;flex:1;background:linear-gradient(180deg,var(--sf-gold),transparent);margin:4px 0;min-height:24px;}
        .sf-ls-content{flex:1;background:var(--sf-surface);border:1px solid var(--sf-border);padding:14px 16px;margin-bottom:1rem;backdrop-filter:blur(8px);}
        .sf-ls-date{font-size:9px;letter-spacing:0.2em;color:var(--sf-gold);text-transform:uppercase;margin-bottom:3px;}
        .sf-ls-title{font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--sf-text);margin-bottom:5px;}
        .sf-ls-text{font-size:12px;color:var(--sf-muted);line-height:1.8;}
        .sf-gallery-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px;}
        .sf-gallery-item{position:relative;background:#1A2E22;aspect-ratio:3/4;cursor:pointer;overflow:hidden;transition:all 0.3s;border:1px solid var(--sf-border);}
        .sf-gallery-item::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(13,27,20,0.7));}
        .sf-gallery-item:hover{transform:scale(1.02);border-color:var(--sf-gold);}
        .sf-gallery-item.tall{grid-row:span 2;aspect-ratio:unset;}
        .sf-amplop-list{display:flex;flex-direction:column;gap:12px;margin-top:1.5rem;}
        .sf-amplop-card{padding:20px;border-radius:2px;position:relative;overflow:hidden;border:1px solid var(--sf-border);backdrop-filter:blur(12px);}
        .sf-amplop-glow{position:absolute;top:-30px;right:-30px;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,0.12),transparent 70%);}
        .sf-amplop-bank{font-size:9px;letter-spacing:0.25em;color:var(--sf-gold);text-transform:uppercase;margin-bottom:6px;opacity:0.7;}
        .sf-amplop-num{font-family:'Cormorant Garamond',serif;font-size:24px;color:var(--sf-gold2);letter-spacing:0.1em;margin-bottom:4px;}
        .sf-amplop-name{font-size:11px;color:var(--sf-muted);margin-bottom:12px;}
        .sf-amplop-copy{display:inline-flex;align-items:center;gap:6px;font-size:9px;letter-spacing:0.15em;border:1px solid rgba(201,168,76,0.4);color:var(--sf-gold);padding:6px 14px;cursor:pointer;text-transform:uppercase;background:transparent;font-family:'Jost',sans-serif;transition:all 0.2s;}
        .sf-amplop-copy:hover{background:var(--sf-glow);border-color:var(--sf-gold);}
        .sf-gift-address{background:var(--sf-surface);border:1px solid var(--sf-border);padding:16px;backdrop-filter:blur(8px);}
        .sf-rsvp-form{display:flex;flex-direction:column;gap:10px;margin-top:1.5rem;}
        .sf-input{width:100%;background:var(--sf-surface);border:1px solid var(--sf-border);padding:13px 14px;font-size:12px;font-family:'Jost',sans-serif;color:var(--sf-text);outline:none;resize:vertical;backdrop-filter:blur(8px);}
        .sf-input::placeholder{color:var(--sf-muted);}
        .sf-input:focus{border-color:var(--sf-gold);box-shadow:0 0 0 2px var(--sf-glow);}
        .sf-textarea{min-height:80px;}
        .sf-radio-row{display:flex;gap:8px;}
        .sf-radio{flex:1;text-align:center;padding:11px;border:1px solid var(--sf-border);font-size:11px;color:var(--sf-muted);cursor:pointer;background:var(--sf-surface);font-family:'Jost',sans-serif;transition:all 0.25s;}
        .sf-radio.active{background:rgba(201,168,76,0.12);color:var(--sf-gold);border-color:var(--sf-gold);}
        .sf-submit{background:transparent;color:var(--sf-gold);border:1px solid var(--sf-gold);padding:15px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;font-family:'Jost',sans-serif;cursor:pointer;transition:all 0.35s;}
        .sf-submit:hover{background:var(--sf-gold);color:#0D1B14;}
        .sf-submit:disabled{opacity:0.5;cursor:not-allowed;}
        select.sf-input option{background:#1A2E22;color:var(--sf-text);}
        .sf-footer{background:linear-gradient(180deg,#0D1B14 0%,#060E0A 100%);color:var(--sf-text);padding:5rem 1.5rem 3rem;text-align:center;position:relative;overflow:hidden;border-top:1px solid var(--sf-border);}
        .sf-footer::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:200px;height:1px;background:linear-gradient(90deg,transparent,var(--sf-gold),transparent);}
        .sf-footer-names{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:300;color:var(--sf-text);margin-bottom:0.25rem;}
        .sf-footer-names em{color:var(--sf-gold);font-style:italic;}
        .sf-footer-text{font-size:12px;color:var(--sf-muted);line-height:2;margin-top:1.5rem;}
        .sf-footer-text strong{color:var(--sf-gold2);font-weight:400;}
        .sf-footer-brand{font-size:9px;letter-spacing:0.2em;color:rgba(240,232,214,0.15);text-transform:uppercase;margin-top:2.5rem;}
        .sf-bottom-nav{position:sticky;bottom:0;background:rgba(13,27,20,0.92);backdrop-filter:blur(16px) saturate(180%);border-top:1px solid var(--sf-border);display:flex;z-index:100;padding:8px 0 6px;}
        .sf-nav-item{flex:1;text-align:center;cursor:pointer;padding:4px;font-size:8px;letter-spacing:0.1em;color:var(--sf-muted);text-transform:uppercase;background:none;border:none;font-family:'Jost',sans-serif;transition:color 0.2s;display:flex;flex-direction:column;align-items:center;gap:3px;}
        .sf-nav-item:hover{color:var(--sf-gold);}
        .sf-nav-icon{font-size:17px;}
      `}</style>
    </>
  );
}
