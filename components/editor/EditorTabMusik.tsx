import { FormData } from '@/hooks/useEditorData';
import { UploadCloud, Music, Play, Pause, Trash2, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import Image from 'next/image';

const MUSIC_LIBRARY = [
  { id: '1', title: 'Beautiful in White', artist: 'Westlife', url: 'https://example.com/music1.mp3', duration: '3:45' },
  { id: '2', title: 'A Thousand Years', artist: 'Christina Perri', url: 'https://example.com/music2.mp3', duration: '4:45' },
  { id: '3', title: 'Perfect', artist: 'Ed Sheeran', url: 'https://example.com/music3.mp3', duration: '4:23' },
  { id: '4', title: 'Marry Your Daughter', artist: 'Brian McKnight', url: 'https://example.com/music4.mp3', duration: '3:42' },
  { id: '5', title: 'You Are The Reason', artist: 'Calum Scott', url: 'https://example.com/music5.mp3', duration: '3:24' },
];

interface EditorTabMusikProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isDarkMode: boolean;
  uploadingAudio: boolean;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'audio', index?: number) => Promise<void>;
  fileInputRefs: {
    cover: React.RefObject<HTMLInputElement>;
    coupleImage: React.RefObject<HTMLInputElement>;
    audio: React.RefObject<HTMLInputElement>;
  };
}

export default function EditorTabMusik({ 
  formData, 
  setFormData, 
  isDarkMode, 
  uploadingAudio, 
  handleFileUpload, 
  fileInputRefs 
}: EditorTabMusikProps) {
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = (audioUrl: string, id: string) => {
    if (playingAudioId === id) {
      audioRef.current?.pause();
      setPlayingAudioId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const newAudio = new Audio(audioUrl);
      newAudio.play();
      newAudio.onended = () => setPlayingAudioId(null);
      audioRef.current = newAudio;
      setPlayingAudioId(id);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-serif font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Musik Latar</h2>
      
      <div className={`p-6 border rounded-2xl ${isDarkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
        <h3 className={`font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Musik Terpilih</h3>
        
        {formData.backgroundMusic ? (
          <div className="flex items-center justify-between p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-rose-100 dark:bg-rose-800 rounded-full flex items-center justify-center text-rose-500">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-stone-900 dark:text-white line-clamp-1">{formData.musicFileName || 'Musik Kustom'}</p>
                <p className="text-xs text-stone-500">Sedang Digunakan</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => togglePlay(formData.backgroundMusic, 'selected')}
                className="p-2 bg-white dark:bg-stone-800 rounded-full shadow-sm hover:bg-stone-50 transition-colors"
              >
                {playingAudioId === 'selected' ? <Pause className="w-4 h-4 text-rose-500" /> : <Play className="w-4 h-4 text-rose-500" />}
              </button>
              <button 
                onClick={() => setFormData({...formData, backgroundMusic: '', musicFileName: ''})}
                className="p-2 bg-white dark:bg-stone-800 rounded-full shadow-sm hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-stone-500 italic mb-4">Belum ada musik yang dipilih.</p>
        )}

        <div className="mt-8">
          <h3 className={`font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Upload Musik Sendiri</h3>
          <div 
            onClick={() => fileInputRefs.audio.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDarkMode ? 'border-stone-700 hover:border-stone-500 bg-stone-900/50' : 'border-stone-300 hover:border-stone-400 bg-white'}`}
          >
            {uploadingAudio ? (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className={`text-sm ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>Mengunggah Audio...</p>
              </div>
            ) : (
              <>
                <UploadCloud className={`w-8 h-8 mb-3 ${isDarkMode ? 'text-stone-500' : 'text-stone-400'}`} />
                <p className={`font-medium mb-1 ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>Klik untuk upload file audio</p>
                <p className={`text-xs ${isDarkMode ? 'text-stone-500' : 'text-stone-400'}`}>MP3, WAV (Maks. 5MB)</p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRefs.audio}
              onChange={(e) => handleFileUpload(e, 'audio')} 
              accept="audio/*" 
              className="hidden" 
            />
          </div>
        </div>

        <div className="mt-8">
          <h3 className={`font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Pilih dari Perpustakaan</h3>
          <div className="space-y-3">
            {MUSIC_LIBRARY.map((music) => (
              <div key={music.id} className={`flex items-center justify-between p-3 border rounded-xl hover:border-rose-300 transition-colors ${formData.backgroundMusic === music.url ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-900/10' : isDarkMode ? 'border-stone-700 bg-stone-800' : 'border-stone-200 bg-white'}`}>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => togglePlay(music.url, music.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${playingAudioId === music.id ? 'bg-rose-500 text-white' : isDarkMode ? 'bg-stone-700 text-stone-300' : 'bg-stone-100 text-stone-600'}`}
                  >
                    {playingAudioId === music.id ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                  </button>
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{music.title}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-stone-500' : 'text-stone-500'}`}>{music.artist} • {music.duration}</p>
                  </div>
                </div>
                <button
                  onClick={() => setFormData({...formData, backgroundMusic: music.url, musicFileName: `${music.title} - ${music.artist}`})}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${formData.backgroundMusic === music.url ? 'bg-rose-500 text-white' : isDarkMode ? 'bg-stone-700 text-stone-300 hover:bg-stone-600' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                >
                  {formData.backgroundMusic === music.url ? 'Terpilih' : 'Pilih'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
