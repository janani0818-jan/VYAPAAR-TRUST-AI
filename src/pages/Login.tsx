import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Play, Lock, UserCheck, Building2, ShieldCheck, KeyRound } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, launchDemo, loading } = useAuth();
  const [email, setEmail] = useState('owner@vyapaartrust.demo');
  const [password, setPassword] = useState('Demo@123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const handleSelectDemoUser = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Demo@123');
    login(demoEmail, 'Demo@123').catch((err) => setError(err.message));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20 mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">VYAPAAR<span className="text-blue-400">TRUST</span> AI</h1>
        <p className="mt-2 text-sm text-slate-400 font-medium">MSME Financial Trust Intelligence Platform</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl z-10 px-4">
        {/* Quick Launch Demo Banner */}
        <div className="bg-gradient-to-r from-blue-900/80 to-indigo-900/80 border border-blue-500/40 rounded-2xl p-5 mb-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Play className="w-3.5 h-3.5 fill-blue-300" />
              <span>Instant Hackathon Evaluation</span>
            </div>
            <h3 className="font-extrabold text-lg">Launch Demo Mode Immediately</h3>
            <p className="text-xs text-slate-300 mt-1">
              Automatically logs in as ABC Textiles with full synthetic financial intelligence pre-loaded.
            </p>
          </div>

          <button
            onClick={() => launchDemo()}
            disabled={loading}
            className="w-full sm:w-auto shrink-0 bg-blue-500 hover:bg-blue-400 text-white font-extrabold text-sm px-6 py-3 rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Demo</span>
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-rose-950/80 border border-rose-800 text-rose-300 text-xs p-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-hidden"
                placeholder="owner@vyapaartrust.demo"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-hidden"
                placeholder="Demo@123"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3 rounded-xl shadow-lg transition"
            >
              {loading ? 'Authenticating...' : 'Sign In to Platform'}
            </button>
          </form>

          {/* Demo Accounts Section (Prompt Section 5 Requirement) */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              <KeyRound className="w-4 h-4 text-blue-400" />
              <span>Hackathon Demo Credentials (Click to Login)</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleSelectDemoUser('owner@vyapaartrust.demo')}
                className="w-full text-left bg-slate-950 hover:bg-slate-800/80 border border-slate-800 p-3 rounded-xl transition flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-900/60 text-blue-300 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400">MSME Owner</div>
                    <div className="text-[11px] text-slate-400">owner@vyapaartrust.demo • Demo@123</div>
                  </div>
                </div>
                <span className="text-[10px] bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded border border-blue-800/50">
                  ABC Textiles
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoUser('lender@vyapaartrust.demo')}
                className="w-full text-left bg-slate-950 hover:bg-slate-800/80 border border-slate-800 p-3 rounded-xl transition flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-900/60 text-emerald-300 flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400">Lender Risk Officer</div>
                    <div className="text-[11px] text-slate-400">lender@vyapaartrust.demo • Demo@123</div>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-900/40 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/50">
                  Portfolio View
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoUser('admin@vyapaartrust.demo')}
                className="w-full text-left bg-slate-950 hover:bg-slate-800/80 border border-slate-800 p-3 rounded-xl transition flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-900/60 text-purple-300 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-purple-400">System Administrator</div>
                    <div className="text-[11px] text-slate-400">admin@vyapaartrust.demo • Demo@123</div>
                  </div>
                </div>
                <span className="text-[10px] bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded border border-purple-800/50">
                  System Stats
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
