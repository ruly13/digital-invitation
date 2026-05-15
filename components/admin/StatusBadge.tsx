import React from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === 'Hadir') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Hadir
      </span>
    );
  }
  if (status === 'Tidak Hadir') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-medium border border-rose-100">
        <XCircle className="w-3.5 h-3.5" />
        Tidak Hadir
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100">
      <Clock className="w-3.5 h-3.5" />
      Menunggu
    </span>
  );
}
