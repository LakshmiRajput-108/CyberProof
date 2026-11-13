import { Scan, RiskLevel } from '../types/scan';
import { WebsiteHistory, DeltaComparison, HistoryTrend } from '../types/history';
import { API_BASE_URL } from '../config/api';

export const HistoryService = {
  async getAllScans(): Promise<Scan[]> {
    const res = await fetch(`${API_BASE_URL}/api/history`);
    if (!res.ok) throw new Error('Failed to fetch scans');
    const data = await res.json();
    // /api/history returns aggregated domains, wait! 
    // /api/history returns list of domains with scans.
    // If we want all scans flat, we need an endpoint or we just map it.
    let all: Scan[] = [];
    for (const group of data) {
      all = all.concat(group.scans);
    }
    return all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getScanById(id: string): Promise<Scan | undefined> {
    const res = await fetch(`${API_BASE_URL}/api/scan/${id}`);
    if (!res.ok) return undefined;
    return res.json();
  },

  async getScansForDomain(domain: string): Promise<Scan[]> {
    const cleanDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    const res = await fetch(`${API_BASE_URL}/api/history/${cleanDomain}`);
    if (!res.ok) return [];
    return res.json();
  },

  calculateDelta(currentScan: Scan, previousScan?: Scan): DeltaComparison {
    if (!previousScan) {
      const currentChecks = currentScan.evidence.length;
      const currentAttention = currentScan.evidence.filter(e => e.importance === 'critical' || e.importance === 'high' || e.status === 'Unable to Verify').length;
      const currentVerified = currentScan.evidence.filter(e => e.status === 'Verified').length;
      const currentUnverified = currentScan.evidence.filter(e => e.status === 'Unable to Verify' || e.status === 'Unknown').length;

      return {
        has_previous: false,
        current_scan: currentScan,
        risk_changed: false,
        current_risk: currentScan.risk_level,
        checks_count: { previous: 0, current: currentChecks, diff: currentChecks },
        attention_count: { previous: 0, current: currentAttention, diff: currentAttention },
        verified_count: { previous: 0, current: currentVerified, diff: currentVerified },
        unverified_count: { previous: 0, current: currentUnverified, diff: currentUnverified },
        what_changed_points: [
          'First scan recorded for this target.',
          'Run another analysis later to compare changes over time.'
        ]
      };
    }

    const prevChecks = previousScan.evidence.length;
    const curChecks = currentScan.evidence.length;

    const prevAttention = previousScan.evidence.filter(e => e.importance === 'critical' || e.importance === 'high' || e.status === 'Unable to Verify').length;
    const curAttention = currentScan.evidence.filter(e => e.importance === 'critical' || e.importance === 'high' || e.status === 'Unable to Verify').length;

    const prevVerified = previousScan.evidence.filter(e => e.status === 'Verified').length;
    const curVerified = currentScan.evidence.filter(e => e.status === 'Verified').length;

    const prevUnverified = previousScan.evidence.filter(e => e.status === 'Unable to Verify' || e.status === 'Unknown').length;
    const curUnverified = currentScan.evidence.filter(e => e.status === 'Unable to Verify' || e.status === 'Unknown').length;

    const riskChanged = currentScan.risk_level !== previousScan.risk_level;
    const whatChanged: string[] = [];

    if (riskChanged) {
      whatChanged.push(`Overall risk assessment changed from ${previousScan.risk_level} RISK to ${currentScan.risk_level} RISK.`);
    } else {
      whatChanged.push(`Assessment remained stable at ${currentScan.risk_level} RISK.`);
    }

    if (curAttention < prevAttention) {
      const resolved = prevAttention - curAttention;
      whatChanged.push(`${resolved} previous security concern${resolved > 1 ? 's are' : ' is'} no longer present in current signals.`);
    } else if (curAttention > prevAttention) {
      const added = curAttention - prevAttention;
      whatChanged.push(`${added} new signal${added > 1 ? 's require' : ' requires'} attention since the last check.`);
    }

    if (curChecks !== prevChecks) {
      whatChanged.push(`Security checks evaluated expanded from ${prevChecks} to ${curChecks} signals.`);
    }

    if (curVerified > prevVerified) {
      whatChanged.push(`Verified signals increased from ${prevVerified} to ${curVerified}.`);
    }

    return {
      has_previous: true,
      previous_scan: previousScan,
      current_scan: currentScan,
      risk_changed: riskChanged,
      previous_risk: previousScan.risk_level,
      current_risk: currentScan.risk_level,
      checks_count: { previous: prevChecks, current: curChecks, diff: curChecks - prevChecks },
      attention_count: { previous: prevAttention, current: curAttention, diff: curAttention - prevAttention },
      verified_count: { previous: prevVerified, current: curVerified, diff: curVerified - prevVerified },
      unverified_count: { previous: prevUnverified, current: curUnverified, diff: curUnverified - prevUnverified },
      what_changed_points: whatChanged
    };
  },

  async getWebsiteHistory(domain: string): Promise<WebsiteHistory | null> {
    const scans = await this.getScansForDomain(domain);
    if (scans.length === 0) return null;

    const sortedByDateAsc = [...scans].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    const firstScan = sortedByDateAsc[0];
    const latestScan = sortedByDateAsc[sortedByDateAsc.length - 1];
    const previousScan = sortedByDateAsc.length > 1 ? sortedByDateAsc[sortedByDateAsc.length - 2] : undefined;

    let trend: HistoryTrend = 'Insufficient Historical Data';
    if (sortedByDateAsc.length >= 2) {
      const riskWeight = (r: RiskLevel) => {
        switch (r) {
          case 'LOW': return 1;
          case 'UNKNOWN': return 2;
          case 'MEDIUM': return 3;
          case 'HIGH': return 4;
        }
      };

      const prevScore = riskWeight(previousScan!.risk_level);
      const curScore = riskWeight(latestScan.risk_level);

      if (curScore < prevScore) {
        trend = 'Improving';
      } else if (curScore > prevScore) {
        trend = 'Worsening';
      } else if (latestScan.risk_level === 'HIGH' || latestScan.risk_level === 'MEDIUM') {
        trend = 'Needs Attention';
      } else {
        trend = 'Stable';
      }
    }

    return {
      domain: latestScan.domain,
      target: latestScan.target,
      first_scan: firstScan.created_at,
      last_scan: latestScan.created_at,
      scans: sortedByDateAsc.reverse(), // most recent first
      trend,
      scan_count: scans.length,
      current_risk: latestScan.risk_level,
      previous_risk: previousScan?.risk_level
    };
  },

  async getAllUniqueDomains(): Promise<WebsiteHistory[]> {
    const res = await fetch(`${API_BASE_URL}/api/history`);
    if (!res.ok) return [];
    const grouped = await res.json();
    
    const histories: WebsiteHistory[] = [];
    for (const group of grouped) {
      const hist = await this.getWebsiteHistory(group.domain);
      if (hist) histories.push(hist);
    }

    return histories.sort((a, b) => new Date(b.last_scan).getTime() - new Date(a.last_scan).getTime());
  }
};
