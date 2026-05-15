import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Koleksi Tema Undangan Digital Premium | karsaloka',
  description: 'Eksplorasi koleksi eksklusif desain tema undangan pernikahan digital dari karsaloka. Pilih tema elegan, floral, modern, atau rustic yang paling sesuai dengan kepribadian Anda.',
  openGraph: {
    title: 'Koleksi Tema Undangan Digital Premium | karsaloka',
    description: 'Eksplorasi koleksi eksklusif desain tema undangan pernikahan digital dari karsaloka.',
    url: 'https://karsaloka.com/tema',
    siteName: 'karsaloka',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Koleksi Tema Undangan Digital Premium | karsaloka',
    description: 'Pilih tema undangan digital mahakarya estetika untuk hari bahagia Anda.',
  },
};

export default function TemaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
