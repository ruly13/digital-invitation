'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, Plus, Download, MoreVertical } from 'lucide-react';
import { useGuestData } from '@/hooks/useGuestData';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';

function GuestListContent() {
  const searchParams = useSearchParams();
  const invitationId = searchParams.get('id');
  const {
    loading,
    searchQuery,
    setSearchQuery,
    filteredGuests,
    stats,
    inviteName,
    downloadCSV
  } = useGuestData(invitationId);

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <Link href="/dashboard" aria-label="Kembali ke Dashboard" className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-600">
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
                        <StatusBadge status={guest.status || 'Menunggu'} />
                      </td>
                      <td className="px-6 py-4 text-stone-600">{(guest.count ?? 0) > 0 ? `${guest.count} Orang` : '-'}</td>
                      <td className="px-6 py-4 text-stone-600 text-sm italic">{guest.message || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <button aria-label="Opsi Lainnya" className="p-2 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors">
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


