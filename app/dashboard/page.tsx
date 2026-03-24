'use client';

import Link from 'next/link';
import { Plus, Settings, Users, Eye, Edit, Trash2, Heart, Loader2 } from 'lucide-react';
import WhatsAppButton from '@/components/WhatsAppButton';
import AIChatWidget from '@/components/AIChatWidget';
import PageTransition from '@/components/PageTransition';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      
      // Get profile info
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      setUserProfile(profile || { full_name: user.email });

      // Get invitations
      const { data: invs, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(invs || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus undangan ini? Tindakan ini tidak dapat dibatalkan.')) return;
    try {
      const { error } = await supabase.from('invitations').delete().eq('id', id);
      if (error) throw error;
      setInvitations(invitations.filter((inv) => inv.id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Gagal menghapus undangan.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-stone-50 font-sans">
      {/* Topbar */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" />
          <Link href="/" className="text-lg font-semibold tracking-tight text-stone-900">karsaloka</Link>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleLogout} className="text-sm font-medium text-stone-500 hover:text-rose-500 transition-colors">
            Keluar
          </button>
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-sm font-bold text-rose-600 uppercase">
            {userProfile?.full_name?.charAt(0) || 'U'}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-stone-900 text-white font-medium">
              <Heart className="w-5 h-5" />
              Undangan Saya
            </Link>
            <Link href="/dashboard/guests" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-100 font-medium transition-colors">
              <Users className="w-5 h-5" />
              Buku Tamu
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-100 font-medium transition-colors">
              <Settings className="w-5 h-5" />
              Pengaturan Akun
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-serif font-semibold text-stone-900">
                Halo, {userProfile?.full_name?.split(' ')[0] || 'Pengguna'}!
              </h1>
              <p className="text-stone-500 mt-1">Kelola semua undangan pernikahan digital Anda di sini.</p>
            </div>
            <Link href="/editor/new" className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              Buat Undangan
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-rose-500 animate-spin mb-4" />
              <p className="text-stone-500 text-sm">Memuat data undangan...</p>
            </div>
          ) : invitations.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-stone-200 shadow-sm text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-rose-300" />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-2">Belum Ada Undangan</h3>
              <p className="text-stone-500 text-sm mb-6 max-w-sm">Mulai rancang undangan pernikahan digital impian Anda sekarang.</p>
              <Link href="/editor/new" className="flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-rose-600 transition-colors shadow-sm">
                <Plus className="w-4 h-4" />
                Buat Undangan Pertama
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {invitations.map((inv) => (
                <div key={inv.id} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      {inv.payment_status === 'active' ? (
                        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium mb-3">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium mb-3">
                          Belum Aktif
                        </span>
                      )}
                      <h3 className="text-xl font-semibold text-stone-900">
                        {inv.bride_name && inv.groom_name 
                          ? `${inv.bride_name} & ${inv.groom_name}` 
                          : 'Pernikahan Baru'}
                      </h3>
                      <p className="text-stone-500 text-sm mt-1">
                        {inv.event_date 
                          ? new Date(inv.event_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) 
                          : 'Tanggal belum ditentukan'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-stone-50 rounded-2xl">
                    <div>
                      <p className="text-xs text-stone-500 font-medium uppercase tracking-wider mb-1">Tema</p>
                      <p className="text-sm font-semibold text-stone-900">{inv.theme_name || 'Elegant'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 font-medium uppercase tracking-wider mb-1">Link</p>
                      <p className="text-sm font-semibold text-rose-500 truncate">
                        {inv.url_slug ? `/${inv.url_slug}` : 'Belum Atur Link'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-stone-100 pt-4">
                    {inv.payment_status !== 'active' && (
                      <a 
                        href={`https://wa.me/6285335660159?text=Halo%20Admin,%20saya%20ingin%20konfirmasi%20pembayaran%20untuk%20mengaktifkan%20undangan%20dengan%20ID/Link:%20${inv.url_slug || inv.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                      >
                       Konfirmasi Pembayaran via WhatsApp
                      </a>
                    )}
                    <div className="flex items-center gap-2">
                      <Link href={`/editor/${inv.id}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-sm font-medium transition-colors">
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                      {inv.url_slug ? (
                        <Link href={`/invite/${inv.url_slug}`} target="_blank" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-sm font-medium transition-colors">
                          <Eye className="w-4 h-4" />
                          Pratinjau
                        </Link>
                      ) : (
                        <button disabled className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-stone-200 bg-stone-50 text-stone-400 rounded-xl text-sm font-medium cursor-not-allowed">
                          <Eye className="w-4 h-4" />
                          Pratinjau
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(inv.id)}
                        className="p-2 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Hapus Undangan"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <WhatsAppButton />
      <AIChatWidget />
    </div>
    </PageTransition>
  );
}
