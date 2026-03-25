import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function TermsOfService() {
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
        <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4">Syarat & Ketentuan</h1>
        <p className="text-stone-500 text-sm mb-12">Terakhir diperbarui: 26 Maret 2026</p>

        <div className="prose prose-stone max-w-none space-y-10 text-stone-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">1. Penerimaan Syarat</h2>
            <p>Dengan mengakses dan menggunakan layanan karsaloka (&quot;Platform&quot;), Anda menyatakan telah membaca, memahami, dan menyetujui Syarat & Ketentuan ini. Jika Anda tidak setuju, mohon hentikan penggunaan Platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">2. Deskripsi Layanan</h2>
            <p>karsaloka adalah platform pembuatan undangan pernikahan digital yang memungkinkan pengguna untuk membuat, mempersonalisasi, dan membagikan undangan dalam format digital. Layanan mencakup pembuatan undangan, manajemen RSVP, buku tamu digital, dan amplop digital.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">3. Akun Pengguna</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Anda bertanggung jawab penuh atas kerahasiaan akun dan kata sandi Anda.</li>
              <li>Anda harus berusia minimal 17 tahun untuk menggunakan Platform ini.</li>
              <li>Satu orang hanya boleh memiliki satu akun aktif.</li>
              <li>Kami berhak menangguhkan akun yang melanggar syarat ini.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">4. Konten Pengguna</h2>
            <p>Anda mempertahankan hak kepemilikan atas semua konten (foto, teks, musik) yang Anda unggah. Dengan mengunggah konten, Anda memberikan karsaloka lisensi terbatas untuk menampilkan konten tersebut kepada tamu undangan Anda. Anda menjamin bahwa konten yang diunggah tidak melanggar hak cipta pihak ketiga.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">5. Pembayaran dan Pengembalian Dana</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pembayaran dilakukan di muka dan bersifat non-refundable setelah undangan diaktifkan.</li>
              <li>Harga yang tertera adalah harga final termasuk pajak yang berlaku.</li>
              <li>Pengembalian dana penuh hanya dipertimbangkan jika terjadi kegagalan teknis dari pihak kami.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">6. Larangan Penggunaan</h2>
            <p>Anda dilarang menggunakan Platform untuk:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Menyebarkan konten yang mengandung ujaran kebencian, pornografi, atau SARA.</li>
              <li>Melakukan penipuan atau aktivitas ilegal apapun.</li>
              <li>Mencoba meretas atau mengganggu keamanan Platform.</li>
              <li>Mengirimkan spam kepada tamu undangan.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">7. Keterbatasan Tanggung Jawab</h2>
            <p>karsaloka tidak bertanggung jawab atas kerugian tidak langsung yang timbul dari penggunaan Platform, termasuk namun tidak terbatas pada kehilangan data akibat keadaan darurat teknis di luar kendali kami.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">8. Perubahan Syarat</h2>
            <p>Kami berhak mengubah Syarat & Ketentuan ini kapan saja. Pengguna akan diberitahu melalui email terdaftar untuk perubahan material. Penggunaan berkelanjutan setelah perubahan berarti penerimaan syarat baru.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">9. Hukum yang Berlaku</h2>
            <p>Syarat & Ketentuan ini diatur dan ditafsirkan berdasarkan hukum Republik Indonesia. Setiap sengketa akan diselesaikan melalui musyawarah mufakat, dan jika tidak tercapai, melalui pengadilan yang berwenang di Indonesia.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-4">10. Hubungi Kami</h2>
            <p>Untuk pertanyaan mengenai syarat ini:</p>
            <a href="https://wa.me/6285335660159" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-rose-600 font-semibold hover:underline">+62 853-3566-0159</a>
          </section>
        </div>
      </main>

      <footer className="text-center py-8 border-t border-stone-100 text-stone-400 text-sm">
        <Link href="/" className="hover:text-rose-500 transition-colors">← Kembali ke Beranda</Link>
      </footer>
    </div>
  );
}
