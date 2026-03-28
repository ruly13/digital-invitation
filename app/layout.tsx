import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
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
    default: 'karsaloka — Undangan Pernikahan Digital Elegan',
    template: '%s | karsaloka',
  },
  description: 'Buat undangan pernikahan digital yang elegan dan modern. Kelola RSVP otomatis, amplop digital, dan bagikan momen spesial Anda dengan mudah bersama karsaloka.',
  keywords: ['undangan pernikahan digital', 'wedding invitation online', 'RSVP online', 'undangan digital', 'karsaloka'],
  authors: [{ name: 'karsaloka' }],
  metadataBase: new URL('https://digital-invitation-rouge.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://digital-invitation-rouge.vercel.app',
    siteName: 'karsaloka',
    title: 'karsaloka — Undangan Pernikahan Digital Elegan',
    description: 'Buat undangan pernikahan digital yang elegan dan modern. Kelola RSVP otomatis, amplop digital, dan bagikan momen spesial Anda.',
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
    description: 'Buat undangan pernikahan digital yang elegan, kelola RSVP, dan bagikan momen spesial Anda.',
    images: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning className="font-sans">{children}</body>
    </html>
  );
}
