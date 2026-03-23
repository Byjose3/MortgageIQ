'use client';

import { useState, useEffect } from 'react';
import TopNav from '@/components/dashboard/TopNav';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardView from '@/components/dashboard/DashboardView';
import DealIntelligencePanel from '@/components/dashboard/DealIntelligencePanel';
import SearchPalette from '@/components/dashboard/SearchPalette';
import NewDealModal from '@/components/dashboard/NewDealModal';
import PipelinePage from '@/components/pages/PipelinePage';
import DealsPage from '@/components/pages/DealsPage';
import ClientsPage from '@/components/pages/ClientsPage';
import DocumentsPage from '@/components/pages/DocumentsPage';
import AnalyticsPage from '@/components/pages/AnalyticsPage';
import BankProposalsPage from '@/components/pages/BankProposalsPage';
import { mockDeals, type DealStage } from '@/lib/mock-data';

type Page = 'dashboard' | 'pipeline' | 'deals' | 'clients' | 'documents' | 'bank-proposals' | 'analytics' | 'settings';

const PAGE_TITLES: Record<Page, string> = {
  dashboard: 'Dashboard',
  pipeline: 'Pipeline',
  deals: 'Deals',
  clients: 'Clientes',
  documents: 'Documentos',
  'bank-proposals': 'Propostas Bancárias',
  analytics: 'Analytics',
  settings: 'Definições',
};

export default function MortgageIQApp() {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<DealStage | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [newDealOpen, setNewDealOpen] = useState(false);

  const selectedDeal = selectedDealId ? mockDeals.find((d) => d.id === selectedDealId) ?? null : null;

  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleDealClick = (dealId: string) => {
    setSelectedDealId(dealId);
  };

  const handleStageClick = (stage: DealStage) => {
    setSelectedStage(selectedStage === stage ? null : stage);
  };

  const handleNavigate = (page: Page) => {
    setActivePage(page);
    setSelectedDealId(null);
    setSelectedStage(null);
  };

  return (
    <div className="h-screen bg-[#F7F8FA] flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <TopNav
        onNewDeal={() => setNewDealOpen(true)}
        onSearchOpen={() => setSearchOpen(true)}
      />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activePage={activePage} onNavigate={handleNavigate} />

        {/* Content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-[1600px] mx-auto">
            {/* Page header breadcrumb */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wide">MortgageIQ</span>
              <span className="text-[#D1D5DB]">/</span>
              <span className="text-[10px] font-semibold text-[#0F1B2D] uppercase tracking-wide">
                {PAGE_TITLES[activePage]}
              </span>
            </div>

            {/* Page content */}
            {activePage === 'dashboard' && (
              <DashboardView
                onDealClick={handleDealClick}
                onStageClick={handleStageClick}
                selectedStage={selectedStage}
              />
            )}
            {activePage === 'pipeline' && (
              <PipelinePage onDealClick={handleDealClick} />
            )}
            {activePage === 'deals' && (
              <DealsPage onDealClick={handleDealClick} onNewDeal={() => setNewDealOpen(true)} />
            )}
            {activePage === 'clients' && <ClientsPage />}
            {activePage === 'documents' && <DocumentsPage />}
            {activePage === 'bank-proposals' && <BankProposalsPage />}
            {activePage === 'analytics' && <AnalyticsPage />}
            {activePage === 'settings' && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="w-16 h-16 bg-[#F7F8FA] rounded-2xl border border-[#E8ECF0] flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-[#9CA3AF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#0F1B2D] mb-2">Definições</h3>
                <p className="text-sm text-[#64748B] max-w-sm">
                  Configurações da plataforma, perfil de utilizador e preferências em breve.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Deal Intelligence Panel */}
      <DealIntelligencePanel
        deal={selectedDeal}
        onClose={() => setSelectedDealId(null)}
      />

      {/* Search Palette */}
      <SearchPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onDealSelect={handleDealClick}
      />

      {/* New Deal Modal */}
      <NewDealModal
        open={newDealOpen}
        onClose={() => setNewDealOpen(false)}
      />
    </div>
  );
}
