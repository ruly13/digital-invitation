import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { GuestResponse } from '@/types';

export function useGuestData(invitationId: string | null) {
  const [guests, setGuests] = useState<GuestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        let query = supabase
          .from('guest_responses')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (invitationId) {
          query = query.eq('invitation_id', invitationId);
        }

        const { data, error } = await query;
        if (error) throw error;
        
        let guestsData = (data || []).map(g => ({
          ...g,
          status: g.attendance || 'Menunggu',
          count: g.guest_count || 0
        }));
        
        // Fetch invitations separately to bypass PostgREST foreign key relationship errors
        const invIds = Array.from(new Set(guestsData.map(g => g.invitation_id).filter(Boolean)));
        if (invIds.length > 0) {
          const { data: invs } = await supabase
            .from('invitations')
            .select('id, bride_name, groom_name')
            .in('id', invIds);
            
          if (invs) {
            guestsData = guestsData.map(g => ({
              ...g,
              invitations: invs.find(i => i.id === g.invitation_id) || null
            }));
          }
        }
        
        setGuests(guestsData);
      } catch (error: any) {
        console.error('Error fetching guests:', error?.message || JSON.stringify(error) || error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, [invitationId]);

  const filteredGuests = guests.filter(g => 
    g.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: guests.length,
    hadir: guests.filter(g => g.status === 'Hadir').length,
    absen: guests.filter(g => g.status === 'Tidak Hadir').length,
    menunggu: guests.filter(g => g.status === 'Menunggu').length,
  };

  const inviteName = invitationId && guests.length > 0 && guests[0].invitations 
    ? `Pernikahan ${guests[0].invitations.bride_name} & ${guests[0].invitations.groom_name}`
    : 'Semua Undangan';

  const downloadCSV = () => {
    const headers = ['Nama', 'Status RSVP', 'Jumlah Tamu', 'Pesan', 'Undangan'];
    const rows = filteredGuests.map(guest => [
      guest.name,
      guest.status,
      guest.count,
      guest.message,
      guest.invitations ? `${guest.invitations.bride_name} & ${guest.invitations.groom_name}` : '-'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `daftar_tamu_${invitationId || 'global'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    guests,
    loading,
    searchQuery,
    setSearchQuery,
    filteredGuests,
    stats,
    inviteName,
    downloadCSV
  };
}
