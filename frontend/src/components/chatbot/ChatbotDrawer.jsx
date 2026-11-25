import React, { useState, useRef, useEffect } from 'react';
import { chatbotApi } from '../../api/chatbotApi';
import { 
  Bot, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Sparkles, 
  MessageSquare,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export default function ChatbotDrawer({ isOpen: controlledOpen, onClose: controlledClose, isFloating = true }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = controlledClose !== undefined ? (val) => (!val && controlledClose()) : setInternalOpen;

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "👋 Hello Dispatcher! I am your **AI Logistics Dispatch Assistant**.\n\nYou can ask me to track parcels (e.g. `Track ORD-1001`), evaluate fleet capacity (e.g. `Can we carry 250kg?`), or inspect transit routes.",
      suggestions: [
        'Show fleet status',
        'Track ORD-1001',
        'Find vehicle for 250kg',
        'Check active routes',
        'Are any vehicles overloaded?'
      ],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatbotApi.sendQuery(query);
      const botReply = res.data?.reply || "I couldn't process that query. Please try asking about an order or fleet capacity.";
      const suggestions = res.data?.suggestions || [
        'Show fleet status',
        'Track ORD-1006',
        'Check active routes'
      ];

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botReply,
          suggestions: suggestions,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "⚠️ Failed to connect to dispatcher assistant service. Ensure backend is running.",
          suggestions: ['Show fleet status'],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedText = (text, isBot = true) => {
    if (!isBot) {
      return (
        <p className="text-xs text-white font-medium leading-relaxed whitespace-pre-wrap">
          {text}
        </p>
      );
    }

    // Simple markdown helper for bold and bullets
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bold replacement
      const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={pIdx} className="px-1.5 py-0.5 rounded bg-amber-100/70 text-ups-brown font-mono text-[11px] font-semibold">{part.slice(1, -1)}</code>;
        }
        return part;
      });

      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <div key={idx} className="flex items-start gap-1.5 pl-2 my-0.5 text-xs text-gray-800">
            <span className="text-ups-gold font-bold">•</span>
            <span>{formattedLine.slice(1)}</span>
          </div>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="text-xs text-gray-800 leading-relaxed">
          {formattedLine}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating launcher trigger (when isFloating is true) */}
      {isFloating && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2 px-4 py-3 bg-ups-brown text-ups-gold hover:bg-black rounded-full shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 border-2 border-ups-gold"
          title="Open AI Logistics Dispatcher"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-ups-gold" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-1 -right-1 ring-2 ring-ups-brown animate-pulse" />
          </div>
          <span className="font-bold text-xs tracking-wide text-white">AI Dispatcher</span>
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className={`
          ${isFloating 
            ? 'fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[540px] shadow-2xl rounded-2xl border border-ups-gray-border flex flex-col overflow-hidden bg-white'
            : 'w-full h-full min-h-[500px] flex flex-col bg-white rounded-xl border border-ups-gray-border shadow-sm overflow-hidden'
          }
        `}>
          {/* Header */}
          <div className="p-3.5 bg-ups-brown text-white flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-ups-gold flex items-center justify-center text-ups-brown shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white leading-tight flex items-center gap-1.5">
                  AI Logistics Dispatcher
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </h4>
                <p className="text-[10px] text-ups-gold font-medium">Real-Time Fleet & Order Intelligence</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-gray-300">
              <button
                onClick={() => setMessages([messages[0]])}
                title="Reset conversation"
                className="p-1 hover:text-white rounded hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              {isFloating && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:text-white rounded hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-gray-50/50">
            {messages.map((m, idx) => {
              const isBot = m.sender === 'bot';
              return (
                <div key={idx} className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-xs ${
                    isBot 
                      ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none' 
                      : 'bg-ups-brown text-white font-medium rounded-tr-none shadow-sm'
                  }`}>
                    {renderFormattedText(m.text, isBot)}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 px-1">{m.time}</span>

                  {/* Suggestions Chips */}
                  {isBot && m.suggestions && m.suggestions.length > 0 && idx === messages.length - 1 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                      {m.suggestions.map((s, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSend(s)}
                          disabled={loading}
                          className="px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-ups-brown text-[10px] font-semibold transition-all active:scale-95 disabled:opacity-50"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-gray-400 text-xs italic bg-white p-2.5 rounded-xl border border-gray-100 max-w-[60%]">
                <Sparkles className="w-3.5 h-3.5 text-ups-gold animate-spin" />
                <span>Dispatcher evaluating database...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about orders, capacity, fleet..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 bg-ups-gold hover:bg-ups-gold-hover text-ups-brown font-bold rounded-lg transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
