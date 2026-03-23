'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, AlertTriangle, Upload, RefreshCw } from 'lucide-react';
import { mockDeals } from '@/lib/mock-data';

type DocStatus = 'received' | 'validated' | 'missing' | 'expired';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const statusConfig: Record<DocStatus, { icon: React.FC<any>, color: string, bg: string, label: string }> = {
  validated: { icon: CheckCircle, color: '#10B981', bg: '#ECFDF5', label: 'Validado' },
  received: { icon: Clock, color: '#F59E0B', bg: '#FFFBEB', label: 'Recebido' },
  missing: { icon: XCircle, color: '#EF4444', bg: '#FEF2F2', label: 'Em Falta' },
  expired: { icon: AlertTriangle, color: '#EF4444', bg: '#FEF2F2', label: 'Expirado' },
};

function DocumentProgressRing({ validated, total, size = 64 }: { validated: number; total: number; size?: number }) {
  const [animated, setAnimated] = useState(false);
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? validated / total : 0;
  const offset = circumference - (animated ? progress : 0) * circumference;
  const color = progress >= 0.8 ? '#10B981' : progress >= 0.5 ? '#F59E0B' : '#EF4444';

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F1F5F9" strokeWidth={strokeWidth} />
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
        <span className="text-xs font-bold text-[#0F1B2D]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {validated}/{total}
        </span>
      </div>
    </div>
  );
}

export default function DocumentStatus() {
  const [selectedDeal, setSelectedDeal] = useState(mockDeals[0]);

  const docs = selectedDeal.documents;
  const validated = docs.filter((d) => d.status === 'validated').length;
  const received = docs.filter((d) => d.status === 'received').length;
  const missing = docs.filter((d) => d.status === 'missing').length;
  const expired = docs.filter((d) => d.status === 'expired').length;

  return (
    <div className="bg-white rounded-xl border border-[#E8ECF0] shadow-card overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E8ECF0] flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="text-sm font-semibold text-[#0F1B2D]">Estado Documentos</h3>
          <p className="text-xs text-[#64748B] mt-0.5">Por deal</p>
        </div>
        <button className="w-7 h-7 flex items-center justify-center text-[#9CA3AF] hover:text-[#0F1B2D] hover:bg-[#F7F8FA] rounded transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Deal selector */}
      <div className="flex gap-1.5 px-4 py-2.5 border-b border-[#F7F8FA] flex-shrink-0 overflow-x-auto">
        {mockDeals.slice(0, 5).map((deal) => (
          <button
            key={deal.id}
            onClick={() => setSelectedDeal(deal)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold flex-shrink-0 transition-all ${
              selectedDeal.id === deal.id
                ? 'bg-[#0F1B2D] text-white'
                : 'bg-[#F7F8FA] text-[#64748B] hover:bg-[#E8ECF0] hover:text-[#0F1B2D]'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-[#2563EB]/20 flex items-center justify-center text-[7px] font-bold text-[#2563EB]">
              {deal.clientAvatar.slice(0, 1)}
            </div>
            {deal.clientName.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex items-center px-4 py-3 gap-4 border-b border-[#F7F8FA] flex-shrink-0">
        <DocumentProgressRing validated={validated} total={docs.length} />
        <div className="flex-1 grid grid-cols-2 gap-2">
          {[
            { status: 'validated' as DocStatus, count: validated },
            { status: 'received' as DocStatus, count: received },
            { status: 'missing' as DocStatus, count: missing },
            { status: 'expired' as DocStatus, count: expired },
          ].map(({ status, count }) => {
            const cfg = statusConfig[status];
            return (
              <div
                key={status}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg"
                style={{ backgroundColor: cfg.bg }}
              >
                <span className="text-base font-bold" style={{ color: cfg.color, fontFamily: 'JetBrains Mono, monospace' }}>
                  {count}
                </span>
                <span className="text-[9px] font-medium" style={{ color: cfg.color }}>
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Document list */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {docs.map((doc) => {
          const cfg = statusConfig[doc.status as DocStatus];
          const Icon = cfg.icon;
          return (
            <div key={doc.id} className="flex items-center gap-2.5 py-2 border-b border-[#F7F8FA] last:border-0">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cfg.bg }}>
                <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#0F1B2D] truncate">{doc.name}</p>
                {doc.updatedAt ? (
                  <p className="text-[10px] text-[#9CA3AF]">{new Date(doc.updatedAt).toLocaleDateString('pt-PT')}</p>
                ) : (
                  <p className="text-[10px] text-[#EF4444]">Não recebido</p>
                )}
              </div>
              {(doc.status === 'missing' || doc.status === 'expired') ? (
                <button className="flex items-center gap-1 text-[9px] font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] px-2 py-1 rounded-md transition-colors flex-shrink-0">
                  <Upload className="w-2.5 h-2.5" />
                  Upload
                </button>
              ) : (
                <span
                  className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cfg.bg, color: cfg.color }}
                >
                  {cfg.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
