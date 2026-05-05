import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Analytics } from "@vercel/analytics/next";
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: {
    default: 'karsaloka — Undangan Pernikahan Digital Elegan & Modern',
    template: '%s | karsaloka',
  },
  description: 'Buat undangan pernikahan digital elegan, unik, dan premium di Indonesia bersama karsaloka. Kelola RSVP, bagikan amplop digital dengan harga yang paling murah dan hemat.',
  keywords: ['undangan pernikahan digital', 'undangan nikah online indonesia', 'undangan digital murah', 'wedding invitation online', 'RSVP online', 'karsaloka'],
  authors: [{ name: 'karsaloka' }],
  metadataBase: new URL('https://karsaloka.site'),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://karsaloka.site',
    siteName: 'karsaloka',
    title: 'karsaloka — Undangan Pernikahan Digital Elegan & Modern',
    description: 'Buat undangan pernikahan digital elegan, murah, dan modern di Indonesia bersama karsaloka.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'karsaloka — Undangan Pernikahan Digital',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'karsaloka — Undangan Pernikahan Digital Elegan',
    description: 'Buat undangan pernikahan digital elegan, unik, dan hemat bersama karsaloka.',
    images: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: 'mnmjgJVmWAVr2iMHh3urbo_ZuMThBxHH1HLvoxgt1qE',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body suppressHydrationWarning className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
