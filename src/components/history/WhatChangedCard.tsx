import React from 'react';
import { DeltaComparison } from '../../types/history';
import { Sparkles, Check, ArrowRight, Shield } from 'lucide-react';

interface WhatChangedCardProps {
  delta: DeltaComparison;
}

export const WhatChangedCard: React.FC<WhatChangedCardProps> = ({ delta }) => {
  return (
    <div className="p-6 md:p-8 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-4">
      <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
        <Sparkles className="w-5 h-5 shrink-0" />
        <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          What Changed Since Your Last Check?
        </h3>
      </div>

      <div className="space-y-2.5">
        {delta.what_changed_points.map((point, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200/80 dark:border-white/5 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium"
          >
            <div className="p-1 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>{point}</span>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-slate-400 font-mono pt-1">
        * Based exclusively on empirical delta analysis of your stored scan snapshots.
      </p>
    </div>
  );
};
