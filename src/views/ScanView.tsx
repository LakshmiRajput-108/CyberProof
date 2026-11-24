import React, { useEffect, useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { ScannerService } from '../services/scannerService';
import { ScanStage } from '../types/scan';
import { ScanProgress } from '../components/scanner/ScanProgress';
import { Button } from '../components/ui/Button';
import { UrlScanner } from '../components/scanner/UrlScanner';
import { QrScanner } from '../components/scanner/QrScanner';
import { EmailScanner } from '../components/scanner/EmailScanner';
import { MessageScanner } from '../components/scanner/MessageScanner';
import { OtpScanner } from '../components/scanner/OtpScanner';
import { useAuth } from '../context/AuthContext';
import { ApiHttpError, ApiNetworkError } from '../services/apiClient';
import { 
  Globe, 
  QrCode, 
  Mail, 
  MessageSquare, 
  Lock,
  EyeOff,
} from 'lucide-react';

const getScanErrorMessage = (error: unknown, isMemberRequest: boolean): string => {
  if (error instanceof ApiNetworkError) {
    return 'Could not reach CyberProof. Check your connection and try again.';
  }

  if (error instanceof ApiHttpError) {
    if (error.status === 401) {
      return isMemberRequest
        ? 'Your member session expired. Sign in again to continue; guest URL scanning remains available.'
        : 'Your guest scan session could not be verified. Restore the session below, then retry the scan.';
    }
    if (error.status === 403) {
      return 'This analysis is not enabled for the current session.';
    }
    if (error.status === 429) {
      return 'Too many requests were made. Wait a moment, then try again.';
    }
    if (error.status >= 500) {
      return 'CyberProof could not complete the analysis right now. Please try again later.';
    }
    return `CyberProof could not accept this request (HTTP ${error.status}). Review the input and try again.`;
  }

  return 'The analysis could not be completed. Please try again.';
};

export const ScanView: React.FC = () => {
  const { currentParams, navigateTo, addScanRecord } = useAppData();
  const { token, loading: authLoading, guestLoading, ensureGuestSession } = useAuth();

  const [activeTab, setActiveTab] = useState<'url' | 'qr' | 'email' | 'message' | 'otp-situation'>('url');

  useEffect(() => {
    const requestedTab = currentParams.tab;
    if (
      requestedTab === 'url' ||
      requestedTab === 'qr' ||
      requestedTab === 'email' ||
      requestedTab === 'message' ||
      requestedTab === 'otp-situation'
    ) {
      setActiveTab(requestedTab);
    }
  }, [currentParams.tab]);

  const [isLoading, setIsLoading] = useState(false);
  const [scanStage, setScanStage] = useState<ScanStage>('idle');
  const [scanPercent, setScanPercent] = useState(0);
  const [scanMessage, setScanMessage] = useState('');
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanNotice, setScanNotice] = useState<string | null>(null);
  const [needsGuestSessionRetry, setNeedsGuestSessionRetry] = useState(false);
  const [retryingGuestSession, setRetryingGuestSession] = useState(false);

  const recordScanError = async (error: unknown): Promise<void> => {
    const guestSessionRejected =
      !token && error instanceof ApiHttpError && error.status === 401;

    if (!guestSessionRejected) {
      setNeedsGuestSessionRetry(false);
      setScanNotice(null);
      setScanError(getScanErrorMessage(error, Boolean(token)));
      return;
    }

    setNeedsGuestSessionRetry(false);
    setScanNotice(null);
    setRetryingGuestSession(true);
    setScanStage('preparing');
    setScanPercent(0);
    setScanMessage('Restoring your guest scan session...');

    try {
      await ensureGuestSession();
      setScanError(null);
      setScanNotice('Guest session restored. Your scan details are ready—submit again.');
    } catch (restoreError) {
      setNeedsGuestSessionRetry(true);
      setScanError(
        restoreError instanceof Error
          ? restoreError.message
          : 'Could not restore your guest session. Please retry.'
      );
    } finally {
      setRetryingGuestSession(false);
      setScanStage('idle');
      setScanPercent(0);
      setScanMessage('');
    }
  };

  const retryGuestScanSession = async () => {
    setRetryingGuestSession(true);
    try {
      await ensureGuestSession();
      setNeedsGuestSessionRetry(false);
      setScanError(null);
      setScanNotice('Guest session restored. Your scan details are ready—submit again.');
    } catch (error) {
      setScanNotice(null);
      setScanError(error instanceof Error ? error.message : 'Could not restore your guest session. Please retry.');
    } finally {
      setRetryingGuestSession(false);
      setScanStage('idle');
      setScanPercent(0);
      setScanMessage('');
    }
  };

  const handleProgress = (stage: ScanStage, percent: number, msg: string) => {
    setScanStage(stage);
    setScanPercent(percent);
    setScanMessage(msg);
  };

  const handleUrlScan = async (url: string) => {
    setIsLoading(true);
    setScanError(null);
    setScanNotice(null);
    setNeedsGuestSessionRetry(false);
    try {
      const result = await ScannerService.analyzeUrl(url, handleProgress);
      addScanRecord(result);
      navigateTo('result', { scan: result });
    } catch (e) {
      console.error(e);
      await recordScanError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQrScan = async (payload: string) => {
    setIsLoading(true);
    setScanError(null);
    setScanNotice(null);
    setNeedsGuestSessionRetry(false);
    try {
      const result = await ScannerService.analyzeQr(payload, handleProgress);
      addScanRecord(result);
      navigateTo('result', { scan: result });
    } catch (e) {
      console.error(e);
      await recordScanError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailScan = async (sender: string, subject: string, body: string) => {
    setIsLoading(true);
    setScanError(null);
    setScanNotice(null);
    setNeedsGuestSessionRetry(false);
    try {
      const result = await ScannerService.analyzeEmail(sender, subject, body, handleProgress);
      addScanRecord(result);
      navigateTo('result', { scan: result });
    } catch (e) {
      console.error(e);
      await recordScanError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageScan = async (msg: string, channel: string) => {
    setIsLoading(true);
    setScanError(null);
    setScanNotice(null);
    setNeedsGuestSessionRetry(false);
    try {
      const result = await ScannerService.analyzeMessage(msg, channel, handleProgress);
      addScanRecord(result);
      navigateTo('result', { scan: result });
    } catch (e) {
      console.error(e);
      await recordScanError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpScan = async (desc: string, channel: string) => {
    setIsLoading(true);
    setScanError(null);
    setScanNotice(null);
    setNeedsGuestSessionRetry(false);
    try {
      const result = await ScannerService.analyzeOtpSituation(desc, channel, handleProgress);
      addScanRecord(result);
      navigateTo('result', { scan: result });
    } catch (e) {
      console.error(e);
      await recordScanError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'url', label: 'Website / URL', icon: Globe },
    { id: 'qr', label: 'QR Code', icon: QrCode },
    { id: 'email', label: 'Email Content', icon: Mail },
    { id: 'message', label: 'Message / SMS', icon: MessageSquare },
    { id: 'otp-situation', label: 'OTP Situation', icon: Lock },
  ] as const;

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Digital Trust Inspection Center
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
          Scan & Analyze Digital Signals
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          All five scan types are free for guests and registered accounts. URL checks use submitted-text heuristics; QR image decoding is unavailable.
        </p>
      </div>

      {isLoading && (
        <ScanProgress
          stage={scanStage}
          percent={scanPercent}
          message={scanMessage}
          isUrlAnalysis={activeTab === 'url'}
        />
      )}
      <div hidden={isLoading} className="cp-scanner-panel bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 rounded-3xl shadow-xl overflow-hidden">
          {/* Tab navigation */}
          <div className="flex border-b border-slate-200 dark:border-white/10 overflow-x-auto bg-slate-50/50 dark:bg-white/[0.02]">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-xs md:text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${
                    isActive
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400 bg-white dark:bg-cyber-bg-darkCard'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8">
            {scanNotice && (
              <p role="status" className="mb-5 p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-sm text-teal-700 dark:text-teal-300">
                {scanNotice}
              </p>
            )}
            {scanError && (
              <div role="alert" className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-sm text-rose-700 dark:text-rose-300 flex flex-wrap items-center justify-between gap-3">
                <span>{scanError}</span>
                {needsGuestSessionRetry && (
                  <Button size="sm" isLoading={retryingGuestSession} onClick={() => void retryGuestScanSession()}>
                    Retry guest session
                  </Button>
                )}
              </div>
            )}
            {authLoading || guestLoading ? (
              <p role="status" className="py-8 text-center text-sm text-slate-500">
                Preparing your CyberProof session...
              </p>
            ) : activeTab === 'url' ? (
              <UrlScanner
                onScan={handleUrlScan}
                isLoading={isLoading}
                initialUrl={currentParams.url}
                initialUrlRequestId={currentParams.urlRequestId}
              />
            ) : activeTab === 'qr' ? (
              <QrScanner onScan={handleQrScan} isLoading={isLoading} />
            ) : activeTab === 'email' ? (
              <EmailScanner onScan={handleEmailScan} isLoading={isLoading} />
            ) : activeTab === 'message' ? (
              <MessageScanner onScan={handleMessageScan} isLoading={isLoading} />
            ) : activeTab === 'otp-situation' ? (
              <OtpScanner onScan={handleOtpScan} isLoading={isLoading} />
            ) : null}
          </div>
      </div>

      {/* Zero Credential Guarantee Bar */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 flex items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <EyeOff className="w-4 h-4 text-teal-500 shrink-0" />
          <span>Never requests passwords, ATM PINs, private OTPs, or authentication keys.</span>
        </div>
        <span className="font-mono text-[11px] hidden sm:inline text-teal-600 dark:text-teal-400 font-semibold">
          Transparent Analysis
        </span>
      </div>
    </div>
  );
};
