import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  MapPin, 
  BarChart3, 
  ChevronRight,
  Boxes,
  Bot
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
      description: 'Operations overview & metrics'
    },
    {
      name: 'Delivery Orders',
      path: '/orders',
      icon: Package,
      description: 'Order management & tracking'
    },
    {
      name: 'Fleet & Capacity',
      path: '/fleet',
      icon: Truck,
      description: 'Vehicle loads & limits'
    },
    {
      name: 'Route Planning',
      path: '/routes',
      icon: MapPin,
      description: 'Route allocation engine'
    },
    {
      name: 'Tracking & Reports',
      path: '/reports',
      icon: BarChart3,
      description: 'Analytics & delivery SLA'
    },
    {
      name: 'AI Dispatcher',
      path: '/chatbot',
      icon: Bot,
      badge: 'AI',
      description: 'Logistics intelligence chatbot'
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-ups-brown text-white flex flex-col
        transition-transform duration-300 ease-in-out border-r border-ups-brown-light
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10 bg-ups-brown-dark/40">
          <div className="w-9 h-9 rounded-lg bg-ups-gold flex items-center justify-center text-ups-brown shadow-sm">
            <Boxes className="w-5 h-5 text-ups-brown" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wide text-white leading-tight">
              Logistics System
            </span>
            <span className="text-[10px] text-ups-gold font-medium uppercase tracking-wider">
              Route & Capacity Hub
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Core Modules
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) => `
                group flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-ups-gold text-ups-brown font-semibold shadow-sm'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-ups-brown' : 'text-gray-400 group-hover:text-ups-gold'
                    }`} />
                    <span>{item.name}</span>
                  </div>

                  {item.badge ? (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      isActive
                        ? 'bg-ups-brown text-ups-gold'
                        : 'bg-ups-gold text-ups-brown'
                    }`}>
                      {item.badge}
                    </span>
                  ) : (
                    isActive && <ChevronRight className="w-3.5 h-3.5 text-ups-brown" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-white/10 bg-ups-brown-dark/30 text-xs">
          <div className="flex items-center gap-2 text-gray-300 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-white">PostgreSQL Connected</span>
          </div>
          <p className="text-[11px] text-gray-400">
            Database Status: <span className="font-semibold text-emerald-400">Active & Synced</span>
          </p>
        </div>
      </aside>
    </>
  );
}
