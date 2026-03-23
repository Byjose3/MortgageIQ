'use client';

import KPIStrip from './KPIStrip';
import PipelineKanban from './PipelineKanban';
import BankProposals from './BankProposals';
import DocumentStatus from './DocumentStatus';
import AlertsPanel from './AlertsPanel';
import PerformanceCharts from './PerformanceCharts';
import { type DealStage } from '@/lib/mock-data';

interface DashboardViewProps {
  onDealClick: (dealId: string) => void;
  onStageClick: (stage: DealStage) => void;
  selectedStage: DealStage | null;
}

export default function DashboardView({ onDealClick, onStageClick, selectedStage }: DashboardViewProps) {
  return (
    <div className="space-y-5">
      {/* KPI Strip */}
      <section>
        <KPIStrip />
      </section>

      {/* Pipeline Kanban */}
      <section>
        <PipelineKanban
          onDealClick={onDealClick}
          onStageClick={onStageClick}
          selectedStage={selectedStage}
        />
      </section>

      {/* Main content: Charts + side panels */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left: Bank proposals + Charts */}
        <div className="xl:col-span-2 space-y-5">
          <BankProposals />
          <PerformanceCharts />
        </div>

        {/* Right: Documents + Alerts */}
        <div className="space-y-5">
          <div className="h-[340px]">
            <DocumentStatus />
          </div>
          <div className="h-[400px]">
            <AlertsPanel />
          </div>
        </div>
      </section>
    </div>
  );
}
