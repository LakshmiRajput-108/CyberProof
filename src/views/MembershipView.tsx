import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { Button } from '../components/ui/Button';
import { 
  Sparkles, 
  Check, 
  Chrome, 
  EyeOff, 
  Info
} from 'lucide-react';

export const MembershipView: React.FC = () => {
  const { navigateTo, isPremium, setIsPremium } = useAppData();
  const [showNotification, setShowNotification] = useState(false);

  const freeFeatures = [
    'Basic website URL analysis',
    'QR code safety inspection',
    'Email content heuristic checks',
    'Suspicious message triage',
    'OTP situation advisory (zero secret collection)',
    'Standard security explanations',
    'Public Learn Hub guides',
    'Local browser scan memory',
  ];

  const premiumFeatures = [
    'CyberProof Browser Extension preview',
    'Instant toolbar checks without leaving websites',
    'Advanced Website Security History',
    'Multi-scan chronological Security Timeline',
    'Empirical Before vs Now delta verification',
    'Site Intelligence & website history',
    'Deep-dive explainable rationale drawer',
    'Personal Security Dashboard with trends',
    'Zero credential reading privacy guarantee',
  ];

  const handleUpgradeClick = () => {
    setIsPremium(true);
    setShowNotification(true);
  };

  return (
    <div className="space-y-12 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-teal-500" />
          <span>CyberProof Ecosystem Plans</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Simple, Honest Digital Trust.
        </h1>
        <p className="text-xs sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Start free with transparent analysis. Upgrade to CyberProof Protection to keep verification right in your browser toolbar.
        </p>
      </div>

      {/* Hero Premium Moment */}
      <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-cyber-navy-900 to-cyber-navy-850 text-white border border-teal-500/30 shadow-2xl relative overflow-hidden space-y-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400">
            Hero Upgrade Highlight
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            CyberProof goes with you while you browse.
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            With CyberProof Protection, your security check is available while you browse — without leaving the website you're checking. Inspect identity, encryption, and deceptive indicators directly in your toolbar.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {[
            { step: '01', title: 'Any Website', desc: 'Browse naturally' },
            { step: '02', title: 'Browser Extension', desc: 'Click CyberProof icon' },
            { step: '03', title: 'Instant Assessment', desc: 'Inspect origin signals' },
            { step: '04', title: 'Understand Evidence', desc: 'Read why it was flagged' },
            { step: '05', title: 'Continue Safely', desc: 'Act with confidence' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between space-y-2 text-center"
            >
              <span className="text-xs font-mono text-teal-400 font-bold">{item.step}</span>
              <h4 className="text-xs font-bold text-white leading-tight">{item.title}</h4>
              <p className="text-[11px] text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-4">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigateTo('extension-preview')}
            leftIcon={<Chrome className="w-4 h-4" />}
          >
            Launch Browser Extension Sandbox
          </Button>

          <span className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
            <EyeOff className="w-3.5 h-3.5 text-teal-400" />
            Zero form or password reading
          </span>
        </div>
      </div>

      {/* Pricing Cards Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* FREE PLAN */}
        <div className="p-8 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">CyberProof Free</h3>
              <p className="text-xs text-slate-500">Essential digital trust check for everyday browsing.</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">₹0</span>
              <span className="text-xs text-slate-400 font-medium">/ forever</span>
            </div>

            <ul className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300">
              {freeFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={() => navigateTo('scan')}
            className="w-full"
          >
            Current Active Plan
          </Button>
        </div>

        {/* PREMIUM PLAN */}
        <div className="p-8 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border-2 border-teal-500 shadow-xl relative flex flex-col justify-between space-y-6">
          <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider bg-teal-500 text-slate-950 uppercase shadow-sm">
            Most Popular
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">CyberProof Protection</h3>
              <p className="text-xs text-slate-500">In-browser protection and deep chronological security history.</p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">₹49</span>
              <span className="text-xs text-slate-400 font-medium">/ month · student-friendly</span>
            </div>

            <ul className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 font-medium">
              {premiumFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              variant={isPremium ? "secondary" : "primary"}
              size="md"
              onClick={handleUpgradeClick}
              className="w-full shadow-lg"
              disabled={isPremium}
            >
              {isPremium ? 'Premium Active' : 'Upgrade to Premium'}
            </Button>
            <p className="text-[11px] text-center text-slate-400 font-mono">
              Honest Notice: Demonstrator environment. No real billing charges occur.
            </p>
          </div>
        </div>
      </div>

      {showNotification && (
        <div className="p-5 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-900 dark:text-teal-300 flex items-start justify-between gap-4 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h4 className="text-sm font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-500" />
              <span>Premium Unlocked (Demo Mode)</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              In accordance with CyberProof principles, we never simulate fake credit card or UPI processing. Premium features are now unlocked for this session. Test all premium features right now in the <strong>Browser Extension Sandbox</strong> and <strong>Security History</strong> views!
            </p>
          </div>
          <button
            onClick={() => setShowNotification(false)}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
