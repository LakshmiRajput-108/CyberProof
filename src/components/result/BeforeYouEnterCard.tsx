import React from 'react';
import { Button } from '../ui/Button';
import { ShieldCheck, Check, Chrome, ArrowRight } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

interface BeforeYouEnterCardProps {
  onCheckWebsite?: () => void;
  className?: string;
}

export const BeforeYouEnterCard: React.FC<BeforeYouEnterCardProps> = ({
  onCheckWebsite,
  className = '',
}) => {
  const { navigateTo } = useAppData();

  const checklist = [
    { label: 'Website identity', desc: 'Is the domain authentic and established?' },
    { label: 'Security signals', desc: 'Is modern transport encryption active?' },
    { label: 'Suspicious behavior', desc: 'Are inputs exfiltrating data to off-origin scripts?' },
    { label: 'Context signals', desc: 'Are there recent consumer or spam alerts?' },
    { label: 'Historical assessment', desc: 'Has this domain changed behavior since previous visits?' },
  ];

  return (
    <div className={`p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-cyber-navy-900 to-cyber-navy-850 text-white border border-teal-500/30 shadow-xl space-y-6 relative overflow-hidden ${className}`}>
      {/* Subtle Glow */}
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CyberProof Signature Habit</span>
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Before You Enter Information
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            About to enter personal or payment details? Run through our five essential digital trust verifications first.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={onCheckWebsite || (() => navigateTo('scan'))}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Check This Website
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => navigateTo('extension-preview')}
            leftIcon={<Chrome className="w-4 h-4 text-teal-400" />}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Get Extension
          </Button>
        </div>
      </div>

      {/* 5-Point Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {checklist.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-teal-500/40 transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span className="text-xs font-bold text-white truncate">{item.label}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="text-[11px] text-slate-400 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
        <span>With CyberProof Protection, the browser extension validates these signals right in your toolbar.</span>
      </div>
    </div>
  );
};
