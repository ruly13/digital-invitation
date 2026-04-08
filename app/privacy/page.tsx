import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans">
      <header className="bg-white border-b border-stone-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-serif font-bold">karsaloka</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4">Kebijakan Privasi</h1>
        <p className="text-stone-500 text-sm mb-12">Terakhir diperbarui: 26 Maret 2026</p>

        <div className="prose prose-stone max-w-none space-y-10 text-stone-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">1. Data yang Kami Kumpulkan</h2>
            <p>Kami mengumpulkan informasi yang Anda berikan secara langsung saat menggunakan layanan karsaloka, termasuk:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Informasi akun: nama, alamat email, kata sandi.</li>
              <li>Data undangan: nama mempelai, tanggal acara, lokasi, foto, dan detail lainnya yang Anda masukkan.</li>
              <li>Data RSVP tamu: nama, kehadiran, dan pesan yang dikirimkan oleh tamu undangan Anda.</li>
              <li>Data teknis: alamat IP, jenis browser, dan log akses untuk keperluan keamanan.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">2. Penggunaan Data</h2>
            <p>Data Anda digunakan semata-mata untuk:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Menyediakan, mengoperasikan, dan meningkatkan layanan karsaloka.</li>
              <li>Mengautentikasi identitas Anda dan mengamankan akun.</li>
              <li>Menampilkan undangan digital kepada tamu yang Anda undang.</li>
              <li>Mengirimkan pemberitahuan penting terkait layanan (bukan iklan).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">3. Penyimpanan dan Keamanan Data</h2>
            <p>Seluruh data disimpan secara aman di server Supabase yang berlokasi di kawasan Asia Tenggara. Kami menerapkan enkripsi SSL/TLS untuk semua transmisi data dan enkripsi at-rest untuk data sensitif. Kata sandi Anda tidak pernah disimpan dalam bentuk teks biasa.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">4. Berbagi Data dengan Pihak Ketiga</h2>
            <p>Kami tidak menjual, menyewakan, atau berbagi data pribadi Anda kepada pihak ketiga untuk tujuan pemasaran. Data hanya dibagikan kepada penyedia layanan infrastruktur (seperti Supabase dan Vercel) yang diperlukan untuk menjalankan platform ini.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">5. Hak Pengguna</h2>
            <p>Anda memiliki hak untuk:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Mengakses dan mengunduh data pribadi Anda kapan saja.</li>
              <li>Memperbarui atau mengoreksi informasi Anda melalui pengaturan akun.</li>
              <li>Menghapus akun dan seluruh data Anda secara permanen.</li>
              <li>Mengajukan pertanyaan atau keluhan melalui kontak di bawah ini.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">6. Cookie</h2>
            <p>Kami menggunakan cookie sesi untuk mempertahankan status login Anda. Tidak ada cookie pelacakan pihak ketiga atau iklan yang digunakan di platform ini.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">7. Hubungi Kami</h2>
            <p>Jika ada pertanyaan mengenai kebijakan privasi ini, silakan hubungi kami melalui WhatsApp:</p>
            <a href="/api/contact" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-rose-600 font-semibold hover:underline">+62 853-3566-0159</a>
          </section>
        </div>
      </main>

      <footer className="text-center py-8 border-t border-stone-100 text-stone-400 text-sm">
        <Link href="/" className="hover:text-rose-500 transition-colors">← Kembali ke Beranda</Link>
      </footer>
    </div>
  );
}
