'use server';

import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';

const rsvpRateLimit = new Map<string, { count: number; timestamp: number }>();

export async function getInvitationBase(id: string, passwordAttempt?: string) {
  try {
    let { data, error } = await supabase.from('invitations').select('*').eq('url_slug', id).single();
    if ((error || !data) && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      const res = await supabase.from('invitations').select('*').eq('id', id).single();
      data = res.data;
      error = res.error;
    }
    
    if (data) {
      const storedPassword = data.password || (data.details && data.details.password);
      
      if (storedPassword) {
        if (!passwordAttempt || passwordAttempt !== storedPassword) {
          // If password matches, we proceed. Otherwise return only basics and a flag.
          // Note: In a real prod environment we'd use bcrypt to compare hashes.
          // But here we rely on server side check to avoid client bundle exposure.
          return { data: { id: data.id, requiresPassword: true, bride_name: data.bride_name, groom_name: data.groom_name, payment_status: data.payment_status } };
        }
      }
    }
    
    return { data, error };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

export async function submitRsvpAction(payload: { invitation_id: string; name: string; status: string; count: number; message: string; captchaAnswer: string; expectedCaptcha: number }) {
  // 1. CAPTCHA Check
  if (!payload.captchaAnswer || parseInt(payload.captchaAnswer) !== payload.expectedCaptcha) {
    return { error: 'Jawaban CAPTCHA salah. Silakan coba lagi.' };
  }

  // 2. Rate Limit Check
  const ipList = (await headers()).get('x-forwarded-for') || 'unknown';
  const ip = ipList.split(',')[0];
  const now = Date.now();
  const limitWindow = 60000; // 1 minute
  const maxRequests = 5;

  const record = rsvpRateLimit.get(ip);
  if (record && now - record.timestamp < limitWindow) {
    if (record.count >= maxRequests) {
      return { error: 'Terlalu banyak permintaan. Silakan coba lagi dalam beberapa menit.' };
    }
    record.count += 1;
    rsvpRateLimit.set(ip, record);
  } else {
    rsvpRateLimit.set(ip, { count: 1, timestamp: now });
  }

  // 3. Database Insert
  const { error } = await supabase.from('guest_responses').insert({
    invitation_id: payload.invitation_id,
    name: payload.name,
    attendance: payload.status,   // 'Hadir' atau 'Tidak Hadir'
    guest_count: payload.count,
    message: payload.message
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function resolveGoogleMapsUrl(url: string) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    const finalUrl = res.url;
    
    // Pattern 1: /@lat,lng
    const match = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[2]), finalUrl };
    }
    
    // Pattern 2: ?ll=lat,lng
    const llMatch = finalUrl.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (llMatch) {
       return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]), finalUrl };
    }
    
    // Pattern 3: /dir//lat,lng  or /place/lat,lng
    const placeMatch = finalUrl.match(/\/(?:place|dir)\/(-?\d+\.\d+)[^0-9.-]+(-?\d+\.\d+)/);
    if (placeMatch) {
       return { lat: parseFloat(placeMatch[1]), lng: parseFloat(placeMatch[2]), finalUrl };
    }
    
    // Pattern 4: /search/lat,+lng
    const searchMatch = finalUrl.match(/\/search\/(-?\d+\.\d+)[^0-9.-]+(-?\d+\.\d+)/);
    if (searchMatch) {
       return { lat: parseFloat(searchMatch[1]), lng: parseFloat(searchMatch[2]), finalUrl };
    }
    
    // Fallback: any two floats separated by common separators in the URL
    const fallbackMatch = finalUrl.match(/(-?\d+\.\d+)(?:%2C|,|\+)+(-?\d+\.\d+)/);
    if (fallbackMatch) {
       return { lat: parseFloat(fallbackMatch[1]), lng: parseFloat(fallbackMatch[2]), finalUrl };
    }

    return { error: 'Titik koordinat tidak ditemukan dalam format link tersebut.' };
  } catch (error: any) {
    return { error: error.message };
  }
}
