import React from 'react';
import { RiskLevel } from '../../types/scan';
import { CheckSquare, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RecommendedActionProps {
  actions: string[];
  risk: RiskLevel;
}

export const RecommendedAction: React.FC<RecommendedActionProps> = ({ actions, risk }) => {
  const getBannerConfig = () => {
    switch (risk) {
      case 'HIGH':
        return {
          bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/30 text-rose-900 dark:text-rose-300',
          title: 'Immediate Defensive Action Recommended',
          icon: AlertTriangle
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30 text-amber-900 dark:text-amber-300',
          title: 'Exercise Elevated Caution',
          icon: AlertTriangle
        };
      case 'LOW':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-300',
          title: 'Safe to Proceed with Standard Habits',
          icon: ShieldCheck
        };
      default:
        return {
          bg: 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-300',
          title: 'Proceed with Measured Verification',
          icon: ShieldCheck
        };
    }
  };

  const { bg, title, icon: Icon } = getBannerConfig();

  return (
    <div className={`p-6 rounded-2xl border ${bg} space-y-4`}>
      <div className="flex items-center gap-2.5">
        <Icon className="w-5 h-5 shrink-0" />
        <h3 className="text-base font-bold">
          What should I do? — {title}
        </h3>
      </div>

      <div className="space-y-2.5">
        {actions.map((act, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-xl bg-white/70 dark:bg-black/20 border border-current/15 text-xs md:text-sm font-medium leading-relaxed"
          >
            <div className="p-1 rounded bg-current/10 shrink-0 mt-0.5">
              <CheckSquare className="w-3.5 h-3.5" />
            </div>
            <span>{act}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
