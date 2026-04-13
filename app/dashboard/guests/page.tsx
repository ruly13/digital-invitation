'use client';

import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, Plus, Download, MoreVertical, CheckCircle2, XCircle, Clock } from 'lucide-react';

function GuestListContent() {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();
  const invitationId = searchParams.get('id');

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        let query = supabase
          .from('guests')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (invitationId) {
          query = query.eq('invitation_id', invitationId);
        }

        const { data, error } = await query;
        if (error) throw error;
        
        let guestsData = data || [];
        
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

  const stats = {
    total: guests.length,
    hadir: guests.filter(g => g.status === 'Hadir').length,
    absen: guests.filter(g => g.status === 'Tidak Hadir').length,
    menunggu: guests.filter(g => g.status === 'Menunggu').length,
  };

  const inviteName = invitationId && guests.length > 0 && guests[0].invitations 
    ? `Pernikahan ${guests[0].invitations.bride_name} & ${guests[0].invitations.groom_name}`
    : 'Semua Undangan';

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <Link href="/dashboard" className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-stone-900">Buku Tamu</h1>
          <p className="text-xs text-stone-500">{inviteName}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total RSVP" value={loading ? '...' : stats.total.toString()} subtitle="Kontak masuk" />
          <StatCard title="RSVP Hadir" value={loading ? '...' : stats.hadir.toString()} subtitle="Orang akan datang" />
          <StatCard title="Menunggu" value={loading ? '...' : stats.menunggu.toString()} subtitle="Belum konfirmasi" />
          <StatCard title="Tidak Hadir" value={loading ? '...' : stats.absen.toString()} subtitle="Konfirmasi absen" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input 
              type="text" 
              placeholder="Cari nama tamu..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={downloadCSV}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-stone-200 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Unduh CSV
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-stone-900 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors">
              <Plus className="w-4 h-4" />
              Tambah Tamu
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-stone-400 animate-pulse">Memuat data tamu...</div>
            ) : filteredGuests.length === 0 ? (
              <div className="p-12 text-center text-stone-400">Belum ada data tamu.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-sm">
                    <th className="px-6 py-4 font-medium">Nama Tamu</th>
                    <th className="px-6 py-4 font-medium">Status RSVP</th>
                    <th className="px-6 py-4 font-medium">Jumlah</th>
                    <th className="px-6 py-4 font-medium">Pesan / Ucapan</th>
                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredGuests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-stone-900">{guest.name}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={guest.status} />
                      </td>
                      <td className="px-6 py-4 text-stone-600">{guest.count > 0 ? `${guest.count} Orang` : '-'}</td>
                      <td className="px-6 py-4 text-stone-600 text-sm italic">{guest.message || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function GuestList() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50 flex items-center justify-center">Memuat...</div>}>
      <GuestListContent />
    </Suspense>
  );
}

function StatCard({ title, value, subtitle }: { title: string, value: string, subtitle: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
      <p className="text-sm font-medium text-stone-500 mb-2">{title}</p>
      <p className="text-3xl font-semibold text-stone-900 mb-1">{value}</p>
      <p className="text-xs text-stone-400">{subtitle}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'Hadir') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Hadir
      </span>
    );
  }
  if (status === 'Tidak Hadir') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-medium border border-rose-100">
        <XCircle className="w-3.5 h-3.5" />
        Tidak Hadir
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100">
      <Clock className="w-3.5 h-3.5" />
      Menunggu
    </span>
  );
}
