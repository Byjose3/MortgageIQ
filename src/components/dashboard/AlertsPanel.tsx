'use client';

import { useState } from 'react';
import { AlertTriangle, Info, CheckCircle, Zap, X, ArrowRight, Clock } from 'lucide-react';
import { mockAlerts, type Alert } from '@/lib/mock-data';

function AlertCard({ alert, onDismiss, onAction }: { alert: Alert; onDismiss: (id: string) => void; onAction: (alert: Alert) => void }) {
  const typeConfig = {
    urgent: {
      icon: Zap,
      color: '#EF4444',
      bg: '#FEF2F2',
      border: '#FECACA',
      badge: 'Urgente',
      badgeBg: '#EF4444',
    },
    warning: {
      icon: AlertTriangle,
      color: '#F59E0B',
      bg: '#FFFBEB',
      border: '#FDE68A',
      badge: 'Atenção',
      badgeBg: '#F59E0B',
    },
    info: {
      icon: Info,
      color: '#2563EB',
      bg: '#EFF6FF',
      border: '#BFDBFE',
      badge: 'Info',
      badgeBg: '#2563EB',
    },
    success: {
      icon: CheckCircle,
      color: '#10B981',
      bg: '#ECFDF5',
      border: '#A7F3D0',
      badge: 'Sucesso',
      badgeBg: '#10B981',
    },
  };

  const cfg = typeConfig[alert.type];
  const Icon = cfg.icon;

  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m atrás`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h atrás`;
    return `${Math.floor(hrs / 24)}d atrás`;
  };

  return (
    <div
      className="relative rounded-xl border p-3 transition-all duration-200 group"
      style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
    >
      {/* Urgency pulse for urgent alerts */}
      {alert.type === 'urgent' && (
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#EF4444] animate-pulse-dot" />
      )}

      <div className="flex items-start gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: `${cfg.badgeBg}20` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
        </div>

        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-semibold text-[#0F1B2D] truncate">{alert.title}</p>
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white flex-shrink-0"
              style={{ backgroundColor: cfg.badgeBg }}
            >
              {cfg.badge}
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] leading-relaxed mb-2">{alert.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] text-[#9CA3AF]">
              <Clock className="w-2.5 h-2.5" />
              {timeAgo(alert.timestamp)}
            </div>
            <button
              onClick={() => onAction(alert)}
              className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors"
              style={{
                backgroundColor: `${cfg.badgeBg}15`,
                color: cfg.color,
              }}
            >
              {alert.action}
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        <button
          onClick={() => onDismiss(alert.id)}
          className="absolute top-2 right-2 w-5 h-5 rounded flex items-center justify-center text-[#9CA3AF] hover:text-[#64748B] hover:bg-white/50 transition-colors opacity-0 group-hover:opacity-100"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'urgent' | 'warning' | 'info'>('all');

  const dismiss = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAction = (alert: Alert) => {
    console.log('Action:', alert.action, 'for deal:', alert.dealId);
  };

  const filtered = filter === 'all' ? alerts : alerts.filter((a) => a.type === filter);
  const urgentCount = alerts.filter((a) => a.type === 'urgent').length;

  return (
    <div className="bg-white rounded-xl border border-[#E8ECF0] shadow-card overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E8ECF0] flex-shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[#0F1B2D]">Alertas & Ações</h3>
            {urgentCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#EF4444] text-white animate-pulse-dot">
                {urgentCount} urgente{urgentCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <span className="text-[10px] text-[#9CA3AF]">{alerts.length} alertas</span>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1">
          {(['all', 'urgent', 'warning', 'info'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[10px] font-semibold px-2 py-1 rounded-md transition-colors ${
                filter === f
                  ? 'bg-[#0F1B2D] text-white'
                  : 'text-[#9CA3AF] hover:bg-[#F7F8FA] hover:text-[#64748B]'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'urgent' ? 'Urgentes' : f === 'warning' ? 'Atenção' : 'Info'}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <CheckCircle className="w-8 h-8 text-[#10B981] mb-2" />
            <p className="text-xs font-medium text-[#64748B]">Sem alertas nesta categoria</p>
          </div>
        ) : (
          filtered.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onDismiss={dismiss}
              onAction={handleAction}
            />
          ))
        )}
      </div>
    </div>
  );
}
