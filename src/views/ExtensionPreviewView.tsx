import React from 'react';
import { BrowserSimulation } from '../components/extension/BrowserSimulation';
import { Button } from '../components/ui/Button';
import { 
  ShieldCheck, 
  EyeOff, 
  Code, 
  Info,
  Lock
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

export const ExtensionPreviewView: React.FC = () => {
  const { navigateTo, isPremium } = useAppData();

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
            Experience how CyberProof operates inside an active web browser. Evaluate Low Risk, High Risk, and Unknown scenarios in real time.
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
            This interactive simulator demonstrates the standalone extension user experience. It is engineered with strict decoupled APIs so that the UI can be packaged into a Chromium / Firefox WebExtension manifest without modifying the core trust engine.
          </p>
        </div>
      </div>

      {/* Interactive Browser Sandbox or Locked State */}
      {!isPremium ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Premium Feature Locked</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            The CyberProof Browser Extension is an exclusive feature for CyberProof Protection members. Upgrade to unlock the interactive sandbox and future extension access.
          </p>
          <Button variant="primary" onClick={() => navigateTo('membership')}>
            Unlock Premium Access
          </Button>
        </div>
      ) : (
        <BrowserSimulation />
      )}

      {/* Architecture & Privacy Specification */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Zero Form Reading</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            The extension inspects only the active tab's domain, TLS cipher certificate, and publicly observable HTTP headers. It has ZERO permission to inspect form inputs or password fields.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">User-Controlled Interaction</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            No intrusive full-screen blockades or unsolicited popups. The extension offers a calm, non-disruptive badge in the browser toolbar that users check at their discretion.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Code className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">API-Ready Decoupling</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            The popup is built with modular React and clean JSON interfaces, enabling seamless export to a WebExtension manifest V3 package.
          </p>
        </div>
      </div>
    </div>
  );
};
