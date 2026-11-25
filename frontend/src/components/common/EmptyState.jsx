import React from 'react';
import { PackageOpen, Plus } from 'lucide-react';

export default function EmptyState({
  title = 'No delivery orders found',
  description = 'Try adjusting your search filters or create a new delivery order.',
  onAction,
  actionText = 'Create New Order',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-xl border border-dashed border-ups-gray-border">
      <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mb-3">
        <PackageOpen className="w-7 h-7 text-ups-brown" />
      </div>
      <h3 className="text-base font-bold text-ups-brown">{title}</h3>
      <p className="text-xs text-ups-text-muted max-w-sm mt-1 mb-4 leading-relaxed">
        {description}
      </p>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ups-gold hover:bg-ups-gold-hover text-ups-brown font-semibold text-xs transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
}
