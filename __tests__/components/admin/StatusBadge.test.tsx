import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/components/admin/StatusBadge';

describe('StatusBadge', () => {
  it('should render "Hadir" status correctly', () => {
    render(<StatusBadge status="Hadir" />);
    const badge = screen.getByText('Hadir');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-emerald-50', 'text-emerald-700');
  });

  it('should render "Tidak Hadir" status correctly', () => {
    render(<StatusBadge status="Tidak Hadir" />);
    const badge = screen.getByText('Tidak Hadir');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-rose-50', 'text-rose-700');
  });

  it('should render "Menunggu" status correctly', () => {
    render(<StatusBadge status="Menunggu" />);
    const badge = screen.getByText('Menunggu');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-amber-50', 'text-amber-700');
  });

  it('should fallback to "Menunggu" if status is unknown', () => {
    render(<StatusBadge status="UnknownStatus" />);
    const badge = screen.getByText('Menunggu');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-amber-50', 'text-amber-700');
  });
});
