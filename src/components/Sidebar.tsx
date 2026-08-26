import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Upload,
  BarChart3,
  Lightbulb,
  FileText,
  Users,
  GitCompare,
  PieChart,
  ShieldAlert,
  Building,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { user } = useAuth();
  const role = user?.role || 'msme_owner';

  const renderNavGroup = () => {
    if (role === 'msme_owner') {
      return (
        <div className="space-y-1">
          <div className="px-3 py-2 text-[9px] font-light text-stone-500 uppercase tracking-[0.3em]">
            MSME Owner Menu
          </div>
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 text-xs tracking-wider uppercase font-light transition ${
              currentTab === 'dashboard'
                ? 'bg-[#181818] text-white border-l-2 border-amber-400 font-normal'
                : 'text-stone-400 hover:bg-[#121212] hover:text-stone-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-stone-400" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab('profile')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 text-xs tracking-wider uppercase font-light transition ${
              currentTab === 'profile'
                ? 'bg-[#181818] text-white border-l-2 border-amber-400 font-normal'
                : 'text-stone-400 hover:bg-[#121212] hover:text-stone-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-stone-400" />
            <span>Financial Profile</span>
          </button>

          <button
            onClick={() => setCurrentTab('upload')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 text-xs tracking-wider uppercase font-light transition ${
              currentTab === 'upload'
                ? 'bg-[#181818] text-white border-l-2 border-amber-400 font-normal'
                : 'text-stone-400 hover:bg-[#121212] hover:text-stone-200'
            }`}
          >
            <Upload className="w-4 h-4 text-stone-400" />
            <span>Data Upload</span>
          </button>

          <button
            onClick={() => setCurrentTab('analysis')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 text-xs tracking-wider uppercase font-light transition ${
              currentTab === 'analysis'
                ? 'bg-[#181818] text-white border-l-2 border-amber-400 font-normal'
                : 'text-stone-400 hover:bg-[#121212] hover:text-stone-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-stone-400" />
            <span>Trust Analysis</span>
          </button>

          <button
            onClick={() => setCurrentTab('recommendations')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 text-xs tracking-wider uppercase font-light transition ${
              currentTab === 'recommendations'
                ? 'bg-[#181818] text-white border-l-2 border-amber-400 font-normal'
                : 'text-stone-400 hover:bg-[#121212] hover:text-stone-200'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-stone-400" />
            <span>Recommendations</span>
          </button>

          <button
            onClick={() => setCurrentTab('reports')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 text-xs tracking-wider uppercase font-light transition ${
              currentTab === 'reports'
                ? 'bg-[#181818] text-white border-l-2 border-amber-400 font-normal'
                : 'text-stone-400 hover:bg-[#121212] hover:text-stone-200'
            }`}
          >
            <FileText className="w-4 h-4 text-stone-400" />
            <span>Reports</span>
          </button>
        </div>
      );
    }

    if (role === 'lender') {
      return (
        <div className="space-y-1">
          <div className="px-3 py-2 text-[9px] font-light text-stone-500 uppercase tracking-[0.3em]">
            Lender Decision Menu
          </div>
          <button
            onClick={() => setCurrentTab('lender_portfolio')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 text-xs tracking-wider uppercase font-light transition ${
              currentTab === 'lender_portfolio'
                ? 'bg-[#181818] text-white border-l-2 border-emerald-400 font-normal'
                : 'text-stone-400 hover:bg-[#121212] hover:text-stone-200'
            }`}
          >
            <Building className="w-4 h-4 text-stone-400" />
            <span>MSME Portfolio</span>
          </button>

          <button
            onClick={() => setCurrentTab('lender_risk')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 text-xs tracking-wider uppercase font-light transition ${
              currentTab === 'lender_risk'
                ? 'bg-[#181818] text-white border-l-2 border-emerald-400 font-normal'
                : 'text-stone-400 hover:bg-[#121212] hover:text-stone-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-stone-400" />
            <span>Risk Analysis</span>
          </button>

          <button
            onClick={() => setCurrentTab('lender_compare')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 text-xs tracking-wider uppercase font-light transition ${
              currentTab === 'lender_compare'
                ? 'bg-[#181818] text-white border-l-2 border-emerald-400 font-normal'
                : 'text-stone-400 hover:bg-[#121212] hover:text-stone-200'
            }`}
          >
            <GitCompare className="w-4 h-4 text-stone-400" />
            <span>Compare MSMEs</span>
          </button>

          <button
            onClick={() => setCurrentTab('reports')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 text-xs tracking-wider uppercase font-light transition ${
              currentTab === 'reports'
                ? 'bg-[#181818] text-white border-l-2 border-emerald-400 font-normal'
                : 'text-stone-400 hover:bg-[#121212] hover:text-stone-200'
            }`}
          >
            <FileText className="w-4 h-4 text-stone-400" />
            <span>Reports & Exports</span>
          </button>
        </div>
      );
    }

    if (role === 'admin') {
      return (
        <div className="space-y-1">
          <div className="px-3 py-2 text-[9px] font-light text-stone-500 uppercase tracking-[0.3em]">
            Admin System Menu
          </div>
          <button
            onClick={() => setCurrentTab('admin_dashboard')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 text-xs tracking-wider uppercase font-light transition ${
              currentTab === 'admin_dashboard'
                ? 'bg-[#181818] text-white border-l-2 border-purple-400 font-normal'
                : 'text-stone-400 hover:bg-[#121212] hover:text-stone-200'
            }`}
          >
            <PieChart className="w-4 h-4 text-stone-400" />
            <span>Platform Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab('lender_portfolio')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 text-xs tracking-wider uppercase font-light transition ${
              currentTab === 'lender_portfolio'
                ? 'bg-[#181818] text-white border-l-2 border-purple-400 font-normal'
                : 'text-stone-400 hover:bg-[#121212] hover:text-stone-200'
            }`}
          >
            <Users className="w-4 h-4 text-stone-400" />
            <span>Registered MSMEs</span>
          </button>
        </div>
      );
    }
  };

  return (
    <aside className="w-64 bg-[#050505] border-r border-[#ffffff15] min-h-[calc(100vh-4rem)] p-4 hidden md:block shrink-0">
      <div className="flex flex-col justify-between h-full">
        <div>{renderNavGroup()}</div>

        {/* Prototype Demo Footer */}
        <div className="pt-6 border-t border-[#ffffff15]">
          <div className="bg-[#0F0F0F] p-3 border border-[#ffffff10] text-xs">
            <div className="flex items-center space-x-2 text-stone-300 text-[10px] tracking-widest uppercase font-light mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Prelims Demo Active</span>
            </div>
            <p className="text-[10px] text-stone-500 leading-tight font-light">
              VyapaarTrust AI Hackathon Prototype with deterministic demo connectors.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
