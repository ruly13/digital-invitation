import { FormData } from '@/hooks/useEditorData';
import { MessageSquare } from 'lucide-react';

interface EditorTabBukuTamuProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isDarkMode: boolean;
}

export default function EditorTabBukuTamu({ formData, setFormData, isDarkMode }: EditorTabBukuTamuProps) {
  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-serif font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Buku Tamu & Ucapan</h2>
      
      <div className={`p-6 border rounded-2xl ${isDarkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Aktifkan Kolom Ucapan</h3>
            <p className={`text-sm ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>Tamu dapat mengirimkan doa dan ucapan secara langsung di undangan.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={formData.enableGuestbook}
              onChange={(e) => setFormData({...formData, enableGuestbook: e.target.checked})}
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
          </label>
        </div>
        {formData.enableGuestbook && (
          <div className="mt-4 p-4 border rounded-xl flex items-start gap-3 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700">
            <div className="mt-0.5">
              <MessageSquare className="w-5 h-5 text-rose-500" />
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Kolom ucapan mendukung sistem <span className="font-semibold text-rose-500">Realtime Update</span>. 
              Tamu bisa melihat ucapan tamu lain secara langsung tanpa memuat ulang (refresh) halaman.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
