'use client';

import { useState } from 'react';
import { Star, ChevronDown, ChevronUp, CheckCircle, XCircle, Trophy, ArrowRight } from 'lucide-react';
import { mockBankProposals, formatFullCurrency } from '@/lib/mock-data';

export default function BankProposals() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState(false);

  const proposals = mockBankProposals;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setConfirmModal(true);
  };

  return (
    <div className="bg-white rounded-xl border border-[#E8ECF0] shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8ECF0]">
        <div>
          <h3 className="text-sm font-semibold text-[#0F1B2D]">Comparação de Propostas Bancárias</h3>
          <p className="text-xs text-[#64748B] mt-0.5">Deal: Carlos Mendes — €420.000 · 30 anos</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-1 rounded-full">
          <Trophy className="w-3 h-3 text-[#10B981]" />
          <span className="text-[11px] font-semibold text-[#10B981]">3 Propostas</span>
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-7 gap-2 px-5 py-2.5 border-b border-[#E8ECF0] bg-[#F8FAFC]">
        {['Banco', 'TAEG', 'TIN', 'Spread', 'Prestação/mês', 'Score', 'Ação'].map((h) => (
          <p key={h} className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide">
            {h}
          </p>
        ))}
      </div>

      {/* Proposals */}
      <div className="divide-y divide-[#F7F8FA]">
        {proposals.map((proposal) => {
          const isExpanded = expandedId === proposal.id;
          const isSelected = selectedId === proposal.id;

          return (
            <div key={proposal.id} className={`${proposal.recommended ? 'bg-[#EFF6FF]/40' : ''}`}>
              {/* Main row */}
              <div
                className={`grid grid-cols-7 gap-2 px-5 py-3 items-center hover:bg-[#F8FAFC] transition-colors cursor-pointer ${
                  isSelected ? 'bg-[#EFF6FF]' : ''
                }`}
                onClick={() => setExpandedId(isExpanded ? null : proposal.id)}
              >
                {/* Bank */}
                <div className="flex items-center gap-2.5">
                  {proposal.recommended && (
                    <div className="w-1 h-8 bg-[#2563EB] rounded-full flex-shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 bg-[#0F1B2D] rounded flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0">
                        {proposal.bankLogo}
                      </div>
                      <p className="text-xs font-semibold text-[#0F1B2D] leading-tight">{proposal.bank}</p>
                    </div>
                    {proposal.recommended && (
                      <span className="text-[9px] font-bold text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.5 rounded mt-1 inline-block">
                        ★ Recomendado
                      </span>
                    )}
                  </div>
                </div>

                {/* TAEG */}
                <div>
                  <p
                    className={`text-sm font-bold ${
                      proposal.recommended ? 'text-[#2563EB]' : 'text-[#0F1B2D]'
                    }`}
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {proposal.taeg}%
                  </p>
                  <p className="text-[9px] text-[#9CA3AF]">anual</p>
                </div>

                {/* TIN */}
                <div>
                  <p className="text-sm font-bold text-[#0F1B2D]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {proposal.tin}%
                  </p>
                  <p className="text-[9px] text-[#9CA3AF]">{proposal.euribor}</p>
                </div>

                {/* Spread */}
                <div>
                  <p className="text-sm font-bold text-[#0F1B2D]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    +{proposal.spread}%
                  </p>
                  {proposal.fixedPeriod > 0 && (
                    <p className="text-[9px] text-[#9CA3AF]">{proposal.fixedPeriod}a fixo</p>
                  )}
                </div>

                {/* Monthly payment */}
                <div>
                  <p className="text-sm font-bold text-[#0F1B2D]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {formatFullCurrency(proposal.monthlyPayment)}
                  </p>
                  <p className="text-[9px] text-[#9CA3AF]">/ mês</p>
                </div>

                {/* Score */}
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${proposal.score}%`,
                        backgroundColor: proposal.score >= 85 ? '#10B981' : proposal.score >= 70 ? '#2563EB' : '#F59E0B',
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-bold"
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      color: proposal.score >= 85 ? '#10B981' : proposal.score >= 70 ? '#2563EB' : '#F59E0B',
                    }}
                  >
                    {proposal.score}
                  </span>
                </div>

                {/* Action */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(proposal.id);
                    }}
                    className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                      proposal.recommended
                        ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                        : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F1B2D]'
                    }`}
                  >
                    Selecionar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(isExpanded ? null : proposal.id);
                    }}
                    className="w-6 h-6 flex items-center justify-center text-[#9CA3AF] hover:text-[#0F1B2D] transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-5 pb-4 border-t border-[#F7F8FA] bg-[#FAFBFC]">
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    {/* Pros */}
                    <div>
                      <p className="text-[10px] font-semibold text-[#10B981] uppercase tracking-wide mb-2">Vantagens</p>
                      <ul className="space-y-1.5">
                        {proposal.pros.map((pro) => (
                          <li key={pro} className="flex items-start gap-1.5 text-xs text-[#64748B]">
                            <CheckCircle className="w-3 h-3 text-[#10B981] mt-0.5 flex-shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cons */}
                    <div>
                      <p className="text-[10px] font-semibold text-[#EF4444] uppercase tracking-wide mb-2">Desvantagens</p>
                      <ul className="space-y-1.5">
                        {proposal.cons.map((con) => (
                          <li key={con} className="flex items-start gap-1.5 text-xs text-[#64748B]">
                            <XCircle className="w-3 h-3 text-[#EF4444] mt-0.5 flex-shrink-0" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Financial summary */}
                    <div>
                      <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">Resumo Financeiro</p>
                      <div className="space-y-1.5">
                        {[
                          { label: 'Custo Total', value: formatFullCurrency(proposal.totalCost) },
                          { label: 'Comissão Processual', value: formatFullCurrency(proposal.processingFee) },
                          { label: 'Seguro Vida/Mês', value: `+${formatFullCurrency(proposal.insurance)}` },
                        ].map((item) => (
                          <div key={item.label} className="flex justify-between items-center">
                            <span className="text-[10px] text-[#9CA3AF]">{item.label}</span>
                            <span className="text-xs font-semibold text-[#0F1B2D]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirm modal */}
      {confirmModal && (
        <>
          <div
            className="fixed inset-0 bg-[#0F1B2D]/40 backdrop-blur-sm z-50"
            onClick={() => setConfirmModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl border border-[#E8ECF0] shadow-[0_24px_48px_rgba(15,27,45,0.2)] w-full max-w-sm p-6 animate-fade-slide-up">
              <div className="w-12 h-12 bg-[#EFF6FF] rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-[#2563EB]" />
              </div>
              <h4 className="text-base font-bold text-[#0F1B2D] text-center mb-2">Confirmar Proposta</h4>
              <p className="text-sm text-[#64748B] text-center leading-relaxed mb-6">
                Tem a certeza que pretende selecionar a proposta do{' '}
                <strong>{proposals.find((p) => p.id === selectedId)?.bank}</strong>?
                Esta ação avançará o processo para a fase de negociação.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E8ECF0] text-sm font-medium text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setConfirmModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-2"
                >
                  Confirmar <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
