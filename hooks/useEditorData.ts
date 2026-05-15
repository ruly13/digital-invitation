import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const INITIAL_FORM_DATA = {
  title: 'Pernikahan Rina & Budi',
  customLink: 'rina-budi',
  customFont: '',
  groomName: 'Budi Santoso',
  brideName: 'Rina Wijaya',
  date: '2026-08-12',
  time: '09:00',
  venue: 'Gedung Serbaguna Senayan',
  address: 'Jl. Pintu Satu Senayan, Jakarta Pusat',
  mapCoordinates: null as { lat: number; lng: number } | null,
  receptionDate: '',
  receptionTime: '',
  receptionVenue: '',
  receptionAddress: '',
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
  youtubeId: '',
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
};

export type FormData = typeof INITIAL_FORM_DATA;

export function useEditorData(id: string) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

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

  const handleSave = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        alert("Sesi telah habis. Silakan login kembali.");
        router.push('/login');
        return;
      }

      if (formData.customLink) {
        let query = supabase
          .from('invitations')
          .select('id')
          .eq('url_slug', formData.customLink);
          
        if (id !== 'new') {
          query = query.neq('id', id);
        }
        
        const { data: existingLink } = await query.single();

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

      let newId = id;
      if (id === 'new') {
        const { data: newInv, error } = await supabase.from('invitations').insert([payload]).select('id').single();
        if (error) throw error;
        if (newInv) newId = newInv.id;
      } else {
        const { error } = await supabase.from('invitations').update(payload).eq('id', id);
        if (error) throw error;
      }

      setShowSaveSuccess(true);
      setTimeout(() => {
        setShowSaveSuccess(false);
        if (id === 'new') {
          router.push(`/editor/${newId}`);
        }
      }, 2000);
      
    } catch (error: any) {
      console.error("Gagal menyimpan:", error);
      alert(error.message || "Terjadi kesalahan saat menyimpan.");
    }
  };

  return {
    formData,
    setFormData,
    loadingInitial,
    handleSave,
    showSaveSuccess
  };
}
