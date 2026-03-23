'use client';

import { useState } from 'react';
import { PIPELINE_STAGES, STAGE_COLORS, stageDeals, mockDeals, formatCurrency, type DealStage } from '@/lib/mock-data';
import { AlertCircle, ChevronRight } from 'lucide-react';

interface PipelinePageProps {
  onDealClick?: (dealId: string) => void;
}

function formatStageValue(value: number): string {
  if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `€${(value / 1000).toFixed(0)}K`;
  return `€${value}`;
}

export default function PipelinePage({ onDealClick }: PipelinePageProps) {
  const [selectedStage, setSelectedStage] = useState<DealStage | null>(null);

  const filteredDeals = selectedStage
    ? mockDeals.filter(d => d.stage === selectedStage)
    : mockDeals;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#0F1B2D]">Pipeline</h2>
        <p className="text-sm text-[#64748B] mt-0.5">Visão geral do funil de negócios</p>
      </div>

      {/* Full width kanban */}
      <div className="bg-white rounded-xl border border-[#E8ECF0] shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8ECF0]">
          <p className="text-sm font-semibold text-[#0F1B2D]">Etapas do Pipeline</p>
          {selectedStage && (
            <button
              onClick={() => setSelectedStage(null)}
              className="text-xs text-[#2563EB] hover:text-[#1D4ED8] font-medium"
            >
              Limpar filtro
            </button>
          )}
        </div>
        <div className="overflow-x-auto p-4">
          <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
            {PIPELINE_STAGES.map((stage) => {
              const data = stageDeals[stage];
              const color = STAGE_COLORS[stage];
              const isSelected = selectedStage === stage;
              return (
                <div
                  key={stage}
                  onClick={() => setSelectedStage(isSelected ? null : stage)}
                  className={`flex-shrink-0 w-[180px] rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-[#2563EB] shadow-[0_0_0_3px_rgba(37,99,235,0.1)] bg-[#EFF6FF]/40'
                      : 'border-[#E8ECF0] hover:border-[#94A3B8] bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-xs font-bold text-[#0F1B2D] truncate">{stage}</span>
                    {data.urgency === 'urgent' && <AlertCircle className="w-3.5 h-3.5 text-[#EF4444] ml-auto flex-shrink-0" />}
                  </div>
                  <p className="text-3xl font-bold text-[#0F1B2D] mb-1">{data.count}</p>
                  <p className="text-xs font-bold" style={{ fontFamily: 'JetBrains Mono, monospace', color }}>
                    {formatStageValue(data.value)}
                  </p>
                  {data.urgency !== 'normal' && (
                    <div
                      className="mt-2 px-2 py-1 rounded text-center text-[9px] font-bold uppercase tracking-wide"
                      style={{
                        backgroundColor: data.urgency === 'urgent' ? '#FEF2F2' : '#FFFBEB',
                        color: data.urgency === 'urgent' ? '#EF4444' : '#F59E0B',
                      }}
                    >
                      {data.urgency === 'urgent' ? 'Urgente' : 'Atenção'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Deal list for selected stage */}
      <div className="bg-white rounded-xl border border-[#E8ECF0] shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8ECF0]">
          <p className="text-sm font-semibold text-[#0F1B2D]">
            {selectedStage ? `Deals: ${selectedStage}` : 'Todos os Deals'}
          </p>
          <span className="text-xs text-[#9CA3AF]">{filteredDeals.length} negócios</span>
        </div>
        <div className="divide-y divide-[#F7F8FA]">
          {filteredDeals.map((deal) => {
            const color = STAGE_COLORS[deal.stage];
            const riskColors = {
              low: { color: '#10B981', bg: '#ECFDF5' },
              medium: { color: '#F59E0B', bg: '#FFFBEB' },
              high: { color: '#EF4444', bg: '#FEF2F2' },
              critical: { color: '#7C3AED', bg: '#F5F3FF' },
            };
            const risk = riskColors[deal.risk];
            return (
              <div
                key={deal.id}
                onClick={() => onDealClick?.(deal.id)}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-full bg-[#0F1B2D] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {deal.clientAvatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#0F1B2D]">{deal.clientName}</p>
                    <span className="text-[9px] font-mono text-[#9CA3AF]">{deal.id}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: `${color}15`, color }}
                    >
                      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
                      {deal.stage}
                    </span>
                    <span className="text-[10px] text-[#9CA3AF]">{deal.bank}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#0F1B2D]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {formatCurrency(deal.amount)}
                  </p>
                  <p className="text-[10px] text-[#9CA3AF]">{deal.taeg}% TAEG</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-center">
                    <p className="text-[10px] font-bold" style={{ fontFamily: 'JetBrains Mono, monospace', color: deal.readinessScore >= 80 ? '#10B981' : deal.readinessScore >= 60 ? '#F59E0B' : '#EF4444' }}>
                      {deal.readinessScore}%
                    </p>
                    <p className="text-[9px] text-[#9CA3AF]">Pront.</p>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: risk.bg, color: risk.color }}
                  >
                    {deal.risk.charAt(0).toUpperCase() + deal.risk.slice(1)}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
