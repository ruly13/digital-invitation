'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Image as ImageIcon, Type, Palette, Music, LayoutTemplate, Settings, Eye, X, Maximize2, Trash2, ChevronLeft, ChevronRight, Upload, Play, Pause, Link as LinkIcon, Library, Heart, Info, Volume2, VolumeX, Moon, Sun, Search, Share2, Check, CalendarHeart, CheckCircle2, MapPin, Send, Gift, BookOpen, MessageSquare, Plus, HeartHandshake } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactPlayer from 'react-player';
import dynamic from 'next/dynamic';
import WhatsAppButton from '@/components/WhatsAppButton';
import AIChatWidget from '@/components/AIChatWidget';
import PageTransition from '@/components/PageTransition';
import { supabase } from '@/lib/supabase';
import imageCompression from 'browser-image-compression';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-stone-100 animate-pulse flex items-center justify-center text-stone-400 text-xs">Memuat Peta...</div>
});

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

const MUSIC_LIBRARY = [
  { id: 'canon', name: 'Canon in D - Pachelbel', url: 'https://www.youtube.com/watch?v=NlprozGcs80' },
  { id: 'thousand', name: 'A Thousand Years - Christina Perri', url: 'https://www.youtube.com/watch?v=rtOvBOTyX00' },
  { id: 'perfect', name: 'Perfect - Ed Sheeran', url: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g' },
  { id: 'beautiful', name: 'Beautiful in White - Westlife', url: 'https://www.youtube.com/watch?v=XRuDQ6aDirE' },
  { id: 'nothing', name: 'Nothing\'s Gonna Change My Love For You', url: 'https://www.youtube.com/watch?v=kyB82k10E7E' },
  { id: 'marry-you', name: 'Marry You - Bruno Mars', url: 'https://www.youtube.com/watch?v=8p_W7-A2V24' },
  { id: 'all-of-me', name: 'All of Me - John Legend', url: 'https://www.youtube.com/watch?v=450p7goxZqg' },
  { id: 'can-you-feel', name: 'Can You Feel The Love Tonight', url: 'https://www.youtube.com/watch?v=25QyCx7V9wM' },
  { id: 'i-do', name: 'I Do - 911', url: 'https://www.youtube.com/watch?v=1u-S_Ym9_wE' },
  { id: 'janji-suci', name: 'Janji Suci - Yovie & Nuno', url: 'https://www.youtube.com/watch?v=kYv9_c-v-3s' },
  { id: 'akad', name: 'Akad - Payung Teduh', url: 'https://www.youtube.com/watch?v=viW0M5R2n_8' },
];

const THEME_INFO: Record<string, string> = {
  elegant: "Inspirasi dari pernikahan kerajaan Eropa dengan palet warna krem dan font serif yang abadi.",
  floral: "Suasana taman bunga di musim semi, memberikan kesan segar, feminin, dan penuh kebahagiaan.",
  modern: "Fokus pada tipografi bersih dan ruang negatif, cocok untuk pasangan yang menyukai kesederhanaan urban.",
  rustic: "Sentuhan kayu, kertas kraft, dan elemen alam yang memberikan suasana hangat dan kekeluargaan.",
  luxury: "Kombinasi emas dan putih gading untuk kesan eksklusif, mewah, dan prestisius.",
  ocean: "Inspirasi dari ketenangan laut dan langit biru, sempurna untuk pernikahan di tepi pantai.",
  minimalist: "Kembali ke dasar dengan palet monokromatik yang sangat bersih dan tidak lekang oleh waktu.",
  romantic: "Warna-warna pastel lembut yang membangkitkan perasaan cinta yang manis dan puitis.",
  'minimalist-elegant': "Perpaduan antara kesederhanaan modern dengan detail tipografi yang sangat halus.",
  'night-fantasy': "Suasana pesta malam yang magis dengan latar gelap dan aksen cahaya bintang.",
  'tropical-nature': "Eksotisme alam tropis dengan warna hijau daun yang menyegarkan dan ceria.",
  'classic-navy': "Kesan formal dan berwibawa dengan warna biru tua yang dipadukan dengan aksen emas.",
  'vintage-rose': "Gaya retro yang romantis dengan palet warna mawar yang memudar, memberikan kesan nostalgia.",
  'modern-geometric': "Pola garis dan bentuk geometris yang dinamis untuk pasangan yang berjiwa seni tinggi.",
  'army': "Gaya militer dengan warna hijau zaitun khas tentara, melambangkan perlindungan, ketegasan dan pengabdian.",
};

export default function Editor() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [activeTab, setActiveTab] = useState('umum');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [musicTab, setMusicTab] = useState<'library' | 'upload' | 'external'>('library');
  const [musicSearchQuery, setMusicSearchQuery] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [previewThemeId, setPreviewThemeId] = useState<string | null>(null);
  const [infoThemeId, setInfoThemeId] = useState<string | null>(null);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [showSaveDateSuccess, setShowSaveDateSuccess] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Pernikahan Rina & Budi',
    customLink: 'rina-budi',
    customFont: '',
    groomName: 'Budi Santoso',
    brideName: 'Rina Wijaya',
    date: '2026-08-12',
    time: '09:00',
    venue: 'Gedung Serbaguna Senayan',
    address: 'Jl. Pintu Satu Senayan, Jakarta Pusat',
    theme: 'elegant',
    openingGreeting: 'The Wedding Of',
    saveTheDateDate: '',
    saveTheDateDescription: '',
    customBgColor: '',
    customAccentColor: '',
    musicUrl: '',
    musicVolume: 50,
    greeting: 'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan resepsi pernikahan putra-putri kami.',
    gallery: [] as string[],
    instagram: '',
    facebook: '',
    twitter: '',
    enableRSVP: true,
    bankAccounts: [] as { bank: string; accountName: string; accountNumber: string; qrisUrl?: string }[],
    digitalWallets: [] as { ewallet: string; accountName: string; accountNumber: string; qrisUrl?: string }[],
    shippingAddress: '',
    loveStories: [] as { year: string; title: string; story: string; imageUrl?: string }[],
    enableGuestbook: true,
    preventSpam: true,
  });

  const handleQRUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'bank' | 'wallet', index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Simple mock upload simulation since we don't have a storage logic yet
    // In real app, this would use supabase.storage
    const imageUrl = URL.createObjectURL(file);
    
    if (type === 'bank') {
      const newAccounts = [...formData.bankAccounts];
      newAccounts[index].qrisUrl = imageUrl;
      setFormData({...formData, bankAccounts: newAccounts});
    } else {
      const newWallets = [...formData.digitalWallets];
      newWallets[index].qrisUrl = imageUrl;
      setFormData({...formData, digitalWallets: newWallets});
    }
  };

  useEffect(() => {
    async function loadData() {
      if (id === 'new') {
        setLoadingInitial(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (data && data.details) {
          // Merge db columns with JSONB details
          setFormData(prev => ({
            ...prev,
            ...data.details,
            title: data.title || prev.title,
            customLink: data.url_slug || prev.customLink,
            brideName: data.bride_name || prev.brideName,
            groomName: data.groom_name || prev.groomName,
            date: data.event_date ? data.event_date.split('T')[0] : prev.date,
            venue: data.venue_name || prev.venue,
            address: data.venue_address || prev.address,
            theme: data.theme_name || prev.theme,
            musicUrl: data.music_url || prev.musicUrl,
          }));
        }
      } catch (err) {
        console.error("Gagal memuat data undangan:", err);
      } finally {
        setLoadingInitial(false);
      }
    }
    loadData();
  }, [id]);

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Lebih dari 5MB
        alert('File audio maksimal 5MB agar mudah dimuat!');
        return;
      }
      setIsUploading(true);
      try {
        const fileExt = file.name.split('.').pop() || 'mp3';
        const fileName = `audio_${Math.random().toString(36).substring(2, 10)}_${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error } = await supabase.storage
          .from('gallery')
          .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);

        setFormData(prev => ({
          ...prev,
          musicUrl: publicUrl
        }));
        
        setShowUploadSuccess(true);
        setTimeout(() => setShowUploadSuccess(false), 3000);
      } catch (err) {
        console.error("Gagal mengunggah musik:", err);
        alert("Gagal mengunggah musik");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/invite/${formData.customLink || id}`;
    navigator.clipboard.writeText(url);
    setShowShareSuccess(true);
    setTimeout(() => setShowShareSuccess(false), 2000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    const newImages: string[] = [];

    try {
      for (const file of Array.from(files)) {
        // Trik: Kompres Gambar! Maks 0.2MB atau lebar maks 1280px untuk Lighthouse Score tinggi
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
          fileType: 'image/webp' // Gunakan WebP untuk kompresi maksimal
        };
        
        let fileToUpload = file;
        try {
          // @ts-ignore
          fileToUpload = await imageCompression(file, options);
          // Ganti extension ke .webp karena kita convert
          const blob = fileToUpload as Blob;
          fileToUpload = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: 'image/webp' });
        } catch (comprErr) {
          console.error("Gagal kompresi, gunakan file asli", comprErr);
        }
        
        const fileExt = 'webp';
        const fileName = `${Math.random().toString(36).substring(2, 10)}_${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;
        
        const { error } = await supabase.storage
          .from('gallery')
          .upload(filePath, fileToUpload);
          
        if (error) {
          console.error('Error uploading image:', error);
          alert('Gagal mengunggah foto. Coba lagi.');
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);
          
        newImages.push(publicUrl);
      }

      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...newImages],
      }));

      setShowUploadSuccess(true);
      setTimeout(() => setShowUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Error saat kompresi/mengunggah:', error);
      alert('Terjadi kesalahan unggahan!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleStoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, storyIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const options = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
        fileType: 'image/webp' as const,
      };

      let fileToUpload: File = file;
      try {
        // @ts-ignore
        const compressed = await imageCompression(file, options);
        fileToUpload = new File([compressed], file.name.replace(/\.[^/.]+$/, '') + '.webp', { type: 'image/webp' });
      } catch {
        // fallback to original if compression fails
      }

      const fileName = `story_${Math.random().toString(36).substring(2, 10)}_${Date.now()}.webp`;
      const filePath = `uploads/${fileName}`;

      const { error } = await supabase.storage.from('gallery').upload(filePath, fileToUpload);
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(filePath);

      const newStories = [...formData.loveStories];
      newStories[storyIndex] = { ...newStories[storyIndex], imageUrl: publicUrl };
      setFormData({ ...formData, loveStories: newStories });

      setShowUploadSuccess(true);
      setTimeout(() => setShowUploadSuccess(false), 3000);
    } catch (err) {
      console.error('Gagal upload foto kisah cinta:', err);
      alert('Gagal mengunggah foto. Coba lagi.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const imgUrl = formData.gallery[index];
    // Hapus dari Storage Supabase agar rapi & tidak menghabiskan limit
    if (imgUrl.includes('supabase.co/storage/v1/object/public/gallery/')) {
        const filePath = imgUrl.split('public/gallery/')[1];
        supabase.storage.from('gallery').remove([filePath]).catch(console.error);
    }

    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    setFormData(prev => {
      const newGallery = [...prev.gallery];
      if (direction === 'left' && index > 0) {
        [newGallery[index - 1], newGallery[index]] = [newGallery[index], newGallery[index - 1]];
      } else if (direction === 'right' && index < newGallery.length - 1) {
        [newGallery[index + 1], newGallery[index]] = [newGallery[index], newGallery[index + 1]];
      }
      return { ...prev, gallery: newGallery };
    });
  };

  const handleSave = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        alert("Sesi telah habis. Silakan login kembali.");
        router.push('/login');
        return;
      }

      // 1. Cek Keunikan Link (Slug)
      if (formData.customLink) {
        const { data: existingLink } = await supabase
          .from('invitations')
          .select('id')
          .eq('url_slug', formData.customLink)
          .neq('id', id) // Jangan cek diri sendiri jika sedang edit
          .single();

        if (existingLink) {
          alert(`Maaf, link "/invite/${formData.customLink}" sudah digunakan oleh orang lain. Silakan pilih link lain.`);
          return;
        }
      }

      const payload = {
        user_id: userData.user.id,
        url_slug: formData.customLink || null,
        bride_name: formData.brideName,
        groom_name: formData.groomName,
        event_date: formData.date ? new Date(formData.date).toISOString() : null,
        venue_name: formData.venue,
        venue_address: formData.address,
        theme_name: formData.theme,
        music_url: formData.musicUrl,
        details: formData
      };

      if (id === 'new') {
        const { error } = await supabase.from('invitations').insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('invitations').update(payload).eq('id', id);
        if (error) throw error;
      }

      setShowSaveSuccess(true);
      setTimeout(() => {
        setShowSaveSuccess(false);
        router.push('/dashboard');
      }, 2000);
      
    } catch (error: any) {
      console.error("Gagal menyimpan:", error);
      alert(error.message || "Terjadi kesalahan saat menyimpan.");
    }
  };

  if (loadingInitial && id !== 'new') {
    return <div className="min-h-screen flex items-center justify-center bg-stone-50"><p className="text-stone-500 animate-pulse">Memuat data undangan...</p></div>;
  }

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
                  editable={true}
                  onSelectAddress={(newAddress) => {
                    setFormData({...formData, address: newAddress});
                    setIsMapModalOpen(false);
                  }}
                />
              </div>
              
              <div className={`p-4 text-center border-t ${isDarkMode ? 'border-stone-800 bg-stone-900/50' : 'border-stone-100 bg-stone-50/50'}`}>
                <p className="text-[10px] text-stone-500 font-medium italic">
                  *Alamat akan diperbarui secara otomatis setelah Anda menekan tombol &quot;Gunakan Lokasi Ini&quot; di dalam peta.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PageTransition>
      <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'bg-stone-950 text-stone-200' : 'bg-stone-100 text-stone-900'}`}>
        {/* Topbar */}
      <header className={`border-b px-3 sm:px-4 py-3 flex items-center justify-between sticky top-0 z-50 transition-colors duration-300 ${isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-stone-800 text-stone-400' : 'hover:bg-stone-100 text-stone-600'}`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Edit Undangan</h1>
            <p className={`text-xs ${isDarkMode ? 'text-stone-500' : 'text-stone-500'}`}>{id === 'new' ? 'Undangan Baru' : formData.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-stone-800 text-yellow-400 hover:bg-stone-700' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
            title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link href={`/invite/${id}`} target="_blank" className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium transition-colors ${isDarkMode ? 'border-stone-700 text-stone-300 hover:bg-stone-800' : 'border-stone-200 text-stone-700 hover:bg-stone-50'}`}>
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Pratinjau</span>
          </Link>
          <button onClick={handleSave} className="flex items-center gap-2 bg-rose-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20">
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Simpan</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Tools — hidden on mobile, shown on md+ */}
        <aside className={`hidden md:flex w-64 border-r flex-col shrink-0 overflow-y-auto transition-colors duration-300 ${isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
          <nav className="flex flex-col p-2 gap-1">
            <TabButton icon={<Settings />} label="Umum" active={activeTab === 'umum'} onClick={() => setActiveTab('umum')} isDarkMode={isDarkMode} />
            <TabButton icon={<Type />} label="Teks & Konten" active={activeTab === 'teks'} onClick={() => setActiveTab('teks')} isDarkMode={isDarkMode} />
            <TabButton icon={<LayoutTemplate />} label="Tema & Warna" active={activeTab === 'tema'} onClick={() => setActiveTab('tema')} isDarkMode={isDarkMode} />
            <TabButton icon={<ImageIcon />} label="Galeri Foto" active={activeTab === 'galeri'} onClick={() => setActiveTab('galeri')} isDarkMode={isDarkMode} />
            <TabButton icon={<Music />} label="Musik Latar" active={activeTab === 'musik'} onClick={() => setActiveTab('musik')} isDarkMode={isDarkMode} />
            <TabButton icon={<Send />} label="RSVP & Tamu" active={activeTab === 'rsvp'} onClick={() => setActiveTab('rsvp')} isDarkMode={isDarkMode} />
            <TabButton icon={<Gift />} label="Amplop Digital" active={activeTab === 'amplop'} onClick={() => setActiveTab('amplop')} isDarkMode={isDarkMode} />
            <TabButton icon={<BookOpen />} label="Kisah Cinta" active={activeTab === 'kisah'} onClick={() => setActiveTab('kisah')} isDarkMode={isDarkMode} />
            <TabButton icon={<MessageSquare />} label="Buku Tamu" active={activeTab === 'bukutamu'} onClick={() => setActiveTab('bukutamu')} isDarkMode={isDarkMode} />
          </nav>
        </aside>

        {/* Editor Panel */}
        <main className={`flex-1 overflow-y-auto p-3 sm:p-6 pb-24 md:pb-6 transition-colors duration-300 ${isDarkMode ? 'bg-stone-950' : 'bg-stone-50'}`}>
          <div className={`max-w-3xl mx-auto rounded-2xl sm:rounded-3xl shadow-sm border p-4 sm:p-8 overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'umum' && (
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
                        eterna.invite/
                      </span>
                      <input 
                        type="text" 
                        value={formData.customLink}
                        onChange={(e) => {
                          // Only allow lowercase letters, numbers, and hyphens
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Tanggal Acara</label>
                      <input 
                        type="date" 
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Waktu Acara</label>
                      <input 
                        type="time" 
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Nama Tempat/Gedung</label>
                    <input 
                      type="text" 
                      value={formData.venue}
                      onChange={(e) => setFormData({...formData, venue: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Alamat Lengkap</label>
                      <button 
                        onClick={() => setIsMapModalOpen(true)}
                        className="text-[10px] font-bold text-rose-500 flex items-center gap-1 hover:text-rose-600 transition-colors uppercase tracking-widest"
                      >
                        <Search className="w-3 h-3" />
                        Pilih dari Peta
                      </button>
                    </div>
                    <textarea 
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all resize-none ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
                      placeholder="Contoh: Jl. Sudirman No. 1, Jakarta Pusat"
                    />
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
                            editable={true}
                            onSelectAddress={(newAddress) => setFormData({...formData, address: newAddress})}
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
            )}

            {activeTab === 'teks' && (
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
            )}

            {activeTab === 'tema' && (
              <div className="space-y-8">
                <div>
                  <h2 className={`text-2xl font-serif font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Pilih Tema</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <ThemeCard id="elegant" name="Elegan Klasik" color="bg-stone-100" active={formData.theme === 'elegant'} onClick={() => setFormData({...formData, theme: 'elegant'})} onPreview={(e) => { e.stopPropagation(); setPreviewThemeId('elegant'); }} onInfo={(e) => { e.stopPropagation(); setInfoThemeId('elegant'); }} isDarkMode={isDarkMode} />
                    <ThemeCard id="floral" name="Bunga Musim Semi" color="bg-rose-50" active={formData.theme === 'floral'} onClick={() => setFormData({...formData, theme: 'floral'})} onPreview={(e) => { e.stopPropagation(); setPreviewThemeId('floral'); }} onInfo={(e) => { e.stopPropagation(); setInfoThemeId('floral'); }} isDarkMode={isDarkMode} />
                    <ThemeCard id="modern" name="Modern Minimalis" color="bg-slate-100" active={formData.theme === 'modern'} onClick={() => setFormData({...formData, theme: 'modern'})} onPreview={(e) => { e.stopPropagation(); setPreviewThemeId('modern'); }} onInfo={(e) => { e.stopPropagation(); setInfoThemeId('modern'); }} isDarkMode={isDarkMode} />
                    <ThemeCard id="rustic" name="Rustic Alam" color="bg-amber-50" active={formData.theme === 'rustic'} onClick={() => setFormData({...formData, theme: 'rustic'})} onPreview={(e) => { e.stopPropagation(); setPreviewThemeId('rustic'); }} onInfo={(e) => { e.stopPropagation(); setInfoThemeId('rustic'); }} isDarkMode={isDarkMode} />
                    <ThemeCard id="luxury" name="Mewah Emas" color="bg-yellow-50" active={formData.theme === 'luxury'} onClick={() => setFormData({...formData, theme: 'luxury'})} onPreview={(e) => { e.stopPropagation(); setPreviewThemeId('luxury'); }} onInfo={(e) => { e.stopPropagation(); setInfoThemeId('luxury'); }} isDarkMode={isDarkMode} />
                    <ThemeCard id="ocean" name="Biru Laut" color="bg-sky-50" active={formData.theme === 'ocean'} onClick={() => setFormData({...formData, theme: 'ocean'})} onPreview={(e) => { e.stopPropagation(); setPreviewThemeId('ocean'); }} onInfo={(e) => { e.stopPropagation(); setInfoThemeId('ocean'); }} isDarkMode={isDarkMode} />
                    <ThemeCard id="minimalist" name="Minimalis Putih" color="bg-white" active={formData.theme === 'minimalist'} onClick={() => setFormData({...formData, theme: 'minimalist'})} onPreview={(e) => { e.stopPropagation(); setPreviewThemeId('minimalist'); }} onInfo={(e) => { e.stopPropagation(); setInfoThemeId('minimalist'); }} isDarkMode={isDarkMode} />
                    <ThemeCard id="romantic" name="Romantis Pastel" color="bg-pink-50" active={formData.theme === 'romantic'} onClick={() => setFormData({...formData, theme: 'romantic'})} onPreview={(e) => { e.stopPropagation(); setPreviewThemeId('romantic'); }} onInfo={(e) => { e.stopPropagation(); setInfoThemeId('romantic'); }} isDarkMode={isDarkMode} />
                    <ThemeCard id="minimalist-elegant" name="Minimalis Elegan" color="bg-white" active={formData.theme === 'minimalist-elegant'} onClick={() => setFormData({...formData, theme: 'minimalist-elegant'})} onPreview={(e) => { e.stopPropagation(); setPreviewThemeId('minimalist-elegant'); }} onInfo={(e) => { e.stopPropagation(); setInfoThemeId('minimalist-elegant'); }} isDarkMode={isDarkMode} />
                    <ThemeCard id="night-fantasy" name="Fantasi Malam" color="bg-slate-900" active={formData.theme === 'night-fantasy'} onClick={() => setFormData({...formData, theme: 'night-fantasy'})} onPreview={(e) => { e.stopPropagation(); setPreviewThemeId('night-fantasy'); }} onInfo={(e) => { e.stopPropagation(); setInfoThemeId('night-fantasy'); }} isDarkMode={isDarkMode} />
                    <ThemeCard id="tropical-nature" name="Alam Tropis" color="bg-green-100" active={formData.theme === 'tropical-nature'} onClick={() => setFormData({...formData, theme: 'tropical-nature'})} onPreview={(e) => { e.stopPropagation(); setPreviewThemeId('tropical-nature'); }} onInfo={(e) => { e.stopPropagation(); setInfoThemeId('tropical-nature'); }} isDarkMode={isDarkMode} />
                    <ThemeCard id="classic-navy" name="Klasik Biru Navy" color="bg-blue-950" active={formData.theme === 'classic-navy'} onClick={() => setFormData({...formData, theme: 'classic-navy'})} onPreview={(e) => { e.stopPropagation(); setPreviewThemeId('classic-navy'); }} onInfo={(e) => { e.stopPropagation(); setInfoThemeId('classic-navy'); }} isDarkMode={isDarkMode} />
                    <ThemeCard id="vintage-rose" name="Vintage Mawar" color="bg-orange-50" active={formData.theme === 'vintage-rose'} onClick={() => setFormData({...formData, theme: 'vintage-rose'})} onPreview={(e) => { e.stopPropagation(); setPreviewThemeId('vintage-rose'); }} onInfo={(e) => { e.stopPropagation(); setInfoThemeId('vintage-rose'); }} isDarkMode={isDarkMode} />
                    <ThemeCard id="modern-geometric" name="Modern Geometris" color="bg-gray-100" active={formData.theme === 'modern-geometric'} onClick={() => setFormData({...formData, theme: 'modern-geometric'})} onPreview={(e) => { e.stopPropagation(); setPreviewThemeId('modern-geometric'); }} onInfo={(e) => { e.stopPropagation(); setInfoThemeId('modern-geometric'); }} isDarkMode={isDarkMode} />
                    <ThemeCard id="army" name="Tentara / Loreng" color="bg-[#4b5320]" active={formData.theme === 'army'} onClick={() => setFormData({...formData, theme: 'army'})} onPreview={(e) => { e.stopPropagation(); setPreviewThemeId('army'); }} onInfo={(e) => { e.stopPropagation(); setInfoThemeId('army'); }} isDarkMode={isDarkMode} />
                  </div>
                </div>

                <div className={`border-t pt-8 ${isDarkMode ? 'border-stone-800' : 'border-stone-200'}`}>
                  <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Warna Latar Kustom</h3>
                  <div className="flex items-center gap-4">
                    <input 
                      type="color" 
                      value={formData.customBgColor || '#ffffff'}
                      onChange={(e) => setFormData({...formData, customBgColor: e.target.value})}
                      className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                    />
                    <div className="flex-1">
                      <p className={`text-sm mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>Pilih warna latar belakang khusus untuk undangan Anda.</p>
                      {formData.customBgColor && (
                        <button 
                          onClick={() => setFormData({...formData, customBgColor: ''})}
                          className="text-xs text-rose-500 hover:text-rose-600 font-medium"
                        >
                          Hapus Warna Kustom (Gunakan Bawaan Tema)
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`border-t pt-8 ${isDarkMode ? 'border-stone-800' : 'border-stone-200'}`}>
                  <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Warna Aksen Kustom</h3>
                  <div className="flex items-center gap-4">
                    <input 
                      type="color" 
                      value={formData.customAccentColor || '#f43f5e'}
                      onChange={(e) => setFormData({...formData, customAccentColor: e.target.value})}
                      className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                    />
                    <div className="flex-1">
                      <p className={`text-sm mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>Pilih warna aksen kedua untuk elemen dekoratif.</p>
                      {formData.customAccentColor && (
                        <button 
                          onClick={() => setFormData({...formData, customAccentColor: ''})}
                          className="text-xs text-rose-500 hover:text-rose-600 font-medium"
                        >
                          Hapus Warna Aksen (Gunakan Bawaan Tema)
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`border-t pt-8 ${isDarkMode ? 'border-stone-800' : 'border-stone-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Pratinjau Tema</h3>
                    <button 
                      onClick={() => setPreviewThemeId(formData.theme)}
                      className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${isDarkMode ? 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'}`}
                    >
                      <Maximize2 className="w-4 h-4" />
                      Lihat Pratinjau Penuh
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <ThemePreview theme={formData.theme} formData={formData} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'galeri' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-serif font-semibold ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Galeri Foto</h2>
                  
                  <AnimatePresence>
                    {showUploadSuccess && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg shadow-green-500/20"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Foto berhasil diunggah
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Carousel Preview */}
                {formData.gallery.length > 0 && (
                  <div className={`mb-10 p-6 rounded-3xl border ${isDarkMode ? 'bg-stone-900/50 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
                    <div className="flex items-center gap-2 mb-4">
                      <LayoutTemplate className="w-4 h-4 text-rose-500" />
                      <span className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>Pratinjau Carousel</span>
                    </div>
                    
                    <div className="relative group">
                      <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory no-scrollbar scroll-smooth">
                        {formData.gallery.map((img, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="min-w-[180px] sm:min-w-[240px] aspect-[3/4] rounded-2xl overflow-hidden shadow-md snap-center relative shrink-0"
                          >
                            <Image src={img} alt={`Preview ${index}`} fill className="object-cover" referrerPolicy="no-referrer" />
                          </motion.div>
                        ))}
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {formData.gallery.map((_, i) => (
                          <div key={i} className="w-1 h-1 rounded-full bg-stone-300" />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {/* Upload Button */}
                  <label className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer ${isDarkMode ? 'border-stone-700 hover:border-rose-500 hover:bg-rose-500/10 text-stone-500 hover:text-rose-400' : 'border-stone-300 hover:border-rose-500 hover:bg-rose-50 text-stone-500 hover:text-rose-600'}`}>
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Unggah Foto</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      onChange={handleImageUpload}
                    />
                  </label>
                  
                  {/* Image Previews */}
                  {formData.gallery.map((img, index) => (
                    <div key={index} className={`aspect-square rounded-2xl border relative group overflow-hidden ${isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-100 border-stone-200'}`}>
                      <Image src={img} alt={`Gallery ${index + 1}`} fill className="object-cover" referrerPolicy="no-referrer" />
                      
                      {/* Overlay Controls */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-end">
                          <button 
                            onClick={() => removeImage(index)}
                            className="p-1.5 bg-white/20 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-colors"
                            title="Hapus Foto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex justify-between mt-auto">
                          <button 
                            onClick={() => moveImage(index, 'left')}
                            disabled={index === 0}
                            className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${index === 0 ? 'bg-black/20 text-white/30 cursor-not-allowed' : 'bg-white/20 hover:bg-white/40 text-white'}`}
                            title="Geser Kiri"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => moveImage(index, 'right')}
                            disabled={index === formData.gallery.length - 1}
                            className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${index === formData.gallery.length - 1 ? 'bg-black/20 text-white/30 cursor-not-allowed' : 'bg-white/20 hover:bg-white/40 text-white'}`}
                            title="Geser Kanan"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-stone-500 mt-4">Unggah foto momen spesial Anda. Anda dapat menghapus atau mengatur urutan foto dengan mengarahkan kursor ke atas foto.</p>
              </div>
            )}

            {activeTab === 'musik' && (
              <div className="space-y-6">
                <h2 className={`text-2xl font-serif font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Musik Latar</h2>
                
                <div className={`flex p-1 rounded-xl mb-6 ${isDarkMode ? 'bg-stone-800' : 'bg-stone-100'}`}>
                  <button 
                    onClick={() => setMusicTab('library')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${musicTab === 'library' ? (isDarkMode ? 'bg-stone-700 text-white shadow-sm' : 'bg-white text-stone-900 shadow-sm') : 'text-stone-500 hover:text-stone-400'}`}
                  >
                    <Library className="w-4 h-4" />
                    Perpustakaan
                  </button>
                  <button 
                    onClick={() => setMusicTab('upload')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${musicTab === 'upload' ? (isDarkMode ? 'bg-stone-700 text-white shadow-sm' : 'bg-white text-stone-900 shadow-sm') : 'text-stone-500 hover:text-stone-400'}`}
                  >
                    <Upload className="w-4 h-4" />
                    Unggah
                  </button>
                  <button 
                    onClick={() => setMusicTab('external')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${musicTab === 'external' ? (isDarkMode ? 'bg-stone-700 text-white shadow-sm' : 'bg-white text-stone-900 shadow-sm') : 'text-stone-500 hover:text-stone-400'}`}
                  >
                    <LinkIcon className="w-4 h-4" />
                    Link Eksternal
                  </button>
                </div>

                <div className={`rounded-2xl p-6 border ${isDarkMode ? 'bg-stone-900/50 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
                  {musicTab === 'library' && (
                    <div className="space-y-4">
                      <p className={`text-sm ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>Pilih musik dari perpustakaan kami yang telah dikurasi khusus untuk pernikahan.</p>
                      
                      <div className="relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-stone-500' : 'text-stone-400'}`} />
                        <input 
                          type="text" 
                          placeholder="Cari lagu atau artis..."
                          value={musicSearchQuery}
                          onChange={(e) => setMusicSearchQuery(e.target.value)}
                          className={`w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-200 text-stone-900'}`}
                        />
                      </div>

                      <div className="grid gap-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-300">
                        {MUSIC_LIBRARY.filter(song => 
                          song.name.toLowerCase().includes(musicSearchQuery.toLowerCase())
                        ).map((song) => (
                          <button
                            key={song.id}
                            onClick={() => setFormData({...formData, musicUrl: song.url})}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${formData.musicUrl === song.url ? 'border-rose-500 bg-rose-500/10' : (isDarkMode ? 'border-stone-700 bg-stone-800 hover:border-stone-600' : 'border-stone-200 bg-white hover:border-rose-300')}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.musicUrl === song.url ? 'bg-rose-500 text-white' : (isDarkMode ? 'bg-stone-700 text-stone-400' : 'bg-stone-100 text-stone-500')}`}>
                                <Music className="w-5 h-5" />
                              </div>
                              <div className="text-left">
                                <p className={`text-sm font-medium ${formData.musicUrl === song.url ? 'text-rose-400' : (isDarkMode ? 'text-stone-200' : 'text-stone-900')}`}>{song.name}</p>
                                <p className="text-xs text-stone-500">YouTube Audio</p>
                              </div>
                            </div>
                            {formData.musicUrl === song.url && (
                              <div className="w-3 h-3 bg-rose-500 rounded-full shadow-sm shadow-rose-500/50"></div>
                            )}
                          </button>
                        ))}
                        {MUSIC_LIBRARY.filter(song => 
                          song.name.toLowerCase().includes(musicSearchQuery.toLowerCase())
                        ).length === 0 && (
                          <div className="py-8 text-center">
                            <p className="text-sm text-stone-500">Tidak ada lagu yang ditemukan.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {musicTab === 'upload' && (
                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${isDarkMode ? 'bg-stone-800 border-stone-700 hover:bg-stone-700 hover:border-rose-500' : 'bg-white border-stone-300 hover:bg-stone-50 hover:border-rose-400'}`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className={`w-8 h-8 mb-2 ${isDarkMode ? 'text-stone-500' : 'text-stone-400'}`} />
                        <p className={`mb-2 text-sm ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}><span className="font-semibold">Klik untuk mengunggah</span> atau seret dan lepas</p>
                        <p className="text-xs text-stone-500">MP3, WAV (Maks. 5MB)</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="audio/mp3,audio/wav,audio/mpeg" 
                        onChange={handleAudioUpload}
                      />
                    </label>
                  )}

                  {musicTab === 'external' && (
                    <div className="space-y-4">
                      <p className={`text-sm ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>Masukkan tautan musik dari YouTube, SoundCloud, atau tautan audio langsung.</p>
                      <div className="flex gap-2">
                        <input 
                          type="url" 
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={externalUrl}
                          onChange={(e) => setExternalUrl(e.target.value)}
                          className={`flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ${isDarkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
                        />
                        <button 
                          onClick={() => {
                            if (externalUrl) {
                              setFormData({...formData, musicUrl: externalUrl});
                            }
                          }}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isDarkMode ? 'bg-stone-700 text-white hover:bg-stone-600' : 'bg-stone-900 text-white hover:bg-stone-800'}`}
                        >
                          Terapkan
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {formData.musicUrl && (
                    <div className="mt-6 space-y-4">
                      <div className={`p-4 border rounded-xl flex items-center justify-between ${isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-600'}`}>
                            <Music className="w-5 h-5" />
                          </div>
                          <div className="max-w-[150px] sm:max-w-xs overflow-hidden">
                            <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Musik Latar Terpilih</p>
                            <p className="text-xs text-stone-500 truncate">{formData.musicUrl.length > 40 ? formData.musicUrl.substring(0, 40) + '...' : formData.musicUrl}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setFormData({...formData, musicUrl: ''})}
                            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isDarkMode ? 'text-rose-400 hover:bg-rose-500/10' : 'text-red-600 hover:text-red-700 hover:bg-red-50'}`}
                            title="Hapus Musik"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>

                      {/* Volume Control */}
                      <div className={`p-4 border rounded-xl ${isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className={`flex items-center gap-2 ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                            {formData.musicVolume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            <span className="text-sm font-medium">Volume Musik</span>
                          </div>
                          <span className="text-xs font-bold text-stone-500">{formData.musicVolume}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={formData.musicVolume}
                          onChange={(e) => setFormData({...formData, musicVolume: parseInt(e.target.value)})}
                          className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-rose-500 ${isDarkMode ? 'bg-stone-700' : 'bg-stone-100'}`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'rsvp' && (
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
                        <span>✓ Data akan terekam ke menu "Buku tamu" di Dashboard</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'amplop' && (
              <div className="space-y-6">
                <h2 className={`text-2xl font-serif font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Amplop Digital / Kado Fisik</h2>
                
                {/* Rekening Bank */}
                <div className={`p-6 border rounded-2xl ${isDarkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Nomor Rekening</h3>
                    <button 
                      onClick={() => setFormData({...formData, bankAccounts: [...formData.bankAccounts, { bank: '', accountName: '', accountNumber: '' }]})}
                      className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Tambah Rekening
                    </button>
                  </div>
                  
                  {formData.bankAccounts.map((account, index) => (
                    <div key={`bank-${index}`} className={`mb-4 p-4 border rounded-xl relative ${isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
                      <button 
                        onClick={() => setFormData({
                          ...formData, 
                          bankAccounts: formData.bankAccounts.filter((_, i) => i !== index)
                        })} 
                        className="absolute right-3 top-3 text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="space-y-3">
                        <div>
                          <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Nama Bank</label>
                          <input type="text" value={account.bank} onChange={(e) => {
                            const newAccounts = [...formData.bankAccounts];
                            newAccounts[index].bank = e.target.value;
                            setFormData({...formData, bankAccounts: newAccounts});
                          }} placeholder="BCA / Mandiri / BNI / BRI" className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none ${isDarkMode ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>No Rekening</label>
                            <input type="text" value={account.accountNumber} onChange={(e) => {
                              const newAccounts = [...formData.bankAccounts];
                              newAccounts[index].accountNumber = e.target.value;
                              setFormData({...formData, bankAccounts: newAccounts});
                            }} className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none ${isDarkMode ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`} />
                          </div>
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Atas Nama</label>
                            <input type="text" value={account.accountName} onChange={(e) => {
                              const newAccounts = [...formData.bankAccounts];
                              newAccounts[index].accountName = e.target.value;
                              setFormData({...formData, bankAccounts: newAccounts});
                            }} className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none ${isDarkMode ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.bankAccounts.length === 0 && <p className="text-sm text-stone-500 italic">Belum ada rekening yang ditambahkan.</p>}
                </div>

                {/* E-Wallet */}
                <div className={`p-6 border rounded-2xl ${isDarkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>E-Wallet (GoPay/OVO/Dana/dll)</h3>
                    <button 
                      onClick={() => setFormData({...formData, digitalWallets: [...formData.digitalWallets, { ewallet: '', accountName: '', accountNumber: '' }]})}
                      className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Tambah E-Wallet
                    </button>
                  </div>
                  
                  {formData.digitalWallets.map((wallet, index) => (
                     <div key={`wallet-${index}`} className={`mb-4 p-4 border rounded-xl relative ${isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
                       <button 
                         onClick={() => setFormData({
                           ...formData, 
                           digitalWallets: formData.digitalWallets.filter((_, i) => i !== index)
                         })} 
                         className="absolute right-3 top-3 text-stone-400 hover:text-red-500 transition-colors"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                       <div className="space-y-3">
                         <div>
                           <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Jenis E-Wallet</label>
                           <input type="text" value={wallet.ewallet} onChange={(e) => {
                             const newWallets = [...formData.digitalWallets];
                             newWallets[index].ewallet = e.target.value;
                             setFormData({...formData, digitalWallets: newWallets});
                           }} placeholder="OVO / GoPay / Dana / ShopeePay" className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none ${isDarkMode ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`} />
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                           <div>
                             <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>No. Akun / HP</label>
                             <input type="text" value={wallet.accountNumber} onChange={(e) => {
                               const newWallets = [...formData.digitalWallets];
                               newWallets[index].accountNumber = e.target.value;
                               setFormData({...formData, digitalWallets: newWallets});
                             }} className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none ${isDarkMode ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`} />
                           </div>
                           <div>
                             <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Atas Nama</label>
                             <input type="text" value={wallet.accountName} onChange={(e) => {
                               const newWallets = [...formData.digitalWallets];
                               newWallets[index].accountName = e.target.value;
                               setFormData({...formData, digitalWallets: newWallets});
                             }} className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none ${isDarkMode ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`} />
                           </div>
                         </div>
                       </div>
                     </div>
                   ))}
                   {formData.digitalWallets.length === 0 && <p className="text-sm text-stone-500 italic">Belum ada e-wallet yang ditambahkan.</p>}
                </div>

                {/* Alamat Pengiriman Kado Fisik */}
                <div className={`p-6 border rounded-2xl ${isDarkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
                  <h3 className={`font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Alamat Pengiriman Kado Fisik</h3>
                  <textarea
                    rows={4}
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})}
                    placeholder="Contoh: Jl. Mawar No. 123, RT 01/RW 02, Kec. Melati, Jakarta Pusat 10000 (Penerima: Budi / 08123456789)"
                    className={`w-full px-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none resize-none ${isDarkMode ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}
                  ></textarea>
                </div>
              </div>
            )}

            {activeTab === 'kisah' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-2xl font-serif font-semibold ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Kisah Cinta (Love Story)</h2>
                  <button 
                    onClick={() => setFormData({...formData, loveStories: [...formData.loveStories, { year: '', title: '', story: '', imageUrl: '' }]})}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-rose-600 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4"/> Tambah Cerita
                  </button>
                </div>
                
                {formData.loveStories.map((story, index) => (
                  <div key={`story-${index}`} className={`mb-6 p-6 border rounded-2xl relative ${isDarkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
                    <button 
                      onClick={() => setFormData({
                        ...formData, 
                        loveStories: formData.loveStories.filter((_, i) => i !== index)
                      })} 
                      className="absolute right-4 top-4 text-stone-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="space-y-4 max-w-[90%]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Tahun / Waktu</label>
                          <input type="text" value={story.year} onChange={(e) => {
                            const newStories = [...formData.loveStories];
                            newStories[index].year = e.target.value;
                            setFormData({...formData, loveStories: newStories});
                          }} placeholder="Misal: Januari 2020" className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 outline-none ${isDarkMode ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`} />
                        </div>
                        <div>
                          <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Judul Cerita</label>
                          <input type="text" value={story.title} onChange={(e) => {
                            const newStories = [...formData.loveStories];
                            newStories[index].title = e.target.value;
                            setFormData({...formData, loveStories: newStories});
                          }} placeholder="Misal: Awal Bertemu" className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 outline-none ${isDarkMode ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`} />
                        </div>
                      </div>

                      {/* Image Upload for Story */}
                      <div className="mt-2">
                        <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Foto Momen (Opsional)</label>
                        <div className="flex items-center gap-4">
                          {story.imageUrl ? (
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-stone-200 shadow-sm">
                              <Image src={story.imageUrl} alt="Story Moment" fill className="object-cover" />
                              <button 
                                onClick={() => {
                                  const newStories = [...formData.loveStories];
                                  newStories[index].imageUrl = '';
                                  setFormData({...formData, loveStories: newStories});
                                }}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full shadow-lg"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <label className={`w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer hover:border-rose-400 hover:bg-rose-50/50 transition-all ${isDarkMode ? 'border-stone-700 bg-stone-900' : 'border-stone-200 bg-stone-50'}`}>
                              <ImageIcon className="w-6 h-6 text-stone-400" />
                              <span className="text-[10px] text-stone-500 mt-1 font-medium text-center">Upload<br/>Foto</span>
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleStoryImageUpload(e, index)} />
                            </label>
                          )}
                          <div className="flex-1">
                            <p className="text-[10px] text-stone-500 leading-relaxed italic">Upload foto untuk momen ini (format JPG/PNG, maks 2MB). Foto akan ditampilkan di atas teks cerita.</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>Deskripsi / Cerita</label>
                        <textarea rows={3} value={story.story} onChange={(e) => {
                          const newStories = [...formData.loveStories];
                          newStories[index].story = e.target.value;
                          setFormData({...formData, loveStories: newStories});
                        }} className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 outline-none resize-none ${isDarkMode ? 'bg-stone-900 border-stone-700 text-white' : 'bg-white border-stone-300 text-stone-900'}`}></textarea>
                      </div>
                    </div>
                  </div>
                ))}
                
                {formData.loveStories.length === 0 && (
                  <div className={`p-8 text-center border-2 border-dashed rounded-3xl ${isDarkMode ? 'border-stone-700 mb-6' : 'border-stone-300 mb-6'}`}>
                    <HeartHandshake className={`w-10 h-10 mx-auto mb-3 ${isDarkMode ? 'text-stone-600' : 'text-stone-300'}`} />
                    <p className={`text-sm ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>Belum ada kisah cinta yang ditambahkan.<br/>Ceritakan momen spesial perjalanan cinta kalian sejak awal bertemu hingga hari bahagia tiba.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bukutamu' && (
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
            )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Full Preview Modal */}
      <AnimatePresence>
        {previewThemeId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/90 backdrop-blur-md" 
              onClick={() => setPreviewThemeId(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg h-[85vh] flex flex-col z-10"
            >
              <div className="flex justify-between items-center mb-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold">Pratinjau Tema</h3>
                    <p className="text-xs text-stone-400 uppercase tracking-widest">karsaloka Premium</p>
                  </div>
                </div>
                <button 
                  onClick={() => setPreviewThemeId(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 bg-white rounded-[2.5rem] p-2 shadow-2xl overflow-hidden">
                <div className="w-full h-full overflow-y-auto rounded-[2rem] scrollbar-hide">
                  <ThemePreview theme={previewThemeId} formData={formData} isFull />
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={() => {
                    setFormData({...formData, theme: previewThemeId});
                    setPreviewThemeId(null);
                  }}
                  className="bg-white text-stone-900 px-8 py-3 rounded-full font-bold shadow-xl hover:bg-rose-500 hover:text-white transition-all transform hover:scale-105"
                >
                  Gunakan Tema Ini
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Theme Info Modal */}
      <AnimatePresence>
        {infoThemeId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" 
              onClick={() => setInfoThemeId(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden z-10 ${isDarkMode ? 'bg-stone-900 border border-stone-800' : 'bg-white'}`}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                      <Info className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-stone-900'}`}>Inspirasi Desain</h3>
                      <p className="text-xs text-rose-500 font-bold uppercase tracking-widest">karsaloka Themes</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setInfoThemeId(null)}
                    className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-stone-800 text-stone-400 hover:text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-stone-800/50' : 'bg-stone-50'}`}>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                      {THEME_INFO[infoThemeId] || "Tema desain elegan untuk momen spesial Anda."}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-stone-500 italic">
                    <Heart className="w-3 h-3 text-rose-500" />
                    <span>Dirancang dengan penuh cinta untuk pernikahan Anda.</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button 
                    onClick={() => setInfoThemeId(null)}
                    className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors shadow-lg"
                  >
                    Tutup Detail
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSaveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 md:bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-stone-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-stone-800"
          >
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium">Perubahan berhasil disimpan</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Tab Navigation */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t safe-area-bottom ${isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
        <div className="flex items-center justify-around px-1 py-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'umum', icon: <Settings className="w-4 h-4" />, label: 'Umum' },
            { id: 'teks', icon: <Type className="w-4 h-4" />, label: 'Teks' },
            { id: 'tema', icon: <LayoutTemplate className="w-4 h-4" />, label: 'Tema' },
            { id: 'galeri', icon: <ImageIcon className="w-4 h-4" />, label: 'Galeri' },
            { id: 'musik', icon: <Music className="w-4 h-4" />, label: 'Musik' },
            { id: 'rsvp', icon: <Send className="w-4 h-4" />, label: 'RSVP' },
            { id: 'amplop', icon: <Gift className="w-4 h-4" />, label: 'Amplop' },
            { id: 'kisah', icon: <BookOpen className="w-4 h-4" />, label: 'Kisah' },
            { id: 'bukutamu', icon: <MessageSquare className="w-4 h-4" />, label: 'Tamu' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[52px] px-1 py-1.5 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'text-rose-500'
                  : isDarkMode ? 'text-stone-500' : 'text-stone-400'
              }`}
            >
              {tab.icon}
              <span className={`text-[9px] mt-0.5 font-medium ${activeTab === tab.id ? 'font-bold' : ''}`}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <WhatsAppButton />
      <AIChatWidget />
    </div>
    </PageTransition>
    </>
  );
}

function TabButton({ icon, label, active, onClick, isDarkMode }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, isDarkMode: boolean }) {
  return (
    <button 
      onClick={onClick}
      title={label}
      className={`group relative flex items-center justify-center sm:justify-start gap-3 px-4 py-3 rounded-xl transition-colors w-full text-left ${
        active 
          ? (isDarkMode ? 'bg-rose-500/10 text-rose-400 font-medium' : 'bg-rose-50 text-rose-600 font-medium')
          : (isDarkMode ? 'text-stone-400 hover:bg-stone-800 hover:text-stone-200' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900')
      }`}
    >
      <div className={`w-5 h-5 ${active ? (isDarkMode ? 'text-rose-400' : 'text-rose-600') : (isDarkMode ? 'text-stone-500' : 'text-stone-500')}`}>
        {icon}
      </div>
      <span className="hidden sm:inline">{label}</span>
      
      {/* Tooltip for collapsed state */}
      <div className={`absolute left-full ml-2 px-2 py-1 text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 sm:hidden pointer-events-none ${isDarkMode ? 'bg-stone-800 text-white' : 'bg-stone-800 text-white'}`}>
        {label}
      </div>
    </button>
  );
}

function ThemeCard({ id, name, color, active, onClick, onPreview, onInfo, isDarkMode }: { id: string, name: string, color: string, active: boolean, onClick: () => void, onPreview: (e: React.MouseEvent) => void, onInfo: (e: React.MouseEvent) => void, isDarkMode: boolean }) {
  return (
    <div className={`relative flex flex-col p-2 rounded-2xl border-2 transition-all ${
      active 
        ? `border-rose-500 shadow-md ${isDarkMode ? 'bg-stone-800' : 'bg-white'}` 
        : (isDarkMode ? 'border-stone-800 bg-stone-800/50 hover:border-stone-700 shadow-sm' : 'border-stone-100 bg-white hover:border-stone-200 shadow-sm')
    }`}>
      <div 
        onClick={onClick}
        className="cursor-pointer group"
      >
        <div className={`w-full h-24 rounded-xl ${color} mb-2 border relative overflow-hidden ${isDarkMode ? 'border-stone-700' : 'border-stone-100'}`}>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
          
          {/* Info Icon */}
          <div className="absolute top-2 left-2 z-10">
            <button 
              onClick={onInfo}
              className={`p-1 backdrop-blur-sm rounded-full transition-colors shadow-sm ${isDarkMode ? 'bg-stone-900/80 text-stone-400 hover:text-rose-400' : 'bg-white/80 text-stone-500 hover:text-rose-500'}`}
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <span className={`block text-center text-xs font-bold mb-2 ${active ? 'text-rose-600' : (isDarkMode ? 'text-stone-300' : 'text-stone-700')}`}>{name}</span>
      </div>
      <button
        onClick={onPreview}
        className={`w-full py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 ${isDarkMode ? 'bg-stone-800 hover:bg-stone-700 text-stone-400' : 'bg-stone-100 hover:bg-stone-200 text-stone-600'}`}
      >
        <Maximize2 className="w-3.5 h-3.5" />
        Pratinjau
      </button>
    </div>
  );
}

function ThemePreview({ theme, formData, isFull = false }: { theme: string, formData: any, isFull?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = formData.musicVolume / 100;
    }
  }, [formData.musicUrl, formData.musicVolume]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
    
    // For native audio element
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  // Determine if the URL is a direct audio file or needs ReactPlayer
  const isDirectAudio = formData.musicUrl && formData.musicUrl.startsWith('data:');
  const Player = ReactPlayer as any;

  const themeStyles: Record<string, { bg: string, text: string, accent: string, font: string, border: string }> = {
    elegant: { bg: 'bg-[#FDFBF7]', text: 'text-stone-800', accent: 'text-rose-400', font: 'font-serif', border: 'border-stone-200' },
    floral: { bg: 'bg-rose-50', text: 'text-rose-900', accent: 'text-rose-500', font: 'font-serif', border: 'border-rose-200' },
    modern: { bg: 'bg-slate-50', text: 'text-slate-900', accent: 'text-slate-500', font: 'font-sans', border: 'border-slate-200' },
    rustic: { bg: 'bg-amber-50', text: 'text-amber-900', accent: 'text-amber-700', font: 'font-serif', border: 'border-amber-200' },
    luxury: { bg: 'bg-yellow-50', text: 'text-yellow-900', accent: 'text-yellow-600', font: 'font-serif', border: 'border-yellow-200' },
    ocean: { bg: 'bg-sky-50', text: 'text-sky-900', accent: 'text-sky-600', font: 'font-sans', border: 'border-sky-200' },
    minimalist: { bg: 'bg-white', text: 'text-black', accent: 'text-stone-300', font: 'font-sans', border: 'border-stone-200' },
    romantic: { bg: 'bg-pink-50', text: 'text-amber-900', accent: 'text-pink-400', font: 'font-serif', border: 'border-pink-200' },
    'minimalist-elegant': { bg: 'bg-white', text: 'text-stone-800', accent: 'text-amber-500', font: 'font-sans', border: 'border-stone-200' },
    'night-fantasy': { bg: 'bg-slate-900', text: 'text-white', accent: 'text-slate-300', font: 'font-serif', border: 'border-slate-700' },
    'tropical-nature': { bg: 'bg-green-100', text: 'text-amber-900', accent: 'text-orange-500', font: 'font-serif', border: 'border-green-300' },
    'classic-navy': { bg: 'bg-blue-950', text: 'text-white', accent: 'text-amber-400', font: 'font-serif', border: 'border-blue-800' },
    'vintage-rose': { bg: 'bg-orange-50', text: 'text-rose-950', accent: 'text-rose-400', font: 'font-serif', border: 'border-rose-200' },
    'modern-geometric': { bg: 'bg-gray-100', text: 'text-black', accent: 'text-teal-600', font: 'font-sans', border: 'border-gray-300' },
    'army': { bg: 'bg-[#4b5320]', text: 'text-yellow-50', accent: 'text-yellow-500', font: 'font-serif', border: 'border-[#303612]' },
  };

  const currentStyle = themeStyles[theme] || themeStyles.elegant;
  const customStyle = formData.customBgColor ? { backgroundColor: formData.customBgColor } : {};
  const bgClass = formData.customBgColor ? '' : currentStyle.bg;
  
  const accentStyle = formData.customAccentColor ? { color: formData.customAccentColor } : {};
  const accentClass = formData.customAccentColor ? '' : currentStyle.accent;
  
  const borderAccentStyle = formData.customAccentColor ? { borderColor: formData.customAccentColor } : {};
  const borderAccentClass = formData.customAccentColor ? '' : currentStyle.border;

  const customFontStyle = formData.customFont ? { fontFamily: `"${formData.customFont}", sans-serif` } : {};
  const fontClass = formData.customFont ? '' : currentStyle.font;

  return (
    <div 
      className={`w-full ${isFull ? 'h-full' : 'max-w-sm aspect-[9/16]'} rounded-3xl overflow-hidden shadow-lg border ${currentStyle.border} ${bgClass} ${currentStyle.text} ${fontClass} flex flex-col items-center justify-center p-8 text-center relative transition-colors duration-500`}
      style={{ ...customStyle, ...customFontStyle }}
    >
      {formData.customFont && (
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=${formData.customFont.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap');
        `}</style>
      )}

      {formData.musicUrl && isDirectAudio && (
        <audio ref={audioRef} src={formData.musicUrl} loop />
      )}
      
      {formData.musicUrl && !isDirectAudio && (
        <div className="hidden">
          <Player 
            ref={playerRef}
            url={formData.musicUrl} 
            playing={isPlaying} 
            loop 
            volume={formData.musicVolume / 100}
            width="0" 
            height="0" 
          />
        </div>
      )}
      
      {formData.musicUrl && (
        <button 
          onClick={togglePlay}
          className="absolute top-4 right-4 w-10 h-10 bg-black/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/20 transition-colors z-10"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
      )}

      <div className="absolute top-0 left-0 w-full h-2 bg-current opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-full h-2 bg-current opacity-20"></div>
      
      <p className="text-xs uppercase tracking-[0.2em] opacity-60 mb-6">{formData.openingGreeting || 'The Wedding Of'}</p>
      
      <h4 className="text-3xl font-light mb-2">{formData.brideName.split(' ')[0] || 'Nama'}</h4>
      <p className={`text-2xl italic ${accentClass} my-2`} style={accentStyle}>&</p>
      <h4 className="text-3xl font-light mb-8">{formData.groomName.split(' ')[0] || 'Nama'}</h4>
      
      <div className={`w-12 h-[1px] ${formData.customAccentColor ? '' : 'bg-current opacity-30'} mx-auto mb-6`} style={formData.customAccentColor ? { backgroundColor: formData.customAccentColor } : {}}></div>
      
      <p className="text-sm font-medium tracking-widest uppercase mb-2">{formData.date || 'Tanggal'}</p>
      <p className="text-xs opacity-70">{formData.venue || 'Lokasi Acara'}</p>
      
      {formData.saveTheDateDate && (
        <div className="mt-8 mb-2">
          <p className={`text-[10px] uppercase tracking-[0.3em] font-bold ${accentClass}`} style={accentStyle}>Save the Date</p>
          <p className="text-sm font-medium mt-1">{formData.saveTheDateDate}</p>
          {formData.saveTheDateDescription && (
            <p className="text-[10px] italic opacity-60 mt-1 max-w-[200px] mx-auto leading-relaxed">{formData.saveTheDateDescription}</p>
          )}
        </div>
      )}

      <div 
        className={`mt-10 px-6 py-2 rounded-full border ${borderAccentClass} text-xs font-medium uppercase tracking-wider opacity-80`}
        style={borderAccentStyle}
      >
        Buka Undangan
      </div>
    </div>
  );
}
