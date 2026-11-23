
import { WatchlistItem } from '../types/watchlist';
import { RiskLevel } from '../types/scan';
import { ApiHttpError, apiFetch } from './apiClient';
import { normalizeDomain } from './domainUtils';

export const WatchlistService = {
  async getWatchlist(): Promise<WatchlistItem[]> {
    const res = await apiFetch('/api/watchlist');
    if (!res.ok) throw new ApiHttpError(res.status);

    const data: unknown = await res.json();
    if (!Array.isArray(data)) throw new Error('The watchlist response was invalid.');
    return data as WatchlistItem[];
  },

  async isWatchlisted(domain: string): Promise<boolean> {
    const wl = await this.getWatchlist();
    const clean = normalizeDomain(domain);

    return wl.some(w => {
      const itemClean = normalizeDomain(w.domain);
      return itemClean === clean;
    });
  },

  async addToWatchlist(item: {
    domain: string;
    target: string;
    current_risk: RiskLevel;
    scan_count?: number;
    notes?: string;
  }): Promise<WatchlistItem> {
    const cleanDomain = normalizeDomain(item.domain);

    const res = await apiFetch('/api/watchlist', {
      method: 'POST',
      body: JSON.stringify({
        domain: cleanDomain,
        target: item.target,
        current_risk: item.current_risk,
        scan_count: item.scan_count,
        notes: item.notes || 'Saved to personal watchlist for future reference.',
      }),
    });

    if (!res.ok) {
      throw new ApiHttpError(res.status);
    }
    return res.json();
  },

  async removeFromWatchlist(id: string): Promise<void> {
    const res = await apiFetch(`/api/watchlist/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new ApiHttpError(res.status);
    }
  },

  async removeByDomain(domain: string): Promise<void> {
    const wl = await this.getWatchlist();
    const clean = normalizeDomain(domain);

    const found = wl.find(w => {
      const itemClean = normalizeDomain(w.domain);
      return itemClean === clean;
    });

    if (found) {
      await this.removeFromWatchlist(found.id);
    }
  },
};
