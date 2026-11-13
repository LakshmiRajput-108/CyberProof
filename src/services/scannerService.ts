import { Scan, ScanStage, RiskLevel, EvidenceItem } from '../types/scan';


import { API_BASE_URL } from '../config/api';

export interface ScanProgressCallback {
  (stage: ScanStage, progressPercent: number, stageMessage: string): void;
}

const saveScanToApi = async (scan: Scan): Promise<Scan> => {
  const res = await fetch(`${API_BASE_URL}/api/scan/${scan.analysis_type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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

  async runProgressSimulation(callback?: ScanProgressCallback): Promise<void> {
    if (!callback) return;

    callback('preparing', 15, 'Preparing analysis...');
    await new Promise(r => setTimeout(r, 450));

    callback('checking', 45, 'Checking available signals...');
    await new Promise(r => setTimeout(r, 650));

    callback('organizing', 75, 'Organizing evidence...');
    await new Promise(r => setTimeout(r, 550));

    callback('explaining', 95, 'Preparing explanation...');
    await new Promise(r => setTimeout(r, 400));

    callback('complete', 100, 'Analysis finalized.');
  },

  async analyzeUrl(url: string, onProgress?: ScanProgressCallback): Promise<Scan> {
    const promise = fetch(`${API_BASE_URL}/api/analyze/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    
    await this.runProgressSimulation(onProgress);
    
    const res = await promise;
    if (!res.ok) throw new Error('Analysis failed');
    return res.json();
  },

  async analyzeQr(payloadText: string, onProgress?: ScanProgressCallback): Promise<Scan> {
    const promise = fetch(`${API_BASE_URL}/api/analyze/qr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payloadText })
    });

    await this.runProgressSimulation(onProgress);

    const res = await promise;
    if (!res.ok) throw new Error('Analysis failed');
    return res.json();
  },

  async analyzeEmail(sender: string, subject: string, body: string, onProgress?: ScanProgressCallback): Promise<Scan> {
    const promise = fetch(`${API_BASE_URL}/api/analyze/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender, subject, body })
    });

    await this.runProgressSimulation(onProgress);

    const res = await promise;
    if (!res.ok) throw new Error('Analysis failed');
    return res.json();
  },

  async analyzeMessage(messageText: string, channel: string, onProgress?: ScanProgressCallback): Promise<Scan> {
    const promise = fetch(`${API_BASE_URL}/api/analyze/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageText, channel })
    });

    await this.runProgressSimulation(onProgress);

    const res = await promise;
    if (!res.ok) throw new Error('Analysis failed');
    return res.json();
  },

  async analyzeOtpSituation(situationDescription: string, channel: string, onProgress?: ScanProgressCallback): Promise<Scan> {
    const promise = fetch(`${API_BASE_URL}/api/analyze/otp-situation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ situationDescription, channel })
    });

    await this.runProgressSimulation(onProgress);

    const res = await promise;
    if (!res.ok) throw new Error('Analysis failed');
    return res.json();
  }
};
