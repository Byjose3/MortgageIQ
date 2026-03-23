'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Briefcase, Users, FileText, ArrowRight } from 'lucide-react';
import { mockDeals, mockClients, formatCurrency } from '@/lib/mock-data';

interface SearchPaletteProps {
  open: boolean;
  onClose: () => void;
  onDealSelect?: (dealId: string) => void;
}

export default function SearchPalette({ open, onClose, onDealSelect }: SearchPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) onClose();
      }
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const q = query.toLowerCase();

  const filteredDeals = q
    ? mockDeals.filter(
        (d) =>
          d.clientName.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q) ||
          d.bank.toLowerCase().includes(q)
      )
    : mockDeals.slice(0, 3);

  const filteredClients = q
    ? mockClients.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      )
    : mockClients.slice(0, 2);

  return (
    <>
      <div className="fixed inset-0 bg-[#0F1B2D]/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-start justify-center z-50 pt-[15vh] px-4">
        <div className="bg-white rounded-2xl border border-[#E8ECF0] shadow-[0_24px_64px_rgba(15,27,45,0.2)] w-full max-w-xl overflow-hidden animate-fade-slide-up">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E8ECF0]">
            <Search className="w-5 h-5 text-[#9CA3AF] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar deals, clientes, documentos..."
              className="flex-1 text-sm text-[#0F1B2D] placeholder-[#9CA3AF] outline-none bg-transparent"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-[#9CA3AF] hover:text-[#64748B]">
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="bg-[#F7F8FA] border border-[#E8ECF0] rounded px-1.5 py-0.5 text-[10px] font-mono text-[#9CA3AF]">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[360px] overflow-y-auto p-2">
            {/* Deals */}
            {filteredDeals.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider px-2 py-1.5">
                  Deals
                </p>
                {filteredDeals.map((deal) => (
                  <button
                    key={deal.id}
                    onClick={() => {
                      onDealSelect?.(deal.id);
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F7F8FA] transition-colors text-left group"
                  >
                    <div className="w-8 h-8 bg-[#EFF6FF] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0F1B2D] truncate">{deal.clientName}</p>
                      <p className="text-xs text-[#9CA3AF]">
                        {deal.id} · {deal.stage} · {formatCurrency(deal.amount)}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}

            {/* Clients */}
            {filteredClients.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider px-2 py-1.5">
                  Clientes
                </p>
                {filteredClients.map((client) => (
                  <button
                    key={client.id}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F7F8FA] transition-colors text-left group"
                  >
                    <div className="w-8 h-8 bg-[#0F1B2D] rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {client.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0F1B2D] truncate">{client.name}</p>
                      <p className="text-xs text-[#9CA3AF]">{client.email}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}

            {query && filteredDeals.length === 0 && filteredClients.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Search className="w-8 h-8 text-[#E8ECF0] mb-2" />
                <p className="text-sm text-[#9CA3AF]">Sem resultados para &quot;{query}&quot;</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-[#F7F8FA] flex items-center gap-4 text-[10px] text-[#9CA3AF]">
            <span className="flex items-center gap-1"><kbd className="bg-[#F7F8FA] border border-[#E8ECF0] rounded px-1 py-0.5 font-mono">↵</kbd> selecionar</span>
            <span className="flex items-center gap-1"><kbd className="bg-[#F7F8FA] border border-[#E8ECF0] rounded px-1 py-0.5 font-mono">↑↓</kbd> navegar</span>
            <span className="flex items-center gap-1"><kbd className="bg-[#F7F8FA] border border-[#E8ECF0] rounded px-1 py-0.5 font-mono">ESC</kbd> fechar</span>
          </div>
        </div>
      </div>
    </>
  );
}
