import React from 'react';
import { Database } from 'lucide-react';

interface DemoBadgeProps {
  className?: string;
  tooltip?: string;
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({
  className = '',
  tooltip = 'Demonstration record provided for UI evaluation. No actual intelligence network claimed.',
}) => {
  return (
    <span
      title={tooltip}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-purple-500/10 text-purple-400 border border-purple-500/30 select-none ${className}`}
    >
      <Database className="w-3 h-3 text-purple-400" aria-hidden="true" />
      <span>Demo Data</span>
    </span>
  );
};
