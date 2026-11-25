import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'gold', subtext, trend }) {
  const colorMap = {
    gold: {
      bg: 'bg-amber-50',
      iconBg: 'bg-ups-gold/20 text-amber-800',
      border: 'border-l-4 border-l-ups-gold',
    },
    brown: {
      bg: 'bg-stone-50',
      iconBg: 'bg-ups-brown/10 text-ups-brown',
      border: 'border-l-4 border-l-ups-brown',
    },
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100 text-blue-700',
      border: 'border-l-4 border-l-blue-500',
    },
    green: {
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-100 text-emerald-700',
      border: 'border-l-4 border-l-emerald-500',
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100 text-purple-700',
      border: 'border-l-4 border-l-purple-500',
    },
    red: {
      bg: 'bg-red-50',
      iconBg: 'bg-red-100 text-red-700',
      border: 'border-l-4 border-l-red-500',
    },
  };

  const style = colorMap[color] || colorMap.gold;

  return (
    <div className={`bg-white rounded-xl p-5 shadow-sm border border-ups-gray-border ${style.border} hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs font-semibold text-ups-text-muted uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-ups-brown mt-1.5 tracking-tight">
            {value}
          </p>
          {subtext && (
            <p className="text-xs text-ups-text-muted mt-1.5 flex items-center gap-1">
              {subtext}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${style.iconBg} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
