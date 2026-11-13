import React, { useState, useEffect } from 'react';
import { useAppData } from '../context/AppDataContext';
import { HistoryService } from '../services/historyService';
import { RiskBadge } from '../components/ui/RiskBadge';
import { Button } from '../components/ui/Button';
import { DemoBadge } from '../components/ui/DemoBadge';
import { TimelineView } from '../components/history/TimelineView';
import { BeforeVsNow } from '../components/history/BeforeVsNow';
import { WhatChangedCard } from '../components/history/WhatChangedCard';
import { HistoryStatsCharts } from '../components/history/HistoryStatsCharts';
import { RecommendedAction } from '../components/result/RecommendedAction';
import { TrustScore } from '../components/ui/TrustScore';
import { TrustJourneyChart } from '../components/history/TrustJourneyChart';
import { WhyExplanationDrawer } from '../components/result/WhyExplanationDrawer';
import { 
  ArrowLeft, 
  Bookmark, 
  BookmarkCheck, 
  Calendar, 
  RotateCw, 
  HelpCircle,
  Loader
} from 'lucide-react';
import { Scan } from '../types/scan';
import { WebsiteHistory } from '../types/history';

export const WebsiteDetailView: React.FC = () => {
  const { currentParams, navigateTo, isWatchlisted, toggleWatchlist } = useAppData();
  const [isWhyOpen, setIsWhyOpen] = useState(false);
  const [history, setHistory] = useState<WebsiteHistory | null>(null);
  const [loading, setLoading] = useState(true);

  const domain = currentParams.domain || 'example.com';

  useEffect(() => {
    let mounted = true;
    HistoryService.getWebsiteHistory(domain).then(res => {
      if (mounted) {
        setHistory(res);
        if (res && res.scans.length > 0) {
          setInspectedScan(res.scans[0]);
        }
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [domain]);

  const [inspectedScan, setInspectedScan] = useState<Scan | null>(null);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <Loader className="w-8 h-8 animate-spin mx-auto text-teal-500" />
        <p className="text-xs text-slate-500">Loading history for {domain}...</p>
      </div>
    );
  }

  const scans = history ? history.scans : [];
  const latestScan = scans[0];
  const previousScan = scans.length > 1 ? scans[1] : undefined;

  if (!history || !latestScan) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Domain Not Found</h2>
        <p className="text-xs text-slate-500">No recorded history found for "{domain}".</p>
        <Button variant="primary" onClick={() => navigateTo('history')}>
          Back to History
        </Button>
      </div>
    );
  }

  const delta = HistoryService.calculateDelta(latestScan, previousScan);
  const watchlisted = isWatchlisted(history.domain);

  const lastCheckedDate = new Date(history.last_scan).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Top Breadcrumb Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('history')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Security History</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant={watchlisted ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => toggleWatchlist(history.domain, history.target, history.current_risk)}
            leftIcon={watchlisted ? <BookmarkCheck className="w-3.5 h-3.5 text-teal-500" /> : <Bookmark className="w-3.5 h-3.5" />}
          >
            {watchlisted ? 'Tracked' : 'Track This Website'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigateTo('scan', { tab: 'url' })}
            leftIcon={<RotateCw className="w-3.5 h-3.5" />}
          >
            Re-scan Target
          </Button>
        </div>
      </div>

      {/* Domain Header Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr_auto] gap-6 items-center">
          <TrustScore scan={latestScan} size="lg" />
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Website Security Record
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold font-mono text-slate-900 dark:text-white break-all">
              {history.domain}
            </h1>
          </div>

          <div className="flex items-center gap-2 justify-center md:justify-end">
            {latestScan.is_demo && <DemoBadge />}
            <RiskBadge risk={history.current_risk} size="lg" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/5 pt-4">
          <span className="flex items-center gap-1 font-mono">
            <Calendar className="w-3.5 h-3.5 text-teal-500" />
            Last checked: {lastCheckedDate}
          </span>
          <span>•</span>
          <span className="font-mono">
            {history.scan_count} Total Recorded Assessment{history.scan_count > 1 ? 's' : ''}
          </span>
          <span>•</span>
          <span className="font-mono">
            Security Trend: <strong>{history.trend}</strong>
          </span>
        </div>

        <div className="pt-2 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsWhyOpen(true)}
            leftIcon={<HelpCircle className="w-3.5 h-3.5 text-teal-500" />}
          >
            Why did CyberProof say this?
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateTo('result', { scan: latestScan })}
          >
            View Raw Evidence Matrix →
          </Button>
        </div>
      </div>

      {/* Trust Journey */}
      <TrustJourneyChart scans={history.scans} />

      {/* 1. What Changed Card */}
      <WhatChangedCard delta={delta} />

      {/* 2. Before vs Now Comparison */}
      <BeforeVsNow delta={delta} />

      {/* 3. Security Timeline */}
      <TimelineView
        scans={history.scans}
        onSelectScan={(s: Scan) => {
          setInspectedScan(s);
          navigateTo('result', { scan: s });
        }}
        selectedScanId={inspectedScan?.id}
      />

      {/* 4. Responsive Security Statistics & Evolution Charts */}
      <HistoryStatsCharts scans={history.scans} />

      {/* 5. Recommended Safe Next Steps */}
      <RecommendedAction
        actions={latestScan.recommended_actions}
        risk={latestScan.risk_level}
      />

      {/* Why Explanation Drawer */}
      <WhyExplanationDrawer
        scan={latestScan}
        isOpen={isWhyOpen}
        onClose={() => setIsWhyOpen(false)}
      />
    </div>
  );
};
