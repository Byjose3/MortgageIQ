// MortgageIQ Mock Data

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type DealStage =
  | 'Prospection'
  | 'Qualification'
  | 'Documentation'
  | 'Analysis'
  | 'Simulation'
  | 'Submission'
  | 'Bank Review'
  | 'Approved'
  | 'Negotiation'
  | 'Deed'
  | 'Closed';

export type DocumentStatus = 'received' | 'validated' | 'missing' | 'expired';
export type ParticipantRole = 'titular' | 'co-titular' | 'fiador' | 'conjugue';

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  role: ParticipantRole;
  nif?: string;
  income?: number;
}

export interface Document {
  id: string;
  name: string;
  status: DocumentStatus;
  updatedAt: string;
}

export interface Deal {
  id: string;
  clientName: string;
  clientAvatar: string;
  participants: Participant[];
  amount: number;
  stage: DealStage;
  risk: RiskLevel;
  readinessScore: number;
  approvalProbability: number;
  missingDocs: string[];
  bank: string;
  taeg: number;
  term: number;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  agent: string;
  propertyValue: number;
  ltv: number;
  monthlyIncome: number;
  documents: Document[];
  notes: string;
}

export interface BankProposal {
  id: string;
  bank: string;
  bankLogo: string;
  taeg: number;
  tin: number;
  spread: number;
  euribor: string;
  monthlyPayment: number;
  totalCost: number;
  processingFee: number;
  insurance: number;
  fixedPeriod: number;
  score: number;
  recommended: boolean;
  pros: string[];
  cons: string[];
}

export interface Alert {
  id: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  dealId?: string;
  clientName?: string;
  timestamp: string;
  action: string;
  dismissed: boolean;
}

export interface KPIData {
  totalActiveDeals: number;
  totalActiveDealsDelta: number;
  readyForSubmission: number;
  readyForSubmissionDelta: number;
  avgApprovalRate: number;
  avgApprovalRateDelta: number;
  avgTimeToApproval: number;
  avgTimeToApprovalDelta: number;
  totalVolumeFinanced: number;
  totalVolumeFinancedDelta: number;
  dealsAtRisk: number;
  dealsAtRiskDelta: number;
}

export const PIPELINE_STAGES: DealStage[] = [
  'Prospection',
  'Qualification',
  'Documentation',
  'Analysis',
  'Simulation',
  'Submission',
  'Bank Review',
  'Approved',
  'Negotiation',
  'Deed',
  'Closed',
];

export const STAGE_COLORS: Record<DealStage, string> = {
  Prospection: '#94A3B8',
  Qualification: '#64748B',
  Documentation: '#F59E0B',
  Analysis: '#3B82F6',
  Simulation: '#8B5CF6',
  Submission: '#06B6D4',
  'Bank Review': '#F97316',
  Approved: '#10B981',
  Negotiation: '#EC4899',
  Deed: '#14B8A6',
  Closed: '#0F1B2D',
};

export const mockDeals: Deal[] = [
  {
    id: 'D-2024-001',
    clientName: 'Miguel Ferreira',
    clientAvatar: 'MF',
    participants: [
      { id: 'p1', name: 'Miguel Ferreira', avatar: 'MF', role: 'titular', nif: '123456789', income: 4200 },
      { id: 'p2', name: 'Ana Ferreira', avatar: 'AF', role: 'conjugue', nif: '987654321', income: 2800 },
    ],
    amount: 285000,
    stage: 'Bank Review',
    risk: 'low',
    readinessScore: 92,
    approvalProbability: 87,
    missingDocs: [],
    bank: 'Millennium BCP',
    taeg: 3.8,
    term: 30,
    createdAt: '2024-11-01',
    updatedAt: '2024-12-18',
    dueDate: '2024-12-22',
    agent: 'Ana Costa',
    propertyValue: 320000,
    ltv: 89,
    monthlyIncome: 4200,
    documents: [
      { id: 'd1', name: 'Declaração IRS', status: 'validated', updatedAt: '2024-12-10' },
      { id: 'd2', name: 'Recibos de Vencimento', status: 'validated', updatedAt: '2024-12-10' },
      { id: 'd3', name: 'Caderneta Predial', status: 'validated', updatedAt: '2024-12-08' },
      { id: 'd4', name: 'Certidão Permanente', status: 'validated', updatedAt: '2024-12-08' },
      { id: 'd5', name: 'Comprovativo Residência', status: 'validated', updatedAt: '2024-12-05' },
    ],
    notes: 'Cliente com perfil sólido. Primeira habitação. Aprovação muito provável.',
  },
  {
    id: 'D-2024-002',
    clientName: 'Sofia Rodrigues',
    clientAvatar: 'SR',
    participants: [
      { id: 'p1', name: 'Sofia Rodrigues', avatar: 'SR', role: 'titular', nif: '234567890', income: 2800 },
    ],
    amount: 195000,
    stage: 'Documentation',
    risk: 'high',
    readinessScore: 54,
    approvalProbability: 61,
    missingDocs: ['Declaração IRS 2023', 'Certidão Nascimento'],
    bank: 'Caixa Geral',
    taeg: 4.1,
    term: 25,
    createdAt: '2024-11-15',
    updatedAt: '2024-12-17',
    dueDate: '2024-12-20',
    agent: 'João Santos',
    propertyValue: 210000,
    ltv: 93,
    monthlyIncome: 2800,
    documents: [
      { id: 'd1', name: 'Declaração IRS', status: 'missing', updatedAt: '' },
      { id: 'd2', name: 'Recibos de Vencimento', status: 'received', updatedAt: '2024-12-15' },
      { id: 'd3', name: 'Caderneta Predial', status: 'validated', updatedAt: '2024-12-10' },
      { id: 'd4', name: 'Certidão Nascimento', status: 'missing', updatedAt: '' },
      { id: 'd5', name: 'Comprovativo Residência', status: 'received', updatedAt: '2024-12-14' },
    ],
    notes: 'LTV elevado. Necessário reforço de documentação urgente.',
  },
  {
    id: 'D-2024-003',
    clientName: 'Carlos Mendes',
    clientAvatar: 'CM',
    participants: [
      { id: 'p1', name: 'Carlos Mendes', avatar: 'CM', role: 'titular', nif: '345678901', income: 7500 },
      { id: 'p2', name: 'Luísa Mendes', avatar: 'LM', role: 'co-titular', nif: '345678902', income: 3200 },
      { id: 'p3', name: 'Paulo Mendes', avatar: 'PM', role: 'fiador', nif: '345678903', income: 4100 },
    ],
    amount: 420000,
    stage: 'Approved',
    risk: 'low',
    readinessScore: 98,
    approvalProbability: 99,
    missingDocs: [],
    bank: 'Santander',
    taeg: 3.5,
    term: 35,
    createdAt: '2024-10-20',
    updatedAt: '2024-12-16',
    dueDate: '2024-12-30',
    agent: 'Ana Costa',
    propertyValue: 480000,
    ltv: 87,
    monthlyIncome: 7500,
    documents: [
      { id: 'd1', name: 'Declaração IRS', status: 'validated', updatedAt: '2024-11-20' },
      { id: 'd2', name: 'Recibos de Vencimento', status: 'validated', updatedAt: '2024-11-20' },
      { id: 'd3', name: 'Caderneta Predial', status: 'validated', updatedAt: '2024-11-18' },
      { id: 'd4', name: 'Certidão Permanente', status: 'validated', updatedAt: '2024-11-18' },
      { id: 'd5', name: 'Comprovativo Residência', status: 'validated', updatedAt: '2024-11-15' },
    ],
    notes: 'Negócio aprovado. Aguardar marcação de escritura.',
  },
  {
    id: 'D-2024-004',
    clientName: 'Inês Oliveira',
    clientAvatar: 'IO',
    participants: [
      { id: 'p1', name: 'Inês Oliveira', avatar: 'IO', role: 'titular', nif: '456789012', income: 2200 },
      { id: 'p2', name: 'Tiago Oliveira', avatar: 'TO', role: 'co-titular', nif: '456789013', income: 1900 },
    ],
    amount: 165000,
    stage: 'Simulation',
    risk: 'medium',
    readinessScore: 71,
    approvalProbability: 74,
    missingDocs: ['Extrato Bancário 6 meses'],
    bank: 'BPI',
    taeg: 4.3,
    term: 30,
    createdAt: '2024-12-01',
    updatedAt: '2024-12-18',
    dueDate: '2024-12-28',
    agent: 'Pedro Lima',
    propertyValue: 185000,
    ltv: 89,
    monthlyIncome: 2200,
    documents: [
      { id: 'd1', name: 'Declaração IRS', status: 'validated', updatedAt: '2024-12-05' },
      { id: 'd2', name: 'Recibos de Vencimento', status: 'validated', updatedAt: '2024-12-05' },
      { id: 'd3', name: 'Caderneta Predial', status: 'received', updatedAt: '2024-12-10' },
      { id: 'd4', name: 'Extrato Bancário', status: 'missing', updatedAt: '' },
      { id: 'd5', name: 'Comprovativo Residência', status: 'validated', updatedAt: '2024-12-08' },
    ],
    notes: 'Simulação em curso. Taxa de esforço aceitável.',
  },
  {
    id: 'D-2024-005',
    clientName: 'António Pereira',
    clientAvatar: 'AP',
    participants: [
      { id: 'p1', name: 'António Pereira', avatar: 'AP', role: 'titular', nif: '567890123', income: 5100 },
    ],
    amount: 310000,
    stage: 'Negotiation',
    risk: 'medium',
    readinessScore: 85,
    approvalProbability: 79,
    missingDocs: [],
    bank: 'Novo Banco',
    taeg: 3.9,
    term: 30,
    createdAt: '2024-11-05',
    updatedAt: '2024-12-17',
    dueDate: '2024-12-25',
    agent: 'João Santos',
    propertyValue: 350000,
    ltv: 88,
    monthlyIncome: 5100,
    documents: [
      { id: 'd1', name: 'Declaração IRS', status: 'validated', updatedAt: '2024-11-15' },
      { id: 'd2', name: 'Recibos de Vencimento', status: 'validated', updatedAt: '2024-11-15' },
      { id: 'd3', name: 'Caderneta Predial', status: 'validated', updatedAt: '2024-11-12' },
      { id: 'd4', name: 'Certidão Permanente', status: 'validated', updatedAt: '2024-11-12' },
      { id: 'd5', name: 'Seguro Vida', status: 'received', updatedAt: '2024-12-10' },
    ],
    notes: 'Negociação em curso. Cliente considera oferta do Santander.',
  },
  {
    id: 'D-2024-006',
    clientName: 'Mariana Silva',
    clientAvatar: 'MS',
    participants: [
      { id: 'p1', name: 'Mariana Silva', avatar: 'MS', role: 'titular', nif: '678901234', income: 1600 },
    ],
    amount: 125000,
    stage: 'Qualification',
    risk: 'critical',
    readinessScore: 32,
    approvalProbability: 38,
    missingDocs: ['Declaração IRS 2022', 'Declaração IRS 2023', 'Extratos 12 meses'],
    bank: 'Abanca',
    taeg: 4.8,
    term: 40,
    createdAt: '2024-12-10',
    updatedAt: '2024-12-18',
    dueDate: '2024-12-21',
    agent: 'Pedro Lima',
    propertyValue: 140000,
    ltv: 89,
    monthlyIncome: 1600,
    documents: [
      { id: 'd1', name: 'Declaração IRS 2022', status: 'missing', updatedAt: '' },
      { id: 'd2', name: 'Declaração IRS 2023', status: 'missing', updatedAt: '' },
      { id: 'd3', name: 'Recibos de Vencimento', status: 'received', updatedAt: '2024-12-15' },
      { id: 'd4', name: 'Extratos Bancários', status: 'missing', updatedAt: '' },
      { id: 'd5', name: 'Comprovativo Residência', status: 'expired', updatedAt: '2024-10-01' },
    ],
    notes: 'Perfil de alto risco. Taxa de esforço acima do limite. Considerar recusar.',
  },
  {
    id: 'D-2024-007',
    clientName: 'Rui Carvalho',
    clientAvatar: 'RC',
    participants: [
      { id: 'p1', name: 'Rui Carvalho', avatar: 'RC', role: 'titular', nif: '789012345', income: 6200 },
      { id: 'p2', name: 'Sandra Carvalho', avatar: 'SC', role: 'conjugue', nif: '789012346', income: 3400 },
    ],
    amount: 380000,
    stage: 'Submission',
    risk: 'low',
    readinessScore: 89,
    approvalProbability: 83,
    missingDocs: [],
    bank: 'Millennium BCP',
    taeg: 3.7,
    term: 30,
    createdAt: '2024-11-20',
    updatedAt: '2024-12-16',
    dueDate: '2024-12-19',
    agent: 'Ana Costa',
    propertyValue: 430000,
    ltv: 88,
    monthlyIncome: 6200,
    documents: [
      { id: 'd1', name: 'Declaração IRS', status: 'validated', updatedAt: '2024-12-01' },
      { id: 'd2', name: 'Recibos de Vencimento', status: 'validated', updatedAt: '2024-12-01' },
      { id: 'd3', name: 'Caderneta Predial', status: 'validated', updatedAt: '2024-11-28' },
      { id: 'd4', name: 'Certidão Permanente', status: 'validated', updatedAt: '2024-11-28' },
      { id: 'd5', name: 'Comprovativo Residência', status: 'validated', updatedAt: '2024-11-25' },
    ],
    notes: 'Pronto para submissão. Toda documentação validada.',
  },
  {
    id: 'D-2024-008',
    clientName: 'Beatriz Sousa',
    clientAvatar: 'BS',
    participants: [
      { id: 'p1', name: 'Beatriz Sousa', avatar: 'BS', role: 'titular', nif: '890123456', income: 3800 },
    ],
    amount: 220000,
    stage: 'Analysis',
    risk: 'medium',
    readinessScore: 67,
    approvalProbability: 69,
    missingDocs: ['Avaliação Imóvel'],
    bank: 'Caixa Geral',
    taeg: 4.0,
    term: 30,
    createdAt: '2024-11-28',
    updatedAt: '2024-12-15',
    dueDate: '2024-12-26',
    agent: 'João Santos',
    propertyValue: 255000,
    ltv: 86,
    monthlyIncome: 3800,
    documents: [
      { id: 'd1', name: 'Declaração IRS', status: 'validated', updatedAt: '2024-12-05' },
      { id: 'd2', name: 'Recibos de Vencimento', status: 'validated', updatedAt: '2024-12-05' },
      { id: 'd3', name: 'Avaliação Imóvel', status: 'missing', updatedAt: '' },
      { id: 'd4', name: 'Caderneta Predial', status: 'validated', updatedAt: '2024-12-03' },
      { id: 'd5', name: 'Comprovativo Residência', status: 'validated', updatedAt: '2024-12-01' },
    ],
    notes: 'Análise em curso. Aguardar avaliação do imóvel.',
  },
];

export const mockBankProposals: BankProposal[] = [
  {
    id: 'BP-001',
    bank: 'Millennium BCP',
    bankLogo: 'BCP',
    taeg: 3.78,
    tin: 3.45,
    spread: 1.20,
    euribor: '6M',
    monthlyPayment: 1285,
    totalCost: 462600,
    processingFee: 650,
    insurance: 42,
    fixedPeriod: 0,
    score: 88,
    recommended: true,
    pros: ['Spread mais competitivo', 'Processo rápido (15 dias)', 'Sem comissão de amortização'],
    cons: ['Seguro obrigatório BCP', 'Taxa variável'],
  },
  {
    id: 'BP-002',
    bank: 'Caixa Geral de Depósitos',
    bankLogo: 'CGD',
    taeg: 4.12,
    tin: 3.78,
    spread: 1.45,
    euribor: '12M',
    monthlyPayment: 1340,
    totalCost: 482400,
    processingFee: 480,
    insurance: 38,
    fixedPeriod: 5,
    score: 74,
    recommended: false,
    pros: ['Período fixo de 5 anos', 'Processo estabelecido', 'Baixo custo processual'],
    cons: ['TAEG mais elevado', 'Menor flexibilidade', 'Spread alto'],
  },
  {
    id: 'BP-003',
    bank: 'Santander',
    bankLogo: 'STD',
    taeg: 3.95,
    tin: 3.60,
    spread: 1.35,
    euribor: '6M',
    monthlyPayment: 1312,
    totalCost: 472320,
    processingFee: 550,
    insurance: 40,
    fixedPeriod: 3,
    score: 81,
    recommended: false,
    pros: ['Bom equilíbrio fixo/variável', 'Seguro competitivo', 'Processo digital'],
    cons: ['Prazo fixo curto', 'Comissão amortização 2%'],
  },
];

export const mockAlerts: Alert[] = [
  {
    id: 'A-001',
    type: 'urgent',
    title: 'Documento expirado',
    description: 'Comprovativo de residência de Mariana Silva expirou há 45 dias.',
    dealId: 'D-2024-006',
    clientName: 'Mariana Silva',
    timestamp: '2024-12-18T09:30:00',
    action: 'Solicitar Agora',
    dismissed: false,
  },
  {
    id: 'A-002',
    type: 'urgent',
    title: 'Prazo de submissão iminente',
    description: 'Deal Rui Carvalho deve ser submetido hoje — prazo expira às 18h.',
    dealId: 'D-2024-007',
    clientName: 'Rui Carvalho',
    timestamp: '2024-12-18T08:15:00',
    action: 'Submeter Agora',
    dismissed: false,
  },
  {
    id: 'A-003',
    type: 'warning',
    title: 'Documentação incompleta',
    description: 'Sofia Rodrigues tem 2 documentos em falta para avançar.',
    dealId: 'D-2024-002',
    clientName: 'Sofia Rodrigues',
    timestamp: '2024-12-18T08:00:00',
    action: 'Ver Documentos',
    dismissed: false,
  },
  {
    id: 'A-004',
    type: 'success',
    title: 'Proposta aprovada!',
    description: 'Santander aprovou proposta de Carlos Mendes — €420.000.',
    dealId: 'D-2024-003',
    clientName: 'Carlos Mendes',
    timestamp: '2024-12-18T07:45:00',
    action: 'Agendar Escritura',
    dismissed: false,
  },
  {
    id: 'A-005',
    type: 'info',
    title: 'Lembrete cliente',
    description: 'António Pereira aguarda contacto sobre proposta do Novo Banco.',
    dealId: 'D-2024-005',
    clientName: 'António Pereira',
    timestamp: '2024-12-17T16:30:00',
    action: 'Contactar Cliente',
    dismissed: false,
  },
  {
    id: 'A-006',
    type: 'warning',
    title: 'LTV acima do limite',
    description: 'Sofia Rodrigues com LTV de 93% — acima do limite recomendado de 90%.',
    dealId: 'D-2024-002',
    clientName: 'Sofia Rodrigues',
    timestamp: '2024-12-17T14:00:00',
    action: 'Rever Proposta',
    dismissed: false,
  },
];

export const mockKPIs: KPIData = {
  totalActiveDeals: 47,
  totalActiveDealsDelta: 12.5,
  readyForSubmission: 8,
  readyForSubmissionDelta: -2.1,
  avgApprovalRate: 78.4,
  avgApprovalRateDelta: 3.2,
  avgTimeToApproval: 23,
  avgTimeToApprovalDelta: -8.5,
  totalVolumeFinanced: 12800000,
  totalVolumeFinancedDelta: 18.7,
  dealsAtRisk: 6,
  dealsAtRiskDelta: 15.3,
};

export const mockChartData = {
  approvalRateTrend: [
    { month: 'Jul', rate: 71 },
    { month: 'Ago', rate: 68 },
    { month: 'Set', rate: 74 },
    { month: 'Out', rate: 76 },
    { month: 'Nov', rate: 75 },
    { month: 'Dez', rate: 78 },
  ],
  dealDuration: [
    { stage: 'Prospection', days: 3 },
    { stage: 'Qualificação', days: 5 },
    { stage: 'Documentação', days: 8 },
    { stage: 'Análise', days: 6 },
    { stage: 'Simulação', days: 4 },
    { stage: 'Submissão', days: 2 },
    { stage: 'Banco', days: 15 },
    { stage: 'Aprovação', days: 5 },
    { stage: 'Escritura', days: 10 },
  ],
  stageConversion: [
    { stage: 'Prospection', count: 120, rate: 100 },
    { stage: 'Qualificação', count: 89, rate: 74 },
    { stage: 'Documentação', count: 72, rate: 60 },
    { stage: 'Análise', count: 61, rate: 51 },
    { stage: 'Simulação', count: 55, rate: 46 },
    { stage: 'Submissão', count: 48, rate: 40 },
    { stage: 'Aprovado', count: 38, rate: 32 },
    { stage: 'Escritura', count: 31, rate: 26 },
  ],
  volumePerBank: [
    { bank: 'Millennium BCP', volume: 4200000 },
    { bank: 'Santander', volume: 3100000 },
    { bank: 'Caixa Geral', volume: 2800000 },
    { bank: 'BPI', volume: 1900000 },
    { bank: 'Novo Banco', volume: 800000 },
  ],
};

export const stageDeals: Record<DealStage, { count: number; value: number; urgency: 'normal' | 'attention' | 'urgent' }> = {
  Prospection: { count: 12, value: 2400000, urgency: 'normal' },
  Qualification: { count: 8, value: 1850000, urgency: 'normal' },
  Documentation: { count: 7, value: 1620000, urgency: 'attention' },
  Analysis: { count: 5, value: 1340000, urgency: 'normal' },
  Simulation: { count: 4, value: 980000, urgency: 'normal' },
  Submission: { count: 3, value: 870000, urgency: 'urgent' },
  'Bank Review': { count: 4, value: 1150000, urgency: 'attention' },
  Approved: { count: 2, value: 720000, urgency: 'normal' },
  Negotiation: { count: 1, value: 310000, urgency: 'attention' },
  Deed: { count: 1, value: 420000, urgency: 'urgent' },
  Closed: { count: 0, value: 0, urgency: 'normal' },
};

export const mockClients = [
  {
    id: 'C-001',
    name: 'Miguel Ferreira',
    email: 'miguel.ferreira@email.com',
    phone: '+351 912 345 678',
    avatar: 'MF',
    activeDeals: 1,
    totalFinanced: 285000,
    status: 'active',
    segment: 'Premium',
    since: '2023-06-15',
    nif: '123456789',
    income: 4200,
  },
  {
    id: 'C-002',
    name: 'Sofia Rodrigues',
    email: 'sofia.rodrigues@email.com',
    phone: '+351 913 456 789',
    avatar: 'SR',
    activeDeals: 1,
    totalFinanced: 195000,
    status: 'at_risk',
    segment: 'Standard',
    since: '2024-09-01',
    nif: '234567890',
    income: 2800,
  },
  {
    id: 'C-003',
    name: 'Carlos Mendes',
    email: 'carlos.mendes@email.com',
    phone: '+351 914 567 890',
    avatar: 'CM',
    activeDeals: 1,
    totalFinanced: 420000,
    status: 'approved',
    segment: 'VIP',
    since: '2022-03-20',
    nif: '345678901',
    income: 7500,
  },
  {
    id: 'C-004',
    name: 'Inês Oliveira',
    email: 'ines.oliveira@email.com',
    phone: '+351 915 678 901',
    avatar: 'IO',
    activeDeals: 1,
    totalFinanced: 165000,
    status: 'active',
    segment: 'Standard',
    since: '2024-10-15',
    nif: '456789012',
    income: 2200,
  },
  {
    id: 'C-005',
    name: 'António Pereira',
    email: 'antonio.pereira@email.com',
    phone: '+351 916 789 012',
    avatar: 'AP',
    activeDeals: 1,
    totalFinanced: 310000,
    status: 'active',
    segment: 'Premium',
    since: '2023-11-08',
    nif: '567890123',
    income: 5100,
  },
  {
    id: 'C-006',
    name: 'Mariana Silva',
    email: 'mariana.silva@email.com',
    phone: '+351 917 890 123',
    avatar: 'MS',
    activeDeals: 1,
    totalFinanced: 125000,
    status: 'at_risk',
    segment: 'Standard',
    since: '2024-12-01',
    nif: '678901234',
    income: 1600,
  },
];

export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `€${(value / 1000000).toFixed(1)}M`;
  }
  return `€${value.toLocaleString('pt-PT')}`;
}

export function formatFullCurrency(value: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
