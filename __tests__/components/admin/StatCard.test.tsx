import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatCard } from '@/components/admin/StatCard';

describe('StatCard', () => {
  it('should render title, value, and subtitle correctly', () => {
    render(<StatCard title="Total Tamu" value="150" subtitle="Data terbaru" />);
    
    expect(screen.getByText('Total Tamu')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('Data terbaru')).toBeInTheDocument();
  });

  it('should handle edge cases like zero or empty values', () => {
    render(<StatCard title="Jumlah Hadir" value="0" subtitle="" />);
    
    expect(screen.getByText('Jumlah Hadir')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
