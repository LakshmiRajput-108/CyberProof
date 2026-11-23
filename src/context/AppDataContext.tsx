
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Scan, RiskLevel } from '../types/scan';
import { WatchlistItem } from '../types/watchlist';
import { ApiHttpError } from '../services/apiClient';
import { apiFetch } from '../services/apiClient';
import { WatchlistService } from '../services/watchlistService';
import { normalizeDomain } from '../services/domainUtils';
import { useAuth } from './AuthContext';

export type AppView =
  | 'landing'
  | 'scan'
  | 'dashboard'
  | 'result'
  | 'history'
  | 'website-detail'
  | 'incident-check'
  | 'threat-pulse'
  | 'learn'
  | 'watchlist'
  | 'profile'
  | 'account'
  | 'membership'
  | 'extension-preview'
  | 'help-center'
  | 'developers';

interface NavigationParams {
  scan?: Scan;
  domain?: string;
  articleId?: string;
  tab?: string;
  url?: string;
  urlRequestId?: number;
}

interface AppDataContextType {
  activeView: AppView;
  currentParams: NavigationParams;
  scans: Scan[];
  watchlist: WatchlistItem[];
  savedDataLoading: boolean;
  savedDataError: string | null;
  guestSessionError: string | null;
  selectedScan: Scan | null;
  selectedDomain: string | null;
  navigateTo: (view: AppView, params?: NavigationParams) => void;
  setSelectedScan: (scan: Scan | null) => void;
  setSelectedDomain: (domain: string | null) => void;
  refreshData: () => Promise<void>;
  retryGuestSession: () => Promise<void>;
  addScanRecord: (scan: Scan) => void;
  toggleWatchlist: (domain: string, target?: string, currentRisk?: RiskLevel) => Promise<void>;
  isWatchlisted: (domain: string) => boolean;
  clearAllHistory: () => void;
  resetDemoData: () => void;
  isPremium: boolean;
  setIsPremium: (value: boolean) => void;
  goBack: () => void;
  goForward: () => void;
}

interface AppHistoryState {
  cpView?: AppView;
  cpParams?: NavigationParams;
  cpOwner?: string | null;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    token,
    user,
    loading: authLoading,
    guest,
    guestLoading,
    ensureGuestSession,
    sessionVerificationError,
    retrySessionVerification,
  } = useAuth();

  const [activeView, setActiveView] = useState<AppView>('landing');
  const [currentParams, setCurrentParams] = useState<NavigationParams>({});
  const [scans, setScans] = useState<Scan[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loadedOwnerKey, setLoadedOwnerKey] = useState<string | null>(null);
  const [savedDataLoading, setSavedDataLoading] = useState(true);
  const [savedDataError, setSavedDataError] = useState<string | null>(null);
  const [guestSessionError, setGuestSessionError] = useState<string | null>(null);
  const [selectedScanState, setSelectedScanState] = useState<Scan | null>(null);
  const [selectedScanOwnerKey, setSelectedScanOwnerKey] = useState<string | null>(null);
  const [selectedDomainState, setSelectedDomainState] = useState<string | null>(null);
  const [selectedDomainOwnerKey, setSelectedDomainOwnerKey] = useState<string | null>(null);
  const [currentParamsOwnerKey, setCurrentParamsOwnerKey] = useState<string | null>(null);
  const watchlistMutationsInFlight = useRef(new Set<string>());
  const [isPremium, setIsPremium] = useState(false);
  const ownerKey = token
    ? `member:${token}`
    : guest
      ? `guest:${guest.sessionId}`
      : null;
  const historyOwner = user
    ? `member:${user.id}`
    : guest
      ? `guest:${guest.sessionId}`
      : null;
  const currentOwnerRef = useRef<string | null>(ownerKey);
  const historyOwnerRef = useRef<string | null>(historyOwner);
  currentOwnerRef.current = ownerKey;
  historyOwnerRef.current = historyOwner;
  const visibleScans = ownerKey !== null && loadedOwnerKey === ownerKey ? scans : [];
  const visibleWatchlist = ownerKey !== null && loadedOwnerKey === ownerKey ? watchlist : [];
  const selectedScan = ownerKey !== null && selectedScanOwnerKey === ownerKey ? selectedScanState : null;
  const selectedDomain = ownerKey !== null && selectedDomainOwnerKey === ownerKey ? selectedDomainState : null;
  const visibleCurrentParams = ownerKey !== null && currentParamsOwnerKey === ownerKey
    ? currentParams
    : {};

  const setSelectedScan = (scan: Scan | null) => {
    setSelectedScanState(scan);
    setSelectedScanOwnerKey(scan ? ownerKey : null);
  };

  const setSelectedDomain = (domain: string | null) => {
    setSelectedDomainState(domain);
    setSelectedDomainOwnerKey(domain ? ownerKey : null);
  };

  useEffect(() => {
    const validView = (value: string | null | undefined): AppView => {
      const views: AppView[] = [
        'landing',
        'scan',
        'dashboard',
        'result',
        'history',
        'website-detail',
        'incident-check',
        'threat-pulse',
        'learn',
        'watchlist',
        'profile',
        'account',
        'membership',
        'extension-preview',
        'help-center',
        'developers',
      ];
      return value && views.includes(value as AppView) ? value as AppView : 'landing';
    };

    const restoreFromHistory = () => {
      const state = window.history.state as AppHistoryState | null;
      const ownsEntry = state?.cpOwner === historyOwnerRef.current;
      const params = ownsEntry ? state?.cpParams || {} : {};
      const restoredView = validView(
        state?.cpView || new URLSearchParams(window.location.search).get('view')
      );

      setActiveView(restoredView);
      setCurrentParams(params);
      setCurrentParamsOwnerKey(ownsEntry ? currentOwnerRef.current : null);
      setSelectedScanState(params.scan || null);
      setSelectedScanOwnerKey(params.scan && ownsEntry ? currentOwnerRef.current : null);
      setSelectedDomainState(params.domain || null);
      setSelectedDomainOwnerKey(params.domain && ownsEntry ? currentOwnerRef.current : null);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    window.history.replaceState(
      { cpView: 'landing', cpParams: {}, cpOwner: historyOwnerRef.current },
      '',
      window.location.pathname
    );
    window.addEventListener('popstate', restoreFromHistory);
    return () => window.removeEventListener('popstate', restoreFromHistory);
  }, []);

  const refreshData = useCallback(async (): Promise<void> => {
    const requestOwnerKey = token
      ? `member:${token}`
      : guest
        ? `guest:${guest.sessionId}`
        : null;

    if (sessionVerificationError) {
      setSavedDataError(null);
      setSavedDataLoading(true);
      retrySessionVerification();
      return;
    }

    if (!requestOwnerKey) {
      setScans([]);
      setWatchlist([]);
      setLoadedOwnerKey(null);
      setSavedDataError(null);
      setSavedDataLoading(false);
      return;
    }

    setSavedDataLoading(true);
    setSavedDataError(null);

    try {
      let nextScans: Scan[] = [];
      let nextWatchlist: WatchlistItem[];

      if (token) {
        const scansRes = await apiFetch('/api/history');

        if (scansRes.ok) {
          const grouped = await scansRes.json();
          for (const group of grouped) {
            nextScans = nextScans.concat(group.scans || []);
          }
        } else if (scansRes.status === 401) {
          return;
        } else {
          throw new Error('Could not fetch account history.');
        }

        nextWatchlist = await WatchlistService.getWatchlist();
      } else {
        const [scansRes, watchlistData] = await Promise.all([
          apiFetch('/api/guest/history'),
          WatchlistService.getWatchlist(),
        ]);

        if (scansRes.ok) {
          nextScans = await scansRes.json();
        } else {
          throw new ApiHttpError(scansRes.status);
        }

        nextWatchlist = watchlistData;
      }

      if (currentOwnerRef.current !== requestOwnerKey) return;

      setScans(nextScans);
      setWatchlist(nextWatchlist);
      setLoadedOwnerKey(requestOwnerKey);
    } catch (error) {
      console.error('Failed to refresh application data:', error);
      if (currentOwnerRef.current === requestOwnerKey) {
        if (!token && error instanceof ApiHttpError && error.status === 401) {
          setGuestSessionError('Your guest session could not be verified. Retry the guest session to continue.');
        } else {
          setSavedDataError(
            error instanceof Error
              ? error.message
              : 'Could not load your saved scans and watchlist.'
          );
        }
      }
    } finally {
      if (currentOwnerRef.current === requestOwnerKey) {
        setSavedDataLoading(false);
      }
    }
  }, [token, guest, sessionVerificationError, retrySessionVerification]);

  const initializeGuestSession = useCallback(async (): Promise<void> => {
    setGuestSessionError(null);
    setSavedDataError(null);
    setSavedDataLoading(true);
    try {
      await ensureGuestSession();
    } catch (error) {
      console.error('Guest session initialization failed:', error);
      setGuestSessionError('Could not start your guest session. Check your connection and retry.');
      setSavedDataLoading(false);
    }
  }, [ensureGuestSession]);

  useEffect(() => {
    if (authLoading) return;

    if (sessionVerificationError) {
      setSavedDataError(sessionVerificationError);
      setSavedDataLoading(false);
      return;
    }

    if (token) {
      setGuestSessionError(null);
      void refreshData();
      return;
    }

    if (guestSessionError) {
      setSavedDataLoading(false);
      return;
    }

    if (!guest && !guestLoading) {
      void initializeGuestSession();
      return;
    }

    if (guest) {
      void refreshData();
    }
  }, [
    authLoading,
    token,
    guest,
    guestLoading,
    guestSessionError,
    initializeGuestSession,
    sessionVerificationError,
    refreshData,
  ]);

  const retryGuestSession = useCallback(async (): Promise<void> => {
    await initializeGuestSession();
  }, [initializeGuestSession]);

  const navigateTo = (view: AppView, params?: NavigationParams) => {
    setActiveView(view);
    const nextParams = params || {};
    setCurrentParams(nextParams);
    setCurrentParamsOwnerKey(ownerKey);
    if (params?.scan) setSelectedScan(params.scan);
    if (params?.domain) setSelectedDomain(params.domain);

    const currentState = window.history.state as AppHistoryState | null;
    if (
      currentState?.cpView !== view ||
      JSON.stringify(currentState.cpParams || {}) !== JSON.stringify(nextParams) ||
      currentState.cpOwner !== historyOwner
    ) {
      const url = new URL(window.location.href);
      url.searchParams.set('view', view);
      window.history.pushState(
        { cpView: view, cpParams: nextParams, cpOwner: historyOwner },
        '',
        `${url.pathname}${url.search}`
      );
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => window.history.back();
  const goForward = () => window.history.forward();

  const addScanRecord = (newScan: Scan) => {
    if (ownerKey) {
      const currentScans = loadedOwnerKey === ownerKey ? scans : [];
      setScans([newScan, ...currentScans]);
      setLoadedOwnerKey(ownerKey);

      if (loadedOwnerKey === ownerKey) {
        const domain = normalizeDomain(newScan.domain);
        const scanCount = currentScans.filter(
          scan => normalizeDomain(scan.domain) === domain
        ).length + 1;
        setWatchlist(prev => prev.map(item => (
          normalizeDomain(item.domain) === domain
            ? {
                ...item,
                scan_count: scanCount,
                current_risk: newScan.risk_level,
                last_checked: newScan.created_at,
              }
            : item
        )));
      }
    }
    setSelectedScan(newScan);
    setSelectedDomain(newScan.domain);
  };

  const isWatchlisted = (domain: string): boolean => {
    const clean = normalizeDomain(domain);
    return visibleWatchlist.some(w => normalizeDomain(w.domain) === clean);
  };

  const toggleWatchlist = async (
    domain: string,
    target?: string,
    currentRisk?: RiskLevel
  ): Promise<void> => {
    if (!token && !guest) {
      throw new Error('Your session is not ready yet. Please try again.');
    }

    const clean = normalizeDomain(domain);
    if (watchlistMutationsInFlight.current.has(clean)) return;
    watchlistMutationsInFlight.current.add(clean);

    try {
      const existing = visibleWatchlist.find(
        w => normalizeDomain(w.domain) === clean
      );

      if (existing) {
        await WatchlistService.removeFromWatchlist(existing.id);
      } else {
        await WatchlistService.addToWatchlist({
          domain: clean,
          target: target || `https://${clean}`,
          current_risk: currentRisk || 'UNKNOWN',
          scan_count:
            visibleScans.filter(s => normalizeDomain(s.domain) === clean).length || 1,
        });

      }

      await refreshData();
    } finally {
      watchlistMutationsInFlight.current.delete(clean);
    }
  };

  const clearAllHistory = () => {
    console.warn('Clear history is temporarily unavailable while account security is being implemented.');
  };

  const resetDemoData = () => {
    console.warn('Demo data reset is temporarily unavailable while account security is being implemented.');
  };

  return (
    <AppDataContext.Provider
      value={{
        activeView,
        currentParams: visibleCurrentParams,
        scans: visibleScans,
        watchlist: visibleWatchlist,
        savedDataLoading,
        savedDataError,
        guestSessionError,
        selectedScan,
        selectedDomain,
        navigateTo,
        setSelectedScan,
        setSelectedDomain,
        refreshData,
        retryGuestSession,
        addScanRecord,
        toggleWatchlist,
        isWatchlisted,
        clearAllHistory,
        resetDemoData,
        isPremium,
        setIsPremium,
        goBack,
        goForward,
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
