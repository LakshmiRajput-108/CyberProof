import React from 'react';
import { useAppData } from '../context/AppDataContext';
import { RiskBadge } from '../components/ui/RiskBadge';
import { Button } from '../components/ui/Button';
import { 
  History, 
  Bookmark, 
  ArrowRight, 
  Clock, 
  Plus
} from 'lucide-react';
import { HistoryService } from '../services/historyService';
import { WebsiteHistory } from '../types/history';

export const DashboardView: React.FC = () => {
  const { scans, watchlist, navigateTo } = useAppData();

  const [uniqueHistories, setUniqueHistories] = React.useState<WebsiteHistory[]>([]);
  React.useEffect(() => {
    HistoryService.getAllUniqueDomains().then(setUniqueHistories);
  }, []);
  
  const multiScanDomain = uniqueHistories.find(h => h.scan_count >= 2) || uniqueHistories[0];

  const recentScans = scans.slice(0, 5);

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 md:p-8 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Personal Security Dashboard
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Digital Trust Overview
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Monitor verified websites, inspect recent scan snapshots, and evaluate security changes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigateTo('scan')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Start New Scan
          </Button>
        </div>
      </div>

      {/* Real Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Recorded Analyses</span>
            <History className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
            {scans.length}
          </div>
          <p className="text-[11px] text-slate-400">
            Total scan snapshots saved in your storage
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Tracked Websites</span>
            <Bookmark className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
            {watchlist.length}
          </div>
          <p className="text-[11px] text-slate-400">
            Saved to your personal watchlist
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">High Risk Flagged</span>
            <span className="text-xs font-bold text-rose-500">Alert</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
            {scans.filter(s => s.risk_level === 'HIGH').length}
          </div>
          <p className="text-[11px] text-slate-400">
            Targets with deceptive or suspicious markers
          </p>
        </div>
      </div>

      {/* Security Over Time Snapshot Card */}
      {multiScanDomain ? (
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-teal-500/[0.04] to-slate-50 dark:to-white/[0.02] border border-teal-500/30 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-white/10 pb-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400 font-bold">
                Security Over Time Snapshot
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                {multiScanDomain.domain}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold">
                {multiScanDomain.scan_count} Scans Recorded
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateTo('website-detail', { domain: multiScanDomain.domain })}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                View Full History
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 py-2">
            {multiScanDomain.scans.slice().reverse().map((s: any, idx: number) => (
              <React.Fragment key={s.id}>
                <div className="flex-1 p-3.5 rounded-2xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 w-full sm:w-auto">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                    <span>Scan #{idx + 1}</span>
                    <span>{new Date(s.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <RiskBadge risk={s.risk_level} size="sm" />
                </div>
                {idx < multiScanDomain.scans.length - 1 && (
                  <span className="text-teal-500 hidden sm:inline font-bold">→</span>
                )}
              </React.Fragment>
            ))}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            {multiScanDomain.trend === 'Improving' && '✓ Assessment improved since first recorded scan as transport security and identity parameters matured.'}
            {multiScanDomain.trend === 'Stable' && 'Assessment remained consistent across all recorded check intervals.'}
            {multiScanDomain.trend === 'Needs Attention' && '⚠️ Identified parameters currently warrant caution.'}
            {multiScanDomain.trend === 'Insufficient Historical Data' && 'First scan baseline established.'}
          </p>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 text-center text-xs text-slate-500">
          No previous scans available yet. Run a website analysis to generate security tracking.
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-500" />
              <span>Recent Analyses</span>
            </h3>
            <button
              onClick={() => navigateTo('history')}
              className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
            >
              See All ({scans.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {recentScans.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No scans recorded yet.</p>
            ) : (
              recentScans.map(scan => (
                <div
                  key={scan.id}
                  onClick={() => navigateTo('result', { scan })}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 hover:border-teal-500/40 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <p className="font-mono text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-500 transition-colors">
                      {scan.domain}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {new Date(scan.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <RiskBadge risk={scan.risk_level} size="sm" />
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-teal-500" />
              <span>Tracked Websites (Watchlist)</span>
            </h3>
            <button
              onClick={() => navigateTo('watchlist')}
              className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
            >
              Manage ({watchlist.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {watchlist.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No websites saved in watchlist yet.</p>
            ) : (
              watchlist.slice(0, 4).map(item => (
                <div
                  key={item.id}
                  onClick={() => navigateTo('website-detail', { domain: item.domain })}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 hover:border-teal-500/40 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <p className="font-mono text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-500 transition-colors">
                      {item.domain}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {item.scan_count} assessments • Last: {new Date(item.last_checked).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <RiskBadge risk={item.current_risk} size="sm" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
