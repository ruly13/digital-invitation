import { FormData } from '@/hooks/useEditorData';
import { UploadCloud, Trash2, GripVertical, Plus } from 'lucide-react';
import React from 'react';
import Image from 'next/image';

interface EditorTabGaleriProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isDarkMode: boolean;
  uploadingImage: { [key: string]: boolean };
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'audio', index?: number) => Promise<void>;
}

export default function EditorTabGaleri({ 
  formData, 
  setFormData, 
  isDarkMode, 
  uploadingImage, 
  handleFileUpload 
}: EditorTabGaleriProps) {
  // Buat referensi dinamis untuk input file galeri
  const galleryInputRefs = React.useRef<{ [key: number]: HTMLInputElement | null }>({});

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-serif font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Galeri Foto</h2>
      
      <div className={`p-6 border rounded-2xl ${isDarkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Foto-Foto Momen</h3>
            <p className={`text-sm ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>Tambahkan foto pre-wedding atau momen spesial lainnya.</p>
          </div>
          <button 
            onClick={() => setFormData({...formData, gallery: [...formData.gallery, '']})}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 bg-rose-50 dark:bg-rose-900/20 px-3 py-1.5 rounded-lg"
          >
            <Plus className="w-4 h-4" /> Tambah Foto
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {formData.gallery.map((url, index) => (
            <div key={`gallery-${index}`} className={`relative aspect-[3/4] border-2 border-dashed rounded-xl overflow-hidden group ${isDarkMode ? 'border-stone-700 bg-stone-900' : 'border-stone-300 bg-white'}`}>
              {url ? (
                <>
                  <Image src={url} alt={`Gallery ${index + 1}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      onClick={() => galleryInputRefs.current[index]?.click()}
                      className="w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
                      title="Ganti Foto"
                    >
                      <UploadCloud className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        const newGallery = [...formData.gallery];
                        newGallery.splice(index, 1);
                        setFormData({...formData, gallery: newGallery});
                      }}
                      className="w-8 h-8 bg-red-500/80 hover:bg-red-500 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
                      title="Hapus Foto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 w-6 h-6 bg-black/40 backdrop-blur-sm rounded-md flex items-center justify-center cursor-move">
                    <GripVertical className="w-3 h-3 text-white" />
                  </div>
                </>
              ) : (
                <div 
                  onClick={() => galleryInputRefs.current[index]?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                >
                  {uploadingImage[`gallery-${index}`] ? (
                    <div className="w-6 h-6 border-3 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <UploadCloud className={`w-6 h-6 mb-2 ${isDarkMode ? 'text-stone-500' : 'text-stone-400'}`} />
                      <span className={`text-xs font-medium ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>Upload Foto</span>
                    </>
                  )}
                </div>
              )}
              <input 
                type="file" 
                ref={(el) => { galleryInputRefs.current[index] = el; }}
                onChange={(e) => handleFileUpload(e, 'image', index)} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          ))}
          {formData.gallery.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-stone-500 border-2 border-dashed rounded-xl border-stone-300 dark:border-stone-700">
              <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-4">
                <Image className="w-8 h-8 opacity-50" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E" alt="Empty Gallery" width={32} height={32} />
              </div>
              <p className="font-medium text-stone-900 dark:text-white">Galeri Masih Kosong</p>
              <p className="text-sm mt-1 mb-4">Mulai tambahkan foto-foto terbaik Anda.</p>
              <button 
                onClick={() => setFormData({...formData, gallery: ['']})}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-rose-500/20"
              >
                Upload Foto Pertama
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-stone-500 mt-4 text-center">Tarik dan lepas (<GripVertical className="inline w-3 h-3" />) untuk mengatur urutan foto. Disarankan rasio 3:4 (Potrait).</p>
      </div>
      
      <div className={`p-6 border rounded-2xl ${isDarkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
        <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Video YouTube (Opsional)</h3>
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>Masukkan ID Video YouTube untuk menampilkan video sinematik.</p>
        <div className="flex gap-2">
          <span className={`inline-flex items-center px-3 rounded-l-lg border border-r-0 text-sm ${isDarkMode ? 'bg-stone-800 border-stone-700 text-stone-400' : 'bg-stone-100 border-stone-300 text-stone-500'}`}>
            youtube.com/watch?v=
          </span>
          <input 
            type="text" 
            value={formData.youtubeId} 
            onChange={(e) => setFormData({...formData, youtubeId: e.target.value})}
            placeholder="ID Video (Cth: dQw4w9WgXcQ)" 
            className={`flex-1 px-3 py-2 border rounded-r-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none ${isDarkMode ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`} 
          />
        </div>
      </div>
    </div>
  );
}
