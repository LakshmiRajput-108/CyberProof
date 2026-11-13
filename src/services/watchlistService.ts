import { WatchlistItem } from '../types/watchlist';
import { RiskLevel } from '../types/scan';
import { API_BASE_URL } from '../config/api';

export const WatchlistService = {
  async getWatchlist(): Promise<WatchlistItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/watchlist`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async isWatchlisted(domain: string): Promise<boolean> {
    const wl = await this.getWatchlist();
    const clean = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    return wl.some(w => {
      const itemClean = w.domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
      return itemClean === clean;
    });
  },

  async addToWatchlist(item: { domain: string; target: string; current_risk: RiskLevel; scan_count?: number; notes?: string }): Promise<WatchlistItem | null> {
    const cleanDomain = item.domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    try {
      const res = await fetch(`${API_BASE_URL}/api/watchlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: cleanDomain,
          target: item.target,
          current_risk: item.current_risk,
          notes: item.notes || 'Saved to personal watchlist for future reference.',
        })
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async removeFromWatchlist(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/api/watchlist/${id}`, { method: 'DELETE' });
    } catch {}
  },

  async removeByDomain(domain: string): Promise<void> {
    const wl = await this.getWatchlist();
    const clean = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    const found = wl.find(w => {
      const itemClean = w.domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
      return itemClean === clean;
    });
    if (found) {
      try {
        await fetch(`${API_BASE_URL}/api/watchlist/${found.id}`, { method: 'DELETE' });
      } catch {}
    }
  }
};
