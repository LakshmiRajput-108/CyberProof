import React from 'react';
import { BrowserSimulation } from '../components/extension/BrowserSimulation';
import { Button } from '../components/ui/Button';
import { 
  ShieldCheck, 
  EyeOff, 
  Code, 
  Info
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

export const ExtensionPreviewView: React.FC = () => {
  const { navigateTo } = useAppData();

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Interactive Extension Sandbox
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-700 dark:text-teal-300">
              PREVIEW
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            CyberProof Browser Extension
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            Explore an illustrative browser interface. It does not inspect your active tab or perform live checks.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigateTo('membership')}
        >
          View Membership Plans
        </Button>
      </div>

      {/* Honest Technical Notice */}
      <div className="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/20 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-slate-900 dark:text-white">Conceptual Extension Sandbox</p>
          <p className="leading-relaxed">
            This conceptual simulator is not an installable browser extension. It shows a saved analysis only when one exactly matches a preset domain; otherwise, no risk rating is shown.
          </p>
        </div>
      </div>

      <BrowserSimulation />

      {/* Architecture & Privacy Specification */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Zero Form Reading</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            This preview does not access the active tab, forms, or password fields.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">User-Controlled Interaction</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            No live browser extension is installed, and this preview does not read or alter an active tab.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Code className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">API-Ready Decoupling</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Packaging, API integration, and extension permissions are not implemented. This page is a website-only concept.
          </p>
        </div>
      </div>
    </div>
  );
};
