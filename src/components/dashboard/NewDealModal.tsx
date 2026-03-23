'use client';

import { useState } from 'react';
import { X, User, Building2, ArrowRight, CheckCircle, Users, Plus, Trash2 } from 'lucide-react';
import { type ParticipantRole } from '@/lib/mock-data';

interface NewDealModalProps {
  open: boolean;
  onClose: () => void;
}

interface ParticipantForm {
  id: string;
  name: string;
  role: ParticipantRole;
  nif: string;
}

const ROLE_LABELS: Record<ParticipantRole, string> = {
  titular: 'Titular',
  'co-titular': 'Co-Titular',
  fiador: 'Fiador',
  conjugue: 'Cônjuge',
};

const ROLE_COLORS: Record<ParticipantRole, { color: string; bg: string }> = {
  titular: { color: '#2563EB', bg: '#EFF6FF' },
  'co-titular': { color: '#7C3AED', bg: '#F5F3FF' },
  fiador: { color: '#F59E0B', bg: '#FFFBEB' },
  conjugue: { color: '#10B981', bg: '#ECFDF5' },
};

export default function NewDealModal({ open, onClose }: NewDealModalProps) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    clientName: '',
    email: '',
    phone: '',
    amount: '',
    bank: '',
    term: '30',
    taeg: '',
    propertyValue: '',
  });
  const [participants, setParticipants] = useState<ParticipantForm[]>([
    { id: '1', name: '', role: 'titular', nif: '' },
  ]);

  if (!open) return null;

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setStep(1);
      setForm({ clientName: '', email: '', phone: '', amount: '', bank: '', term: '30', taeg: '', propertyValue: '' });
      setParticipants([{ id: '1', name: '', role: 'titular', nif: '' }]);
      onClose();
    }, 2000);
  };

  const addParticipant = () => {
    if (participants.length >= 3) return;
    setParticipants([...participants, { id: Date.now().toString(), name: '', role: 'co-titular', nif: '' }]);
  };

  const removeParticipant = (id: string) => {
    if (participants.length <= 1) return;
    setParticipants(participants.filter((p) => p.id !== id));
  };

  const updateParticipant = (id: string, field: keyof ParticipantForm, value: string) => {
    setParticipants(participants.map((p) => p.id === id ? { ...p, [field]: value } : p));
  };

  const totalSteps = 3;
  const inputClass = "w-full px-3 py-2.5 bg-[#F7F8FA] border border-[#E8ECF0] rounded-lg text-sm text-[#0F1B2D] outline-none focus:border-[#2563EB] focus:bg-white transition-colors placeholder-[#9CA3AF]";

  return (
    <>
      <div className="fixed inset-0 bg-[#0F1B2D]/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl border border-[#E8ECF0] shadow-[0_24px_64px_rgba(15,27,45,0.2)] w-full max-w-md flex flex-col max-h-[calc(100vh-2rem)] overflow-hidden animate-fade-slide-up">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E8ECF0] flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #0F1B2D 0%, #1E3352 100%)' }}>
            <div>
              <h3 className="text-base font-bold text-white">Novo Deal</h3>
              <p className="text-xs text-white/50 mt-0.5">Passo {step} de {totalSteps}</p>
            </div>
            <button onClick={onClose} className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-[#F1F5F9]">
            <div className="h-full bg-[#2563EB] transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }} />
          </div>

          <div className="flex-1 overflow-y-auto">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-16 h-16 bg-[#ECFDF5] rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-[#10B981]" />
              </div>
              <h4 className="text-base font-bold text-[#0F1B2D] mb-2">Deal Criado!</h4>
              <p className="text-sm text-[#64748B]">O negócio foi adicionado ao pipeline com sucesso.</p>
            </div>
          ) : step === 1 ? (
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-3 flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  Dados do Cliente
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-[#64748B] mb-1 block">Nome Completo *</label>
                    <input type="text" placeholder="Ex: João Silva" className={inputClass} value={form.clientName} onChange={(e) => setForm({...form, clientName: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-[#64748B] mb-1 block">Email</label>
                      <input type="email" placeholder="email@exemplo.com" className={inputClass} value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#64748B] mb-1 block">Telefone</label>
                      <input type="tel" placeholder="+351 912..." className={inputClass} value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : step === 2 ? (
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5" />
                  Detalhes do Crédito
                </p>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-[#64748B] mb-1 block">Montante *</label>
                      <input type="number" placeholder="250000" className={inputClass} value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#64748B] mb-1 block">Valor Imóvel</label>
                      <input type="number" placeholder="280000" className={inputClass} value={form.propertyValue} onChange={(e) => setForm({...form, propertyValue: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#64748B] mb-1 block">Banco</label>
                    <select className={inputClass} value={form.bank} onChange={(e) => setForm({...form, bank: e.target.value})}>
                      <option value="">Selecionar banco...</option>
                      {['Millennium BCP', 'Caixa Geral', 'Santander', 'BPI', 'Novo Banco', 'Abanca'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-[#64748B] mb-1 block">Prazo (anos)</label>
                      <select className={inputClass} value={form.term} onChange={(e) => setForm({...form, term: e.target.value})}>
                        {[10, 15, 20, 25, 30, 35, 40].map(t => <option key={t} value={t}>{t} anos</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#64748B] mb-1 block">TAEG (%)</label>
                      <input type="number" step="0.01" placeholder="3.85" className={inputClass} value={form.taeg} onChange={(e) => setForm({...form, taeg: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Step 3 — Intervenientes */
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" />
                  Intervenientes
                </p>
                <span className="text-[10px] font-medium text-[#9CA3AF] bg-[#F7F8FA] border border-[#E8ECF0] px-2 py-0.5 rounded-full">
                  {participants.length}/3
                </span>
              </div>

              <div className="space-y-3">
                {participants.map((participant, index) => {
                  const roleCfg = ROLE_COLORS[participant.role];
                  return (
                    <div key={participant.id} className="rounded-xl border border-[#E8ECF0] bg-[#F8FAFC] p-3 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
                            style={{ backgroundColor: roleCfg.bg, color: roleCfg.color }}
                          >
                            {index + 1}
                          </div>
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: roleCfg.bg, color: roleCfg.color }}
                          >
                            {ROLE_LABELS[participant.role]}
                          </span>
                        </div>
                        {participants.length > 1 && (
                          <button
                            onClick={() => removeParticipant(participant.id)}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="text-[10px] font-medium text-[#64748B] mb-1 block">Nome Completo *</label>
                        <input
                          type="text"
                          placeholder="Ex: Maria Silva"
                          className={inputClass}
                          value={participant.name}
                          onChange={(e) => updateParticipant(participant.id, 'name', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-medium text-[#64748B] mb-1 block">Papel</label>
                          <select
                            className={inputClass}
                            value={participant.role}
                            onChange={(e) => updateParticipant(participant.id, 'role', e.target.value as ParticipantRole)}
                          >
                            {(Object.keys(ROLE_LABELS) as ParticipantRole[]).map((r) => (
                              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-medium text-[#64748B] mb-1 block">NIF</label>
                          <input
                            type="text"
                            placeholder="123456789"
                            className={inputClass}
                            value={participant.nif}
                            onChange={(e) => updateParticipant(participant.id, 'nif', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {participants.length < 3 && (
                <button
                  onClick={addParticipant}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-[#CBD5E1] rounded-xl text-xs font-medium text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Adicionar interveniente {participants.length < 3 ? `(${3 - participants.length} disponível${3 - participants.length > 1 ? 'is' : ''})` : ''}
                </button>
              )}

              {participants.length >= 3 && (
                <p className="mt-2 text-[10px] text-center text-[#9CA3AF]">Máximo de 3 intervenientes atingido</p>
              )}
            </div>
          )}
          </div>

          {/* Footer */}
          {!submitted && (
            <div className="px-6 py-4 border-t border-[#E8ECF0] flex gap-3">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E8ECF0] text-sm font-medium text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
                >
                  Anterior
                </button>
              )}
              {step < totalSteps ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !form.clientName}
                  className="flex-1 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Próximo <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={participants.some((p) => !p.name)}
                  className="flex-1 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Criar Deal <CheckCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
