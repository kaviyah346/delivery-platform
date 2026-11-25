import React from 'react';
import { Menu, Plus, RefreshCw, Shield, Bell } from 'lucide-react';

export default function Header({ onMenuClick, onNewOrderClick, title, subtitle, onRefresh, isRefreshing }) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-ups-gray-border px-4 sm:px-6 py-3.5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-ups-text-muted hover:text-ups-brown hover:bg-ups-gray-hover transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-ups-brown leading-tight">
              {title || 'Dashboard'}
            </h1>
            {subtitle && (
              <p className="text-xs text-ups-text-muted hidden sm:block mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions and User Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Refresh button */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh Data"
              className="p-2 rounded-lg border border-ups-gray-border text-ups-text-muted hover:text-ups-brown hover:bg-ups-gray-bg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-ups-gold' : ''}`} />
            </button>
          )}

          {/* New Delivery Order CTA */}
          {onNewOrderClick && (
            <button
              type="button"
              onClick={onNewOrderClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-ups-gold hover:bg-ups-gold-hover text-ups-brown font-semibold text-xs sm:text-sm shadow-sm transition-all duration-150 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">New Order</span>
              <span className="xs:hidden">New</span>
            </button>
          )}

          {/* User profile avatar */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-ups-gray-border">
            <div className="w-8 h-8 rounded-full bg-ups-brown text-ups-gold font-bold text-xs flex items-center justify-center border border-ups-gold">
              DS
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-semibold text-ups-text-dark leading-tight">
                Dispatcher
              </span>
              <span className="text-[10px] text-ups-text-muted">
                Operations Center
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
