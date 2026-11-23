
import { Scan, ScanStage } from '../types/scan';
import { ApiHttpError, apiFetch } from './apiClient';

export interface ScanProgressCallback {
  (stage: ScanStage, progressPercent: number, stageMessage: string): void;
}

const getAnalysisResult = async (
  responsePromise: Promise<Response>,
  onProgress?: ScanProgressCallback,
  completionMessage = 'Analysis complete.'
): Promise<Scan> => {
  const response = await responsePromise;
  if (!response.ok) throw new ApiHttpError(response.status);

  const result = await response.json() as Scan;
  onProgress?.('complete', 100, completionMessage);
  return result;
};

export const getScannerPrefillUrl = (
  target?: string,
  domain?: string
): string | null => {
  const input = target?.trim() || domain?.trim();
  if (!input) return null;

  const hasScheme = /^[a-z][a-z\d+.-]*:\/\//i.test(input);
  const isHostWithPort = /^(?:localhost|(?:[\w-]+\.)+[\w-]+|\[[\da-f:]+\]):\d+(?:[/?#]|$)/i.test(input);
  const hasSchemePrefix = /^[a-z][a-z\d+.-]*:/i.test(input);
  if (hasSchemePrefix && !hasScheme && !isHostWithPort) return null;

  try {
    const url = new URL(hasScheme ? input : `https://${input}`);
    if ((url.protocol !== 'http:' && url.protocol !== 'https:') || !url.hostname) return null;
    return url.toString();
  } catch {
    return null;
  }
};

const saveScanToApi = async (scan: Scan): Promise<Scan> => {
  const res = await apiFetch(`/api/scan/${scan.analysis_type}`, {
    method: 'POST',
    body: JSON.stringify(scan)
  });

  if (!res.ok) throw new Error('Failed to save scan to backend');
  return res.json();
};

export const ScannerService = {
  extractDomain(target: string): string {
    let clean = target.trim();

    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }

    try {
      const parsed = new URL(clean);
      return parsed.hostname.toLowerCase();
    } catch {
      return clean.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].toLowerCase();
    }
  },

  async runProgressSimulation(callback?: ScanProgressCallback, isUrlAnalysis = false): Promise<void> {
    if (!callback) return;

    callback('preparing', 15, isUrlAnalysis ? 'Preparing submitted URL...' : 'Preparing submitted content...');
    await new Promise(r => setTimeout(r, 450));

    callback(
      'checking',
      45,
      isUrlAnalysis ? 'Checking URL text and hostname patterns...' : 'Reviewing submitted content...'
    );
    await new Promise(r => setTimeout(r, 650));

    callback(
      'organizing',
      75,
      isUrlAnalysis ? 'Organizing heuristic URL findings...' : 'Organizing analysis findings...'
    );
    await new Promise(r => setTimeout(r, 550));

    callback('explaining', 95, 'Preparing explanation...');
    await new Promise(r => setTimeout(r, 400));
  },

  async analyzeUrl(url: string, onProgress?: ScanProgressCallback): Promise<Scan> {
    const promise = apiFetch('/api/analyze/url', {
      method: 'POST',
      body: JSON.stringify({ url })
    });

    await this.runProgressSimulation(onProgress, true);
    return getAnalysisResult(promise, onProgress, 'Heuristic URL analysis complete.');
  },

  async analyzeQr(payloadText: string, onProgress?: ScanProgressCallback): Promise<Scan> {
    const promise = apiFetch('/api/analyze/qr', {
      method: 'POST',
      body: JSON.stringify({ payloadText })
    });

    await this.runProgressSimulation(onProgress);
    return getAnalysisResult(promise, onProgress);
  },

  async analyzeEmail(sender: string, subject: string, body: string, onProgress?: ScanProgressCallback): Promise<Scan> {
    const promise = apiFetch('/api/analyze/email', {
      method: 'POST',
      body: JSON.stringify({ sender, subject, body })
    });

    await this.runProgressSimulation(onProgress);
    return getAnalysisResult(promise, onProgress);
  },

  async analyzeMessage(messageText: string, channel: string, onProgress?: ScanProgressCallback): Promise<Scan> {
    const promise = apiFetch('/api/analyze/message', {
      method: 'POST',
      body: JSON.stringify({ messageText, channel })
    });

    await this.runProgressSimulation(onProgress);
    return getAnalysisResult(promise, onProgress);
  },

  async analyzeOtpSituation(situationDescription: string, channel: string, onProgress?: ScanProgressCallback): Promise<Scan> {
    const promise = apiFetch('/api/analyze/otp-situation', {
      method: 'POST',
      body: JSON.stringify({ situationDescription, channel })
    });

    await this.runProgressSimulation(onProgress);
    return getAnalysisResult(promise, onProgress);
  }
};
