'use client';

import Link from 'next/link';
import { ArrowLeft, Search, Plus, Download, MoreVertical, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function GuestList() {
  const guests = [
    { id: 1, name: 'Keluarga Bapak Ahmad', category: 'Keluarga', status: 'Hadir', count: 4, phone: '081234567890' },
    { id: 2, name: 'Siti Aminah & Pasangan', category: 'Teman', status: 'Menunggu', count: 2, phone: '089876543210' },
    { id: 3, name: 'Budi Santoso', category: 'Rekan Kerja', status: 'Tidak Hadir', count: 0, phone: '085678901234' },
    { id: 4, name: 'Keluarga Ibu Ratna', category: 'Keluarga', status: 'Hadir', count: 3, phone: '081122334455' },
    { id: 5, name: 'Andi Wijaya', category: 'Teman', status: 'Hadir', count: 1, phone: '087766554433' },
  ];

  const downloadCSV = () => {
    const headers = ['Nama', 'Kategori', 'Status RSVP', 'Jumlah Tamu', 'No. WhatsApp'];
    const rows = guests.map(guest => [
      guest.name,
      guest.category,
      guest.status,
      guest.count,
      guest.phone
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'daftar_tamu_eternainvite.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Topbar */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <Link href="/dashboard" className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-stone-900">Buku Tamu</h1>
          <p className="text-xs text-stone-500">Pernikahan Rina & Budi</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Undangan" value="150" subtitle="Kontak tersimpan" />
          <StatCard title="RSVP Hadir" value="85" subtitle="Orang akan datang" />
          <StatCard title="Menunggu" value="45" subtitle="Belum konfirmasi" />
          <StatCard title="Tidak Hadir" value="20" subtitle="Konfirmasi absen" />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input 
              type="text" 
              placeholder="Cari nama tamu..." 
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
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-stone-200 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors">
              <Download className="w-4 h-4" />
              Ekspor
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors">
              <Plus className="w-4 h-4" />
              Tambah Tamu
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-sm">
                  <th className="px-6 py-4 font-medium">Nama Tamu</th>
                  <th className="px-6 py-4 font-medium">Kategori</th>
                  <th className="px-6 py-4 font-medium">Status RSVP</th>
                  <th className="px-6 py-4 font-medium">Jumlah</th>
                  <th className="px-6 py-4 font-medium">No. WhatsApp</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-stone-900">{guest.name}</td>
                    <td className="px-6 py-4 text-stone-600">
                      <span className="inline-block px-2.5 py-1 bg-stone-100 rounded-md text-xs font-medium">
                        {guest.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={guest.status} />
                    </td>
                    <td className="px-6 py-4 text-stone-600">{guest.count > 0 ? `${guest.count} Orang` : '-'}</td>
                    <td className="px-6 py-4 text-stone-600">{guest.phone}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
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
