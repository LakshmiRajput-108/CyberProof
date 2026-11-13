import React from 'react';
import { Scan } from '../../types/scan';
import { RiskBadge } from '../ui/RiskBadge';
import { DemoBadge } from '../ui/DemoBadge';
import { TrustScore } from '../ui/TrustScore';
import { Button } from '../ui/Button';
import { 
  HelpCircle, 
  Bookmark, 
  BookmarkCheck, 
  History, 
  RotateCw, 
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

interface AssessmentHeroProps {
  scan: Scan;
  onOpenWhy: () => void;
  onReScan: () => void;
}

export const AssessmentHero: React.FC<AssessmentHeroProps> = ({
  scan,
  onOpenWhy,
  onReScan,
}) => {
  const { isWatchlisted, toggleWatchlist, navigateTo } = useAppData();
  const watchlisted = isWatchlisted(scan.domain);

  const getRiskBorder = () => {
    switch (scan.risk_level) {
      case 'LOW': return 'border-emerald-500/30 bg-emerald-500/[0.03]';
      case 'MEDIUM': return 'border-amber-500/30 bg-amber-500/[0.03]';
      case 'HIGH': return 'border-rose-500/30 bg-rose-500/[0.03]';
      default: return 'border-slate-500/30 bg-slate-500/[0.03]';
    }
  };

  const formattedDate = new Date(scan.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`p-6 md:p-8 rounded-3xl border ${getRiskBorder()} bg-white dark:bg-cyber-bg-darkCard shadow-lg space-y-6 transition-all`}>
      {/* Top Meta Line */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <RiskBadge risk={scan.risk_level} size="lg" />
          {scan.is_demo && <DemoBadge />}
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <Calendar className="w-3.5 h-3.5" />
          <span>Analyzed {formattedDate}</span>
        </div>
      </div>

      {/* Trust Score + Target */}
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 items-center">
        <TrustScore scan={scan} size="xl" />
        <div className="space-y-2">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono break-all">
            {scan.domain}
          </h1>
          {scan.analysis_type === 'url' && (
            <span className="text-xs text-slate-400 truncate max-w-md hidden sm:inline">
              ({scan.target})
            </span>
          )}
        </div>

          <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
            {scan.summary}
          </p>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-white/5">
        <Button
          variant="primary"
          size="md"
          onClick={onOpenWhy}
          leftIcon={<HelpCircle className="w-4 h-4" />}
          className="shadow-md"
        >
          Why did CyberProof say this?
        </Button>

        <Button
          variant={watchlisted ? 'secondary' : 'outline'}
          size="md"
          onClick={() => toggleWatchlist(scan.domain, scan.target, scan.risk_level)}
          leftIcon={watchlisted ? <BookmarkCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" /> : <Bookmark className="w-4 h-4" />}
        >
          {watchlisted ? 'Tracked in Watchlist' : 'Track This Website'}
        </Button>

        <Button
          variant="outline"
          size="md"
          onClick={() => navigateTo('website-detail', { domain: scan.domain, scan })}
          leftIcon={<History className="w-4 h-4" />}
        >
          View Security History
        </Button>

        <Button
          variant="ghost"
          size="md"
          onClick={onReScan}
          leftIcon={<RotateCw className="w-4 h-4" />}
          title="Re-run assessment"
        >
          Re-check
        </Button>
      </div>
    </div>
  );
};
