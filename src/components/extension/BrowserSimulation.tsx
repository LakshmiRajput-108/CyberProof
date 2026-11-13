import React, { useState } from 'react';
import { ExtensionPopup } from './ExtensionPopup';
import { useAppData } from '../../context/AppDataContext';
import { Scan } from '../../types/scan';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Lock, 
  ShieldCheck, 
  ShieldAlert, 
  HelpCircle, 
  Globe, 
  ExternalLink,
  Info
} from 'lucide-react';

export const BrowserSimulation: React.FC = () => {
  const { scans: allScans } = useAppData();

  const presets = [
    {
      id: 'low',
      label: 'Verified Corporate (Low Risk)',
      domain: 'example.com',
      url: 'https://example.com/documentation',
      scan: allScans.find(s => s.domain === 'example.com') || allScans[0],
      simulatedPageTitle: 'Example Domain Documentation',
      simulatedContent: (
        <div className="space-y-4 max-w-xl mx-auto py-12 px-6 text-left">
          <div className="border-b border-slate-200 dark:border-white/10 pb-4">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Example Domain</h1>
            <p className="text-xs text-slate-500 mt-1">Managed under official Internet documentation standards.</p>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            This domain is established to be used for illustrative examples in documents. You may use this domain in examples without prior coordination or asking for permission.
          </p>
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 text-xs text-slate-500 font-mono">
            GET /documentation HTTP/2<br />
            Host: example.com<br />
            Strict-Transport-Security: max-age=31536000; includeSubDomains
          </div>
        </div>
      )
    },
    {
      id: 'high',
      label: 'Phishing Trap (High Risk)',
      domain: 'secure-banking-portal-update.xyz',
      url: 'https://secure-banking-portal-update.xyz/login/verify',
      scan: allScans.find(s => s.domain === 'secure-banking-portal-update.xyz') || allScans[3],
      simulatedPageTitle: 'Online Account Security Portal - Login',
      simulatedContent: (
        <div className="space-y-5 max-w-md mx-auto py-8 px-6 text-left bg-white dark:bg-cyber-bg-darkCard rounded-2xl border border-rose-300 dark:border-rose-500/30 shadow-lg mt-6">
          <div className="flex items-center gap-2 text-rose-600">
            <ShieldAlert className="w-6 h-6" />
            <h2 className="text-base font-bold">Urgent Verification Required</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Your international payment card has been temporarily locked due to unusual IP activity. Enter your banking username, password, and card CVV below to avoid permanent deactivation.
          </p>
          <div className="space-y-3">
            <input
              type="text"
              disabled
              placeholder="Username or Account Number"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-slate-50 dark:bg-white/5 opacity-70"
            />
            <input
              type="password"
              disabled
              placeholder="Online Banking Password"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-slate-50 dark:bg-white/5 opacity-70"
            />
            <button
              disabled
              className="w-full py-2 text-xs font-bold bg-rose-600 text-white rounded-lg opacity-80"
            >
              Verify & Unlock Card
            </button>
          </div>
          <p className="text-[10px] text-rose-500 text-center font-mono">
            ⚠️ Phishing Simulation: Script directs to an off-domain destination.
          </p>
        </div>
      )
    },
    {
      id: 'unknown',
      label: 'New Boutique Store (Unknown)',
      domain: 'artisan-coffee-roasters.shop',
      url: 'https://artisan-coffee-roasters.shop/collection/single-origin',
      scan: allScans.find(s => s.domain === 'artisan-coffee-roasters.shop') || allScans[4],
      simulatedPageTitle: 'Artisan Roast House — Small Batch Beans',
      simulatedContent: (
        <div className="space-y-4 max-w-xl mx-auto py-10 px-6 text-left">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Artisan Coffee Roasters</h1>
            <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">Cart (0)</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Freshly roasted beans sourced directly from independent growers. Standard SSL encryption active.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs">
              <p className="font-semibold text-slate-800 dark:text-white">Ethiopian Yirgacheffe</p>
              <p className="text-slate-500 text-[11px] mt-1">₹650 • 250g</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs">
              <p className="font-semibold text-slate-800 dark:text-white">Colombian Huila</p>
              <p className="text-slate-500 text-[11px] mt-1">₹580 • 250g</p>
            </div>
          </div>
          <div className="text-[11px] text-slate-400">
            * CyberProof identified valid SSL, but merchant registration remains unverified.
          </div>
        </div>
      )
    }
  ];

  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(true);

  const activePreset = presets[activePresetIndex];

  const getExtensionBadgeColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'bg-emerald-500 text-slate-950';
      case 'HIGH': return 'bg-rose-500 text-white animate-pulse';
      case 'MEDIUM': return 'bg-amber-500 text-slate-950';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Scenario Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-teal-500" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Simulate Browser Navigation Scenario:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset, idx) => (
            <button
              key={preset.id}
              onClick={() => {
                setActivePresetIndex(idx);
                setIsPopupOpen(true);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                activePresetIndex === idx
                  ? 'bg-teal-500/15 border-teal-500 text-teal-700 dark:text-teal-300 font-bold shadow-sm'
                  : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Realistic Simulated Browser Window */}
      <div className="rounded-3xl border border-slate-300 dark:border-white/15 bg-slate-100 dark:bg-cyber-bg-dark shadow-2xl overflow-hidden relative">
        {/* Browser Top Bar & Tabs */}
        <div className="px-4 pt-3 pb-2 bg-slate-200 dark:bg-slate-900 border-b border-slate-300 dark:border-white/10 flex items-center justify-between">
          {/* Window dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          {/* Active Tab */}
          <div className="flex-1 max-w-sm mx-4">
            <div className="px-3.5 py-1.5 rounded-t-xl bg-white dark:bg-cyber-bg-darkCard border-t border-x border-slate-300 dark:border-white/10 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center justify-between shadow-sm">
              <span className="truncate">{activePreset.simulatedPageTitle}</span>
              <span className="text-[10px] text-slate-400 ml-2">✕</span>
            </div>
          </div>

          <div className="w-10" />
        </div>

        {/* Browser Navigation Toolbar */}
        <div className="px-4 py-2.5 bg-white dark:bg-cyber-bg-darkCard border-b border-slate-200 dark:border-white/10 flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-400">
            <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/5"><ArrowLeft className="w-3.5 h-3.5" /></button>
            <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/5"><ArrowRight className="w-3.5 h-3.5" /></button>
            <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/5"><RotateCw className="w-3.5 h-3.5" /></button>
          </div>

          {/* Address Bar */}
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-800 dark:text-slate-200 truncate">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">{activePreset.url}</span>
          </div>

          {/* Extension Toolbar Icon Button */}
          <div className="relative">
            <button
              onClick={() => setIsPopupOpen(!isPopupOpen)}
              title="CyberProof Browser Extension (Click to toggle popup)"
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 ${
                isPopupOpen
                  ? 'bg-teal-500/20 border-teal-500 text-teal-600 dark:text-teal-300 ring-2 ring-teal-500/30'
                  : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-teal-500/40 text-slate-700 dark:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-teal-500" />
              <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${getExtensionBadgeColor(activePreset.scan.risk_level)}`}>
                {activePreset.scan.risk_level}
              </span>
            </button>

            {/* In-situ Extension Popup Dropdown */}
            {isPopupOpen && (
              <div className="absolute right-0 top-12 z-30 shadow-2xl">
                <ExtensionPopup scan={activePreset.scan} isSimulated={true} />
              </div>
            )}
          </div>
        </div>

        {/* Webpage Content Viewport */}
        <div className="min-h-[380px] bg-slate-50 dark:bg-cyber-bg-dark relative overflow-y-auto p-4">
          {activePreset.simulatedContent}
        </div>
      </div>
    </div>
  );
};
