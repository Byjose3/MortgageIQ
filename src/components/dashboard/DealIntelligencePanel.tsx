'use client';

import { useEffect, useState } from 'react';
import {
  X,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  Zap,
  Shield,
  Upload,
  Users,
  FolderOpen,
  BarChart2,
} from 'lucide-react';
import { type Deal, type ParticipantRole, STAGE_COLORS, formatFullCurrency } from '@/lib/mock-data';
import DealDocumentsPanel from '@/components/dashboard/DealDocumentsPanel';

interface DealIntelligencePanelProps {
  deal: Deal | null;
  onClose: () => void;
}

function ProgressRing({
  value,
  size = 80,
  strokeWidth = 8,
  color,
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  label: string;
  sublabel: string;
}) {
  const [animated, setAnimated] = useState(false);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated ? value / 100 : 0) * circumference;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center rotate-0">
          <span className="text-base font-bold text-[#0F1B2D]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {animated ? `${value}` : '0'}
          </span>
        </div>
      </div>
      <p className="text-xs font-semibold text-[#0F1B2D] text-center">{label}</p>
      <p className="text-[10px] text-[#9CA3AF] text-center">{sublabel}</p>
    </div>
  );
}

function DocumentItem({ doc }: { doc: { id: string; name: string; status: string; updatedAt: string } }) {
  const statusConfig = {
    validated: { icon: CheckCircle, color: '#10B981', bg: '#ECFDF5', label: 'Validado' },
    received: { icon: Clock, color: '#F59E0B', bg: '#FFFBEB', label: 'Recebido' },
    missing: { icon: XCircle, color: '#EF4444', bg: '#FEF2F2', label: 'Em Falta' },
    expired: { icon: AlertTriangle, color: '#EF4444', bg: '#FEF2F2', label: 'Expirado' },
  };
  const config = statusConfig[doc.status as keyof typeof statusConfig];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2.5 py-2 border-b border-[#F7F8FA] last:border-0">
      <div
        className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: config.bg }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-[#0F1B2D] truncate">{doc.name}</p>
        {doc.updatedAt && (
          <p className="text-[10px] text-[#9CA3AF]">{new Date(doc.updatedAt).toLocaleDateString('pt-PT')}</p>
        )}
      </div>
      <span
        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        {config.label}
      </span>
      {(doc.status === 'missing' || doc.status === 'expired') && (
        <button className="flex items-center gap-1 text-[10px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded hover:bg-[#DBEAFE] transition-colors flex-shrink-0">
          <Upload className="w-2.5 h-2.5" />
          Upload
        </button>
      )}
    </div>
  );
}

export default function DealIntelligencePanel({ deal, onClose }: DealIntelligencePanelProps) {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents'>('overview');

  useEffect(() => {
    if (deal) {
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [deal]);

  if (!deal) return null;

  const stageColor = STAGE_COLORS[deal.stage];

  const riskConfig = {
    low: { color: '#10B981', bg: '#ECFDF5', label: 'Baixo Risco', icon: Shield },
    medium: { color: '#F59E0B', bg: '#FFFBEB', label: 'Risco Médio', icon: AlertTriangle },
    high: { color: '#EF4444', bg: '#FEF2F2', label: 'Alto Risco', icon: AlertTriangle },
    critical: { color: '#7C3AED', bg: '#F5F3FF', label: 'Risco Crítico', icon: Zap },
  };
  const riskCfg = riskConfig[deal.risk];
  const RiskIcon = riskCfg.icon;

  const recommendedAction =
    deal.risk === 'critical' || deal.risk === 'high'
      ? 'Completar Documentação'
      : deal.stage === 'Approved'
      ? 'Agendar Escritura'
      : deal.stage === 'Submission' || deal.stage === 'Bank Review'
      ? 'Acompanhar Banco'
      : deal.stage === 'Negotiation'
      ? 'Confirmar Proposta'
      : 'Avançar Etapa';

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-[#0F1B2D]/20 backdrop-blur-[2px] z-40 transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-[420px] bg-white border-l border-[#E8ECF0] shadow-[−8px_0_40px_rgba(15,27,45,0.12)] z-50 flex flex-col transition-transform duration-300 ease-out ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header with mesh gradient */}
        <div className="relative overflow-hidden px-5 pt-5 pb-4 flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0F1B2D 0%, #1E3352 60%, #2563EB 100%)' }}>
          {/* Subtle mesh overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 70% 30%, #7C3AED 0%, transparent 50%), radial-gradient(circle at 30% 80%, #10B981 0%, transparent 40%)'
          }} />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1">Deal Intelligence</p>
                <p className="text-[11px] font-mono text-white/60">{deal.id}</p>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold text-white">
                {deal.clientAvatar}
              </div>
              <div>
                <p className="font-bold text-white text-base leading-tight">{deal.clientName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${stageColor}30`, color: stageColor }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: stageColor }}
                    />
                    {deal.stage}
                  </span>
                  <span className="text-white/60 text-[11px]">{deal.bank}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-white/50">Montante</p>
                <p className="text-xl font-bold text-white" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {formatFullCurrency(deal.amount)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/50">TAEG</p>
                <p className="text-lg font-bold text-white" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {deal.taeg}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/50">Prazo</p>
                <p className="text-lg font-bold text-white" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {deal.term}a
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-[#E8ECF0] bg-white flex-shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors border-b-2 ${activeTab === 'overview' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-[#64748B] hover:text-[#0F1B2D]'}`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Análise
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors border-b-2 relative ${activeTab === 'documents' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-[#64748B] hover:text-[#0F1B2D]'}`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            Documentação
            {deal.missingDocs.length > 0 && (
              <span className="absolute top-2 right-6 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[8px] font-bold flex items-center justify-center">
                {deal.missingDocs.length}
              </span>
            )}
          </button>
        </div>

        {/* Documents tab — full height */}
        {activeTab === 'documents' && (
          <div className="flex-1 overflow-hidden">
            <DealDocumentsPanel deal={deal} />
          </div>
        )}

        {/* Overview tab — Scrollable content */}
        {activeTab === 'overview' && <div className="flex-1 overflow-y-auto">
          {/* Participants */}
          {deal.participants && deal.participants.length > 0 && (
            <div className="px-5 py-4 border-b border-[#F7F8FA]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-[#0F1B2D] uppercase tracking-wide flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  Intervenientes
                </p>
                <span className="text-[10px] font-medium text-[#9CA3AF] bg-[#F7F8FA] border border-[#E8ECF0] px-2 py-0.5 rounded-full">
                  {deal.participants.length}/3
                </span>
              </div>
              <div className="space-y-2">
                {deal.participants.map((p) => {
                  const roleConfig: Record<ParticipantRole, { color: string; bg: string; label: string }> = {
                    titular:      { color: '#2563EB', bg: '#EFF6FF', label: 'Titular' },
                    'co-titular': { color: '#7C3AED', bg: '#F5F3FF', label: 'Co-Titular' },
                    fiador:       { color: '#F59E0B', bg: '#FFFBEB', label: 'Fiador' },
                    conjugue:     { color: '#10B981', bg: '#ECFDF5', label: 'Cônjuge' },
                  };
                  const cfg = roleConfig[p.role];
                  return (
                    <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E8ECF0]">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: cfg.bg, color: cfg.color }}
                      >
                        {p.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#0F1B2D] truncate">{p.name}</p>
                        {p.nif && <p className="text-[10px] text-[#9CA3AF] font-mono">{p.nif}</p>}
                      </div>
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cfg.bg, color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Intelligence scores */}
          <div className="px-5 py-4 border-b border-[#F7F8FA]">
            <p className="text-xs font-semibold text-[#0F1B2D] uppercase tracking-wide mb-4">Análise de Inteligência</p>
            <div className="flex items-center justify-around">
              <ProgressRing
                value={deal.readinessScore}
                color={deal.readinessScore >= 80 ? '#10B981' : deal.readinessScore >= 60 ? '#F59E0B' : '#EF4444'}
                label="Prontidão"
                sublabel="Score"
                size={80}
                strokeWidth={7}
              />
              <div className="w-px h-16 bg-[#E8ECF0]" />
              <ProgressRing
                value={deal.approvalProbability}
                color={deal.approvalProbability >= 75 ? '#2563EB' : deal.approvalProbability >= 55 ? '#F59E0B' : '#EF4444'}
                label="Prob. Aprovação"
                sublabel="Estimativa IA"
                size={80}
                strokeWidth={7}
              />
              <div className="w-px h-16 bg-[#E8ECF0]" />
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 flex-shrink-0"
                  style={{ borderColor: riskCfg.color, backgroundColor: riskCfg.bg }}
                >
                  <RiskIcon className="w-5 h-5" style={{ color: riskCfg.color }} />
                </div>
                <p className="text-xs font-semibold text-[#0F1B2D] text-center">Nível Risco</p>
                <p className="text-[10px] font-medium" style={{ color: riskCfg.color }}>{riskCfg.label}</p>
              </div>
            </div>
          </div>

          {/* Key details */}
          <div className="px-5 py-4 border-b border-[#F7F8FA]">
            <p className="text-xs font-semibold text-[#0F1B2D] uppercase tracking-wide mb-3">Detalhes Financeiros</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'LTV', value: `${deal.ltv}%`, warn: deal.ltv > 90 },
                { label: 'Rendimento Mensal', value: formatFullCurrency(deal.monthlyIncome), warn: false },
                { label: 'Valor Imóvel', value: formatFullCurrency(deal.propertyValue), warn: false },
                { label: 'Prazo de Vencimento', value: new Date(deal.dueDate).toLocaleDateString('pt-PT'), warn: new Date(deal.dueDate) < new Date() },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`px-3 py-2.5 rounded-lg border ${
                    item.warn ? 'border-[#FECACA] bg-[#FEF2F2]' : 'border-[#E8ECF0] bg-[#F8FAFC]'
                  }`}
                >
                  <p className="text-[10px] text-[#9CA3AF] mb-0.5">{item.label}</p>
                  <p
                    className="text-sm font-bold"
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      color: item.warn ? '#EF4444' : '#0F1B2D',
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="px-5 py-4 border-b border-[#F7F8FA]">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-[#0F1B2D] uppercase tracking-wide">Documentos</p>
              <span className="text-[10px] text-[#9CA3AF]">
                {deal.documents.filter(d => d.status === 'validated').length}/{deal.documents.length} validados
              </span>
            </div>
            <div>
              {deal.documents.map((doc) => (
                <DocumentItem key={doc.id} doc={doc} />
              ))}
            </div>
          </div>

          {/* Notes */}
          {deal.notes && (
            <div className="px-5 py-4 border-b border-[#F7F8FA]">
              <p className="text-xs font-semibold text-[#0F1B2D] uppercase tracking-wide mb-2">Notas</p>
              <p className="text-xs text-[#64748B] leading-relaxed bg-[#F8FAFC] px-3 py-2.5 rounded-lg border border-[#E8ECF0]">
                {deal.notes}
              </p>
            </div>
          )}

          {/* Missing docs */}
          {deal.missingDocs.length > 0 && (
            <div className="px-5 py-4 border-b border-[#F7F8FA]">
              <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                  <p className="text-xs font-semibold text-[#EF4444]">Documentos em Falta ({deal.missingDocs.length})</p>
                </div>
                <ul className="space-y-1">
                  {deal.missingDocs.map((doc) => (
                    <li key={doc} className="flex items-center gap-2 text-xs text-[#DC2626]">
                      <span className="w-1 h-1 rounded-full bg-[#EF4444]" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>}

        {/* Action footer */}
        {activeTab === 'overview' && (
        <div className="px-5 py-4 border-t border-[#E8ECF0] flex-shrink-0 bg-white">
          <button className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold py-3 rounded-xl transition-colors shadow-[0_2px_8px_rgba(37,99,235,0.35)]">
            <Zap className="w-4 h-4" />
            {recommendedAction}
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] text-sm font-medium py-2.5 rounded-xl transition-colors border border-[#E8ECF0]"
          >
            <FolderOpen className="w-4 h-4" />
            Gerir Documentação
          </button>
        </div>
        )}
      </div>
    </>
  );
}
