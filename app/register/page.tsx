'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Register() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Supabase signUp function
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;
      
      setSuccess(true);
      
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftar. Silakan coba lagi nanti.');
      console.error(err);
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
          Buat Akun Baru
        </h2>
        <p className="mt-2 text-center text-sm text-stone-600">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-medium text-rose-600 hover:text-rose-500 transition-colors">
            Masuk di sini
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-3xl sm:px-10 border border-stone-200">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm">
              Pendaftaran berhasil! Silakan periksa kotak masuk email Anda untuk verifikasi akun, lalu login.
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-stone-700">
                Nama Lengkap
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-stone-300 rounded-xl shadow-sm placeholder-stone-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-all"
                  placeholder="Nama Anda"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700">
                Alamat Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-stone-300 rounded-xl shadow-sm placeholder-stone-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-all"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700">
                Kata Sandi
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-stone-300 rounded-xl shadow-sm placeholder-stone-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-all"
                  placeholder="Minimal 6 karakter"
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading || success}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-600 transition-all disabled:opacity-50"
              >
                {loading ? 'Memproses...' : 'Daftar Sekarang'}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
