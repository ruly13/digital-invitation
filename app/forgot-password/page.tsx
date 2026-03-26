'use client';

import Link from 'next/link';
import { Heart, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Masukkan alamat email Anda terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim email. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
            <Heart className="w-6 h-6 text-rose-500" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-serif font-semibold text-stone-900">
          Lupa Kata Sandi?
        </h2>
        <p className="mt-2 text-center text-sm text-stone-600">
          Masukkan email Anda dan kami akan kirimkan link untuk reset kata sandi.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-3xl sm:px-10 border border-stone-200">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">Email Terkirim!</h3>
                <p className="text-stone-600 text-sm mb-6">
                  Silakan periksa kotak masuk <strong>{email}</strong> dan ikuti link yang kami kirimkan untuk mereset kata sandi Anda.
                </p>
                <p className="text-xs text-stone-400 mb-6">Tidak menerima email? Cek folder Spam atau coba lagi.</p>
                <button
                  onClick={() => { setSent(false); setEmail(''); }}
                  className="text-sm text-rose-600 hover:text-rose-500 font-medium transition-colors"
                >
                  Kirim Ulang Email
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error && (
                  <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleReset}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-stone-700">
                      Alamat Email
                    </label>
                    <div className="mt-1 relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="appearance-none block w-full pl-10 pr-4 py-3 border border-stone-300 rounded-xl shadow-sm placeholder-stone-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-all"
                        placeholder="nama@email.com"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-stone-900 hover:bg-rose-600 focus:outline-none transition-all disabled:opacity-50"
                  >
                    {loading ? 'Mengirim...' : 'Kirim Link Reset'}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 text-center">
            <Link href="/login" className="flex items-center justify-center gap-1 text-sm text-stone-500 hover:text-rose-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke halaman Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
