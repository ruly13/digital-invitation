'use client';

import Link from 'next/link';
import { Heart, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Validate password strength
  const isLongEnough = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const passwordsMatch = password === confirm && confirm.length > 0;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) {
      setError('Kata sandi tidak cocok.');
      return;
    }
    if (!isLongEnough) {
      setError('Kata sandi minimal 8 karakter.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Gagal mereset kata sandi. Link mungkin sudah kadaluarsa.');
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
          Buat Kata Sandi Baru
        </h2>
        <p className="mt-2 text-center text-sm text-stone-600">
          Masukkan kata sandi baru Anda di bawah ini.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-3xl sm:px-10 border border-stone-200">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">Kata Sandi Berhasil Diubah!</h3>
                <p className="text-stone-600 text-sm">Mengarahkan ke halaman login dalam 3 detik...</p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {error && (
                  <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <form className="space-y-5" onSubmit={handleReset}>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Kata Sandi Baru</label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="appearance-none block w-full px-4 py-3 border border-stone-300 rounded-xl placeholder-stone-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 text-sm pr-10"
                        placeholder="Minimal 8 karakter"
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Password strength indicators */}
                    {password.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <div className={`flex items-center gap-2 text-xs ${isLongEnough ? 'text-emerald-600' : 'text-stone-400'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${isLongEnough ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                          Minimal 8 karakter
                        </div>
                        <div className={`flex items-center gap-2 text-xs ${hasNumber ? 'text-emerald-600' : 'text-stone-400'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${hasNumber ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                          Mengandung angka
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Konfirmasi Kata Sandi</label>
                    <input
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      className={`appearance-none block w-full px-4 py-3 border rounded-xl placeholder-stone-400 focus:outline-none text-sm transition-colors ${
                        confirm.length > 0
                          ? passwordsMatch
                            ? 'border-emerald-400 focus:ring-emerald-500 focus:border-emerald-500'
                            : 'border-rose-400 focus:ring-rose-500 focus:border-rose-500'
                          : 'border-stone-300 focus:ring-rose-500 focus:border-rose-500'
                      }`}
                      placeholder="Ketik ulang kata sandi"
                    />
                    {confirm.length > 0 && !passwordsMatch && (
                      <p className="mt-1 text-xs text-rose-500">Kata sandi tidak cocok</p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={loading || !passwordsMatch || !isLongEnough}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-stone-900 hover:bg-rose-600 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
