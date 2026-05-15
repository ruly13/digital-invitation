import PageTransition from '@/components/PageTransition';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tentang Kami - karsaloka',
  description: 'Mengenal lebih dekat tim dan visi di balik karsaloka, platform undangan pernikahan digital premium Indonesia.',
  openGraph: {
    title: 'Tentang Kami | karsaloka',
    description: 'Mengenal lebih dekat tim dan visi di balik karsaloka.',
    url: 'https://karsaloka.com/about',
    siteName: 'karsaloka',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-rose-100 selection:text-rose-900 p-6 md:p-12 lg:p-24">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-rose-500 transition-colors mb-12 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </Link>

          <h1 className="text-5xl md:text-7xl font-serif mb-8 tracking-tight">Tentang <span className="italic text-rose-500">karsaloka.</span></h1>
          
          <div className="space-y-8 text-lg text-stone-600 leading-relaxed font-light">
            <p className="text-2xl font-medium text-stone-800 leading-snug">
              Kami percaya bahwa setiap perayaan cinta berhak mendapatkan permulaan yang sempurna—sebuah undangan yang tidak hanya menyampaikan informasi, tetapi juga membangkitkan rasa dan estetika.
            </p>

            <p>
              Lahir dari kecintaan kami terhadap desain digital dan keinginan untuk merevolusi cara pasangan membagikan kabar bahagia mereka. Kami menyadari bahwa undangan cetak tradisional seringkali kaku dan mahal, sementara undangan digital yang ada di pasaran jarang yang benar-benar memprioritaskan estetika premium.
            </p>

            <div className="py-8 my-10 border-y border-stone-200 flex justify-center text-rose-300">
              <Heart className="w-12 h-12" />
            </div>

            <h2 className="text-3xl font-serif text-stone-900 mb-4 mt-12">Misi Kami</h2>
            <p>
              Menyediakan platform pembuatan undangan pernikahan digital yang sangat mudah digunakan tanpa harus mengorbankan kualitas dan keindahan desain. Setiap piksel yang kami buat dirancang untuk memastikan momen sekali seumur hidup Anda terabadikan dengan cara yang tak terlupakan.
            </p>
            <p>
              Dari tipografi yang dipilih secara khusus hingga animasi yang sangat halus, karsaloka adalah komitmen terhadap karya seni digital berselera tinggi.
            </p>

            <h2 className="text-3xl font-serif text-stone-900 mb-4 mt-12">Mengapa Memilih Kami?</h2>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Desain Eksklusif:</strong> Beragam mahakarya desain yang dirancang oleh desainer dengan obsesi terhadap detail.</li>
              <li><strong>Keamanan Privasi:</strong> Kami melindungi daftar tamu dan foto Anda dengan sistem keamanan yang andal.</li>
              <li><strong>Kemudahan Penggunaan:</strong> Anda adalah senimannya. Atur warna, font, dan konten semudah menekan layar sentuh dari ponsel pintar Anda.</li>
            </ul>

            <div className="bg-stone-900 text-white rounded-[2rem] p-10 mt-16 text-center">
              <h3 className="text-3xl font-serif mb-4">Mari Merangkai Cerita Anda.</h3>
              <p className="text-stone-300 mb-8 max-w-md mx-auto">Kami tidak sabar menjadi bagian dari hari bahagia Anda. Tulis awal kisah Anda sekarang.</p>
              <Link href="/dashboard" className="inline-block bg-rose-500 text-white px-8 py-4 rounded-full font-bold hover:bg-rose-600 transition-all hover:scale-105 shadow-xl shadow-rose-900/50">
                Mulai Buat Undangan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
