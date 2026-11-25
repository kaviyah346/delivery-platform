import React from 'react';
import ChatbotDrawer from '../components/chatbot/ChatbotDrawer';
import { Bot, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function ChatbotPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-ups-brown to-ups-brown-light text-white p-6 rounded-xl shadow-sm border border-ups-brown flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-ups-gold font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            AI Logistics Dispatcher & Natural Language Assistant
          </div>
          <h2 className="text-xl font-bold">Automated Fleet & Order Intelligence</h2>
          <p className="text-xs text-gray-300 max-w-xl mt-1 leading-relaxed">
            Query real-time parcel statuses, vehicle payload capacities, active routes, and automated allocation suggestions in natural language.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-white">Capacity Safety Guard Active</span>
        </div>
      </div>

      {/* Embedded Chatbot Window */}
      <div className="h-[580px] max-w-4xl mx-auto">
        <ChatbotDrawer isOpen={true} isFloating={false} />
      </div>
    </div>
  );
}
