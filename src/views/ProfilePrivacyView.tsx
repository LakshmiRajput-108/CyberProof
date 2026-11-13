import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { useTheme } from '../context/ThemeContext';

import { Button } from '../components/ui/Button';
import { 
  User, 
  Trash2, 
  Download, 
  RotateCcw, 
  Sun, 
  Moon, 
  Monitor, 
  EyeOff
} from 'lucide-react';
import { ThemeMode } from '../types/user';

export const ProfilePrivacyView: React.FC = () => {
  const { scans, watchlist, clearAllHistory, resetDemoData } = useAppData();
  const { theme, setTheme } = useTheme();

  const [confirmClear, setConfirmClear] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleExportData = () => {
    const data = {
      exported_at: new Date().toISOString(),
      version: '1.0.0',
      scans: scans,
      watchlist: watchlist,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyberproof-data-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setActionNotice('Data export downloaded as JSON file.');
  };

  const handleClear = () => {
    clearAllHistory();
    setConfirmClear(false);
    setActionNotice('All stored scans and security history cleared from local storage.');
  };

  const handleResetDefaults = () => {
    resetDemoData();
    setActionNotice('Demo records and sample watchlist restored to factory baseline.');
  };

  return (
    <div className="space-y-10 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Account & Privacy Controls
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
          Profile & Privacy Center
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
          Control your local data retention, theme preferences, and review the CyberProof privacy architecture.
        </p>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-xs font-semibold text-teal-700 dark:text-teal-300 flex items-center justify-between">
          <span>{actionNotice}</span>
          <button onClick={() => setActionNotice(null)} className="underline">Dismiss</button>
        </div>
      )}

      {/* 1. Profile & Theme Preferences Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xl">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Local Explorer Profile</h2>
            <p className="text-xs text-slate-500">Plan: CyberProof Free • {scans.length} Scans in Browser Vault</p>
          </div>
        </div>

        {/* Theme Selector */}
        <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Interface Theme
          </label>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            {[
              { id: 'dark' as ThemeMode, label: 'Dark Mode', icon: Moon },
              { id: 'light' as ThemeMode, label: 'Light Mode', icon: Sun },
              { id: 'system' as ThemeMode, label: 'System Default', icon: Monitor },
            ].map(item => {
              const Icon = item.icon;
              const isSelected = theme === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTheme(item.id)}
                  className={`p-3 rounded-2xl border text-xs font-medium flex flex-col items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-teal-500/10 border-teal-500 text-teal-600 dark:text-teal-400 font-bold ring-1 ring-teal-500/30'
                      : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Privacy Center */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Privacy Architecture
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            CyberProof Transparency Statement
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span>What CyberProof Analyzes</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li>• Public domain registration and host age</li>
              <li>• Transport Layer Security (TLS/HTTPS) cipher chains</li>
              <li>• Publicly served HTTP security headers</li>
              <li>• Behavioral redirect pathways</li>
              <li>• Form target URLs (where credentials would be sent)</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-rose-500/[0.05] border border-rose-500/20 space-y-2">
            <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <EyeOff className="w-4 h-4" />
              <span>What CyberProof NEVER Requests</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-rose-950 dark:text-rose-300 font-medium">
              <li>✕ Account passwords or PIN codes</li>
              <li>✕ SMS or authenticator One-Time Passwords (OTPs)</li>
              <li>✕ Credit card numbers or CVV security codes</li>
              <li>✕ Private recovery keys or seed phrases</li>
              <li>✕ Authentication tokens or session cookies</li>
            </ul>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 space-y-1">
          <p className="font-semibold text-slate-900 dark:text-white">Where is my data stored?</p>
          <p className="leading-relaxed">
            All analysis history, snapshots, and watchlist items are stored exclusively within your browser's private local storage. No remote servers track your personal browsing habits.
          </p>
        </div>
      </div>

      {/* 3. Data Controls */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Data Management & Purge Controls</h2>
          <p className="text-xs text-slate-500">You maintain absolute ownership over your recorded security history.</p>
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={handleExportData}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export History (JSON)
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={handleResetDefaults}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Restore Default Demo Scans
          </Button>

          {!confirmClear ? (
            <Button
              variant="danger"
              size="md"
              onClick={() => setConfirmClear(true)}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Clear All Stored History
            </Button>
          ) : (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs">
              <span className="text-rose-600 dark:text-rose-400 font-bold">Are you sure?</span>
              <button
                onClick={handleClear}
                className="px-3 py-1 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-500"
              >
                Yes, Delete Everything
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="px-2 py-1 text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
