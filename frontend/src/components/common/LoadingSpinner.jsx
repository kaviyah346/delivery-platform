import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading data from server...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-12 h-12 rounded-full bg-ups-gold/20 flex items-center justify-center text-ups-brown animate-pulse mb-3">
        <Loader2 className="w-6 h-6 animate-spin text-ups-brown" />
      </div>
      <p className="text-sm font-semibold text-ups-brown">{message}</p>
      <p className="text-xs text-ups-text-muted mt-1">Connecting to PostgreSQL Database</p>
    </div>
  );
}
