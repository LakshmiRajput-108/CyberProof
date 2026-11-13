import { Scan } from '../types/scan';
import { WatchlistItem } from '../types/watchlist';
import { UserPreferences, UserProfile } from '../types/user';
import { INITIAL_DEMO_SCANS, INITIAL_WATCHLIST } from './mockData';

const STORAGE_KEYS = {
  SCANS: 'cyberproof_scans_v1',
  WATCHLIST: 'cyberproof_watchlist_v1',
  PREFERENCES: 'cyberproof_preferences_v1',
  PROFILE: 'cyberproof_profile_v1',
};

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  saveHistoryLocally: true,
  reducedMotion: false,
  compactCards: false,
  showDemoBadges: true,
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Security Explorer',
  plan: 'free',
  joinedDate: 'September 2026',
  analysesCount: 5,
};

export const StorageService = {
  // Scans
  getScans(): Scan[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SCANS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not parse stored scans from localStorage', e);
    }
    // Initialize with demo scans
    this.saveScans(INITIAL_DEMO_SCANS);
    return INITIAL_DEMO_SCANS;
  },

  saveScans(scans: Scan[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(scans));
    } catch (e) {
      console.warn('Could not save scans to localStorage', e);
    }
  },

  addScan(scan: Scan): void {
    const current = this.getScans();
    // Place new scan at the start
    const updated = [scan, ...current];
    this.saveScans(updated);
  },

  clearScans(): void {
    localStorage.removeItem(STORAGE_KEYS.SCANS);
  },

  // Watchlist
  getWatchlist(): WatchlistItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not parse stored watchlist', e);
    }
    this.saveWatchlist(INITIAL_WATCHLIST);
    return INITIAL_WATCHLIST;
  },

  saveWatchlist(items: WatchlistItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save watchlist to localStorage', e);
    }
  },

  addWatchlistItem(item: WatchlistItem): void {
    const current = this.getWatchlist();
    const existingIndex = current.findIndex(w => w.domain.toLowerCase() === item.domain.toLowerCase());
    if (existingIndex >= 0) {
      current[existingIndex] = item;
      this.saveWatchlist([...current]);
    } else {
      this.saveWatchlist([item, ...current]);
    }
  },

  removeWatchlistItem(id: string): void {
    const current = this.getWatchlist();
    this.saveWatchlist(current.filter(w => w.id !== id));
  },

  // Preferences
  getPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (stored) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Could not load preferences', e);
    }
    return DEFAULT_PREFERENCES;
  },

  savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...prefs };
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save preferences', e);
    }
    return updated;
  },

  // Profile
  getProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (stored) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Could not load profile', e);
    }
    return DEFAULT_PROFILE;
  },

  saveProfile(profile: Partial<UserProfile>): UserProfile {
    const current = this.getProfile();
    const updated = { ...current, ...profile };
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save profile', e);
    }
    return updated;
  },

  // Reset demo state
  resetToDemoDefaults(): void {
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(INITIAL_DEMO_SCANS));
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(INITIAL_WATCHLIST));
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(DEFAULT_PREFERENCES));
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
  }
};
