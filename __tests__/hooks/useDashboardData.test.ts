import { renderHook, waitFor } from '@testing-library/react';
import { useDashboardData } from '@/hooks/useDashboardData';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockGetUser = jest.fn();
const mockFrom = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: () => mockGetUser(),
      signOut: jest.fn(),
    },
    from: (table: string) => mockFrom(table),
  }
}));

describe('useDashboardData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default states and loading true', async () => {
    // Mock user missing
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    const { result } = renderHook(() => useDashboardData());

    expect(result.current.loading).toBe(true);
    expect(result.current.invitations).toEqual([]);
    expect(result.current.userProfile).toBeNull();
    expect(result.current.guestStats).toEqual({ totalGuests: 0, totalWishes: 0 });
  });

  it('should fetch and populate invitations successfully', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'user-1', email: 'test@example.com' } } });
    
    mockFrom.mockImplementation((table) => {
      if (table === 'profiles') {
        return { select: () => ({ eq: () => ({ single: jest.fn().mockResolvedValue({ data: { full_name: 'Test User' }, error: null }) }) }) };
      }
      if (table === 'invitations') {
        return { select: () => ({ eq: () => ({ order: jest.fn().mockResolvedValue({ data: [{ id: 'inv-1', theme_name: 'Theme 1' }], error: null }) }) }) };
      }
      if (table === 'guests') {
        return { select: () => ({ in: jest.fn().mockResolvedValue({ data: [{ count: 2, message: 'Congrats!' }], error: null }) }) };
      }
      return {};
    });

    const { result } = renderHook(() => useDashboardData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.userProfile).toEqual({ full_name: 'Test User' });
    expect(result.current.invitations).toHaveLength(1);
    expect(result.current.guestStats).toEqual({ totalGuests: 2, totalWishes: 1 });
  });
});
