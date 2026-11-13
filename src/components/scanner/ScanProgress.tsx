import React from 'react';
import { ScanStage } from '../../types/scan';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface ScanProgressProps {
  stage: ScanStage;
  percent: number;
  message: string;
}

export const ScanProgress: React.FC<ScanProgressProps> = ({ stage, percent, message }) => {
  const steps = [
    { key: 'preparing', label: 'Preparing analysis' },
    { key: 'checking', label: 'Checking available signals' },
    { key: 'organizing', label: 'Organizing evidence' },
    { key: 'explaining', label: 'Preparing explanation' },
  ];

  const getStepStatus = (stepKey: string) => {
    const order = ['preparing', 'checking', 'organizing', 'explaining', 'complete'];
    const currentIndex = order.indexOf(stage);
    const stepIndex = order.indexOf(stepKey);

    if (currentIndex > stepIndex || stage === 'complete') return 'completed';
    if (currentIndex === stepIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 md:p-8 rounded-2xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 mb-2">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
          {message}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          CyberProof is inspecting observable technical markers and reputation signals.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>Processing signals</span>
          <span>{percent}%</span>
        </div>
      </div>

      {/* Steps List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {steps.map(step => {
          const status = getStepStatus(step.key);
          return (
            <div
              key={step.key}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                status === 'completed'
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                  : status === 'current'
                  ? 'bg-teal-500/10 border-teal-500/30 text-teal-800 dark:text-teal-300 ring-1 ring-teal-500/30'
                  : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-400'
              }`}
            >
              {status === 'completed' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : status === 'current' ? (
                <Loader2 className="w-4 h-4 text-teal-500 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
              )}
              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
