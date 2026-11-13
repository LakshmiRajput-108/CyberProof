import React from 'react';
import { Scan } from '../../types/scan';
import { Drawer } from '../ui/Drawer';
import { RiskBadge } from '../ui/RiskBadge';
import { 
  CheckCircle2, 
  Search, 
  HelpCircle, 
  AlertCircle, 
  Scale,
  ShieldCheck 
} from 'lucide-react';

interface WhyExplanationDrawerProps {
  scan: Scan | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WhyExplanationDrawer: React.FC<WhyExplanationDrawerProps> = ({
  scan,
  isOpen,
  onClose,
}) => {
  if (!scan) return null;

  const { why_flagged, risk_level, domain } = scan;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Why did CyberProof say this?"
      subtitle={`Detailed rationale breakdown for ${domain}`}
      width="max-w-xl md:max-w-2xl"
    >
      <div className="space-y-6">
        {/* Assessment Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Current Assessment Verdict:</span>
            <div className="mt-1">
              <RiskBadge risk={risk_level} size="md" />
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 dark:text-slate-400">Core Principle:</span>
            <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-1">
              Explain the Evidence
            </p>
          </div>
        </div>

        {/* Section 0: Plain Language Overview */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-teal-500" />
            <span>Summary of Findings</span>
          </h3>
          <div className="p-4 rounded-xl bg-teal-50/50 dark:bg-teal-500/5 border border-teal-200 dark:border-teal-500/20 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {why_flagged.overview}
          </div>
        </div>

        {/* Section 1: What was checked */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-500" />
            <span>1. What was checked?</span>
          </h3>
          <ul className="space-y-2">
            {why_flagged.checked.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 2: What was found */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>2. What was found?</span>
          </h3>
          <ul className="space-y-2">
            {why_flagged.found.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 3: What could not be verified */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>3. What could not be verified?</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            True digital trust requires honesty about limitations. No scanner possesses omniscient visibility.
          </p>
          <ul className="space-y-2">
            {why_flagged.unverified.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 4: Why it affected the assessment */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-500" />
            <span>4. Why it affected this assessment</span>
          </h3>
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
            {why_flagged.assessment_rationale}
          </div>
        </div>
      </div>
    </Drawer>
  );
};
