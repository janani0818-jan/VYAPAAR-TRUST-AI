import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, MSMEProfile } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  currentMSME: MSMEProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  launchDemo: () => Promise<void>;
  refreshCurrentMSME: () => Promise<void>;
  setCurrentMSMEById: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('vt_token'));
  const [currentMSME, setCurrentMSME] = useState<MSMEProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initAuth() {
      if (token) {
        try {
          const { user } = await api.getCurrentUser(token);
          setUser(user);
          if (user.msmeId) {
            const msme = await api.getMSMEProfile(user.msmeId);
            setCurrentMSME(msme);
          } else {
            const defaultMsme = await api.getMSMEProfile('msme_abc_textiles');
            setCurrentMSME(defaultMsme);
          }
        } catch (err) {
          console.error('Failed to restore session:', err);
          logout();
        }
      }
      setLoading(false);
    }
    initAuth();
  }, [token]);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await api.login(email, pass);
      setToken(res.token);
      localStorage.setItem('vt_token', res.token);
      setUser(res.user);

      if (res.user.msmeId) {
        const msme = await api.getMSMEProfile(res.user.msmeId);
        setCurrentMSME(msme);
      } else {
        const defaultMsme = await api.getMSMEProfile('msme_abc_textiles');
        setCurrentMSME(defaultMsme);
      }
    } finally {
      setLoading(false);
    }
  };

  const launchDemo = async () => {
    setLoading(true);
    try {
      const res = await api.login('owner@vyapaartrust.demo', 'Demo@123');
      setToken(res.token);
      localStorage.setItem('vt_token', res.token);
      setUser(res.user);
      const msme = await api.getMSMEProfile('msme_abc_textiles');
      setCurrentMSME(msme);
    } finally {
      setLoading(false);
    }
  };

  const refreshCurrentMSME = async () => {
    if (currentMSME) {
      const updated = await api.getMSMEProfile(currentMSME.id);
      setCurrentMSME(updated);
    }
  };

  const setCurrentMSMEById = async (id: string) => {
    const updated = await api.getMSMEProfile(id);
    setCurrentMSME(updated);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCurrentMSME(null);
    localStorage.removeItem('vt_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        currentMSME,
        loading,
        login,
        logout,
        launchDemo,
        refreshCurrentMSME,
        setCurrentMSMEById,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
