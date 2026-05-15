import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import dynamic from 'next/dynamic';
import { MapPin, Share2, Check, Save, CalendarHeart, X } from 'lucide-react';
import { FormData } from '@/hooks/useEditorData';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-stone-100 animate-pulse flex items-center justify-center text-stone-400 text-xs">Memuat Peta...</div>
});

interface EditorTabUmumProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isDarkMode: boolean;
  id: string;
}

export default function EditorTabUmum({ formData, setFormData, isDarkMode, id }: EditorTabUmumProps) {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [showSaveDateSuccess, setShowSaveDateSuccess] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/invite/${formData.customLink || id}`;
    navigator.clipboard.writeText(url);
    setShowShareSuccess(true);
    setTimeout(() => setShowShareSuccess(false), 2000);
  };

  return (
    <>
      {/* Map Selection Modal */}
      <AnimatePresence>
        {isMapModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMapModalOpen(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`relative w-full max-w-4xl h-[80vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col ${isDarkMode ? 'bg-stone-900 border border-stone-800' : 'bg-white'}`}
            >
              <div className="p-6 flex items-center justify-between border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="bg-rose-100 p-2 rounded-xl">
                    <MapPin className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Pilih Lokasi Venue</h3>
                    <p className="text-xs text-stone-500">Klik pada peta untuk menentukan lokasi yang tepat</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMapModalOpen(false)}
                  className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-stone-800 text-stone-400' : 'hover:bg-stone-100 text-stone-500'}`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 relative">
                <LeafletMap 
                  address={formData.address} 
                  mapCoordinates={formData.mapCoordinates}
                  editable={true}
                  onSelectAddress={(newAddress, lat, lng) => {
                    setFormData({
                      ...formData, 
                      address: newAddress,
                      mapCoordinates: lat && lng ? { lat, lng } : formData.mapCoordinates
                    });
                    setIsMapModalOpen(false);
                  }}
                />
              </div>
              
              <div className={`p-4 text-center border-t ${isDarkMode ? 'border-stone-800 bg-stone-900/50' : 'border-stone-100 bg-stone-50/50'}`}>
                <p className="text-[10px] text-stone-500 font-medium italic">
                  *Alamat akan diperbarui secara otomatis setelah Anda menekan tombol "Gunakan Lokasi Ini" di dalam peta.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <h2 className={`text-2xl font-serif font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Informasi Umum</h2>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Judul Undangan</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Kalimat Pembuka (Cover)</label>
            <input 
              type="text" 
              value={formData.openingGreeting}
              onChange={(e) => setFormData({...formData, openingGreeting: e.target.value})}
              placeholder="Contoh: The Wedding Of"
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
            />
            <p className="text-xs text-stone-500 mt-1">Teks ini akan muncul di bagian atas sebelum nama mempelai.</p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Tautan Kustom</label>
            <div className="flex items-center">
              <span className={`px-4 py-2 border border-r-0 rounded-l-xl text-sm ${isDarkMode ? 'bg-stone-800 border-stone-700 text-stone-500' : 'bg-stone-100 border-stone-300 text-stone-500'}`}>
                karsaloka.id/
              </span>
              <input 
                type="text" 
                value={formData.customLink}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                  setFormData({...formData, customLink: value});
                }}
                placeholder="nama-pasangan"
                className={`w-full px-4 py-2 border rounded-r-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
              />
            </div>
            <p className="text-xs text-stone-500 mt-1">Gunakan huruf kecil, angka, dan tanda hubung (-).</p>
            
            <button 
              onClick={handleShare}
              className={`mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                showShareSuccess 
                  ? 'bg-green-500 text-white shadow-green-200' 
                  : (isDarkMode ? 'bg-stone-800 text-stone-200 hover:bg-stone-700 border border-stone-700' : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200')
              }`}
            >
              {showShareSuccess ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {showShareSuccess ? 'Tautan Tersalin!' : 'Bagikan Undangan'}
            </button>
          </div>

          {/* Save the Date Section */}
          <div className={`p-6 rounded-2xl border mt-8 ${isDarkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
            <h3 className={`text-lg font-serif font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>
              <CalendarHeart className="w-5 h-5 text-rose-500" />
              Save the Date
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Tanggal Save the Date</label>
                <input 
                  type="date" 
                  value={formData.saveTheDateDate}
                  onChange={(e) => setFormData({...formData, saveTheDateDate: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Deskripsi Singkat</label>
                <textarea 
                  rows={3}
                  value={formData.saveTheDateDescription}
                  onChange={(e) => setFormData({...formData, saveTheDateDescription: e.target.value})}
                  placeholder="Contoh: Kami sangat menantikan kehadiran Anda di hari bahagia kami."
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all resize-none ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
                />
              </div>
              <button 
                onClick={() => {
                  setShowSaveDateSuccess(true);
                  setTimeout(() => setShowSaveDateSuccess(false), 2000);
                }}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                  showSaveDateSuccess 
                    ? 'bg-green-500 text-white shadow-green-200' 
                    : 'bg-stone-900 text-white hover:bg-rose-600'
                }`}
              >
                {showSaveDateSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {showSaveDateSuccess ? 'Tersimpan!' : 'Simpan Save the Date'}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Nama Mempelai Pria</label>
              <input 
                type="text" 
                value={formData.groomName}
                onChange={(e) => setFormData({...formData, groomName: e.target.value})}
                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Nama Mempelai Wanita</label>
              <input 
                type="text" 
                value={formData.brideName}
                onChange={(e) => setFormData({...formData, brideName: e.target.value})}
                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
              />
            </div>
          </div>

          {/* === AKAD NIKAH === */}
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-rose-50/50 border-rose-100'}`}>
            <h3 className={`text-base font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>
              🕌 Akad Nikah
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Tanggal Akad</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Waktu Akad</label>
                  <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Nama Tempat/Gedung Akad</label>
                <input type="text" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
                  placeholder="Contoh: Masjid Al-Azhar"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Alamat Lengkap Akad</label>
                <textarea rows={2} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all resize-none ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
                  placeholder="Contoh: Jl. Sisingamangaraja, Kebayoran Baru, Jakarta Selatan"
                />
              </div>
            </div>
          </div>

          {/* === RESEPSI === */}
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-amber-50/50 border-amber-100'}`}>
            <h3 className={`text-base font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>
              🎊 Resepsi Pernikahan
            </h3>
            <p className={`text-xs mb-4 ${isDarkMode ? 'text-stone-500' : 'text-stone-500'}`}>
              Kosongkan jika akad dan resepsi di tempat/waktu yang sama.
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Tanggal Resepsi</label>
                  <input type="date" value={formData.receptionDate} onChange={(e) => setFormData({...formData, receptionDate: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Waktu Resepsi</label>
                  <input type="time" value={formData.receptionTime} onChange={(e) => setFormData({...formData, receptionTime: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Nama Tempat/Gedung Resepsi</label>
                <input type="text" value={formData.receptionVenue} onChange={(e) => setFormData({...formData, receptionVenue: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
                  placeholder="Contoh: Ballroom Hotel Mulia"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Alamat Lengkap Resepsi</label>
                <textarea rows={2} value={formData.receptionAddress} onChange={(e) => setFormData({...formData, receptionAddress: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all resize-none ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
                  placeholder="Contoh: Jl. Asia Afrika, Senayan, Jakarta Pusat"
                />
              </div>
            </div>
          </div>

          {/* Interactive Map */}
          {formData.address && (
            <div className="mt-6 flex flex-col items-center">
              <div className="w-full max-w-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>Pratinjau Lokasi</span>
                </div>
                <div className={`w-full h-[220px] sm:h-[300px] md:aspect-video rounded-[2rem] overflow-hidden border-2 shadow-xl relative group transition-all duration-300 z-0 ${isDarkMode ? 'border-stone-800 bg-stone-900 shadow-black/20' : 'border-stone-100 bg-stone-50 shadow-stone-200/50'}`}>
                  <LeafletMap 
                    address={formData.address} 
                    mapCoordinates={formData.mapCoordinates}
                    editable={false}
                    onSelectAddress={(newAddress, lat, lng) => setFormData({
                      ...formData, 
                      address: newAddress,
                      mapCoordinates: lat && lng ? { lat, lng } : formData.mapCoordinates
                    })}
                  />
                  <div className="absolute inset-0 pointer-events-none border-[8px] border-transparent group-hover:border-rose-500/10 transition-all rounded-[2rem] z-[1001]"></div>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 z-[1002] bg-stone-900 text-white px-4 py-2 rounded-xl text-[10px] font-bold shadow-2xl flex items-center gap-2 hover:bg-rose-600 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                  >
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    Buka di Google Maps
                  </a>
                  <button
                    onClick={() => setIsMapModalOpen(true)}
                    className="absolute top-4 right-4 z-[1002] bg-white text-stone-900 px-4 py-2 rounded-xl text-[10px] font-bold shadow-2xl flex items-center gap-2 hover:bg-stone-100 transition-all"
                  >
                    Edit Pin Lokasi
                  </button>
                </div>
                <p className={`text-[10px] mt-3 italic text-center ${isDarkMode ? 'text-stone-500' : 'text-stone-400'}`}>
                  *Peta interaktif ini membantu tamu menemukan lokasi acara Anda dengan mudah.
                </p>
              </div>
            </div>
          )}

          <div className={`pt-4 border-t ${isDarkMode ? 'border-stone-800' : 'border-stone-200'}`}>
            <h3 className={`text-lg font-serif font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Tautan Media Sosial</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Instagram</label>
                <div className="flex items-center">
                  <span className={`px-4 py-2 border border-r-0 rounded-l-xl text-sm ${isDarkMode ? 'bg-stone-800 border-stone-700 text-stone-500' : 'bg-stone-100 border-stone-300 text-stone-500'}`}>
                    @
                  </span>
                  <input 
                    type="text" 
                    value={formData.instagram}
                    onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                    placeholder="username"
                    className={`w-full px-4 py-2 border rounded-r-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Facebook</label>
                <input 
                  type="text" 
                  value={formData.facebook}
                  onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                  placeholder="Tautan profil Facebook"
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Twitter / X</label>
                <div className="flex items-center">
                  <span className={`px-4 py-2 border border-r-0 rounded-l-xl text-sm ${isDarkMode ? 'bg-stone-800 border-stone-700 text-stone-500' : 'bg-stone-100 border-stone-300 text-stone-500'}`}>
                    @
                  </span>
                  <input 
                    type="text" 
                    value={formData.twitter}
                    onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                    placeholder="username"
                    className={`w-full px-4 py-2 border rounded-r-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
