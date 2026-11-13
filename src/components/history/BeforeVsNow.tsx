import React from 'react';
import { DeltaComparison } from '../../types/history';
import { RiskBadge } from '../ui/RiskBadge';
import { ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, Calendar, Activity } from 'lucide-react';

interface BeforeVsNowProps {
  delta: DeltaComparison;
}

export const BeforeVsNow: React.FC<BeforeVsNowProps> = ({ delta }) => {
  if (!delta.has_previous || !delta.previous_scan) {
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 text-center space-y-2">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Before vs Now Comparison
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Insufficient historical scans to perform a delta comparison. A baseline has been established with the current scan.
        </p>
      </div>
    );
  }

  const prevDate = new Date(delta.previous_scan.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const curDate = new Date(delta.current_scan.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formatDiff = (diff: number, inverted: boolean = false) => {
    if (diff === 0) return <span className="text-slate-400 font-mono text-xs">No change</span>;
    const isPositive = diff > 0;
    const isGood = inverted ? !isPositive : isPositive;
    return (
      <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
        isGood 
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
      }`}>
        {isPositive ? `+${diff}` : diff}
      </span>
    );
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400 font-bold">
            Security Change Verification
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Before vs Now Comparison
          </h3>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Strictly calculated from stored scan logs
        </div>
      </div>

      {/* Side by side Assessment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Previous */}
        <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Previous Assessment
            </span>
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {prevDate}
            </span>
          </div>

          <div>
            <RiskBadge risk={delta.previous_risk || 'UNKNOWN'} size="lg" />
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
            {delta.previous_scan.summary}
          </p>
        </div>

        {/* Current */}
        <div className="p-5 rounded-2xl bg-teal-500/[0.04] border border-teal-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Current Assessment
            </span>
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {curDate}
            </span>
          </div>

          <div>
            <RiskBadge risk={delta.current_risk} size="lg" />
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-2">
            {delta.current_scan.summary}
          </p>
        </div>
      </div>

      {/* Delta Metrics Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs md:text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 text-slate-400 text-xs uppercase font-mono">
              <th className="pb-3 font-semibold">Security Parameter</th>
              <th className="pb-3 font-semibold text-center">Previous Scan</th>
              <th className="pb-3 text-center"></th>
              <th className="pb-3 font-semibold text-center">Current Scan</th>
              <th className="pb-3 font-semibold text-right">Net Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            <tr>
              <td className="py-3 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-500" />
                <span>Total Security Checks Evaluated</span>
              </td>
              <td className="py-3 text-center font-mono text-slate-600 dark:text-slate-400">
                {delta.checks_count.previous}
              </td>
              <td className="py-3 text-center text-slate-400">
                <ArrowRight className="w-3.5 h-3.5 mx-auto" />
              </td>
              <td className="py-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                {delta.checks_count.current}
              </td>
              <td className="py-3 text-right">
                {formatDiff(delta.checks_count.diff)}
              </td>
            </tr>

            <tr>
              <td className="py-3 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Signals Requiring Attention</span>
              </td>
              <td className="py-3 text-center font-mono text-slate-600 dark:text-slate-400">
                {delta.attention_count.previous}
              </td>
              <td className="py-3 text-center text-slate-400">
                <ArrowRight className="w-3.5 h-3.5 mx-auto" />
              </td>
              <td className="py-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                {delta.attention_count.current}
              </td>
              <td className="py-3 text-right">
                {/* Decreasing attention points is good */}
                {formatDiff(delta.attention_count.diff, true)}
              </td>
            </tr>

            <tr>
              <td className="py-3 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Positively Verified Signals</span>
              </td>
              <td className="py-3 text-center font-mono text-slate-600 dark:text-slate-400">
                {delta.verified_count.previous}
              </td>
              <td className="py-3 text-center text-slate-400">
                <ArrowRight className="w-3.5 h-3.5 mx-auto" />
              </td>
              <td className="py-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                {delta.verified_count.current}
              </td>
              <td className="py-3 text-right">
                {formatDiff(delta.verified_count.diff)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
