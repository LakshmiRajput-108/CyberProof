import React from 'react';
import { Scan } from '../../types/scan';
import { RiskBadge } from '../ui/RiskBadge';
import { Calendar, ArrowDown, History, CheckCircle, Clock } from 'lucide-react';

interface TimelineViewProps {
  scans: Scan[];
  onSelectScan?: (scan: Scan) => void;
  selectedScanId?: string;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  scans,
  onSelectScan,
  selectedScanId,
}) => {
  if (scans.length <= 1) {
    return (
      <div className="p-8 rounded-2xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          First Scan Recorded
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          This is the first time this target was analyzed in your security history. Run another analysis in the future to compare changes over time.
        </p>
      </div>
    );
  }

  // Sorted ascending by time for the journey view
  const chronological = [...scans].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-teal-500" />
            <span>Security Scan Timeline</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Chronological progression of {scans.length} recorded scans for this domain.
          </p>
        </div>
      </div>

      <div className="relative pl-6 md:pl-8 space-y-8 before:absolute before:left-2.5 md:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-white/10">
        {chronological.map((scan, index) => {
          const isCurrent = index === chronological.length - 1;
          const isFirst = index === 0;
          const isSelected = selectedScanId ? scan.id === selectedScanId : isCurrent;

          const dateStr = new Date(scan.created_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });

          return (
            <div
              key={scan.id}
              onClick={() => onSelectScan && onSelectScan(scan)}
              className={`relative cursor-pointer transition-all ${
                isSelected ? 'scale-[1.01]' : 'opacity-85 hover:opacity-100'
              }`}
            >
              {/* Timeline Dot */}
              <div
                className={`absolute -left-6 md:-left-8 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isCurrent
                    ? 'border-teal-500 bg-teal-500 text-slate-950 shadow-md ring-4 ring-teal-500/20'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-cyber-bg-darkCard text-slate-400'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-slate-950' : 'bg-slate-400'}`} />
              </div>

              {/* Node Card */}
              <div
                className={`p-4 md:p-5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-teal-500/[0.03] border-teal-500/40 shadow-md'
                    : 'bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                      {isFirst ? 'First Scan' : isCurrent ? 'Current Scan' : `Historical Scan #${index + 1}`}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </span>
                  </div>

                  <RiskBadge risk={scan.risk_level} size="sm" />
                </div>

                <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {scan.summary}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{scan.evidence.length} signals evaluated</span>
                  <span className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">
                    {isSelected ? 'Viewing this check' : 'Click to inspect'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
