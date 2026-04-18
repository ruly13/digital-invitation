import { Suspense } from 'react';
import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import InvitationClientPage from './InvitationClient';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const SITE_URL = 'https://digital-invitation-rouge.vercel.app';

  // Demo page
  if (id === 'demo') {
    return {
      title: 'Demo Undangan — karsaloka',
      description: 'Lihat contoh undangan pernikahan digital interaktif dari karsaloka. Tema elegan, RSVP otomatis, amplop digital, dan musik latar.',
      openGraph: {
        title: 'Demo Undangan Pernikahan Digital — karsaloka',
        description: 'Lihat contoh undangan pernikahan digital interaktif dari karsaloka.',
        images: [`https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&h=630&auto=format&fit=crop`],
        type: 'website',
      },
      twitter: { card: 'summary_large_image' },
    };
  }

  // Fetch real invitation data
  try {
    let query = supabase.from('invitations').select('details, bride_name, groom_name').eq('url_slug', id);
    let { data } = await query.single();
    if (!data && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      const res = await supabase.from('invitations').select('details, bride_name, groom_name').eq('id', id).single();
      data = res.data;
    }

    if (data) {
      const groom = data.details?.groomName || data.groom_name || 'Mempelai Pria';
      const bride = data.details?.brideName || data.bride_name || 'Mempelai Wanita';
      const coverPhoto = data.details?.coverPhoto || 
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&h=630&auto=format&fit=crop';
      const title = `Undangan Pernikahan ${groom} & ${bride}`;

      return {
        title,
        description: `Anda mendapat undangan pernikahan dari ${groom} & ${bride}. Konfirmasi kehadiran Anda melalui RSVP online.`,
        openGraph: {
          title,
          description: `${groom} & ${bride} mengundang Anda untuk hadir di hari istimewa mereka.`,
          images: [{ url: coverPhoto, width: 1200, height: 630, alt: title }],
          type: 'website',
          locale: 'id_ID',
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description: `${groom} & ${bride} mengundang Anda di hari istimewa mereka.`,
          images: [coverPhoto],
        },
      };
    }
  } catch {
    // fallback below
  }

  return {
    title: 'Undangan Pernikahan Digital — karsaloka',
    openGraph: {
      title: 'Undangan Pernikahan Digital — karsaloka',
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}


export default async function InvitationPage({ params }: Props) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center bg-stone-50"><p className="text-stone-500 font-serif animate-pulse">Memuat undangan...</p></div>}>
      <InvitationClientPage id={id} />
    </Suspense>
  );
}
