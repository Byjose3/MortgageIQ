'use client';

import { useState } from 'react';
import { Search, Plus, Phone, Mail, TrendingUp, Users } from 'lucide-react';
import { mockClients, formatCurrency } from '@/lib/mock-data';

const segmentConfig = {
  VIP: { color: '#7C3AED', bg: '#F5F3FF' },
  Premium: { color: '#2563EB', bg: '#EFF6FF' },
  Standard: { color: '#64748B', bg: '#F7F8FA' },
};

const statusConfig = {
  active: { label: 'Ativo', color: '#10B981', bg: '#ECFDF5' },
  at_risk: { label: 'Em Risco', color: '#EF4444', bg: '#FEF2F2' },
  approved: { label: 'Aprovado', color: '#2563EB', bg: '#EFF6FF' },
};

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = mockClients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0F1B2D]">Clientes</h2>
          <p className="text-sm text-[#64748B] mt-0.5">{mockClients.length} clientes activos</p>
        </div>
        <button className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-4 h-9 rounded-lg transition-colors shadow-[0_2px_8px_rgba(37,99,235,0.35)]">
          <Plus className="w-4 h-4" />
          Novo Cliente
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Clientes', value: mockClients.length, icon: Users, color: '#2563EB', bg: '#EFF6FF' },
          { label: 'VIP', value: mockClients.filter(c => c.segment === 'VIP').length, icon: TrendingUp, color: '#7C3AED', bg: '#F5F3FF' },
          { label: 'Em Risco', value: mockClients.filter(c => c.status === 'at_risk').length, icon: TrendingUp, color: '#EF4444', bg: '#FEF2F2' },
          { label: 'Volume Total', value: formatCurrency(mockClients.reduce((s, c) => s + c.totalFinanced, 0)), icon: TrendingUp, color: '#10B981', bg: '#ECFDF5' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-[#E8ECF0] shadow-card p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: stat.bg }}>
                <Icon className="w-4.5 h-4.5" style={{ color: stat.color, width: '18px', height: '18px' }} />
              </div>
              <div>
                <p className="text-xs text-[#64748B]">{stat.label}</p>
                <p className="text-lg font-bold text-[#0F1B2D]">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-[#F7F8FA] border border-[#E8ECF0] rounded-lg px-3 h-9 w-full max-w-md">
        <Search className="w-4 h-4 text-[#9CA3AF]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar clientes..."
          className="flex-1 bg-transparent text-sm text-[#0F1B2D] placeholder-[#9CA3AF] outline-none"
        />
      </div>

      {/* Client grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((client) => {
          const seg = segmentConfig[client.segment as keyof typeof segmentConfig];
          const sta = statusConfig[client.status as keyof typeof statusConfig];
          return (
            <div
              key={client.id}
              className="bg-white rounded-xl border border-[#E8ECF0] shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 overflow-hidden cursor-pointer"
            >
              {/* Header */}
              <div className="relative p-4 pb-3 bg-[#F7F8FA] border-b border-[#E8ECF0]">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: seg.color }}>
                    {client.avatar}
                  </div>
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: seg.bg, color: seg.color }}
                  >
                    {client.segment}
                  </span>
                </div>
                <p className="text-sm font-bold text-[#0F1B2D] mt-2">{client.name}</p>
                <p className="text-[10px] text-[#9CA3AF] font-mono">{client.nif}</p>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{client.phone}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#F7F8FA]">
                  <div>
                    <p className="text-[10px] text-[#9CA3AF]">Volume financiado</p>
                    <p className="text-sm font-bold text-[#0F1B2D]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {formatCurrency(client.totalFinanced)}
                    </p>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: sta.bg, color: sta.color }}
                  >
                    {sta.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
