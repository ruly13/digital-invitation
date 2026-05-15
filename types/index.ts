export interface Invitation {
  id: string;
  user_id: string;
  url_slug: string | null;
  bride_name: string;
  groom_name: string;
  event_date: string | null;
  payment_status: 'active' | 'paid' | 'pending';
  theme_name: string;
  music_url?: string;
  details?: Record<string, any>;
  created_at: string;
}

export interface GuestResponse {
  id: string;
  invitation_id: string;
  name: string;
  attendance: 'Hadir' | 'Tidak Hadir' | 'Menunggu' | string;
  guest_count: number;
  message: string;
  created_at: string;
  status?: string; // used locally in our hooks
  count?: number;  // used locally in our hooks
  invitations?: {
    bride_name: string;
    groom_name: string;
    id: string;
  } | null;
}
