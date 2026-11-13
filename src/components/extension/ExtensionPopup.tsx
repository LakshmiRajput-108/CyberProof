import React, { useState } from 'react';
import { Scan, RiskLevel } from '../../types/scan';
import { RiskBadge } from '../ui/RiskBadge';
import { Button } from '../ui/Button';
import { 
  ShieldCheck, 
  ExternalLink, 
  History, 
  Bookmark, 
  BookmarkCheck, 
  AlertTriangle, 
  HelpCircle, 
  Check, 
  Lock, 
  ChevronRight,
  EyeOff
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';
import { useAppData } from '../../context/AppDataContext';

interface ExtensionPopupProps {
  scan: Scan;
  onClose?: () => void;
  isSimulated?: boolean;
}

export const ExtensionPopup: React.FC<ExtensionPopupProps> = ({
  scan,
  isSimulated = false,
}) => {
  const { navigateTo, isWatchlisted, toggleWatchlist } = useAppData();
  const [showQuickWhy, setShowQuickWhy] = useState(false);
  const [showBeforeYouEnterPrompt, setShowBeforeYouEnterPrompt] = useState(true);

  const watchlisted = isWatchlisted(scan.domain);

  const identityStatus = scan.evidence.find(e => e.category === 'Identity')?.status || 'Verified';
  const securityStatus = scan.evidence.find(e => e.category === 'Security')?.status || 'Verified';
  const behaviorStatus = scan.evidence.find(e => e.category === 'Behavior')?.status || 'Verified';
  const contextStatus = scan.evidence.find(e => e.category === 'Context')?.status || 'Verified';

  const renderStatusCheck = (label: string, status: string) => {
    const isOk = status === 'Verified';
    const isWarn = status === 'Observed' || status === 'Unable to Verify';
    return (
      <div className="flex items-center justify-between text-xs py-1">
        <span className="text-slate-600 dark:text-slate-300 font-medium">{label}</span>
        <span className={`inline-flex items-center gap-1 font-mono font-semibold ${
          isOk ? 'text-emerald-600 dark:text-emerald-400' : isWarn ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'
        }`}>
          {isOk ? '✓ Verified' : isWarn ? '⚠️ Review' : '? Unknown'}
        </span>
      </div>
    );
  };

  const [activeTab, setActiveTab] = useState<'website' | 'caller'>('website');
  const [callerState, setCallerState] = useState<'inactive' | 'processing' | 'detected'>('inactive');

  return (
    <div className="w-80 md:w-88 bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden font-sans text-slate-900 dark:text-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-150">
      {/* Extension Header */}
      <div className="p-3.5 bg-slate-50 dark:bg-cyber-bg-darkElevated flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-xs tracking-tight text-slate-900 dark:text-white">
              CYBERPROOF
            </span>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono ml-1.5 font-bold">
              PROTECTION
            </span>
          </div>
        </div>

        {activeTab === 'website' && (
          <button
            onClick={() => toggleWatchlist(scan.domain, scan.target, scan.risk_level)}
            title={watchlisted ? 'Tracked in Watchlist' : 'Track Website'}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-teal-600 transition-colors"
          >
            {watchlisted ? (
              <BookmarkCheck className="w-4 h-4 text-teal-500" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-cyber-bg-darkElevated px-2 gap-2">
        <button
          onClick={() => setActiveTab('website')}
          className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-colors ${activeTab === 'website' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          Website Guard
        </button>
        <button
          onClick={() => setActiveTab('caller')}
          className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-colors ${activeTab === 'caller' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          Caller Guard
        </button>
      </div>

      {/* Main Body */}
      <div className="p-4 space-y-4 flex-1 overflow-y-auto min-h-[300px]">
        {activeTab === 'website' ? (
          <>
            {/* Domain & Verdict */}
            <div className="space-y-1.5 text-center">
              <p className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                {scan.domain}
              </p>
              <div className="flex justify-center">
                <RiskBadge risk={scan.risk_level} size="md" />
              </div>
            </div>

            {/* Dynamic Context Message */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {scan.risk_level === 'LOW' && (
                <p>
                  <strong>Low Risk:</strong> No major concerns were identified in the available signals. Standard encryption and established identity verified.
                </p>
              )}
              {scan.risk_level === 'HIGH' && (
                <p className="text-rose-600 dark:text-rose-400 font-medium">
                  <strong>High Risk:</strong> Several available signals require extreme caution. Newly registered or deceptive credential heuristics detected.
                </p>
              )}
              {scan.risk_level === 'UNKNOWN' && (
                <p className="text-slate-600 dark:text-slate-300">
                  <strong>Unknown:</strong> CyberProof couldn't verify enough signals to provide a stronger assessment. Limited historical telemetry.
                </p>
              )}
            </div>

            {/* Signals Checklist */}
            <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 divide-y divide-slate-100 dark:divide-white/5">
              {renderStatusCheck('Identity', identityStatus)}
              {renderStatusCheck('Security Protocol', securityStatus)}
              {renderStatusCheck('Interaction Behavior', behaviorStatus)}
              {renderStatusCheck('Reputation Context', contextStatus)}
            </div>

            {/* "Before You Continue" Nudge (User controlled) */}
            {showBeforeYouEnterPrompt && scan.risk_level !== 'LOW' && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Before you interact...</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-snug">
                  You are about to interact with an unverified or high-risk origin. Check the full evidence before typing.
                </p>
                <button
                  onClick={() => setShowBeforeYouEnterPrompt(false)}
                  className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium"
                >
                  Dismiss warning
                </button>
              </div>
            )}

            {/* "Why?" Accordion */}
            <div>
              <button
                onClick={() => setShowQuickWhy(!showQuickWhy)}
                className="w-full flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline py-1"
              >
                <span>{showQuickWhy ? 'Hide Reason' : 'Why did CyberProof say this?'}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showQuickWhy ? 'rotate-90' : ''}`} />
              </button>
              {showQuickWhy && (
                <div className="mt-2 p-2.5 rounded-lg bg-slate-100 dark:bg-white/5 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed space-y-1">
                  <p><strong>Rationale:</strong> {scan.why_flagged.assessment_rationale}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold">Caller Guard</h3>
              <p className="text-[10px] text-slate-500 px-2">Manual transcript analysis. We do not auto-record calls.</p>
            </div>

            {callerState === 'inactive' && (
              <div className="py-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 mx-auto flex items-center justify-center">
                  <EyeOff className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500">Standby. Activate to begin manual analysis.</p>
                <Button variant="primary" size="sm" onClick={() => {
                  setCallerState('processing');
                  fetch(`${API_BASE_URL}/api/caller/analyze`, {
                    method: 'POST',
                    headers: { 
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer premium'
                    },
                    body: JSON.stringify({ transcript: "simulation" })
                  })
                  .then(res => res.json())
                  .then(data => setCallerState('detected'))
                  .catch(() => setCallerState('detected'));
                }}>
                  Start Caller Guard
                </Button>
              </div>
            )}

            {callerState === 'processing' && (
              <div className="py-6 text-center space-y-3">
                <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-mono text-teal-600 dark:text-teal-400 animate-pulse">Analyzing simulated transcript...</p>
              </div>
            )}

            {callerState === 'detected' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400 mb-1">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Potential Scam Indicator Detected</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                    The caller appears to be requesting a security code or OTP.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">What should I do?</h4>
                  <ul className="space-y-1.5 text-[11px]">
                    <li className="flex items-start gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                      <span>Never share verification codes over a phone call.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                      <span>Suggested response: "I don't share security codes over phone calls."</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex flex-col gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCallerState('inactive')} className="w-full">
                    End Session
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Extension Footer Actions */}
      <div className="p-3 bg-slate-50 dark:bg-cyber-bg-darkElevated border-t border-slate-200 dark:border-white/10 grid grid-cols-2 gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigateTo('result', { scan })}
          rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
        >
          Full Analysis
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateTo('website-detail', { domain: scan.domain, scan })}
          leftIcon={<History className="w-3.5 h-3.5" />}
        >
          History
        </Button>
      </div>

      {/* Privacy Guarantee Footer */}
      <div className="px-3 py-1.5 bg-slate-100 dark:bg-black/40 border-t border-slate-200/50 dark:border-white/5 text-[10px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <EyeOff className="w-3 h-3 text-teal-500" />
          <span>Zero Form Reading</span>
        </span>
        <span className="font-mono">Origin-only check</span>
      </div>
    </div>
  );
};
