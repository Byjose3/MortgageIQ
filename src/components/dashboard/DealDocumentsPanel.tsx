'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Upload, FileText, CheckCircle2, XCircle, Clock, AlertTriangle,
  Globe, User, Home, Landmark, X, Trash2,
  FileImage, FileSpreadsheet, File, Info, RefreshCw, ChevronRight, ChevronLeft
} from 'lucide-react';
import type { Participant, Deal } from '@/lib/mock-data';

// ─── Document type definitions ──────────────────────────────────────────────

export type DocCategory = 'identity' | 'financial' | 'property' | 'loan' | 'other';
export type DocOrigin = 'PT' | 'EU' | 'NON_EU';
export type UploadedDocStatus = 'received' | 'validated' | 'missing' | 'expired' | 'pending';

export interface DocTemplate {
  id: string;
  name: string;
  category: DocCategory;
  required: boolean;
  foreignEquivalent?: string;
  description?: string;
  acceptedFormats?: string[];
}

export interface ParticipantDocument {
  id: string;
  participantId: string;
  templateId: string;
  templateName: string;
  category: DocCategory;
  origin: DocOrigin;
  status: UploadedDocStatus;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  uploadedAt?: string;
  validatedAt?: string;
  expiresAt?: string;
  notes?: string;
}

// ─── Document templates per category ────────────────────────────────────────

const IDENTITY_DOCS: DocTemplate[] = [
  { id: 'cc_pt', name: 'Cartão de Cidadão', category: 'identity', required: true, foreignEquivalent: 'Passaporte / ID Europeu', description: 'Frente e verso em validade', acceptedFormats: ['pdf', 'jpg', 'png'] },
  { id: 'passport', name: 'Passaporte', category: 'identity', required: false, foreignEquivalent: 'Passaporte Internacional', description: 'Cópia da página de dados', acceptedFormats: ['pdf', 'jpg', 'png'] },
  { id: 'nif', name: 'Comprovativo NIF', category: 'identity', required: true, foreignEquivalent: 'Tax ID / TIN no país de origem', description: 'Emitido pela AT', acceptedFormats: ['pdf', 'jpg'] },
  { id: 'residency', name: 'Comprovativo de Residência', category: 'identity', required: true, foreignEquivalent: 'Residence Permit / Certificado de Registo', description: 'Fatura ou documento oficial < 3 meses', acceptedFormats: ['pdf', 'jpg'] },
  { id: 'niss', name: 'Comprovativo NISS', category: 'identity', required: false, foreignEquivalent: 'Social Security Number equivalente', description: 'Segurança social portuguesa', acceptedFormats: ['pdf'] },
];

const FINANCIAL_DOCS: DocTemplate[] = [
  { id: 'irs', name: 'Declaração IRS (último ano)', category: 'financial', required: true, foreignEquivalent: 'Declaração fiscal equivalente apostilada', description: 'Com nota de liquidação', acceptedFormats: ['pdf'] },
  { id: 'salaries', name: 'Últimos 3 Recibos de Vencimento', category: 'financial', required: true, foreignEquivalent: 'Pay Slips / Fiches de paie (3 meses)', description: 'Recibos dos últimos 3 meses', acceptedFormats: ['pdf', 'jpg'] },
  { id: 'bank_stmt', name: 'Extratos Bancários (6 meses)', category: 'financial', required: true, foreignEquivalent: 'Bank Statements (6 months)', description: 'Conta salário ou principal', acceptedFormats: ['pdf'] },
  { id: 'employment', name: 'Contrato de Trabalho', category: 'financial', required: true, foreignEquivalent: 'Employment Contract / Contrat de travail', description: 'Ou declaração de vínculo empregatício', acceptedFormats: ['pdf'] },
  { id: 'irs_nota', name: 'Nota de Liquidação IRS', category: 'financial', required: false, description: 'Emitida pela AT após entrega do IRS', acceptedFormats: ['pdf'] },
  { id: 'other_income', name: 'Outros Rendimentos', category: 'financial', required: false, foreignEquivalent: 'Other Income Proof', description: 'Rendimentos de arrendamento, capitais, etc.', acceptedFormats: ['pdf', 'jpg'] },
  { id: 'debts', name: 'Mapa de Responsabilidades Bancárias', category: 'financial', required: true, foreignEquivalent: 'Credit Report equivalente', description: 'Emitido pelo Banco de Portugal', acceptedFormats: ['pdf'] },
];

const PROPERTY_DOCS: DocTemplate[] = [
  { id: 'caderneta', name: 'Caderneta Predial', category: 'property', required: true, description: 'Urbana ou rústica', acceptedFormats: ['pdf', 'jpg'] },
  { id: 'certidao_perm', name: 'Certidão Permanente (Registo Predial)', category: 'property', required: true, description: '< 6 meses de validade', acceptedFormats: ['pdf'] },
  { id: 'licenca_hab', name: 'Licença de Habitabilidade / Utilização', category: 'property', required: true, description: 'Emitida pela Câmara Municipal', acceptedFormats: ['pdf', 'jpg'] },
  { id: 'planta', name: 'Planta do Imóvel', category: 'property', required: false, description: 'Planta arquitetónica com áreas', acceptedFormats: ['pdf', 'jpg'] },
  { id: 'escritura', name: 'Escritura Aquisição Anterior', category: 'property', required: false, description: 'Se imóvel já foi vendido/comprado anteriormente', acceptedFormats: ['pdf'] },
  { id: 'promissory', name: 'CPCV (Contrato Promessa)', category: 'property', required: false, description: 'Contrato promessa de compra e venda', acceptedFormats: ['pdf'] },
];

const LOAN_DOCS: DocTemplate[] = [
  { id: 'ficha_info', name: 'Ficha de Informação Normalizada (FIN)', category: 'loan', required: true, description: 'Preenchida pelo banco', acceptedFormats: ['pdf'] },
  { id: 'simulacao', name: 'Simulação / Proposta do Banco', category: 'loan', required: true, description: 'Proposta formal da instituição', acceptedFormats: ['pdf'] },
  { id: 'seguro_vida', name: 'Proposta Seguro de Vida', category: 'loan', required: false, description: 'Associado ao crédito habitação', acceptedFormats: ['pdf'] },
  { id: 'seguro_hab', name: 'Proposta Seguro Multirriscos', category: 'loan', required: false, description: 'Seguro do imóvel', acceptedFormats: ['pdf'] },
];

const ALL_TEMPLATES: DocTemplate[] = [...IDENTITY_DOCS, ...FINANCIAL_DOCS, ...PROPERTY_DOCS, ...LOAN_DOCS];

const CATEGORY_CONFIG: Record<DocCategory, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  identity: { label: 'Identidade', icon: <User className="w-3.5 h-3.5" />, color: '#2563EB', bg: '#EFF6FF' },
  financial: { label: 'Financeiros', icon: <Landmark className="w-3.5 h-3.5" />, color: '#10B981', bg: '#ECFDF5' },
  property: { label: 'Imóvel', icon: <Home className="w-3.5 h-3.5" />, color: '#7C3AED', bg: '#F5F3FF' },
  loan: { label: 'Crédito', icon: <FileSpreadsheet className="w-3.5 h-3.5" />, color: '#F59E0B', bg: '#FFFBEB' },
  other: { label: 'Outros', icon: <File className="w-3.5 h-3.5" />, color: '#64748B', bg: '#F7F8FA' },
};

const ORIGIN_CONFIG: Record<DocOrigin, { label: string; flag: string; color: string }> = {
  PT: { label: 'Portugal', flag: '🇵🇹', color: '#10B981' },
  EU: { label: 'União Europeia', flag: '🇪🇺', color: '#2563EB' },
  NON_EU: { label: 'Fora da UE', flag: '🌍', color: '#F59E0B' },
};

const STATUS_CONFIG: Record<UploadedDocStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  validated: { label: 'Validado', color: '#10B981', bg: '#ECFDF5', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  received: { label: 'Recebido', color: '#2563EB', bg: '#EFF6FF', icon: <Clock className="w-3.5 h-3.5" /> },
  missing: { label: 'Em falta', color: '#EF4444', bg: '#FEF2F2', icon: <XCircle className="w-3.5 h-3.5" /> },
  expired: { label: 'Expirado', color: '#F59E0B', bg: '#FFFBEB', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  pending: { label: 'A processar', color: '#8B5CF6', bg: '#F5F3FF', icon: <RefreshCw className="w-3.5 h-3.5 animate-spin" /> },
};

const ROLE_LABELS: Record<string, string> = {
  titular: 'Titular',
  'co-titular': 'Co-titular',
  fiador: 'Fiador',
  conjugue: 'Cônjuge',
};

// ─── Generate initial documents from participants ──────────────────────────

function generateInitialDocs(participants: Participant[]): ParticipantDocument[] {
  const docs: ParticipantDocument[] = [];
  participants.forEach((p) => {
    ALL_TEMPLATES.forEach((tmpl) => {
      // Only identity + financial are per-person; property + loan are deal-level (assigned to titular)
      if ((tmpl.category === 'property' || tmpl.category === 'loan') && p.role !== 'titular') return;
      docs.push({
        id: `${p.id}-${tmpl.id}`,
        participantId: p.id,
        templateId: tmpl.id,
        templateName: tmpl.name,
        category: tmpl.category,
        origin: 'PT',
        status: 'missing',
      });
    });
  });
  return docs;
}

// ─── File icon helper ──────────────────────────────────────────────────────

function FileIcon({ fileType }: { fileType?: string }) {
  if (!fileType) return <File className="w-5 h-5 text-[#9CA3AF]" />;
  if (fileType.includes('pdf')) return <FileText className="w-5 h-5 text-[#EF4444]" />;
  if (fileType.includes('image')) return <FileImage className="w-5 h-5 text-[#2563EB]" />;
  if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('csv')) return <FileSpreadsheet className="w-5 h-5 text-[#10B981]" />;
  return <File className="w-5 h-5 text-[#9CA3AF]" />;
}

// ─── Main Component ────────────────────────────────────────────────────────

interface DealDocumentsPanelProps {
  deal: Deal;
  onClose?: () => void;
}

export default function DealDocumentsPanel({ deal, onClose }: DealDocumentsPanelProps) {
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>(deal.participants[0]?.id ?? '');
  const [selectedCategory, setSelectedCategory] = useState<DocCategory | 'all'>('all');
  const [documents, setDocuments] = useState<ParticipantDocument[]>(() => generateInitialDocs(deal.participants));
  const [draggingOver, setDraggingOver] = useState<string | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [originModal, setOriginModal] = useState<{ docId: string; origin: DocOrigin } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingUploadDocId, setPendingUploadDocId] = useState<string | null>(null);
  const categoryTabsRef = useRef<HTMLDivElement>(null);

  const scrollCategoryTabs = (dir: 'left' | 'right') => {
    if (categoryTabsRef.current) {
      categoryTabsRef.current.scrollBy({ left: dir === 'right' ? 120 : -120, behavior: 'smooth' });
    }
  };

  const participant = deal.participants.find(p => p.id === selectedParticipantId);

  const visibleDocs = documents.filter(d => {
    const isMine = d.participantId === selectedParticipantId;
    const catMatch = selectedCategory === 'all' || d.category === selectedCategory;
    return isMine && catMatch;
  });

  // Stats for current participant
  const participantDocs = documents.filter(d => d.participantId === selectedParticipantId);
  const validatedCount = participantDocs.filter(d => d.status === 'validated').length;
  const receivedCount = participantDocs.filter(d => d.status === 'received').length;
  const missingCount = participantDocs.filter(d => d.status === 'missing').length;
  const completionPct = participantDocs.length > 0 ? Math.round(((validatedCount + receivedCount) / participantDocs.length) * 100) : 0;

  const handleFileSelect = useCallback((docId: string, files: FileList | null) => {
    if (!files || !files[0]) return;
    const file = files[0];
    setUploadingDoc(docId);
    // Simulate processing
    setTimeout(() => {
      setDocuments(prev => prev.map(d => d.id === docId ? {
        ...d,
        status: 'received',
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadedAt: new Date().toISOString().split('T')[0],
      } : d));
      setUploadingDoc(null);
    }, 1200);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setDraggingOver(null);
    handleFileSelect(docId, e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleValidate = (docId: string) => {
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, status: 'validated', validatedAt: new Date().toISOString().split('T')[0] } : d));
  };

  const handleRemove = (docId: string) => {
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, status: 'missing', fileName: undefined, fileSize: undefined, fileType: undefined, uploadedAt: undefined } : d));
  };

  const handleOriginChange = (docId: string, origin: DocOrigin) => {
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, origin } : d));
    setOriginModal(null);
  };

  const triggerUpload = (docId: string) => {
    setPendingUploadDocId(docId);
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (pendingUploadDocId) {
      handleFileSelect(pendingUploadDocId, e.target.files);
      setPendingUploadDocId(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Group docs by category for display
  const grouped: Record<string, ParticipantDocument[]> = {};
  visibleDocs.forEach(d => {
    if (!grouped[d.category]) grouped[d.category] = [];
    grouped[d.category].push(d);
  });

  const categoriesToShow: DocCategory[] = selectedCategory === 'all'
    ? (['identity', 'financial', 'property', 'loan'] as DocCategory[]).filter(c => grouped[c]?.length > 0)
    : [selectedCategory as DocCategory];

  // Overall deal stats
  const totalDocs = documents.length;
  const totalValidated = documents.filter(d => d.status === 'validated').length;
  const totalMissing = documents.filter(d => d.status === 'missing').length;
  const dealCompletionPct = totalDocs > 0 ? Math.round((totalValidated / totalDocs) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-[#F7F8FA]">
      <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xlsx" onChange={handleInputChange} />

      {/* ── Header ── */}
      <div className="bg-white border-b border-[#E8ECF0] px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#EFF6FF] rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-[#2563EB]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F1B2D] leading-tight">Documentação</h2>
              <p className="text-[11px] text-[#9CA3AF]">{deal.id} · {deal.clientName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-[#F7F8FA] border border-[#E8ECF0] rounded-lg px-2.5 py-1.5">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span className="text-[11px] font-bold text-[#0F1B2D]">{totalValidated}</span>
              </div>
              <span className="text-[#E8ECF0] text-xs">·</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                <span className="text-[11px] font-bold text-[#0F1B2D]">{totalMissing}</span>
              </div>
              <span className="text-[#E8ECF0] text-xs">·</span>
              <span className="text-[11px] font-bold text-[#2563EB]">{dealCompletionPct}%</span>
            </div>
            {onClose && (
              <button onClick={onClose} className="w-7 h-7 rounded-lg bg-[#F7F8FA] border border-[#E8ECF0] flex items-center justify-center hover:bg-[#F1F5F9] transition-colors">
                <X className="w-3.5 h-3.5 text-[#64748B]" />
              </button>
            )}
          </div>
        </div>

        {/* ── Participant pill switcher ── */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
          {deal.participants.map((p) => {
            const pDocs = documents.filter(d => d.participantId === p.id);
            const pMissing = pDocs.filter(d => d.status === 'missing').length;
            const isSelected = selectedParticipantId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => { setSelectedParticipantId(p.id); setSelectedCategory('all'); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all flex-shrink-0 ${
                  isSelected
                    ? 'bg-[#0F1B2D] border-[#0F1B2D]'
                    : 'bg-white border-[#E8ECF0] hover:border-[#94A3B8]'
                }`}
              >
                <span className={`text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-[#0F1B2D]'}`}>
                  {p.avatar}
                </span>
                <div className="text-left">
                  <p className={`text-[11px] font-semibold leading-tight truncate max-w-[72px] ${isSelected ? 'text-white' : 'text-[#0F1B2D]'}`}>
                    {p.name.split(' ')[0]}
                  </p>
                  <p className={`text-[10px] leading-tight ${isSelected ? 'text-white/60' : 'text-[#9CA3AF]'}`}>
                    {ROLE_LABELS[p.role] ?? p.role}
                  </p>
                </div>
                {pMissing > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#EF4444] text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                    {pMissing > 9 ? '9+' : pMissing}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Participant progress + category tabs ── */}
      {participant && (
        <div className="bg-white border-b border-[#E8ECF0] px-4 py-3 flex-shrink-0">
          {/* Progress row */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${completionPct}%`,
                  backgroundColor: completionPct === 100 ? '#10B981' : completionPct > 60 ? '#2563EB' : '#F59E0B'
                }}
              />
            </div>
            <span className="text-[11px] font-bold font-mono flex-shrink-0" style={{
              color: completionPct === 100 ? '#10B981' : completionPct > 60 ? '#2563EB' : '#F59E0B'
            }}>{completionPct}%</span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {(['validated', 'received', 'missing'] as UploadedDocStatus[]).map(s => {
                const count = participantDocs.filter(d => d.status === s).length;
                if (count === 0) return null;
                const cfg = STATUS_CONFIG[s];
                return (
                  <div key={s} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                    {cfg.icon}
                    <span>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category tabs */}
          <div className="relative flex items-center gap-1 px-1">
            {/* Left scroll button */}
            <button
              onClick={() => scrollCategoryTabs('left')}
              className="flex-shrink-0 w-6 h-7 flex items-center justify-center rounded-lg bg-[#F7F8FA] border border-[#E8ECF0] hover:bg-[#E8ECF0] transition-colors z-10"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-[#64748B]" />
            </button>

            {/* Scrollable tabs */}
            <div
              ref={categoryTabsRef}
              className="flex items-center gap-2 py-3 px-1"
              style={{ overflowX: 'auto', overflowY: 'visible', scrollbarWidth: 'none', msOverflowStyle: 'none', flex: 1 }}
            >
              <button
                onClick={() => setSelectedCategory('all')}
                className={`flex items-center gap-1 px-3 h-7 rounded-lg text-xs font-semibold transition-colors flex-shrink-0 ${
                  selectedCategory === 'all' ? 'bg-[#0F1B2D] text-white' : 'bg-[#F7F8FA] text-[#64748B] hover:bg-[#F1F5F9]'
                }`}
              >
                Todos
                <span className={`text-[9px] px-1 rounded ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-[#E8ECF0] text-[#64748B]'}`}>
                  {participantDocs.length}
                </span>
              </button>
              {(['identity', 'financial', 'property', 'loan'] as DocCategory[]).map(cat => {
                const cfg = CATEGORY_CONFIG[cat];
                const catDocs = participantDocs.filter(d => d.category === cat);
                if (catDocs.length === 0) return null;
                const catMissing = catDocs.filter(d => d.status === 'missing').length;
                const isActive = selectedCategory === cat;
                return (
                  <div key={cat} className="relative flex-shrink-0">
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className="flex items-center gap-1 px-3 h-7 rounded-lg text-xs font-semibold transition-colors"
                      style={isActive ? { backgroundColor: cfg.color, color: 'white' } : { backgroundColor: cfg.bg, color: cfg.color }}
                    >
                      {cfg.icon}
                      <span>{cfg.label}</span>
                    </button>
                    {catMissing > 0 && (
                      <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center px-1 z-10 shadow-sm leading-none">
                        {catMissing}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right scroll button */}
            <button
              onClick={() => scrollCategoryTabs('right')}
              className="flex-shrink-0 w-6 h-7 flex items-center justify-center rounded-lg bg-[#F7F8FA] border border-[#E8ECF0] hover:bg-[#E8ECF0] transition-colors z-10"
            >
              <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
            </button>
          </div>
        </div>
      )}

      {/* ── Document List ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {categoriesToShow.map(cat => {
          const catDocs = grouped[cat] ?? [];
          if (catDocs.length === 0) return null;
          const cfg = CATEGORY_CONFIG[cat];
          const catDone = catDocs.filter(d => d.status !== 'missing').length;
          return (
            <div key={cat}>
              {/* Category header */}
              <div className="flex items-center gap-2 mb-2.5">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                  {cfg.icon}
                  <span>{cfg.label}</span>
                </div>
                <div className="h-px flex-1 bg-[#E8ECF0]" />
                <span className="text-[10px] text-[#9CA3AF] font-mono">{catDone}/{catDocs.length}</span>
              </div>

              {/* Doc rows */}
              <div className="space-y-2">
                {catDocs.map(doc => {
                  const template = ALL_TEMPLATES.find(t => t.id === doc.templateId);
                  const statusCfg = STATUS_CONFIG[doc.status];
                  const originCfg = ORIGIN_CONFIG[doc.origin];
                  const isExpanded = expandedDoc === doc.id;
                  const isUploading = uploadingDoc === doc.id;
                  const isDragging = draggingOver === doc.id;
                  const hasForeign = doc.origin !== 'PT';

                  return (
                    <div
                      key={doc.id}
                      className={`bg-white rounded-xl border transition-all ${
                        isDragging
                          ? 'border-[#2563EB] shadow-[0_0_0_3px_rgba(37,99,235,0.12)]'
                          : doc.status === 'missing'
                          ? 'border-dashed border-[#E8ECF0]'
                          : 'border-[#E8ECF0]'
                      }`}
                      onDragOver={(e) => { e.preventDefault(); setDraggingOver(doc.id); }}
                      onDragLeave={() => setDraggingOver(null)}
                      onDrop={(e) => handleDrop(e, doc.id)}
                    >
                      {/* Main row */}
                      <div className="flex items-center gap-3 px-3 py-2.5">
                        {/* Status indicator */}
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
                        >
                          {statusCfg.icon}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] font-semibold text-[#0F1B2D] truncate leading-tight">{doc.templateName}</span>
                            {template?.required && (
                              <span className="text-[9px] font-bold text-[#EF4444] bg-[#FEF2F2] px-1 py-0.5 rounded leading-none flex-shrink-0">OBR</span>
                            )}
                          </div>
                          {doc.fileName ? (
                            <div className="flex items-center gap-1 mt-0.5">
                              <FileIcon fileType={doc.fileType} />
                              <span className="text-[10px] text-[#64748B] font-mono truncate max-w-[120px]">{doc.fileName}</span>
                              {doc.fileSize && <span className="text-[10px] text-[#9CA3AF] flex-shrink-0">{(doc.fileSize / 1024).toFixed(0)}KB</span>}
                            </div>
                          ) : (
                            <p className="text-[10px] text-[#9CA3AF] mt-0.5 truncate">{template?.description}</p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {/* Origin badge */}
                          <button
                            onClick={() => setOriginModal({ docId: doc.id, origin: doc.origin })}
                            className="flex items-center gap-0.5 text-[10px] font-semibold px-1.5 h-6 rounded-lg border transition-colors flex-shrink-0"
                            style={{
                              backgroundColor: hasForeign ? `${originCfg.color}10` : '#F7F8FA',
                              borderColor: hasForeign ? `${originCfg.color}40` : '#E8ECF0',
                              color: hasForeign ? originCfg.color : '#9CA3AF'
                            }}
                            title="Alterar origem"
                          >
                            {originCfg.flag}
                          </button>

                          {/* Upload/validate/view actions */}
                          {isUploading ? (
                            <div className="flex items-center gap-1 text-[10px] text-[#8B5CF6] font-semibold px-2 h-6 bg-[#F5F3FF] rounded-lg">
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            </div>
                          ) : doc.status === 'missing' || doc.status === 'expired' ? (
                            <button
                              onClick={() => triggerUpload(doc.id)}
                              className="flex items-center gap-1 text-[10px] font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] px-2.5 h-6 rounded-lg transition-colors"
                            >
                              <Upload className="w-3 h-3" />
                              Anexar
                            </button>
                          ) : (
                            <div className="flex items-center gap-1">
                              {doc.status === 'received' && (
                                <button
                                  onClick={() => handleValidate(doc.id)}
                                  className="flex items-center gap-1 text-[10px] font-bold text-[#10B981] bg-[#ECFDF5] hover:bg-[#D1FAE5] px-2 h-6 rounded-lg transition-colors"
                                  title="Marcar como validado"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  OK
                                </button>
                              )}
                              <button
                                onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}
                                className="w-6 h-6 rounded-lg bg-[#F7F8FA] border border-[#E8ECF0] flex items-center justify-center hover:bg-[#F1F5F9] transition-colors"
                                title="Ver detalhes"
                              >
                                <ChevronRight className={`w-3 h-3 text-[#64748B] transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                              </button>
                              <button
                                onClick={() => handleRemove(doc.id)}
                                className="w-6 h-6 rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center hover:bg-[#FEE2E2] transition-colors"
                                title="Remover ficheiro"
                              >
                                <Trash2 className="w-3 h-3 text-[#EF4444]" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Foreign doc alert */}
                      {hasForeign && doc.origin === 'NON_EU' && template && (
                        <div className="mx-3 mb-2.5 flex items-start gap-2 bg-[#FFFBEB] border border-[#FDE68A] rounded-lg px-3 py-2">
                          <AlertTriangle className="w-3 h-3 text-[#F59E0B] mt-0.5 flex-shrink-0" />
                          <p className="text-[10px] text-[#92400E] leading-relaxed">
                            <strong>Fora da UE:</strong> Apostila Haia + tradução certificada.
                            {template.foreignEquivalent && <span className="text-[#78350F]"> Equiv: <em>{template.foreignEquivalent}</em></span>}
                          </p>
                        </div>
                      )}
                      {hasForeign && doc.origin === 'EU' && template?.foreignEquivalent && (
                        <div className="mx-3 mb-2.5 flex items-start gap-2 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg px-3 py-2">
                          <Info className="w-3 h-3 text-[#2563EB] mt-0.5 flex-shrink-0" />
                          <p className="text-[10px] text-[#1E40AF]">UE aceite. Equiv: <em>{template.foreignEquivalent}</em></p>
                        </div>
                      )}

                      {/* Expanded detail */}
                      {isExpanded && doc.status !== 'missing' && (
                        <div className="px-3 pb-2.5 pt-2 border-t border-[#F7F8FA]">
                          <div className="grid grid-cols-3 gap-2">
                            {doc.uploadedAt && (
                              <div>
                                <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wide">Carregado</p>
                                <p className="text-[11px] font-semibold text-[#0F1B2D]">{new Date(doc.uploadedAt).toLocaleDateString('pt-PT')}</p>
                              </div>
                            )}
                            {doc.validatedAt && (
                              <div>
                                <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wide">Validado</p>
                                <p className="text-[11px] font-semibold text-[#10B981]">{new Date(doc.validatedAt).toLocaleDateString('pt-PT')}</p>
                              </div>
                            )}
                            {doc.expiresAt && (
                              <div>
                                <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wide">Expira</p>
                                <p className="text-[11px] font-semibold text-[#F59E0B]">{new Date(doc.expiresAt).toLocaleDateString('pt-PT')}</p>
                              </div>
                            )}
                          </div>
                          {doc.notes && (
                            <p className="mt-2 text-[10px] text-[#64748B] bg-[#F7F8FA] rounded-lg px-2.5 py-1.5">{doc.notes}</p>
                          )}
                        </div>
                      )}

                      {/* Drag drop hint */}
                      {isDragging && (
                        <div className="mx-3 mb-2.5 flex items-center justify-center gap-2 bg-[#EFF6FF] border-2 border-dashed border-[#2563EB] rounded-xl py-2.5 text-xs font-semibold text-[#2563EB]">
                          <Upload className="w-3.5 h-3.5" />
                          Largar para anexar
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {visibleDocs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="w-10 h-10 text-[#E8ECF0] mb-3" />
            <p className="text-sm font-medium text-[#9CA3AF]">Nenhum documento nesta categoria</p>
          </div>
        )}

        {/* Foreign docs tip */}
        <div className="bg-[#F0FDF4] rounded-xl p-3 border border-[#D1FAE5] flex items-start gap-2">
          <Globe className="w-3.5 h-3.5 text-[#10B981] mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-[#047857] leading-relaxed">
            <strong className="text-[#065F46]">Docs. Estrangeiros:</strong> Toque na bandeira de cada documento para marcar PT / UE / Fora UE. Fora da UE pode requerer apostila.
          </p>
        </div>
      </div>

      {/* ── Origin modal ── */}
      {originModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setOriginModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-72 p-5" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-[#0F1B2D] mb-1">Origem do Documento</h3>
            <p className="text-xs text-[#64748B] mb-4">País/região de emissão</p>
            <div className="space-y-2">
              {(Object.entries(ORIGIN_CONFIG) as [DocOrigin, typeof ORIGIN_CONFIG[DocOrigin]][]).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => handleOriginChange(originModal.docId, key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                    originModal.origin === key ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E8ECF0] hover:border-[#94A3B8]'
                  }`}
                >
                  <span className="text-xl">{cfg.flag}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#0F1B2D]">{cfg.label}</p>
                    {key === 'NON_EU' && <p className="text-[10px] text-[#F59E0B]">Pode requerer apostila + tradução</p>}
                    {key === 'EU' && <p className="text-[10px] text-[#2563EB]">Documentos equivalentes aceites</p>}
                    {key === 'PT' && <p className="text-[10px] text-[#10B981]">Formato padrão português</p>}
                  </div>
                  {originModal.origin === key && <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />}
                </button>
              ))}
            </div>
            <button onClick={() => setOriginModal(null)} className="mt-4 w-full h-9 rounded-xl bg-[#F7F8FA] border border-[#E8ECF0] text-sm font-semibold text-[#64748B] hover:bg-[#F1F5F9] transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
