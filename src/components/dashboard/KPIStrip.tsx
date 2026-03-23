'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { mockKPIs, formatCurrency } from '@/lib/mock-data';

interface KPICardProps {
  label: string;
  value: string;
  delta: number;
  icon: React.ReactNode;
  accentColor: string;
  bgColor: string;
  isRisk?: boolean;
  delay: number;
  animated?: boolean;
}

function KPICard({ label, value, delta, icon, accentColor, bgColor, isRisk, delay, animated }: KPICardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const isPositive = isRisk ? delta < 0 : delta > 0;
  const deltaAbs = Math.abs(delta);

  return (
    <div
      className={`bg-white rounded-xl border border-[#E8ECF0] p-4 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3 relative overflow-hidden ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms, box-shadow 0.2s ease` }}
    >
      {/* Background accent */}
      <div
        className="absolute top-0 right-0 w-16 h-16 rounded-bl-[2rem] opacity-8"
        style={{ backgroundColor: accentColor, opacity: 0.07 }}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[#64748B] uppercase tracking-wide leading-none">{label}</p>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: bgColor }}
        >
          <div style={{ color: accentColor }}>{icon}</div>
        </div>
      </div>

      {/* Value */}
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-[#0F1B2D] leading-none tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          {visible ? value : '—'}
        </span>
        {isRisk && (
          <div className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse-dot mb-1" />
        )}
      </div>

      {/* Delta */}
      <div className="flex items-center gap-1.5">
        {isPositive ? (
          <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
        ) : (
          <TrendingDown className={`w-3.5 h-3.5 ${isRisk ? 'text-[#10B981]' : 'text-[#EF4444]'}`} />
        )}
        <span
          className={`text-xs font-semibold ${
            isPositive ? 'text-[#10B981]' : isRisk ? 'text-[#10B981]' : 'text-[#EF4444]'
          }`}
        >
          {isPositive ? '+' : '-'}{deltaAbs}%
        </span>
        <span className="text-xs text-[#9CA3AF]">vs. 30 dias</span>
      </div>

      {/* Sparkline placeholder */}
      <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: visible ? `${Math.min(100, 40 + deltaAbs * 2)}%` : '0%',
            backgroundColor: accentColor,
            transitionDelay: `${delay + 200}ms`,
          }}
        />
      </div>
    </div>
  );
}

export default function KPIStrip() {
  const kpis = mockKPIs;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      <KPICard
        label="Deals Ativos"
        value={String(kpis.totalActiveDeals)}
        delta={kpis.totalActiveDealsDelta}
        icon={<Briefcase className="w-4 h-4" />}
        accentColor="#2563EB"
        bgColor="#EFF6FF"
        delay={0}
      />
      <KPICard
        label="Prontos Submissão"
        value={String(kpis.readyForSubmission)}
        delta={kpis.readyForSubmissionDelta}
        icon={<CheckCircle className="w-4 h-4" />}
        accentColor="#10B981"
        bgColor="#ECFDF5"
        delay={60}
      />
      <KPICard
        label="Taxa Aprovação"
        value={`${kpis.avgApprovalRate}%`}
        delta={kpis.avgApprovalRateDelta}
        icon={<TrendingUp className="w-4 h-4" />}
        accentColor="#7C3AED"
        bgColor="#F5F3FF"
        delay={120}
      />
      <KPICard
        label="Tempo Aprovação"
        value={`${kpis.avgTimeToApproval}d`}
        delta={kpis.avgTimeToApprovalDelta}
        icon={<Clock className="w-4 h-4" />}
        accentColor="#F59E0B"
        bgColor="#FFFBEB"
        delay={180}
      />
      <KPICard
        label="Volume Financiado"
        value={formatCurrency(kpis.totalVolumeFinanced)}
        delta={kpis.totalVolumeFinancedDelta}
        icon={<DollarSign className="w-4 h-4" />}
        accentColor="#10B981"
        bgColor="#ECFDF5"
        delay={240}
      />
      <KPICard
        label="Deals em Risco"
        value={String(kpis.dealsAtRisk)}
        delta={kpis.dealsAtRiskDelta}
        icon={<AlertTriangle className="w-4 h-4" />}
        accentColor="#EF4444"
        bgColor="#FEF2F2"
        isRisk
        delay={300}
      />
    </div>
  );
}

// Inline import fix
function Briefcase({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  );
}
