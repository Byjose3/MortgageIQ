'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, BarChart2, Activity, Filter, Download } from 'lucide-react';
import { mockChartData, mockKPIs } from '@/lib/mock-data';

function BigLineChart({ data }: { data: { month: string; rate: number }[] }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 300); return () => clearTimeout(t); }, []);

  const width = 600;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const minVal = 60;
  const maxVal = 90;

  const xScale = (i: number) => (i / (data.length - 1)) * chartW;
  const yScale = (v: number) => chartH - ((v - minVal) / (maxVal - minVal)) * chartH;
  const points = data.map((d, i) => ({ x: xScale(i), y: yScale(d.rate), ...d }));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: 200 }}>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = padding.top + t * chartH;
        const val = Math.round(maxVal - t * (maxVal - minVal));
        return (
          <g key={t}>
            <line x1={padding.left} y1={y} x2={padding.left + chartW} y2={y} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
            <text x={padding.left - 6} y={y + 4} textAnchor="end" fill="#9CA3AF" fontSize="10">{val}%</text>
          </g>
        );
      })}
      <path
        d={`M ${padding.left + points[0].x} ${padding.top + points[0].y} ` + points.slice(1).map(p => `L ${padding.left + p.x} ${padding.top + p.y}`).join(' ')}
        fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={padding.left + p.x} cy={padding.top + p.y} r="5" fill="white" stroke="#2563EB" strokeWidth="2" />
          <text x={padding.left + p.x} y={height - 6} textAnchor="middle" fill="#9CA3AF" fontSize="10">{p.month}</text>
          <text x={padding.left + p.x} cy={padding.top + p.y - 12} y={padding.top + p.y - 12} textAnchor="middle" fill="#2563EB" fontSize="9" fontWeight="bold">{p.rate}%</text>
        </g>
      ))}
    </svg>
  );
}

function BigBarChart({ data }: { data: { bank: string; volume: number }[] }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 400); return () => clearTimeout(t); }, []);

  const maxVal = Math.max(...data.map(d => d.volume));
  const colors = ['#2563EB', '#10B981', '#F59E0B', '#7C3AED', '#EF4444'];
  const fmt = (v: number) => v >= 1000000 ? `€${(v / 1000000).toFixed(1)}M` : `€${(v / 1000).toFixed(0)}K`;

  return (
    <div className="space-y-4 mt-4">
      {data.map((d, i) => (
        <div key={d.bank}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-[#64748B]">{d.bank}</span>
            <span className="text-sm font-bold text-[#0F1B2D]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{fmt(d.volume)}</span>
          </div>
          <div className="h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: animated ? `${(d.volume / maxVal) * 100}%` : '0%', backgroundColor: colors[i], transitionDelay: `${i * 100}ms` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0F1B2D]">Analytics</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Performance e métricas operacionais</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-sm font-medium text-[#64748B] bg-white border border-[#E8ECF0] px-3 h-9 rounded-lg hover:bg-[#F7F8FA] transition-colors">
            <Filter className="w-4 h-4" />
            Período
          </button>
          <button className="flex items-center gap-1.5 text-sm font-medium text-[#64748B] bg-white border border-[#E8ECF0] px-3 h-9 rounded-lg hover:bg-[#F7F8FA] transition-colors">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Taxa Aprovação Média', value: `${mockKPIs.avgApprovalRate}%`, delta: `+${mockKPIs.avgApprovalRateDelta}%`, color: '#2563EB', bg: '#EFF6FF' },
          { label: 'Tempo Médio Aprovação', value: `${mockKPIs.avgTimeToApproval} dias`, delta: `${mockKPIs.avgTimeToApprovalDelta}%`, color: '#10B981', bg: '#ECFDF5' },
          { label: 'Volume Total Financiado', value: '€12.8M', delta: `+${mockKPIs.totalVolumeFinancedDelta}%`, color: '#7C3AED', bg: '#F5F3FF' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-[#E8ECF0] shadow-card p-5">
            <p className="text-xs text-[#64748B] mb-2">{kpi.label}</p>
            <p className="text-3xl font-bold text-[#0F1B2D]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{kpi.value}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <TrendingUp className="w-3.5 h-3.5" style={{ color: kpi.color }} />
              <span className="text-xs font-semibold" style={{ color: kpi.color }}>{kpi.delta}</span>
              <span className="text-xs text-[#9CA3AF]">vs. mês anterior</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Approval rate trend */}
        <div className="bg-white rounded-xl border border-[#E8ECF0] shadow-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-[#EFF6FF] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#2563EB]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F1B2D]">Taxa de Aprovação</p>
              <p className="text-[10px] text-[#9CA3AF]">Últimos 6 meses</p>
            </div>
          </div>
          <BigLineChart data={mockChartData.approvalRateTrend} />
        </div>

        {/* Volume per bank */}
        <div className="bg-white rounded-xl border border-[#E8ECF0] shadow-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-[#ECFDF5] rounded-lg flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-[#10B981]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F1B2D]">Volume por Banco</p>
              <p className="text-[10px] text-[#9CA3AF]">Distribuição de negócios</p>
            </div>
          </div>
          <BigBarChart data={mockChartData.volumePerBank} />
        </div>

        {/* Stage conversion */}
        <div className="bg-white rounded-xl border border-[#E8ECF0] shadow-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-[#F5F3FF] rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-[#7C3AED]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F1B2D]">Funil de Conversão</p>
              <p className="text-[10px] text-[#9CA3AF]">Taxa de conversão por etapa</p>
            </div>
          </div>
          <div className="space-y-3 mt-2">
            {mockChartData.stageConversion.map((d, i) => {
              const colors = ['#2563EB', '#3B82F6', '#60A5FA', '#7C3AED', '#8B5CF6', '#A78BFA', '#10B981', '#34D399'];
              return (
                <div key={d.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-[#64748B]">{d.stage}</span>
                    <span className="text-xs font-bold text-[#0F1B2D]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {d.count} <span className="text-[#9CA3AF] font-normal">({d.rate}%)</span>
                    </span>
                  </div>
                  <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.rate}%`, backgroundColor: colors[i % colors.length] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deal duration */}
        <div className="bg-white rounded-xl border border-[#E8ECF0] shadow-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-[#FFFBEB] rounded-lg flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F1B2D]">Duração por Etapa</p>
              <p className="text-[10px] text-[#9CA3AF]">Dias médios por fase do processo</p>
            </div>
          </div>
          <div className="space-y-2">
            {mockChartData.dealDuration.map((d) => {
              const color = d.days > 10 ? '#EF4444' : d.days > 6 ? '#F59E0B' : '#2563EB';
              const maxDays = 15;
              return (
                <div key={d.stage} className="flex items-center gap-2">
                  <span className="w-20 text-xs text-[#64748B] text-right flex-shrink-0">{d.stage}</span>
                  <div className="flex-1 h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(d.days / maxDays) * 100}%`, backgroundColor: color }} />
                  </div>
                  <span className="w-10 text-xs font-bold text-right flex-shrink-0" style={{ fontFamily: 'JetBrains Mono, monospace', color }}>
                    {d.days}d
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
