import React, { useState, useEffect } from 'react';
import { AdminStats } from '../types';
import { api } from '../services/api';
import { Building2, FileSpreadsheet, Activity, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !stats) {
    return <div className="p-8 text-slate-500">Loading System Administration Console...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#ffffff10] pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-[1px] w-8 bg-stone-600"></span>
          <span className="text-[10px] font-light uppercase tracking-[0.3em] text-stone-400">PLATFORM GOVERNANCE & AUDIT CONSOLE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif italic text-white font-normal">System Administration</h1>
        <p className="text-xs text-stone-400 font-light mt-1">
          Platform performance metrics, registered datasets, user activity audit logs, and scoring engine health
        </p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121212] p-5 border border-[#ffffff15]">
          <span className="text-[10px] font-light text-stone-500 uppercase tracking-[0.2em]">Registered MSMEs</span>
          <div className="text-3xl font-serif text-white mt-1 font-normal">{stats.registeredMsmes}</div>
          <p className="text-[10px] text-stone-500 font-light mt-1">Active enterprise profiles</p>
        </div>

        <div className="bg-[#121212] p-5 border border-[#ffffff15]">
          <span className="text-[10px] font-light text-stone-500 uppercase tracking-[0.2em]">Uploaded Datasets</span>
          <div className="text-3xl font-serif text-amber-300 mt-1 font-normal">{stats.uploadedDatasets}</div>
          <p className="text-[10px] text-stone-500 font-light mt-1">GST, Bank, UPI & Invoices</p>
        </div>

        <div className="bg-[#121212] p-5 border border-[#ffffff15]">
          <span className="text-[10px] font-light text-stone-500 uppercase tracking-[0.2em]">Analyses Executed</span>
          <div className="text-3xl font-serif text-emerald-400 mt-1 font-normal">{stats.analysesCompleted}</div>
          <p className="text-[10px] text-stone-500 font-light mt-1">Real-time Trust Score runs</p>
        </div>

        <div className="bg-[#121212] p-5 border border-[#ffffff15]">
          <span className="text-[10px] font-light text-stone-500 uppercase tracking-[0.2em]">Average Trust Score</span>
          <div className="text-3xl font-serif text-white mt-1 font-normal">{stats.avgTrustScore} <span className="text-xs font-sans text-stone-500">/ 100</span></div>
          <p className="text-[10px] text-stone-500 font-light mt-1">Mean platform rating</p>
        </div>
      </div>

      {/* System Activity Audit Logs */}
      <div className="bg-[#121212] p-6 border border-[#ffffff15] space-y-4">
        <div className="flex items-center justify-between border-b border-[#ffffff10] pb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-amber-300" />
            <h3 className="font-serif font-medium text-white text-base">System Audit Activity Log</h3>
          </div>
          <span className="text-[9px] font-light bg-[#1A1A1A] text-stone-300 px-2.5 py-1 border border-[#ffffff10] uppercase tracking-widest">
            Live Audit Stream
          </span>
        </div>

        <div className="divide-y divide-[#ffffff10] text-xs font-light text-stone-300">
          {stats.recentActivities.map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between hover:bg-[#1A1A1A] transition px-2">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-[10px] text-stone-500 w-20 shrink-0">{log.timestamp}</span>
                <span className="font-mono text-[9px] text-stone-300 bg-[#1A1A1A] px-2 py-0.5 border border-[#ffffff10] uppercase">{log.type}</span>
                <span className="text-stone-200 font-light">{log.description}</span>
              </div>
              <span className="text-stone-500 font-light text-[10px] shrink-0 ml-2">by {log.user}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
