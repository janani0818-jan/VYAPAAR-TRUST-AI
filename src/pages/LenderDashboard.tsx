import React, { useState, useEffect } from 'react';
import { MSMEProfile } from '../types';
import { api } from '../services/api';
import {
  Building2,
  Search,
  Filter,
  Eye,
  GitCompare,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  FileText,
} from 'lucide-react';

interface LenderDashboardProps {
  onSelectMSME: (msmeId: string) => void;
  onCompareMSMEs: (ids: string[]) => void;
  onOpenReportModal: (msme: MSMEProfile) => void;
}

export const LenderDashboard: React.FC<LenderDashboardProps> = ({
  onSelectMSME,
  onCompareMSMEs,
  onOpenReportModal,
}) => {
  const [portfolio, setPortfolio] = useState<MSMEProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [compareList, setCompareList] = useState<string[]>([]);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const res = await api.getLenderPortfolio();
        setPortfolio(res.msmes);
      } catch (err) {
        console.error('Failed to load portfolio:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, []);

  const toggleCompare = (id: string) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter((i) => i !== id));
    } else {
      if (compareList.length >= 3) {
        alert('You can select up to 3 MSMEs for side-by-side comparison.');
        return;
      }
      setCompareList([...compareList, id]);
    }
  };

  const filteredPortfolio = portfolio.filter((m) => {
    const matchesSearch =
      m.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.gstin.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRisk === 'ALL' || m.analysis.riskLevel === selectedRisk;
    return matchesSearch && matchesRisk;
  });

  const lowRiskCount = portfolio.filter((m) => m.analysis.riskLevel === 'Low Risk').length;
  const modRiskCount = portfolio.filter((m) => m.analysis.riskLevel === 'Moderate Risk').length;
  const highRiskCount = portfolio.filter((m) => m.analysis.riskLevel === 'High Risk' || m.analysis.riskLevel === 'Medium-High Risk').length;

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'Low Risk':
        return <span className="bg-emerald-950/60 text-emerald-400 text-[9px] font-light px-2.5 py-0.5 border border-emerald-800/60 uppercase tracking-widest">Low Risk</span>;
      case 'Moderate Risk':
        return <span className="bg-amber-950/60 text-amber-300 text-[9px] font-light px-2.5 py-0.5 border border-amber-800/60 uppercase tracking-widest">Moderate Risk</span>;
      case 'Medium-High Risk':
        return <span className="bg-amber-950/80 text-amber-400 text-[9px] font-light px-2.5 py-0.5 border border-amber-700/80 uppercase tracking-widest">Medium-High Risk</span>;
      case 'High Risk':
        return <span className="bg-rose-950/60 text-rose-300 text-[9px] font-light px-2.5 py-0.5 border border-rose-800/60 uppercase tracking-widest">High Risk</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ffffff10] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-[1px] w-8 bg-stone-600"></span>
            <span className="text-[10px] font-light uppercase tracking-[0.3em] text-stone-400">INSTITUTIONAL UNDERWRITING PORTFOLIO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif italic text-white font-normal">Lender Decision Dashboard</h1>
          <p className="text-xs text-stone-400 font-light mt-1">
            Institutional MSME risk analysis, credit readiness scoring, and side-by-side underwriting decision support
          </p>
        </div>

        {compareList.length > 0 && (
          <button
            onClick={() => onCompareMSMEs(compareList)}
            className="border border-[#ffffff] text-white hover:bg-white hover:text-black text-xs font-light tracking-[0.2em] uppercase px-4 py-2.5 transition-colors flex items-center space-x-2"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare Selected ({compareList.length}/3)</span>
          </button>
        )}
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121212] p-5 border border-[#ffffff15]">
          <span className="text-[10px] font-light text-stone-500 uppercase tracking-[0.2em]">Total Portfolio Size</span>
          <div className="text-3xl font-serif text-white mt-1 font-normal">{portfolio.length}</div>
          <p className="text-[10px] text-stone-500 font-light mt-1">Verified MSME profiles</p>
        </div>

        <div className="bg-[#121212] p-5 border border-emerald-900/40">
          <span className="text-[10px] font-light text-emerald-400 uppercase tracking-[0.2em]">Low Risk MSMEs</span>
          <div className="text-3xl font-serif text-emerald-400 mt-1 font-normal">{lowRiskCount}</div>
          <p className="text-[10px] text-stone-500 font-light mt-1">Score ≥ 80 • Prime Underwriting</p>
        </div>

        <div className="bg-[#121212] p-5 border border-amber-900/40">
          <span className="text-[10px] font-light text-amber-300 uppercase tracking-[0.2em]">Moderate Risk MSMEs</span>
          <div className="text-3xl font-serif text-amber-300 mt-1 font-normal">{modRiskCount}</div>
          <p className="text-[10px] text-stone-500 font-light mt-1">Score 65–79 • Working Capital Review</p>
        </div>

        <div className="bg-[#121212] p-5 border border-rose-900/40">
          <span className="text-[10px] font-light text-rose-400 uppercase tracking-[0.2em]">High Risk MSMEs</span>
          <div className="text-3xl font-serif text-rose-400 mt-1 font-normal">{highRiskCount}</div>
          <p className="text-[10px] text-stone-500 font-light mt-1">Score &lt; 65 • Collateral required</p>
        </div>
      </div>

      {/* Search & Risk Filter Bar */}
      <div className="bg-[#121212] p-4 border border-[#ffffff15] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search MSME name, sector, or GSTIN..."
            className="w-full bg-[#050505] border border-[#ffffff15] pl-9 pr-4 py-2 text-xs text-stone-200 focus:outline-none focus:border-[#ffffff40]"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          {['ALL', 'Low Risk', 'Moderate Risk', 'Medium-High Risk', 'High Risk'].map((risk) => (
            <button
              key={risk}
              onClick={() => setSelectedRisk(risk)}
              className={`text-[10px] font-light uppercase tracking-wider px-3 py-1.5 transition shrink-0 border ${
                selectedRisk === risk
                  ? 'bg-white text-black border-white'
                  : 'bg-[#1A1A1A] text-stone-400 border-[#ffffff10] hover:text-white'
              }`}
            >
              {risk === 'ALL' ? 'All Risk Levels' : risk}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Table */}
      <div className="bg-[#121212] border border-[#ffffff15] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F0F0F] border-b border-[#ffffff15] text-[10px] font-light text-stone-400 uppercase tracking-[0.2em]">
                <th className="p-4">Compare</th>
                <th className="p-4">MSME Entity</th>
                <th className="p-4">Sector</th>
                <th className="p-4">Trust Score</th>
                <th className="p-4">Risk Classification</th>
                <th className="p-4">Credit Readiness</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffffff10] text-xs text-stone-300 font-light">
              {filteredPortfolio.map((m) => {
                const isChecked = compareList.includes(m.id);
                return (
                  <tr key={m.id} className="hover:bg-[#1A1A1A] transition">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCompare(m.id)}
                        className="w-3.5 h-3.5 bg-black border-[#ffffff30] text-amber-300 focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => onSelectMSME(m.id)}
                        className="font-serif text-white hover:text-amber-300 text-left transition block font-normal"
                      >
                        {m.companyName}
                      </button>
                      <span className="text-[10px] text-stone-500 block font-mono">{m.gstin} • {m.location}</span>
                    </td>
                    <td className="p-4 font-light text-stone-400">{m.sector}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1 font-serif text-white">
                        <span className="text-sm font-normal text-amber-300">{m.analysis.trustScore}</span>
                        <span className="text-[10px] text-stone-500 font-sans">/ 100</span>
                      </div>
                    </td>
                    <td className="p-4">{getRiskBadge(m.analysis.riskLevel)}</td>
                    <td className="p-4">
                      <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 border border-emerald-800/60 text-[10px] font-mono">
                        {m.analysis.creditReadinessPct}%
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => onSelectMSME(m.id)}
                        className="p-1.5 text-stone-400 hover:text-white hover:bg-[#222222] transition inline-flex items-center space-x-1"
                        title="View Detailed Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase tracking-wider hidden sm:inline">Inspect</span>
                      </button>
                      <button
                        onClick={() => onOpenReportModal(m)}
                        className="p-1.5 text-stone-400 hover:text-white hover:bg-[#222222] transition inline-flex items-center space-x-1"
                        title="Generate Report"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase tracking-wider hidden sm:inline">Report</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
