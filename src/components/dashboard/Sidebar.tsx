'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  GitBranch,
  Briefcase,
  Users,
  FileText,
  Building2,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type Page = 'dashboard' | 'pipeline' | 'deals' | 'clients' | 'documents' | 'bank-proposals' | 'analytics' | 'settings';

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pipeline' as Page, label: 'Pipeline', icon: GitBranch },
  { id: 'deals' as Page, label: 'Deals', icon: Briefcase },
  { id: 'clients' as Page, label: 'Clientes', icon: Users },
  { id: 'documents' as Page, label: 'Documentos', icon: FileText },
  { id: 'bank-proposals' as Page, label: 'Propostas Banco', icon: Building2 },
  { id: 'analytics' as Page, label: 'Analytics', icon: BarChart3 },
];

const bottomItems = [
  { id: 'settings' as Page, label: 'Definições', icon: Settings },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex flex-col bg-white border-r border-[#E8ECF0] transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-56'
      } overflow-hidden flex-shrink-0`}
    >
      {/* Top spacer */}
      <div className="h-4" />

      {/* Main nav */}
      <nav className="flex-1 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-[0_2px_8px_rgba(37,99,235,0.4)]'
                  : 'text-[#64748B] hover:bg-[#F7F8FA] hover:text-[#0F1B2D]'
              }`}
            >
              <Icon className={`flex-shrink-0 transition-all ${collapsed ? 'w-5 h-5' : 'w-4.5 h-4.5'} w-[18px] h-[18px]`} />
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap overflow-hidden">
                  {item.label}
                </span>
              )}
              {!collapsed && isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-3 my-2 h-px bg-[#E8ECF0]" />

      {/* Bottom nav */}
      <div className="px-2 pb-4 space-y-0.5">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${
                isActive
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#64748B] hover:bg-[#F7F8FA] hover:text-[#0F1B2D]'
              }`}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-[#E8ECF0] rounded-full flex items-center justify-center text-[#64748B] hover:text-[#2563EB] hover:border-[#2563EB] transition-all duration-150 z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </aside>
  );
}
