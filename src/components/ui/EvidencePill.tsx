import React from 'react';
import { EvidenceStatus } from '../../types/scan';
import { Check, Eye, HelpCircle, AlertCircle } from 'lucide-react';

interface EvidencePillProps {
  status: EvidenceStatus;
  className?: string;
}

export const EvidencePill: React.FC<EvidencePillProps> = ({ status, className = '' }) => {
  const getConfig = () => {
    switch (status) {
      case 'Verified':
        return {
          icon: Check,
          label: 'Verified',
          styles: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30',
        };
      case 'Observed':
        return {
          icon: Eye,
          label: 'Observed',
          styles: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/30',
        };
      case 'Unable to Verify':
        return {
          icon: AlertCircle,
          label: 'Unable to Verify',
          styles: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30',
        };
      case 'Unknown':
      default:
        return {
          icon: HelpCircle,
          label: 'Unknown',
          styles: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/80 dark:text-slate-400 dark:border-slate-700',
        };
    }
  };

  const { icon: Icon, label, styles } = getConfig();

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${styles} ${className}`}
    >
      <Icon className="w-3 h-3" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
};
