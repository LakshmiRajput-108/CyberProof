import React, { useRef, useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { Button } from '../components/ui/Button';
import { getScannerPrefillUrl } from '../services/scannerService';
import { 
  Bookmark, 
  Trash2, 
  RotateCw, 
  ExternalLink, 
  Search, 
  Info,
  Plus
} from 'lucide-react';
import { WatchlistItem } from '../types/watchlist';
import { TRUST_SCORE_DISCLAIMER, TrustScore } from '../components/ui/TrustScore';
import { findMatchingScan } from '../services/domainUtils';

export const WatchlistView: React.FC = () => {
  const {
    watchlist,
    toggleWatchlist,
    navigateTo,
    scans,
    refreshData,
    savedDataLoading,
    savedDataError,
    guestSessionError,
    retryGuestSession,
  } = useAppData();
  const [filterQuery, setFilterQuery] = useState('');
  const [rescanError, setRescanError] = useState<string | null>(null);
  const [watchlistActionError, setWatchlistActionError] = useState<string | null>(null);
  const [watchlistActionPending, setWatchlistActionPending] = useState(false);
  const watchlistActionInFlight = useRef(false);
  const rescanRequestId = useRef(0);

  const handleWatchlistToggle = async (domain: string) => {
    if (watchlistActionInFlight.current) return;
    watchlistActionInFlight.current = true;
    setWatchlistActionPending(true);
    setWatchlistActionError(null);
    try {
      await toggleWatchlist(domain);
    } catch (error) {
      setWatchlistActionError(
        error instanceof Error
          ? error.message
          : 'Could not update your watchlist. Check your connection or sign in again, then retry.'
      );
    } finally {
      watchlistActionInFlight.current = false;
      setWatchlistActionPending(false);
    }
  };

  const handleRescan = (target: string, domain: string) => {
    const url = getScannerPrefillUrl(target, domain);
    if (!url) {
      setRescanError('This tracked website has no valid HTTP or HTTPS URL to re-scan. Update or re-add it with a valid address.');
      return;
    }

    setRescanError(null);
    rescanRequestId.current += 1;
    navigateTo('scan', {
      tab: 'url',
      url,
      urlRequestId: rescanRequestId.current,
    });
  };

  const filtered = watchlist.filter((item: WatchlistItem) =>
    item.domain.toLowerCase().includes(filterQuery.toLowerCase()) ||
    item.target.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Site Intelligence
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Site Intelligence
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Track websites you have checked, review their heuristic signals, and follow how scores change across your saved scans.
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {TRUST_SCORE_DISCLAIMER}
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigateTo('scan', { tab: 'url' })}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Website to Site Intelligence
        </Button>
      </div>

      {/* Honest Architecture Disclosure */}
      <div className="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/20 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Tracked Website Architecture:</strong> Saved entries are tied to your current account or guest session. A new comparison is available after you run another check; CyberProof does not run background scans.
        </p>
      </div>

      {rescanError && (
        <p role="alert" className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-700 dark:text-rose-300">
          {rescanError}
        </p>
      )}
      {watchlistActionError && (
        <p role="alert" className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-700 dark:text-rose-300">
          {watchlistActionError}
        </p>
      )}

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter tracked websites..."
          value={filterQuery}
          onChange={e => setFilterQuery(e.target.value)}
          className="cp-site-search w-full pl-10 pr-4 py-2 bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
        />
      </div>

      {/* Watchlist Grid */}
      {guestSessionError ? (
        <div role="alert" className="cp-site-card p-8 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-rose-300 dark:border-rose-500/30 text-center space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Guest session unavailable</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{guestSessionError}</p>
          <Button variant="primary" size="sm" onClick={() => void retryGuestSession()}>
            Retry
          </Button>
        </div>
      ) : savedDataError ? (
        <div role="alert" className="cp-site-card p-8 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-rose-300 dark:border-rose-500/30 text-center space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Saved data unavailable</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{savedDataError}</p>
          <Button variant="primary" size="sm" onClick={() => void refreshData()}>
            Retry
          </Button>
        </div>
      ) : savedDataLoading ? (
        <div className="cp-site-card p-8 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 text-center text-sm text-slate-500">
          Loading watchlist...
        </div>
      ) : filtered.length === 0 ? (
        <div className="cp-site-card p-12 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 text-center space-y-3">
          <Bookmark className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No sites tracked yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Save a website from a scan result to build its CyberProof trust history and review it again later.
          </p>
          <Button variant="outline" size="sm" onClick={() => navigateTo('scan')}>
            Scan a Website
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item: WatchlistItem) => {
            const matchingScan = findMatchingScan(item.domain, scans);
            const dateStr = new Date(item.last_checked).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={item.id}
                className="cp-site-card p-6 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 hover:border-teal-500/40 shadow-sm transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[10px] font-mono uppercase text-slate-400">Tracked Website</span>
                      <h3 className="text-base font-extrabold font-mono text-slate-900 dark:text-white truncate">
                        {item.domain}
                      </h3>
                    </div>
                    {matchingScan ? (
                      <TrustScore scan={matchingScan} size="sm" showLabel={false} showStatus={false} />
                    ) : (
                      <span
                        role="status"
                        className="shrink-0 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2.5 py-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400"
                      >
                        Not analyzed
                      </span>
                    )}
                  </div>

                  {item.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {item.notes}
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-1 text-[11px] font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span>Last recorded assessment:</span>
                      <span className="text-slate-700 dark:text-slate-200 font-medium">{dateStr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recorded evaluations:</span>
                      <span className="text-slate-700 dark:text-slate-200 font-medium">{item.scan_count}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateTo('website-detail', { domain: item.domain })}
                    rightIcon={<ExternalLink className="w-3 h-3" />}
                  >
                    View History
                  </Button>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRescan(item.target, item.domain)}
                      title="Run new scan"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void handleWatchlistToggle(item.domain)}
                      title="Remove from Site Intelligence"
                      disabled={watchlistActionPending}
                      className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
