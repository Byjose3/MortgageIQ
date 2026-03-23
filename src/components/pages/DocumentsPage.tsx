'use client';

import { useState } from 'react';
import { CheckCircle, Clock, XCircle, AlertTriangle, Upload, Search, FileText } from 'lucide-react';
import { mockDeals } from '@/lib/mock-data';

const statusConfig = {
  validated: { icon: CheckCircle, color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', label: 'Validado' },
  received: { icon: Clock, color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', label: 'Recebido' },
  missing: { icon: XCircle, color: '#EF4444', bg: '#FEF2F2', border: '#FECACA', label: 'Em Falta' },
  expired: { icon: AlertTriangle, color: '#EF4444', bg: '#FEF2F2', border: '#FECACA', label: 'Expirado' },
};

export default function DocumentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Flatten all documents across deals
  const allDocs = mockDeals.flatMap((deal) =>
    deal.documents.map((doc) => ({
      ...doc,
      dealId: deal.id,
      clientName: deal.clientName,
      clientAvatar: deal.clientAvatar,
    }))
  );

  const filtered = allDocs.filter((doc) => {
    const matchSearch = doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.clientName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: allDocs.length,
    validated: allDocs.filter(d => d.status === 'validated').length,
    received: allDocs.filter(d => d.status === 'received').length,
    missing: allDocs.filter(d => d.status === 'missing').length,
    expired: allDocs.filter(d => d.status === 'expired').length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#0F1B2D]">Documentos</h2>
        <p className="text-sm text-[#64748B] mt-0.5">Gestão de toda a documentação por deal</p>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {(['validated', 'received', 'missing', 'expired'] as const).map((s) => {
          const cfg = statusConfig[s];
          const Icon = cfg.icon;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
              className={`bg-white rounded-xl border shadow-card p-4 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-card-hover transition-all cursor-pointer text-left ${
                statusFilter === s ? 'border-[#2563EB] shadow-[0_0_0_2px_rgba(37,99,235,0.1)]' : 'border-[#E8ECF0]'
              }`}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: cfg.bg }}>
                <Icon className="w-4.5 h-4.5" style={{ color: cfg.color, width: '18px', height: '18px' }} />
              </div>
              <div>
                <p className="text-xs text-[#64748B]">{cfg.label}</p>
                <p className="text-xl font-bold" style={{ color: cfg.color, fontFamily: 'JetBrains Mono, monospace' }}>
                  {counts[s]}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search and filter */}
      <div className="flex items-center gap-2 bg-[#F7F8FA] border border-[#E8ECF0] rounded-lg px-3 h-9 w-full max-w-md">
        <Search className="w-4 h-4 text-[#9CA3AF]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar documentos ou clientes..."
          className="flex-1 bg-transparent text-sm text-[#0F1B2D] placeholder-[#9CA3AF] outline-none"
        />
      </div>

      {/* Document matrix */}
      <div className="bg-white rounded-xl border border-[#E8ECF0] shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8ECF0] bg-[#F8FAFC]">
              {['Documento', 'Cliente', 'Deal ID', 'Estado', 'Data', 'Ação'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc, idx) => {
              const cfg = statusConfig[doc.status as keyof typeof statusConfig];
              const Icon = cfg.icon;
              return (
                <tr key={idx} className="border-b border-[#F7F8FA] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-[#F7F8FA] rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-3.5 h-3.5 text-[#64748B]" />
                      </div>
                      <span className="text-sm font-medium text-[#0F1B2D]">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#0F1B2D] rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                        {doc.clientAvatar}
                      </div>
                      <span className="text-xs text-[#64748B]">{doc.clientName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-mono text-[#64748B] bg-[#F7F8FA] px-2 py-0.5 rounded">{doc.dealId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: cfg.bg }}>
                        <Icon className="w-3 h-3" style={{ color: cfg.color }} />
                      </div>
                      <span className="text-[10px] font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#9CA3AF]">
                    {doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString('pt-PT') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {(doc.status === 'missing' || doc.status === 'expired') && (
                      <button className="flex items-center gap-1 text-[10px] font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] px-2.5 py-1 rounded-lg transition-colors">
                        <Upload className="w-3 h-3" />
                        Upload
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
