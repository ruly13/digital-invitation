import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditorTabGaleri from '@/components/editor/EditorTabGaleri';

// Mock Supabase agar tidak perlu env vars
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: { getUser: jest.fn() },
    from: jest.fn(() => ({ select: jest.fn(), insert: jest.fn(), update: jest.fn(), eq: jest.fn() })),
  },
}));

// FormData mock yang mencerminkan INITIAL_FORM_DATA tanpa mengimport hook
const buildFormData = (overrides: Record<string, unknown> = {}) => ({
  title: 'Test Invitation',
  customLink: 'test-link',
  customFont: '',
  groomName: 'Budi',
  brideName: 'Rina',
  date: '2026-08-12',
  time: '09:00',
  venue: 'Gedung Test',
  address: 'Jl. Test No. 1',
  mapCoordinates: null,
  receptionDate: '',
  receptionTime: '',
  receptionVenue: '',
  receptionAddress: '',
  theme: 'elegant',
  openingGreeting: 'The Wedding Of',
  saveTheDateDate: '',
  saveTheDateDescription: '',
  customBgColor: '',
  customAccentColor: '',
  musicUrl: '',
  musicVolume: 50,
  greeting: 'Dengan memohon rahmat...',
  gallery: [] as string[],
  youtubeId: '',
  instagram: '',
  facebook: '',
  twitter: '',
  enableRSVP: true,
  bankAccounts: [],
  digitalWallets: [],
  shippingAddress: '',
  loveStories: [],
  enableGuestbook: true,
  preventSpam: true,
  ...overrides,
});

describe('EditorTabGaleri', () => {
  const mockSetFormData = jest.fn();
  const mockHandleFileUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the gallery heading and sub-heading', () => {
    render(
      <EditorTabGaleri
        formData={buildFormData() as any}
        setFormData={mockSetFormData}
        isDarkMode={false}
        uploadingImage={{}}
        handleFileUpload={mockHandleFileUpload}
      />
    );

    expect(screen.getByText('Galeri Foto')).toBeInTheDocument();
    expect(screen.getByText('Foto-Foto Momen')).toBeInTheDocument();
  });

  it('should render empty gallery state when gallery is empty', () => {
    render(
      <EditorTabGaleri
        formData={buildFormData({ gallery: [] }) as any}
        setFormData={mockSetFormData}
        isDarkMode={false}
        uploadingImage={{}}
        handleFileUpload={mockHandleFileUpload}
      />
    );

    expect(screen.getByText('Galeri Masih Kosong')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload foto pertama/i })).toBeInTheDocument();
  });

  it('should render youtube video id input', () => {
    render(
      <EditorTabGaleri
        formData={buildFormData() as any}
        setFormData={mockSetFormData}
        isDarkMode={false}
        uploadingImage={{}}
        handleFileUpload={mockHandleFileUpload}
      />
    );

    expect(screen.getByPlaceholderText('ID Video (Cth: dQw4w9WgXcQ)')).toBeInTheDocument();
  });

  it('should call setFormData when youtube input changes', () => {
    render(
      <EditorTabGaleri
        formData={buildFormData() as any}
        setFormData={mockSetFormData}
        isDarkMode={false}
        uploadingImage={{}}
        handleFileUpload={mockHandleFileUpload}
      />
    );

    const input = screen.getByPlaceholderText('ID Video (Cth: dQw4w9WgXcQ)');
    fireEvent.change(input, { target: { value: 'dQw4w9WgXcQ' } });

    expect(mockSetFormData).toHaveBeenCalledTimes(1);
  });

  it('should call setFormData with new empty gallery slot when "Tambah Foto" is clicked', () => {
    render(
      <EditorTabGaleri
        formData={buildFormData() as any}
        setFormData={mockSetFormData}
        isDarkMode={false}
        uploadingImage={{}}
        handleFileUpload={mockHandleFileUpload}
      />
    );

    const tambahButton = screen.getByText('Tambah Foto');
    fireEvent.click(tambahButton);

    expect(mockSetFormData).toHaveBeenCalledTimes(1);
    expect(mockSetFormData).toHaveBeenCalledWith(
      expect.objectContaining({ gallery: [''] })
    );
  });

  it('should not render empty state when gallery has images', () => {
    const images = ['https://example.com/p1.jpg', 'https://example.com/p2.jpg'];
    render(
      <EditorTabGaleri
        formData={buildFormData({ gallery: images }) as any}
        setFormData={mockSetFormData}
        isDarkMode={false}
        uploadingImage={{}}
        handleFileUpload={mockHandleFileUpload}
      />
    );

    expect(screen.queryByText('Galeri Masih Kosong')).not.toBeInTheDocument();
    expect(screen.getByText('Galeri Foto')).toBeInTheDocument();
  });
});
