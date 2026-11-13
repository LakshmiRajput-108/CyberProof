import React, { createContext, useContext, useState, useEffect } from 'react';
import { Scan, RiskLevel } from '../types/scan';
import { WatchlistItem } from '../types/watchlist';
import { API_BASE_URL } from '../config/api';

import { WatchlistService } from '../services/watchlistService';

export type AppView = 
  | 'landing'
  | 'scan'
  | 'result'
  | 'history'
  | 'website-detail'
  | 'incident-check'
  | 'threat-pulse'
  | 'learn'
  | 'watchlist'
  | 'profile'
  | 'membership'
  | 'extension-preview'
  | 'help-center'
  | 'developers';

interface NavigationParams {
  scan?: Scan;
  domain?: string;
  articleId?: string;
  tab?: string;
}

interface AppDataContextType {
  activeView: AppView;
  currentParams: NavigationParams;
  scans: Scan[];
  watchlist: WatchlistItem[];
  selectedScan: Scan | null;
  selectedDomain: string | null;
  navigateTo: (view: AppView, params?: NavigationParams) => void;
  setSelectedScan: (scan: Scan | null) => void;
  setSelectedDomain: (domain: string | null) => void;
  refreshData: () => void;
  addScanRecord: (scan: Scan) => void;
  toggleWatchlist: (domain: string, target?: string, currentRisk?: RiskLevel) => void;
  isWatchlisted: (domain: string) => boolean;
  clearAllHistory: () => void;
  resetDemoData: () => void;
  isPremium: boolean;
  setIsPremium: (val: boolean) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<AppView>('landing');
  const [currentParams, setCurrentParams] = useState<NavigationParams>({});
  const [scans, setScans] = useState<Scan[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      const scansRes = await fetch(`${API_BASE_URL}/api/history`);
      if (scansRes.ok) {
        const grouped = await scansRes.json();
        let flat: Scan[] = [];
        for (const g of grouped) flat = flat.concat(g.scans);
        setScans(flat);
      }
      const wlRes = await fetch(`${API_BASE_URL}/api/watchlist`);
      if (wlRes.ok) {
        setWatchlist(await wlRes.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const navigateTo = (view: AppView, params?: NavigationParams) => {
    setActiveView(view);
    if (params) {
      setCurrentParams(params);
      if (params.scan) setSelectedScan(params.scan);
      if (params.domain) setSelectedDomain(params.domain);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addScanRecord = (newScan: Scan) => {
    setScans(prev => [newScan, ...prev]);
    setSelectedScan(newScan);
    setSelectedDomain(newScan.domain);
  };

  const isWatchlisted = (domain: string): boolean => {
    const clean = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    return watchlist.some(w => {
      const itemClean = w.domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
      return itemClean === clean;
    });
  };

  const toggleWatchlist = async (domain: string, target?: string, currentRisk?: RiskLevel) => {
    const clean = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    const existing = watchlist.find(w => {
      const itemClean = w.domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
      return itemClean === clean;
    });

    if (existing) {
      await WatchlistService.removeFromWatchlist(existing.id);
    } else {
      await WatchlistService.addToWatchlist({
        domain: clean,
        target: target || `https://${clean}`,
        current_risk: currentRisk || 'UNKNOWN',
        scan_count: scans.filter(s => s.domain.toLowerCase().includes(clean)).length || 1,
      });
    }
    await refreshData();
  };

  const clearAllHistory = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/data/clear`, { method: 'POST' });
      await refreshData();
      setSelectedScan(null);
      setSelectedDomain(null);
    } catch (e) {
      console.error(e);
    }
  };

  const resetDemoData = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/data/reset`, { method: 'POST' });
      await refreshData();
    } catch (e) {
      console.error(e);
    }
  };

  const [isPremium, setIsPremium] = useState<boolean>(false);

  return (
    <AppDataContext.Provider
      value={{
        activeView,
        currentParams,
        scans,
        watchlist,
        selectedScan,
        selectedDomain,
        navigateTo,
        setSelectedScan,
        setSelectedDomain,
        refreshData,
        addScanRecord,
        toggleWatchlist,
        isWatchlisted,
        clearAllHistory,
        resetDemoData,
        isPremium,
        setIsPremium,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = (): AppDataContextType => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
