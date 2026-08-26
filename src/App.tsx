import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AccountAggregatorModal } from './components/AccountAggregatorModal';
import { ReportModal } from './components/ReportModal';
import { Login } from './pages/Login';
import { MSMEDashboard } from './pages/MSMEDashboard';
import { FinancialProfile } from './pages/FinancialProfile';
import { DataUpload } from './pages/DataUpload';
import { TrustAnalysis } from './pages/TrustAnalysis';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { LenderDashboard } from './pages/LenderDashboard';
import { MSMEDetail } from './pages/MSMEDetail';
import { MSMECompare } from './pages/MSMECompare';
import { AdminDashboard } from './pages/AdminDashboard';
import { MSMEProfile } from './types';

const AppContent: React.FC = () => {
  const { user, currentMSME, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedMSMEId, setSelectedMSMEId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState<boolean>(false);
  const [reportModalProfile, setReportModalProfile] = useState<MSMEProfile | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-300">Initializing VyapaarTrust AI Engine...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const handleNavigate = (tab: string) => {
    setSelectedMSMEId(null);
    setCurrentTab(tab);
  };

  const handleSelectMSMEForInspection = (id: string) => {
    setSelectedMSMEId(id);
    setCurrentTab('msme_detail');
  };

  const handleCompareMSMEs = (ids: string[]) => {
    setCompareIds(ids);
    setCurrentTab('lender_compare');
  };

  const handleOpenReportModal = (msme?: MSMEProfile) => {
    if (msme) {
      setReportModalProfile(msme);
    } else if (currentMSME) {
      setReportModalProfile(currentMSME);
    }
  };

  const renderActiveView = () => {
    // If inspecting a specific MSME detail
    if (selectedMSMEId && currentTab === 'msme_detail') {
      return (
        <MSMEDetail
          msmeId={selectedMSMEId}
          onBack={() => handleNavigate('lender_portfolio')}
          onOpenReportModal={handleOpenReportModal}
        />
      );
    }

    // Role or Tab Routing
    switch (currentTab) {
      // MSME Owner Views
      case 'dashboard':
        return (
          <MSMEDashboard
            onNavigate={handleNavigate}
            onOpenReportModal={() => handleOpenReportModal()}
          />
        );
      case 'profile':
        return <FinancialProfile />;
      case 'upload':
        return <DataUpload onUploadSuccess={() => handleNavigate('analysis')} />;
      case 'analysis':
      case 'lender_risk':
        return <TrustAnalysis />;
      case 'recommendations':
        return <RecommendationsPage />;
      case 'reports':
        return <ReportsPage onOpenReportModal={() => handleOpenReportModal()} />;

      // Lender Views
      case 'lender_portfolio':
        return (
          <LenderDashboard
            onSelectMSME={handleSelectMSMEForInspection}
            onCompareMSMEs={handleCompareMSMEs}
            onOpenReportModal={handleOpenReportModal}
          />
        );
      case 'lender_compare':
        return (
          <MSMECompare
            selectedIds={compareIds}
            onBack={() => handleNavigate('lender_portfolio')}
          />
        );

      // Admin Views
      case 'admin_dashboard':
        return <AdminDashboard />;

      default:
        return (
          <MSMEDashboard
            onNavigate={handleNavigate}
            onOpenReportModal={() => handleOpenReportModal()}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] flex flex-col font-sans">
      {/* Top Header Navigation */}
      <Header onOpenConsentModal={() => setIsConsentModalOpen(true)} />

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Role Sidebar */}
        <Sidebar currentTab={currentTab} setCurrentTab={handleNavigate} />

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#050505] border-t border-[#ffffff15] z-40 px-2 py-2.5 flex items-center justify-around text-[10px] text-stone-400">
          <button
            onClick={() => handleNavigate(user.role === 'lender' ? 'lender_portfolio' : user.role === 'admin' ? 'admin_dashboard' : 'dashboard')}
            className="flex flex-col items-center font-medium tracking-widest uppercase text-stone-200"
          >
            <span>Dashboard</span>
          </button>
          <button onClick={() => handleNavigate('analysis')} className="flex flex-col items-center tracking-widest uppercase hover:text-stone-200">
            <span>Analysis</span>
          </button>
          <button onClick={() => handleNavigate('upload')} className="flex flex-col items-center tracking-widest uppercase hover:text-stone-200">
            <span>Upload</span>
          </button>
          <button onClick={() => handleNavigate('reports')} className="flex flex-col items-center tracking-widest uppercase hover:text-stone-200">
            <span>Reports</span>
          </button>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Account Aggregator Consent Modal */}
      <AccountAggregatorModal
        isOpen={isConsentModalOpen}
        onClose={() => setIsConsentModalOpen(false)}
      />

      {/* Financial Intelligence Report Modal */}
      {reportModalProfile && (
        <ReportModal
          msme={reportModalProfile}
          isOpen={!!reportModalProfile}
          onClose={() => setReportModalProfile(null)}
        />
      )}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
