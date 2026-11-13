import React, { useState } from 'react';
import { EvidenceItem, EvidenceCategory } from '../../types/scan';
import { EvidencePill } from '../ui/EvidencePill';
import { 
  Fingerprint, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Info, 
  AlertCircle 
} from 'lucide-react';

interface EvidenceMatrixProps {
  evidence: EvidenceItem[];
}

export const EvidenceMatrix: React.FC<EvidenceMatrixProps> = ({ evidence }) => {
  const [activeCategory, setActiveCategory] = useState<EvidenceCategory | 'All'>('All');

  const categories: { key: EvidenceCategory; label: string; icon: React.ElementType }[] = [
    { key: 'Identity', label: 'Identity', icon: Fingerprint },
    { key: 'Security', label: 'Security', icon: ShieldCheck },
    { key: 'Behavior', label: 'Behavior', icon: Activity },
    { key: 'Context', label: 'Context', icon: Layers },
  ];

  const filtered = activeCategory === 'All'
    ? evidence
    : evidence.filter(e => e.category === activeCategory);

  const getImportanceBadge = (importance: EvidenceItem['importance']) => {
    switch (importance) {
      case 'critical':
        return <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">Critical Signal</span>;
      case 'high':
        return <span className="text-[10px] uppercase font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">High Importance</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Observable Evidence Matrix
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organized across 4 core signal categories. Every item represents an observable fact or unverified parameter.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeCategory === 'All'
                ? 'bg-white dark:bg-cyber-bg-darkCard text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            All Signals ({evidence.length})
          </button>
          {categories.map(c => {
            const count = evidence.filter(e => e.category === c.key).length;
            const Icon = c.icon;
            return (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === c.key
                    ? 'bg-white dark:bg-cyber-bg-darkCard text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-teal-500" />
                <span>{c.label} ({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Evidence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(item => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  {item.category} Signal
                </span>
                <div className="flex items-center gap-2">
                  {getImportanceBadge(item.importance)}
                  <EvidencePill status={item.status} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.label}
                </h3>
                <p className="text-xs font-mono text-teal-600 dark:text-teal-400 font-medium mt-0.5">
                  {item.value}
                </p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                {item.explanation}
              </p>
            </div>

            {item.status === 'Unable to Verify' && (
              <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Signal could not be confirmed via public network queries.</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
