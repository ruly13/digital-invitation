import { FormData } from '@/hooks/useEditorData';

const FONT_OPTIONS = [
  { value: '', label: 'Bawaan Tema' },
  { value: 'Inter', label: 'Inter (Modern Sans)' },
  { value: 'Playfair Display', label: 'Playfair Display (Elegan Serif)' },
  { value: 'Montserrat', label: 'Montserrat (Bersih Sans)' },
  { value: 'Lora', label: 'Lora (Klasik Serif)' },
  { value: 'Dancing Script', label: 'Dancing Script (Tegak Bersambung)' },
  { value: 'Great Vibes', label: 'Great Vibes (Mewah Bersambung)' },
  { value: 'Cinzel', label: 'Cinzel (Klasik Kapital)' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond (Tradisional Serif)' },
  { value: 'Outfit', label: 'Outfit (Geometris Modern)' },
  { value: 'Space Grotesk', label: 'Space Grotesk (Teknologi)' },
];

interface EditorTabTeksProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isDarkMode: boolean;
}

export default function EditorTabTeks({ formData, setFormData, isDarkMode }: EditorTabTeksProps) {
  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-serif font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Teks & Konten</h2>
      
      <div>
        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Pilihan Font</label>
        <select
          value={formData.customFont}
          onChange={(e) => setFormData({...formData, customFont: e.target.value})}
          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
        >
          {FONT_OPTIONS.map(font => (
            <option key={font.value} value={font.value} className={isDarkMode ? 'bg-stone-800 text-white' : 'bg-white text-stone-900'}>
              {font.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-stone-500 mt-2">Pilih font kustom dari Google Fonts untuk menggantikan font bawaan tema.</p>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Kalimat Sambutan</label>
        <textarea 
          rows={5}
          value={formData.greeting}
          onChange={(e) => setFormData({...formData, greeting: e.target.value})}
          className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all resize-none ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
        />
        <p className="text-xs text-stone-500 mt-2">Kalimat ini akan muncul di bagian isi undangan setelah bagian pembuka.</p>
      </div>
    </div>
  );
}
