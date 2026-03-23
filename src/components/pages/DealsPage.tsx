'use client';

import { useState } from 'react';
import { Search, Filter, SortAsc, Plus, ChevronRight } from 'lucide-react';
import { mockDeals, formatCurrency, STAGE_COLORS, type Deal } from '@/lib/mock-data';

const riskConfig = {
  low: { label: 'Baixo', color: '#10B981', bg: '#ECFDF5' },
  medium: { label: 'Médio', color: '#F59E0B', bg: '#FFFBEB' },
  high: { label: 'Alto', color: '#EF4444', bg: '#FEF2F2' },
  critical: { label: 'Crítico', color: '#7C3AED', bg: '#F5F3FF' },
};

interface DealsPageProps {
  onDealClick?: (dealId: string) => void;
  onNewDeal?: () => void;
}

export default function DealsPage({ onDealClick, onNewDeal }: DealsPageProps) {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const filtered = mockDeals.filter((d) => {
    const matchesSearch =
      d.clientName.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.bank.toLowerCase().includes(search.toLowerCase());
    const matchesStage = stageFilter === 'all' || d.stage === stageFilter;
    const matchesRisk = riskFilter === 'all' || d.risk === riskFilter;
    return matchesSearch && matchesStage && matchesRisk;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0F1B2D]">Deals</h2>
          <p className="text-sm text-[#64748B] mt-0.5">{mockDeals.length} negócios ativos</p>
        </div>
        <button onClick={onNewDeal} className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-4 h-9 rounded-lg transition-colors shadow-[0_2px_8px_rgba(37,99,235,0.35)]">
          <Plus className="w-4 h-4" />
          Novo Deal
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center bg-white rounded-xl border border-[#E8ECF0] shadow-card p-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-[#F7F8FA] border border-[#E8ECF0] rounded-lg px-3 h-9">
          <Search className="w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por cliente, deal ID..."
            className="flex-1 bg-transparent text-sm text-[#0F1B2D] placeholder-[#9CA3AF] outline-none"
          />
        </div>

        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="h-9 px-3 bg-[#F7F8FA] border border-[#E8ECF0] rounded-lg text-sm text-[#64748B] outline-none hover:border-[#94A3B8] transition-colors"
        >
          <option value="all">Todas as Etapas</option>
          {['Prospection','Qualification','Documentation','Analysis','Simulation','Submission','Bank Review','Approved','Negotiation','Deed','Closed'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="h-9 px-3 bg-[#F7F8FA] border border-[#E8ECF0] rounded-lg text-sm text-[#64748B] outline-none hover:border-[#94A3B8] transition-colors"
        >
          <option value="all">Todos os Riscos</option>
          <option value="low">Baixo Risco</option>
          <option value="medium">Risco Médio</option>
          <option value="high">Alto Risco</option>
          <option value="critical">Risco Crítico</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E8ECF0] shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8ECF0] bg-[#F8FAFC]">
              {['Cliente', 'Deal ID', 'Montante', 'Etapa', 'Banco', 'TAEG', 'Score', 'Risco', 'Prazo', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((deal) => {
              const risk = riskConfig[deal.risk];
              const stageColor = STAGE_COLORS[deal.stage];
              const scoreColor = deal.readinessScore >= 80 ? '#10B981' : deal.readinessScore >= 60 ? '#F59E0B' : '#EF4444';
              return (
                <tr
                  key={deal.id}
                  className="border-b border-[#F7F8FA] hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                  onClick={() => onDealClick?.(deal.id)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-[#0F1B2D] rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {deal.clientAvatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0F1B2D]">{deal.clientName}</p>
                        <p className="text-[10px] text-[#9CA3AF]">{deal.agent}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-[#64748B] bg-[#F7F8FA] px-2 py-1 rounded">{deal.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-[#0F1B2D]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {formatCurrency(deal.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full"
                      style={{ backgroundColor: `${stageColor}15`, color: stageColor }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stageColor }} />
                      {deal.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#64748B]">{deal.bank}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-[#0F1B2D]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {deal.taeg}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${deal.readinessScore}%`, backgroundColor: scoreColor }}
                        />
                      </div>
                      <span className="text-xs font-bold" style={{ fontFamily: 'JetBrains Mono, monospace', color: scoreColor }}>
                        {deal.readinessScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-[10px] font-semibold px-2 py-1 rounded-full"
                      style={{ backgroundColor: risk.bg, color: risk.color }}
                    >
                      {risk.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#64748B]">
                    {new Date(deal.dueDate).toLocaleDateString('pt-PT')}
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight className="w-4 h-4 text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="w-10 h-10 text-[#E8ECF0] mb-3" />
            <p className="text-sm font-medium text-[#9CA3AF]">Nenhum deal encontrado</p>
            <p className="text-xs text-[#C8CDD5] mt-1">Tente ajustar os filtros</p>
          </div>
        )}
      </div>
    </div>
  );
}
