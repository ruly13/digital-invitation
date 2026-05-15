import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
}

export function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
      <p className="text-sm font-medium text-stone-500 mb-2">{title}</p>
      <p className="text-3xl font-semibold text-stone-900 mb-1">{value}</p>
      <p className="text-xs text-stone-400">{subtitle}</p>
    </div>
  );
}
