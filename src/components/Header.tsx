import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Play, LogOut, ShieldCheck, UserCheck, ChevronDown, Building2 } from 'lucide-react';

interface HeaderProps {
  onOpenConsentModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenConsentModal }) => {
  const { user, currentMSME, logout, launchDemo, login } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'msme_owner':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium">MSME Owner</span>;
      case 'lender':
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-medium">Lender Risk Officer</span>;
      case 'admin':
        return <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full font-medium">Platform Admin</span>;
      default:
        return null;
    }
  };

  return (
    <header className="bg-[#050505] border-b border-[#ffffff15] text-[#E0E0E0] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 border border-[#ffffff30] rounded-sm flex items-center justify-center bg-[#0F0F0F]">
            <Shield className="w-5 h-5 text-stone-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif italic text-lg tracking-tight text-white font-normal">VYAPAAR<span className="font-sans not-italic text-stone-400 font-light text-xs tracking-[0.2em] ml-1 uppercase">TRUST</span></span>
              <span className="bg-[#ffffff10] text-stone-300 text-[9px] font-light px-2 py-0.5 rounded-none border border-[#ffffff15] uppercase tracking-[0.25em]">AI Intelligence</span>
            </div>
            <p className="text-[10px] tracking-wider uppercase text-stone-400 hidden sm:block">MSME Financial Trust & Credit Intelligence</p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Account Aggregator Consent Indicator */}
          {onOpenConsentModal && (
            <button
              onClick={onOpenConsentModal}
              className="hidden lg:flex items-center space-x-1.5 bg-[#121212] hover:bg-[#1A1A1A] text-stone-300 text-[11px] tracking-wider uppercase px-3 py-1.5 border border-[#ffffff15] transition"
              title="View Account Aggregator Consent Status"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>AA Consent: Active</span>
              <span className="text-[9px] bg-emerald-950/80 text-emerald-400 px-1.5 py-0.5 border border-emerald-800/50 ml-1">Simulated</span>
            </button>
          )}

          {/* Quick Launch Demo Button */}
          <button
            onClick={() => launchDemo()}
            className="flex items-center space-x-2 border border-[#ffffff] text-white hover:bg-white hover:text-black text-[10px] tracking-[0.25em] uppercase font-light px-4 py-2 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Demo</span>
          </button>

          {/* User Profile & Demo Switcher */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-[#121212] hover:bg-[#1A1A1A] px-3 py-1.5 border border-[#ffffff15] transition text-left"
              >
                <div className="w-6 h-6 rounded-none bg-stone-800 text-stone-200 flex items-center justify-center font-serif text-xs border border-stone-600">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-medium text-stone-200 leading-none">{user.name}</div>
                  <div className="text-[9px] text-stone-400 tracking-wider uppercase mt-0.5">{user.role.replace('_', ' ')}</div>
                </div>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0F0F0F] border border-[#ffffff20] shadow-2xl py-2 z-50 text-xs text-stone-200">
                  <div className="px-4 py-2 border-b border-[#ffffff15]">
                    <p className="font-serif text-white font-medium text-sm">{user.name}</p>
                    <p className="text-stone-400 text-[10px] tracking-wide">{user.email}</p>
                    <div className="mt-2">{getRoleBadge(user.role)}</div>
                  </div>

                  <div className="px-3 py-2 text-[9px] text-stone-500 uppercase tracking-[0.2em] font-light">
                    Switch Demo Account
                  </div>

                  <button
                    onClick={() => {
                      login('owner@vyapaartrust.demo', 'Demo@123');
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#1A1A1A] flex items-center justify-between text-xs ${user.role === 'msme_owner' ? 'text-amber-300 font-medium' : 'text-stone-300'}`}
                  >
                    <span>MSME Owner (ABC Textiles)</span>
                    <Building2 className="w-3.5 h-3.5 text-stone-400" />
                  </button>

                  <button
                    onClick={() => {
                      login('lender@vyapaartrust.demo', 'Demo@123');
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#1A1A1A] flex items-center justify-between text-xs ${user.role === 'lender' ? 'text-emerald-300 font-medium' : 'text-stone-300'}`}
                  >
                    <span>Lender Risk Analyst</span>
                    <UserCheck className="w-3.5 h-3.5 text-stone-400" />
                  </button>

                  <button
                    onClick={() => {
                      login('admin@vyapaartrust.demo', 'Demo@123');
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#1A1A1A] flex items-center justify-between text-xs ${user.role === 'admin' ? 'text-purple-300 font-medium' : 'text-stone-300'}`}
                  >
                    <span>System Admin</span>
                    <Shield className="w-3.5 h-3.5 text-stone-400" />
                  </button>

                  <div className="border-t border-[#ffffff15] mt-2 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-rose-400 hover:bg-[#1A1A1A] flex items-center space-x-2 text-xs"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
