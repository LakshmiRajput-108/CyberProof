import React from 'react';
import { RiskLevel } from '../../types/scan';
import { ShieldCheck, AlertTriangle, ShieldAlert, HelpCircle } from 'lucide-react';

interface RiskBadgeProps {
  risk: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  risk,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const getRiskDetails = () => {
    switch (risk) {
      case 'LOW':
        return {
          label: 'LOW RISK',
          icon: ShieldCheck,
          styles: 'text-emerald-700 bg-emerald-50 border-emerald-300 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/30',
        };
      case 'MEDIUM':
        return {
          label: 'MEDIUM RISK',
          icon: AlertTriangle,
          styles: 'text-amber-800 bg-amber-50 border-amber-300 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/30',
        };
      case 'HIGH':
        return {
          label: 'HIGH RISK',
          icon: ShieldAlert,
          styles: 'text-rose-800 bg-rose-50 border-rose-300 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/30',
        };
      case 'UNKNOWN':
      default:
        return {
          label: 'UNKNOWN',
          icon: HelpCircle,
          styles: 'text-slate-700 bg-slate-100 border-slate-300 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700',
        };
    }
  };

  const { label, icon: Icon, styles } = getRiskDetails();

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-semibold tracking-wide',
    md: 'text-xs md:text-sm px-2.5 py-1 gap-1.5 font-semibold tracking-wider',
    lg: 'text-sm md:text-base px-3.5 py-1.5 gap-2 font-bold tracking-wider',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <span
      role="status"
      aria-label={`Risk Assessment: ${label}`}
      className={`inline-flex items-center rounded-full border ${styles} ${sizeStyles} transition-colors ${className}`}
    >
      {showIcon && <Icon className={`${iconSizes} shrink-0`} aria-hidden="true" />}
      <span>{label}</span>
    </span>
  );
};
