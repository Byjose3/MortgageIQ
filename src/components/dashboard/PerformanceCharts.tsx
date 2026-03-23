'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, BarChart2, Filter, Activity } from 'lucide-react';
import { mockChartData } from '@/lib/mock-data';

// Simple Line Chart
function LineChart({ data }: { data: { month: string; rate: number }[] }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 500);
    return () => clearTimeout(t);
  }, []);

  const width = 320;
  const height = 100;
  const padding = { top: 10, right: 10, bottom: 20, left: 30 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const minVal = Math.min(...data.map((d) => d.rate)) - 5;
  const maxVal = Math.max(...data.map((d) => d.rate)) + 5;

  const xScale = (i: number) => (i / (data.length - 1)) * chartW;
  const yScale = (v: number) => chartH - ((v - minVal) / (maxVal - minVal)) * chartH;

  const points = data.map((d, i) => ({ x: xScale(i), y: yScale(d.rate), ...d }));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartH} L 0 ${chartH} Z`;

  return (
    <div className="relative w-full" style={{ height: height + 20 }}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padding.top + t * chartH;
          const val = Math.round(maxVal - t * (maxVal - minVal));
          return (
            <g key={t}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + chartW}
                y2={y}
                stroke="#F1F5F9"
                strokeWidth="1"
              />
              <text x={padding.left - 4} y={y + 4} textAnchor="end" fill="#9CA3AF" fontSize="8">
                {val}%
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path
          d={`M ${padding.left} ${padding.top} ` + areaD.replace(/^/, `translate(${padding.left} ${padding.top}) `)}
          transform={`translate(${padding.left} ${padding.top})`}
          fill="url(#lineGradient)"
          opacity={animated ? 0.3 : 0}
          style={{ transition: 'opacity 0.8s ease 0.5s' }}
        />

        {/* Line */}
        <path
          d={`M ${padding.left + points[0].x} ${padding.top + points[0].y} ` +
             points.slice(1).map(p => `L ${padding.left + p.x} ${padding.top + p.y}`).join(' ')}
          fill="none"
          stroke="#2563EB"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={padding.left + p.x}
            cy={padding.top + p.y}
            r="3"
            fill="white"
            stroke="#2563EB"
            strokeWidth="2"
          />
        ))}

        {/* X labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={padding.left + p.x}
            y={height - 2}
            textAnchor="middle"
            fill="#9CA3AF"
            fontSize="8"
          >
            {p.month}
          </text>
        ))}

        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// Bar Chart
function BarChart({ data }: { data: { stage: string; days: number }[] }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 600);
    return () => clearTimeout(t);
  }, []);

  const maxVal = Math.max(...data.map((d) => d.days));

  return (
    <div className="flex items-end gap-1 h-[90px] mt-2">
      {data.map((d, i) => {
        const height = animated ? (d.days / maxVal) * 80 : 0;
        const color = d.days > 10 ? '#EF4444' : d.days > 6 ? '#F59E0B' : '#2563EB';
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1" title={`${d.stage}: ${d.days} dias`}>
            <div
              className="w-full rounded-t-sm transition-all duration-700 relative group"
              style={{
                height: `${height}px`,
                backgroundColor: color,
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0F1B2D] text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {d.days}d
              </div>
            </div>
            <span className="text-[7px] text-[#9CA3AF] text-center" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: '20px', overflow: 'hidden' }}>
              {d.stage.slice(0, 4)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Funnel Chart
function FunnelChart({ data }: { data: { stage: string; count: number; rate: number }[] }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-1.5 mt-2">
      {data.slice(0, 6).map((d, i) => {
        const prev = i > 0 ? data[i - 1].count : d.count;
        const convRate = i > 0 ? Math.round((d.count / prev) * 100) : 100;
        return (
          <div key={d.stage} className="flex items-center gap-2">
            <div className="w-14 text-right flex-shrink-0">
              <span className="text-[9px] text-[#9CA3AF] truncate">{d.stage.slice(0, 5)}</span>
            </div>
            <div className="flex-1 h-4 bg-[#F1F5F9] rounded overflow-hidden relative">
              <div
                className="h-full rounded transition-all duration-700 flex items-center"
                style={{
                  width: animated ? `${d.rate}%` : '0%',
                  backgroundColor: `hsl(${221 + (i * 8)}, 83%, ${53 - i * 3}%)`,
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                <span className="text-[8px] font-bold text-white pl-1.5 whitespace-nowrap">
                  {d.count}
                </span>
              </div>
            </div>
            <div className="w-8 text-right flex-shrink-0">
              <span className="text-[9px] font-semibold text-[#64748B]">{convRate}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Horizontal Bar Chart
function HorizontalBarChart({ data }: { data: { bank: string; volume: number }[] }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 800);
    return () => clearTimeout(t);
  }, []);

  const maxVal = Math.max(...data.map((d) => d.volume));
  const colors = ['#2563EB', '#10B981', '#F59E0B', '#7C3AED', '#EF4444'];

  const fmt = (v: number) => v >= 1000000 ? `€${(v / 1000000).toFixed(1)}M` : `€${(v / 1000).toFixed(0)}K`;

  return (
    <div className="space-y-2.5 mt-2">
      {data.map((d, i) => (
        <div key={d.bank}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-[#64748B] truncate">{d.bank}</span>
            <span className="text-[10px] font-bold text-[#0F1B2D] ml-2 flex-shrink-0" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {fmt(d.volume)}
            </span>
          </div>
          <div className="h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: animated ? `${(d.volume / maxVal) * 100}%` : '0%',
                backgroundColor: colors[i % colors.length],
                transitionDelay: `${i * 80}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface ChartCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconColor: string;
  children: React.ReactNode;
  delay?: number;
}

function ChartCard({ title, subtitle, icon, iconColor, children, delay = 0 }: ChartCardProps) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`bg-white rounded-xl border border-[#E8ECF0] shadow-card p-4 transition-all duration-400 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms` }}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${iconColor}15` }}
        >
          <div style={{ color: iconColor }}>{icon}</div>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#0F1B2D] leading-tight">{title}</p>
          <p className="text-[10px] text-[#9CA3AF]">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function PerformanceCharts() {
  return (
    <div className="bg-white rounded-xl border border-[#E8ECF0] shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8ECF0]">
        <div>
          <h3 className="text-sm font-semibold text-[#0F1B2D]">Analytics de Performance</h3>
          <p className="text-xs text-[#64748B] mt-0.5">Últimos 6 meses</p>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium text-[#64748B] bg-[#F7F8FA] hover:bg-[#E8ECF0] border border-[#E8ECF0] px-3 py-1.5 rounded-lg transition-colors">
          <Filter className="w-3 h-3" />
          Filtrar
        </button>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4">
        <ChartCard
          title="Taxa de Aprovação"
          subtitle="Tendência mensal (%)"
          icon={<TrendingUp className="w-3.5 h-3.5" />}
          iconColor="#2563EB"
          delay={0}
        >
          <LineChart data={mockChartData.approvalRateTrend} />
        </ChartCard>

        <ChartCard
          title="Duração por Etapa"
          subtitle="Dias médios por fase"
          icon={<BarChart2 className="w-3.5 h-3.5" />}
          iconColor="#F59E0B"
          delay={80}
        >
          <BarChart data={mockChartData.dealDuration} />
        </ChartCard>

        <ChartCard
          title="Funil de Conversão"
          subtitle="Taxa de conversão por etapa"
          icon={<Activity className="w-3.5 h-3.5" />}
          iconColor="#7C3AED"
          delay={160}
        >
          <FunnelChart data={mockChartData.stageConversion} />
        </ChartCard>

        <ChartCard
          title="Volume por Banco"
          subtitle="Distribuição de volume financiado"
          icon={<BarChart2 className="w-3.5 h-3.5" />}
          iconColor="#10B981"
          delay={240}
        >
          <HorizontalBarChart data={mockChartData.volumePerBank} />
        </ChartCard>
      </div>
    </div>
  );
}
