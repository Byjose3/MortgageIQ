'use client';

import { useState } from 'react';
import { Bell, Search, Plus, ChevronDown, X, Command } from 'lucide-react';
import { mockAlerts } from '@/lib/mock-data';

interface TopNavProps {
  onNewDeal?: () => void;
  onSearchOpen?: () => void;
}

export default function TopNav({ onNewDeal, onSearchOpen }: TopNavProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const urgentCount = mockAlerts.filter(a => a.type === 'urgent' && !a.dismissed).length;

  return (
    <header className="h-16 bg-white border-b border-[#E8ECF0] flex items-center px-6 gap-4 z-50 relative shadow-[0_1px_0_0_#E8ECF0]">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-6">
        <div className="w-8 h-8 bg-[#0F1B2D] rounded-lg flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 14L9 4L15 14" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.5 10.5H12.5" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="font-bold text-[#0F1B2D] text-[15px] tracking-tight">
          Mortgage<span className="text-[#2563EB]">IQ</span>
        </span>
      </div>

      {/* Search bar */}
      <button
        onClick={onSearchOpen}
        className="flex items-center gap-3 bg-[#F7F8FA] border border-[#E8ECF0] rounded-lg px-4 h-9 flex-1 max-w-sm text-sm text-[#9CA3AF] hover:border-[#2563EB]/40 hover:bg-white transition-all duration-150 group"
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">Pesquisar deals, clientes...</span>
        <div className="flex items-center gap-0.5 bg-white border border-[#E8ECF0] rounded px-1.5 py-0.5 text-[10px] font-mono text-[#9CA3AF] group-hover:border-[#2563EB]/30">
          <Command className="w-2.5 h-2.5" />
          <span>K</span>
        </div>
      </button>

      <div className="flex-1" />

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F7F8FA] hover:text-[#0F1B2D] transition-colors"
          >
            <Bell className="w-5 h-5" />
            {urgentCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#EF4444] rounded-full text-[9px] font-bold text-white flex items-center justify-center leading-none animate-pulse-dot">
                {urgentCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 bg-white rounded-xl border border-[#E8ECF0] shadow-[0_8px_32px_rgba(15,27,45,0.14)] z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E8ECF0] flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0F1B2D]">Notificações</span>
                <button
                  onClick={() => setNotifOpen(false)}
                  className="w-6 h-6 flex items-center justify-center rounded text-[#9CA3AF] hover:text-[#0F1B2D] hover:bg-[#F7F8FA]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {mockAlerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="px-4 py-3 border-b border-[#F7F8FA] hover:bg-[#F7F8FA] transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        alert.type === 'urgent' ? 'bg-[#EF4444]' :
                        alert.type === 'warning' ? 'bg-[#F59E0B]' :
                        alert.type === 'success' ? 'bg-[#10B981]' : 'bg-[#2563EB]'
                      }`} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#0F1B2D] truncate">{alert.title}</p>
                        <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed line-clamp-2">{alert.description}</p>
                        <p className="text-[10px] text-[#9CA3AF] mt-1">
                          {new Date(alert.timestamp).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 text-center">
                <button className="text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8]">
                  Ver todas as notificações
                </button>
              </div>
            </div>
          )}
        </div>

        {/* New Deal CTA */}
        <button
          onClick={onNewDeal}
          className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-4 h-9 rounded-lg transition-colors shadow-[0_2px_8px_rgba(37,99,235,0.35)] hover:shadow-[0_4px_12px_rgba(37,99,235,0.45)]"
        >
          <Plus className="w-4 h-4" />
          Novo Deal
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#E8ECF0] cursor-pointer group">
          <div className="w-8 h-8 bg-[#0F1B2D] rounded-full flex items-center justify-center text-xs font-bold text-white">
            AC
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-[#0F1B2D] leading-tight">Ana Costa</p>
            <p className="text-[10px] text-[#64748B] leading-tight">Senior Intermediary</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#0F1B2D] transition-colors" />
        </div>
      </div>

      {/* Backdrop for notifications */}
      {notifOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
      )}
    </header>
  );
}
