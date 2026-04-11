'use client';

import Link from 'next/link';
import { Heart, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { useState, Suspense, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string; captcha?: string }>({});
  
  const [captcha, setCaptcha] = useState({ a: 0, b: 0 });
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  
  // init captcha
  useEffect(() => {
    setCaptcha({ a: Math.floor(Math.random() * 8) + 1, b: Math.floor(Math.random() * 8) + 1 });
  }, []);

  const validate = () => {
    const errs: { email?: string; password?: string; captcha?: string } = {};
    if (!email.trim()) errs.email = 'Email tidak boleh kosong.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Format email tidak valid.';
    if (!password) errs.password = 'Kata sandi tidak boleh kosong.';
    else if (password.length < 6) errs.password = 'Kata sandi minimal 6 karakter.';
    if (!captchaAnswer || parseInt(captchaAnswer) !== captcha.a + captcha.b) {
      errs.captcha = 'Jawaban salah.';
      // refresh captcha
      setCaptcha({ a: Math.floor(Math.random() * 8) + 1, b: Math.floor(Math.random() * 8) + 1 });
      setCaptchaAnswer('');
    }
    return errs;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email atau kata sandi salah. Silakan coba lagi.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Email Anda belum diverifikasi. Cek kotak masuk email Anda.');
        } else {
          throw error;
        }
      }
      
      // Use window.location for a full refresh to ensure auth state is picked up by middleware/server components
      window.location.href = redirectTo;
    } catch (err: any) {
      setError(err.message || 'Gagal masuk. Cek email dan kata sandi Anda.');
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleLogin}>
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-stone-700">
          Alamat Email
        </label>
        <div className="mt-1 relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setFieldErrors(p => ({...p, email: undefined})); }}
            autoComplete="email"
            className={`appearance-none block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm placeholder-stone-400 focus:outline-none sm:text-sm transition-all ${
              fieldErrors.email ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50' : 'border-stone-300 focus:ring-rose-500 focus:border-rose-500'
            }`}
            placeholder="nama@email.com"
          />
        </div>
        {fieldErrors.email && (
          <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />{fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-stone-700">
          Kata Sandi
        </label>
        <div className="mt-1 relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            id="password"
            name="password"
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setFieldErrors(p => ({...p, password: undefined})); }}
            autoComplete="current-password"
            className={`appearance-none block w-full pl-10 pr-10 py-3 border rounded-xl shadow-sm placeholder-stone-400 focus:outline-none sm:text-sm transition-all ${
              fieldErrors.password ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50' : 'border-stone-300 focus:ring-rose-500 focus:border-rose-500'
            }`}
            placeholder="••••••••"
          />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />{fieldErrors.password}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-stone-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-stone-900">
            Ingat saya
          </label>
        </div>

        <div className="text-sm">
          <Link href="/forgot-password" className="font-medium text-rose-600 hover:text-rose-500 transition-colors">
            Lupa kata sandi?
          </Link>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">
          Keamanan: {captcha.a} + {captcha.b} = ?
        </label>
        <div className="mt-1">
          <input
            type="number"
            value={captchaAnswer}
            onChange={(e) => { setCaptchaAnswer(e.target.value); setFieldErrors(p => ({...p, captcha: undefined})); }}
            className={`appearance-none block w-full px-4 py-3 border rounded-xl shadow-sm placeholder-stone-400 focus:outline-none sm:text-sm transition-all ${
              fieldErrors.captcha ? 'border-rose-400 focus:ring-rose-500 border-rose-500 bg-rose-50' : 'border-stone-300 focus:ring-rose-500 border-rose-500'
            }`}
            placeholder="Jawaban"
            required
          />
        </div>
        {fieldErrors.captcha && (
          <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />{fieldErrors.captcha}
          </p>
        )}
      </div>

      <div>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900 transition-all disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </motion.button>
      </div>
    </form>
  );
}

export default function Login() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
            <Heart className="w-6 h-6 text-rose-500" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-serif font-semibold text-stone-900">
          Masuk ke Akun Anda
        </h2>
        <p className="mt-2 text-center text-sm text-stone-600">
          Hanya untuk admin karsaloka
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-3xl sm:px-10 border border-stone-200">
          <Suspense fallback={<div className="text-center py-4">Memuat...</div>}>
            <LoginForm />
          </Suspense>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-stone-500">Atau lanjutkan dengan</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-stone-50 rounded-xl border border-stone-200 text-center">
              <p className="text-xs text-stone-500">Social login (Google & Facebook) akan segera tersedia. Gunakan email dan kata sandi untuk saat ini.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
