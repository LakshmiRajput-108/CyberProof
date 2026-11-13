import React, { useState, useEffect } from 'react';
import { useAppData } from '../context/AppDataContext';
import { HistoryService } from '../services/historyService';
import { RiskBadge } from '../components/ui/RiskBadge';
import { Button } from '../components/ui/Button';
import { DemoBadge } from '../components/ui/DemoBadge';
import { 
  Search, 
  History, 
  ArrowRight, 
  Calendar 
} from 'lucide-react';
import { RiskLevel, AnalysisType } from '../types/scan';
import { WebsiteHistory } from '../types/history';
import { TrustScore } from '../components/ui/TrustScore';

export const HistoryView: React.FC = () => {
  const { navigateTo } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<AnalysisType | 'ALL'>('ALL');
  const [uniqueHistories, setUniqueHistories] = useState<WebsiteHistory[]>([]);

  useEffect(() => {
    HistoryService.getAllUniqueDomains().then(setUniqueHistories);
  }, []);

  const filteredHistories = uniqueHistories.filter(item => {
    const matchesSearch = item.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRisk === 'ALL' || item.current_risk === selectedRisk;
    const matchesType = selectedType === 'ALL' || item.scans.some(s => s.analysis_type === selectedType);
    return matchesSearch && matchesRisk && matchesType;
  });

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'Improving':
        return <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Improving ↗</span>;
      case 'Worsening':
        return <span className="text-xs font-mono font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">Worsening ↘</span>;
      case 'Needs Attention':
        return <span className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">Needs Attention ⚠️</span>;
      case 'Stable':
        return <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">Stable →</span>;
      default:
        return <span className="text-xs font-mono text-slate-400">Baseline</span>;
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Recorded Scans
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Security History
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Search previously checked targets, compare chronological changes, and inspect evidence trends.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigateTo('scan')}
          >
            New Analysis
          </Button>
        </div>
      </div>

      {/* History Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10">
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Analyses</span>
          <strong className="block mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">{uniqueHistories.reduce((n,h)=>n+h.scan_count,0)}</strong>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10">
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Tracked Websites</span>
          <strong className="block mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">{uniqueHistories.length}</strong>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10">
          <span className="text-[10px] uppercase tracking-wider text-slate-400">High Risk Flagged</span>
          <strong className="block mt-1 text-2xl font-extrabold text-rose-600 dark:text-rose-400">{uniqueHistories.filter(h=>h.current_risk==='HIGH').length}</strong>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search domains or targets..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <span className="text-xs font-medium text-slate-400 whitespace-nowrap">Risk:</span>
          {(['ALL', 'LOW', 'MEDIUM', 'HIGH', 'UNKNOWN'] as const).map(r => (
            <button
              key={r}
              onClick={() => setSelectedRisk(r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedRisk === r
                  ? 'bg-teal-600 text-white dark:bg-teal-500 dark:text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <span className="text-xs font-medium text-slate-400 whitespace-nowrap">Type:</span>
          {(['ALL', 'url', 'qr', 'email', 'message', 'otp-situation'] as const).map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedType === t
                  ? 'bg-slate-800 text-white dark:bg-white/20 dark:text-white font-bold'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* History Items Grid */}
      {filteredHistories.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 text-center space-y-3">
          <History className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Matching History</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or risk filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredHistories.map(hist => {
            const latestScan = hist.scans[0];
            const dateStr = new Date(hist.last_scan).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={hist.domain}
                onClick={() => navigateTo('website-detail', { domain: hist.domain, scan: latestScan })}
                className="p-5 rounded-2xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 hover:border-teal-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <TrustScore scan={latestScan} size="sm" showLabel={false} showStatus={false} />
                    <h3 className="text-base font-extrabold font-mono text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
                      {hist.domain}
                    </h3>
                    <RiskBadge risk={hist.current_risk} size="sm" />
                    {getTrendBadge(hist.trend)}
                    {latestScan.is_demo && <DemoBadge />}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-2xl">
                    {latestScan.summary}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
                    <span>{hist.scan_count} scan{hist.scan_count > 1 ? 's' : ''} on record</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Last checked: {dateStr}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-white/5">
                  <Button
                    variant="outline"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />}
                  >
                    Inspect Detail & Delta
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
