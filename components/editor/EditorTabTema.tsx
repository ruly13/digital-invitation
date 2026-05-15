import { FormData } from '@/hooks/useEditorData';
import { THEME_INFO, ThemeCard } from './ThemeComponents';
import { Layers } from 'lucide-react';

interface EditorTabTemaProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isDarkMode: boolean;
  setPreviewThemeId: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function EditorTabTema({ formData, setFormData, isDarkMode, setPreviewThemeId }: EditorTabTemaProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-2xl font-serif font-semibold ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Tema Undangan</h2>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>Pilih desain visual yang sesuai dengan konsep pernikahan Anda.</p>
        </div>
        <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-stone-800' : 'bg-stone-100'}`}>
          <Layers className={`w-5 h-5 ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(THEME_INFO).map(([id, info]) => (
          <ThemeCard 
            key={id}
            id={id}
            info={info}
            isSelected={formData.theme === id}
            onSelect={() => setFormData({...formData, theme: id})}
            onPreview={() => setPreviewThemeId(id)}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  );
}
