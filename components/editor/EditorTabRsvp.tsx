import { FormData } from '@/hooks/useEditorData';
import { Send } from 'lucide-react';

interface EditorTabRsvpProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isDarkMode: boolean;
}

export default function EditorTabRsvp({ formData, setFormData, isDarkMode }: EditorTabRsvpProps) {
  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-serif font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Sistem RSVP</h2>
      
      <div className={`p-6 border rounded-2xl ${isDarkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Aktifkan Form RSVP</h3>
            <p className={`text-sm ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>Izinkan tamu untuk mengonfirmasi kehadiran mereka.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={formData.enableRSVP}
              onChange={(e) => setFormData({...formData, enableRSVP: e.target.checked})}
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
          </label>
        </div>
        {formData.enableRSVP && (
          <div className="mt-4 p-4 bg-rose-500/10 rounded-xl border border-rose-500/20">
            <p className="text-sm font-medium text-rose-600 dark:text-rose-400 flex flex-col gap-1">
              <span>✓ Form Konfirmasi Kehadiran (Hadir / Tidak Hadir)</span>
              <span>✓ Pilihan Jumlah Orang yang Akan Dibawa (Maks. 5 orang)</span>
              <span>✓ Data akan terekam ke menu &quot;Buku tamu&quot; di Dashboard</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
