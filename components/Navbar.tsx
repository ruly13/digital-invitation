'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { WHATSAPP_URL } from '@/lib/constants';
import Logo from '@/components/Logo';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100"
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center">
          <Logo className="text-lg sm:text-xl" />
        </div>
        <div className="hidden md:flex items-center gap-10 text-sm font-medium text-stone-600">
          <Link href="#fitur" className="hover:text-rose-600 transition-colors">Fitur</Link>
          <Link href="#cara-kerja" className="hover:text-rose-600 transition-colors">Cara Kerja</Link>
          <Link href="#harga" className="hover:text-rose-600 transition-colors">Harga</Link>
          <Link href="/tema" className="hover:text-rose-600 transition-colors">Tema</Link>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link href="/tema" className="text-xs sm:text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors md:hidden whitespace-nowrap">Tema</Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href={WHATSAPP_URL()} target="_blank" className="bg-rose-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium hover:bg-rose-600 transition-all shadow-sm hover:shadow-md whitespace-nowrap">
              Pesan Sekarang
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
