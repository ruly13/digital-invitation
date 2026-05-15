import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Invitation } from '@/types';

export function useDashboardData() {
  const router = useRouter();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [guestStats, setGuestStats] = useState({ totalGuests: 0, totalWishes: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }
        
        const [profileResponse, invsResponse] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase.from('invitations').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
        ]);
        
        setUserProfile(profileResponse.data || { full_name: user?.email || 'Pengguna' });

        if (invsResponse.error) throw invsResponse.error;
        
        const invs = invsResponse.data || [];
        setInvitations(invs);
        
        if (invs.length > 0) {
          const invIds = invs.map((i: Invitation) => i.id);
          const { data: guestsData } = await supabase
            .from('guests')
            .select('count, message')
            .in('invitation_id', invIds);
            
          if (guestsData) {
            const totalGuests = guestsData.reduce((sum, g) => sum + (g.count || 0), 0);
            const totalWishes = guestsData.filter(g => g.message && g.message.trim() !== '').length;
            setGuestStats({ totalGuests, totalWishes });
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [router]);

  const handleDelete = async (inv: Invitation) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus undangan ini? Tindakan ini tidak dapat dibatalkan.')) return;
    try {
      if (inv.details?.gallery && Array.isArray(inv.details.gallery)) {
        const filePaths = inv.details.gallery
          .filter((url: string) => url.includes('supabase.co/storage/v1/object/public/gallery/'))
          .map((url: string) => url.split('public/gallery/')[1]);
        
        if (filePaths.length > 0) {
          await supabase.storage.from('gallery').remove(filePaths);
        }
      }

      // Bersihkan juga file audio dari bucket
      const musicUrl = inv.music_url || inv.details?.musicUrl;
      if (musicUrl && musicUrl.includes('supabase.co/storage/v1/object/public/gallery/')) {
        const audioPath = musicUrl.split('public/gallery/')[1];
        await supabase.storage.from('gallery').remove([audioPath]);
      }

      await supabase.from('invitations').delete().eq('id', inv.id);
      setInvitations(invitations.filter((i) => i.id !== inv.id));
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Gagal menghapus undangan.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return {
    invitations,
    loading,
    userProfile,
    guestStats,
    handleDelete,
    handleLogout
  };
}
