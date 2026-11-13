import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';

interface UrlScannerProps {
  onScan: (url: string) => void;
  isLoading: boolean;
  initialUrl?: string;
}

export const UrlScanner: React.FC<UrlScannerProps> = ({ onScan, isLoading, initialUrl = '' }) => {
  const [url, setUrl] = useState(initialUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onScan(url.trim());
  };

  const samplePresets = [
    { label: 'example.com', desc: 'Standard baseline', val: 'https://example.com' },
    { label: 'secure-banking-portal-update.xyz', desc: 'High-risk sample', val: 'https://secure-banking-portal-update.xyz/login/verify' },
    { label: 'artisan-coffee-roasters.shop', desc: 'Unverified sample', val: 'https://artisan-coffee-roasters.shop' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="url-input" className="block text-sm font-semibold text-slate-900 dark:text-white">
          Website or Link Address (URL)
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enter any full link or domain to evaluate transport encryption, identity stability, and suspicious behavior markers.
        </p>

        <div className="relative mt-2">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Globe className="w-5 h-5 text-teal-500" />
          </div>
          <input
            id="url-input"
            type="text"
            required
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="e.g. https://myaccount-security-alert.xyz or github.com"
            className="w-full pl-11 pr-32 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all font-mono"
          />
          <div className="absolute inset-y-1.5 right-1.5 flex items-center">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Analyze
            </Button>
          </div>
        </div>
      </div>

      {/* Preset Suggestions */}
      <div className="pt-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-500" />
          <span>Try quick demonstration targets:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {samplePresets.map(preset => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setUrl(preset.val);
                onScan(preset.val);
              }}
              className="text-left px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs transition-colors"
            >
              <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{preset.label}</span>
              <span className="text-slate-400 ml-1.5 text-[11px]">({preset.desc})</span>
            </button>
          ))}
        </div>
      </div>
    </form>
  );
};
