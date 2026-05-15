import { renderHook, act } from '@testing-library/react';
import { useGuestData } from '@/hooks/useGuestData';
import { supabase } from '@/lib/supabase';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          eq: jest.fn().mockResolvedValue({
            data: [
              { id: '1', name: 'John Doe', attendance: 'Hadir', guest_count: 2, message: 'Selamat!' },
              { id: '2', name: 'Jane Smith', attendance: 'Tidak Hadir', guest_count: 0, message: 'Maaf ya.' },
            ],
            error: null
          })
        }))
      }))
    }))
  }
}));

describe('useGuestData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('seharusnya memiliki inisialisasi default yang benar', async () => {
    const { result } = renderHook(() => useGuestData('test-invitation-id'));
    
    expect(result.current.loading).toBe(true);
    expect(result.current.searchQuery).toBe('');
  });

  // Tes lainnya bisa ditambahkan untuk memvalidasi fetching, pencarian, dan stats.
});
