'use client';

import Link from 'next/link';
import { Plus, Settings, Users, Eye, Edit, Trash2, Heart, Copy, Check, BarChart3, MessageSquare, BookHeart, LayoutDashboard } from 'lucide-react';
import WhatsAppButton from '@/components/WhatsAppButton';
import AIChatWidget from '@/components/AIChatWidget';
import PageTransition from '@/components/PageTransition';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
        
        setInvitations(invsResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [router]);

  const handleDelete = async (inv: any) => {
    if (!confirm('Apakah Anda yakin ingin menghapus undangan ini? Tindakan ini tidak dapat dibatalkan.')) return;
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

  const copyLink = (slug: string, id: string) => {
    const fullUrl = `${window.location.protocol}//${window.location.host}/invite/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Kalkulasi Quick Stats
  const totalInvitations = invitations.length;
  const activeInvitations = invitations.filter(i => i.payment_status === 'active' || i.payment_status === 'paid').length;
  // TODO: Hubungkan ke tabel 'guests' dan 'comments' di versi selanjutnya
  const totalGuests = 0; 
  const totalWishes = 0;

  return (
    <PageTransition>
      <div className="min-h-screen bg-stone-50 font-sans pb-20 md:pb-0">
        {/* Topbar */}
        <header className="bg-white border-b border-stone-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <Link href="/" className="text-xl font-bold tracking-tight text-stone-900 font-serif">Karsaloka</Link>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleLogout} className="text-sm font-medium text-stone-500 hover:text-rose-500 transition-colors hidden sm:block">
              Keluar
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center text-sm font-bold text-white uppercase shadow-sm">
              {userProfile?.full_name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <nav className="flex flex-col gap-2 sticky top-24">
              <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${pathname === '/dashboard' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-600 hover:bg-stone-100'}`}>
                <LayoutDashboard className="w-5 h-5" />
                Beranda
              </Link>
              <Link href="/dashboard/guests" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-100 font-medium transition-all">
                <Users className="w-5 h-5" />
                Buku Tamu Global
              </Link>
              <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-100 font-medium transition-all">
                <Settings className="w-5 h-5" />
                Pengaturan Akun
              </Link>
            </nav>
          </aside>

          {/* Mobile Bottom Navigation */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-40 px-6 py-3 flex justify-between items-center shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
            <Link href="/dashboard" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard' ? 'text-rose-500' : 'text-stone-400'}`}>
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px] font-medium">Beranda</span>
            </Link>
            <Link href="/editor/new" className="flex flex-col items-center justify-center -mt-8 bg-stone-900 text-white w-12 h-12 rounded-full shadow-lg border-4 border-stone-50">
              <Plus className="w-5 h-5" />
            </Link>
            <Link href="/dashboard/settings" className={`flex flex-col items-center gap-1 ${pathname?.includes('/settings') ? 'text-rose-500' : 'text-stone-400'}`}>
              <Settings className="w-5 h-5" />
              <span className="text-[10px] font-medium">Akun</span>
            </Link>
          </nav>

          {/* Main Content */}
          <main className="flex-1 w-full max-w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-900 tracking-tight">
                  Halo, {userProfile?.full_name?.split(' ')[0] || 'Pengguna'}! 👋
                </h1>
                <p className="text-stone-500 mt-1 max-w-md text-sm sm:text-base">Senang melihat Anda kembali. Kelola kesempurnaan momen pernikahan Anda di sini.</p>
              </div>
              <Link href="/editor/new" className="hidden sm:flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-stone-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap">
                <Plus className="w-4 h-4" />
                Buat Undangan Baru
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
              <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-stone-100 shadow-sm flex flex-col justify-between">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-rose-50 flex items-center justify-center mb-3 sm:mb-4">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-stone-500 mb-1">Total Undangan</p>
                  <h4 className="text-xl sm:text-2xl font-bold text-stone-900">{loading ? '-' : totalInvitations}</h4>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-stone-100 shadow-sm flex flex-col justify-between">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3 sm:mb-4">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-stone-500 mb-1">Tamu (RSVP)</p>
                  <h4 className="text-xl sm:text-2xl font-bold text-stone-900">{loading ? '-' : totalGuests}</h4>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-stone-100 shadow-sm flex flex-col justify-between">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-50 flex items-center justify-center mb-3 sm:mb-4">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-stone-500 mb-1">Total Ucapan</p>
                  <h4 className="text-xl sm:text-2xl font-bold text-stone-900">{loading ? '-' : totalWishes}</h4>
                </div>
              </div>
              <div className="bg-gradient-to-br from-stone-900 to-stone-800 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-md flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full"></div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center mb-3 sm:mb-4 relative z-10">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="relative z-10">
                  <p className="text-xs sm:text-sm font-medium text-stone-300 mb-1">Undangan Aktif</p>
                  <h4 className="text-xl sm:text-2xl font-bold text-white">{loading ? '-' : activeInvitations}</h4>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-serif">Daftar Undangan Anda</h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-3xl p-5 border border-stone-100 shadow-sm min-h-[250px] animate-pulse">
                    <div className="w-20 h-6 bg-stone-100 rounded-full mb-4"></div>
                    <div className="w-3/4 h-6 bg-stone-100 rounded-md mb-2"></div>
                    <div className="w-1/2 h-4 bg-stone-100 rounded-md mb-6"></div>
                    <div className="w-full h-16 bg-stone-50 rounded-2xl mb-4"></div>
                    <div className="w-full h-10 bg-stone-100 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : invitations.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-rose-300 fill-rose-100" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-stone-900 mb-2 font-serif">Belum Ada Undangan</h3>
                <p className="text-stone-500 text-sm sm:text-base mb-6 max-w-sm">Mulai rancang undangan pernikahan digital impian Anda sekarang dengan fitur kustomisasi premium kami.</p>
                <Link href="/editor/new" className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3.5 rounded-full text-sm font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-rose-500/30">
                  <Plus className="w-5 h-5" />
                  Buat Undangan Pertama
                </Link>
              </motion.div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
              >
                {invitations.map((inv) => (
                  <motion.div 
                    variants={itemVariants}
                    key={inv.id} 
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                  >
                    {/* Decorative Top Accent */}
                    {(inv.payment_status === 'active' || inv.payment_status === 'paid') ? (
                       <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                    ) : (
                       <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-stone-200 to-stone-300"></div>
                    )}
                   
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-full pr-4">
                        {(inv.payment_status === 'active' || inv.payment_status === 'paid') ? (
                          <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50/80 text-emerald-700 border border-emerald-100 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulse_2s_ease-in-out_infinite]"></span>
                              Premium Aktif
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-100 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              Belum Aktif
                            </span>
                          </div>
                        )}
                        <h3 className="text-xl sm:text-2xl font-semibold text-stone-900 font-serif truncate">
                          {inv.bride_name && inv.groom_name 
                            ? `${inv.bride_name} & ${inv.groom_name}` 
                            : 'Pernikahan Baru'}
                        </h3>
                        <p className="text-stone-500 text-sm mt-1">
                          {inv.event_date 
                            ? new Date(inv.event_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) 
                            : 'Buka Editor untuk atur tanggal'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                      <div>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">Tema</p>
                        <p className="text-sm font-semibold text-stone-900 truncate">{inv.theme_name || 'Elegant'}</p>
                      </div>
                      <div className="relative group/link">
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">Tautan Publik</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-rose-500 truncate max-w-[120px] sm:max-w-full">
                            {inv.url_slug ? `/invite/${inv.url_slug}` : 'Belum diatur'}
                          </p>
                          {inv.url_slug && (
                            <button 
                              onClick={() => copyLink(inv.url_slug, inv.id)}
                              className="flex items-center shadow-sm gap-1.5 px-2 py-1 bg-white hover:bg-stone-200 border border-stone-200 rounded-md transition-colors text-stone-500 hover:text-stone-900"
                              title="Salin Link"
                            >
                              {copiedId === inv.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      {!(inv.payment_status === 'active' || inv.payment_status === 'paid') && (
                        <a 
                          href={`https://wa.me/6285335660159?text=Halo%20Admin,%20saya%20ingin%20konfirmasi%20pembayaran%20untuk%20mengaktifkan%20undangan%20dengan%20ID/Link:%20${inv.url_slug || inv.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-emerald-500/20 shadow-lg"
                        >
                          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-5.824 4.74-10.563 10.564-10.563 5.832 0 10.564 4.74 10.564 10.564 0 5.824-4.732 10.563-10.564 10.563z"/></svg>
                          <span className="hidden sm:inline">Konfirmasi via WhatsApp</span>
                          <span className="inline sm:hidden">Aktifkan via WA</span>
                        </a>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Link href={`/editor/${inv.id}`} className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 border border-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                          <Edit className="w-4 h-4" />
                          Edit Undangan
                        </Link>
                        
                        <Link href={`/dashboard/guests?id=${inv.id}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-700 rounded-xl text-sm font-semibold transition-colors">
                          <BookHeart className="w-4 h-4" />
                          <span className="hidden sm:inline">Tamu</span>
                        </Link>

                        {inv.url_slug ? (
                          <Link href={`/invite/${inv.url_slug}`} target="_blank" className="flex-1 flex items-center justify-center gap-2 px-2 py-2.5 border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-xl text-sm transition-colors" title="Pratinjau">
                            <Eye className="w-5 h-5" />
                          </Link>
                        ) : (
                          <button disabled className="flex-1 flex items-center justify-center gap-2 px-2 py-2.5 border border-stone-100 bg-stone-50 text-stone-300 rounded-xl text-sm cursor-not-allowed">
                            <Eye className="w-5 h-5" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(inv)}
                          className="flex-none p-2.5 text-stone-400 border border-transparent hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          title="Hapus"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </main>
        </div>
        <WhatsAppButton />
        <AIChatWidget />
      </div>
    </PageTransition>
  );
}
