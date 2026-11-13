import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { ScannerService } from '../services/scannerService';
import { ScanStage } from '../types/scan';
import { ScanProgress } from '../components/scanner/ScanProgress';
import { UrlScanner } from '../components/scanner/UrlScanner';
import { QrScanner } from '../components/scanner/QrScanner';
import { EmailScanner } from '../components/scanner/EmailScanner';
import { MessageScanner } from '../components/scanner/MessageScanner';
import { OtpScanner } from '../components/scanner/OtpScanner';
import { 
  Globe, 
  QrCode, 
  Mail, 
  MessageSquare, 
  Lock,
  EyeOff
} from 'lucide-react';

export const ScanView: React.FC = () => {
  const { currentParams, navigateTo, addScanRecord } = useAppData();

  const [activeTab, setActiveTab] = useState<'url' | 'qr' | 'email' | 'message' | 'otp-situation'>(
    (currentParams.tab as any) || 'url'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [scanStage, setScanStage] = useState<ScanStage>('idle');
  const [scanPercent, setScanPercent] = useState(0);
  const [scanMessage, setScanMessage] = useState('');

  const handleProgress = (stage: ScanStage, percent: number, msg: string) => {
    setScanStage(stage);
    setScanPercent(percent);
    setScanMessage(msg);
  };

  const handleUrlScan = async (url: string) => {
    setIsLoading(true);
    try {
      const result = await ScannerService.analyzeUrl(url, handleProgress);
      addScanRecord(result);
      navigateTo('result', { scan: result });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQrScan = async (payload: string) => {
    setIsLoading(true);
    try {
      const result = await ScannerService.analyzeQr(payload, handleProgress);
      addScanRecord(result);
      navigateTo('result', { scan: result });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailScan = async (sender: string, subject: string, body: string) => {
    setIsLoading(true);
    try {
      const result = await ScannerService.analyzeEmail(sender, subject, body, handleProgress);
      addScanRecord(result);
      navigateTo('result', { scan: result });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageScan = async (msg: string, channel: string) => {
    setIsLoading(true);
    try {
      const result = await ScannerService.analyzeMessage(msg, channel, handleProgress);
      addScanRecord(result);
      navigateTo('result', { scan: result });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpScan = async (desc: string, channel: string) => {
    setIsLoading(true);
    try {
      const result = await ScannerService.analyzeOtpSituation(desc, channel, handleProgress);
      addScanRecord(result);
      navigateTo('result', { scan: result });
    } catch (e) {
      console.error(e);
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
          Choose what you are checking. We analyze publicly observable markers to explain evidence in plain English.
        </p>
      </div>

      {isLoading ? (
        <ScanProgress stage={scanStage} percent={scanPercent} message={scanMessage} />
      ) : (
        <div className="bg-white dark:bg-cyber-bg-darkCard border border-slate-200 dark:border-white/10 rounded-3xl shadow-xl overflow-hidden">
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
            {activeTab === 'url' && (
              <UrlScanner onScan={handleUrlScan} isLoading={isLoading} />
            )}
            {activeTab === 'qr' && (
              <QrScanner onScan={handleQrScan} isLoading={isLoading} />
            )}
            {activeTab === 'email' && (
              <EmailScanner onScan={handleEmailScan} isLoading={isLoading} />
            )}
            {activeTab === 'message' && (
              <MessageScanner onScan={handleMessageScan} isLoading={isLoading} />
            )}
            {activeTab === 'otp-situation' && (
              <OtpScanner onScan={handleOtpScan} isLoading={isLoading} />
            )}
          </div>
        </div>
      )}

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
