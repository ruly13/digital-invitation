import { FormData } from '@/hooks/useEditorData';
import { Plus, Trash2, Calendar } from 'lucide-react';

interface EditorTabKisahProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isDarkMode: boolean;
}

export default function EditorTabKisah({ formData, setFormData, isDarkMode }: EditorTabKisahProps) {
  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-serif font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Kisah Cinta</h2>
      
      <div className={`p-6 border rounded-2xl ${isDarkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Timeline Perjalanan</h3>
            <p className={`text-sm ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>Ceritakan perjalanan kisah cinta Anda kepada tamu undangan.</p>
          </div>
          <button 
            onClick={() => setFormData({...formData, loveStories: [...formData.loveStories, { date: '', title: '', description: '' }]})}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Tambah Kisah
          </button>
        </div>
        
        <div className="space-y-6">
          {formData.loveStories.map((story, index) => (
            <div key={`story-${index}`} className={`relative p-5 border rounded-xl ${isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
              <button 
                onClick={() => setFormData({
                  ...formData, 
                  loveStories: formData.loveStories.filter((_, i) => i !== index)
                })} 
                className="absolute right-4 top-4 text-stone-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Tanggal / Tahun</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-stone-500' : 'text-stone-400'}`} />
                      </div>
                      <input 
                        type="text" 
                        value={story.date} 
                        onChange={(e) => {
                          const newStories = [...formData.loveStories];
                          newStories[index].date = e.target.value;
                          setFormData({...formData, loveStories: newStories});
                        }} 
                        placeholder="Cth: Januari 2020" 
                        className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none ${isDarkMode ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Judul Cerita</label>
                    <input 
                      type="text" 
                      value={story.title} 
                      onChange={(e) => {
                        const newStories = [...formData.loveStories];
                        newStories[index].title = e.target.value;
                        setFormData({...formData, loveStories: newStories});
                      }} 
                      placeholder="Cth: Pertama Bertemu" 
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none ${isDarkMode ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`} 
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Isi Cerita</label>
                  <textarea 
                    rows={3}
                    value={story.description} 
                    onChange={(e) => {
                      const newStories = [...formData.loveStories];
                      newStories[index].description = e.target.value;
                      setFormData({...formData, loveStories: newStories});
                    }} 
                    placeholder="Ceritakan momen tersebut secara singkat..." 
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none resize-none ${isDarkMode ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`} 
                  />
                </div>
              </div>
            </div>
          ))}
          {formData.loveStories.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-stone-500">Belum ada kisah cinta yang ditambahkan.</p>
              <button 
                onClick={() => setFormData({...formData, loveStories: [{ date: '', title: '', description: '' }]})}
                className="mt-2 text-sm font-medium text-rose-500 hover:text-rose-600"
              >
                + Mulai Tulis Kisah Anda
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
