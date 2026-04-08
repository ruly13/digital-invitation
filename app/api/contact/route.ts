import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const msg = searchParams.get('msg') || 'Halo Admin karsaloka, saya ingin bertanya tentang undangan digital...';
  
  // The WhatsApp number is securely stored on the server side
  // Default to the provided one if no env var is set, to keep functionality
  const waNumber = process.env.ADMIN_WHATSAPP_NUMBER || '6285335660159';
  
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
  
  return NextResponse.redirect(waUrl);
}
