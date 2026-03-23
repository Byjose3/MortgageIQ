'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { PIPELINE_STAGES, STAGE_COLORS, stageDeals, mockDeals, formatCurrency, type DealStage } from '@/lib/mock-data';

interface PipelineKanbanProps {
  onDealClick?: (dealId: string) => void;
  onStageClick?: (stage: DealStage) => void;
  selectedStage?: DealStage | null;
}

function formatStageValue(value: number): string {
  if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `€${(value / 1000).toFixed(0)}K`;
  return `€${value}`;
}

export default function PipelineKanban({ onDealClick, onStageClick, selectedStage }: PipelineKanbanProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-[#E8ECF0] shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8ECF0]">
        <div>
          <h3 className="text-sm font-semibold text-[#0F1B2D]">Pipeline de Negócios</h3>
          <p className="text-xs text-[#64748B] mt-0.5">47 deals ativos em 11 etapas</p>
        </div>
        <button className="text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1">
          Ver tudo <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Kanban scroll */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-2 p-4" style={{ minWidth: 'max-content' }}>
          {PIPELINE_STAGES.map((stage, index) => {
            const data = stageDeals[stage];
            const color = STAGE_COLORS[stage];
            const isSelected = selectedStage === stage;
            const urgencyBg =
              data.urgency === 'urgent'
                ? 'bg-[#FEF2F2] border-[#FECACA]'
                : data.urgency === 'attention'
                ? 'bg-[#FFFBEB] border-[#FDE68A]'
                : 'bg-[#F8FAFC] border-[#E8ECF0]';

            // Get deals for this stage
            const stageDealsArr = mockDeals.filter(d => d.stage === stage);

            return (
              <div
                key={stage}
                onClick={() => onStageClick?.(stage)}
                className={`flex-shrink-0 w-[160px] rounded-xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-[#2563EB] shadow-[0_0_0_2px_rgba(37,99,235,0.15)]'
                    : `${urgencyBg} hover:border-[#94A3B8]`
                } ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{
                  transition: `opacity 0.4s ease ${index * 60}ms, transform 0.4s ease ${index * 60}ms, border-color 0.15s, box-shadow 0.15s`,
                }}
              >
                {/* Stage header */}
                <div className="px-3 pt-3 pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[11px] font-semibold text-[#0F1B2D] truncate">{stage}</span>
                    {data.urgency === 'urgent' && (
                      <AlertCircle className="w-3 h-3 text-[#EF4444] flex-shrink-0 ml-auto" />
                    )}
                  </div>

                  <div className="flex items-end gap-1.5">
                    <span
                      className="text-2xl font-bold leading-none"
                      style={{ color }}
                    >
                      {data.count}
                    </span>
                    <span className="text-[10px] text-[#9CA3AF] mb-0.5">deals</span>
                  </div>

                  <p
                    className="text-[11px] font-semibold mt-1"
                    style={{ fontFamily: 'JetBrains Mono, monospace', color: '#0F1B2D' }}
                  >
                    {formatStageValue(data.value)}
                  </p>
                </div>

                {/* Deal mini cards */}
                {stageDealsArr.length > 0 && (
                  <div className="px-2 pb-2 space-y-1 border-t border-[#E8ECF0]/60 pt-2">
                    {stageDealsArr.slice(0, 2).map((deal) => (
                      <button
                        key={deal.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDealClick?.(deal.id);
                        }}
                        className="w-full bg-white rounded-lg px-2 py-1.5 border border-[#E8ECF0] hover:border-[#2563EB]/40 hover:bg-[#EFF6FF]/30 transition-all group text-left"
                      >
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
                            style={{ backgroundColor: color }}
                          >
                            {deal.clientAvatar}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-medium text-[#0F1B2D] truncate leading-tight">
                              {deal.clientName.split(' ')[0]}
                            </p>
                            <p className="text-[9px] text-[#9CA3AF]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                              {formatCurrency(deal.amount)}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                    {stageDealsArr.length > 2 && (
                      <p className="text-[10px] text-[#9CA3AF] text-center pt-0.5">
                        +{stageDealsArr.length - 2} mais
                      </p>
                    )}
                  </div>
                )}

                {/* Urgency indicator */}
                {data.urgency !== 'normal' && (
                  <div
                    className="mx-3 mb-3 px-2 py-1 rounded-md text-center"
                    style={{
                      backgroundColor: data.urgency === 'urgent' ? '#FEF2F2' : '#FFFBEB',
                    }}
                  >
                    <p
                      className="text-[9px] font-semibold uppercase tracking-wide"
                      style={{
                        color: data.urgency === 'urgent' ? '#EF4444' : '#F59E0B',
                      }}
                    >
                      {data.urgency === 'urgent' ? '⚡ Urgente' : '⚠ Atenção'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
