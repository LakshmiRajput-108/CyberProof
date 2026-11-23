
import { Scan, RiskLevel } from '../types/scan';
import { WebsiteHistory, DeltaComparison, HistoryTrend } from '../types/history';
import { ApiHttpError, apiFetch } from './apiClient';
import { normalizeDomain } from './domainUtils';

const buildWebsiteHistory = (scans: Scan[]): WebsiteHistory | null => {
  if (scans.length === 0) return null;

  const sorted = [...scans].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const firstScan = sorted[0];
  const latestScan = sorted[sorted.length - 1];
  const previousScan =
    sorted.length > 1 ? sorted[sorted.length - 2] : undefined;

  let trend: HistoryTrend = 'Insufficient Historical Data';

  if (previousScan) {
    const riskWeight = (risk: RiskLevel): number => {
      switch (risk) {
        case 'LOW': return 1;
        case 'UNKNOWN': return 2;
        case 'MEDIUM': return 3;
        case 'HIGH': return 4;
      }
    };

    const previousScore = riskWeight(previousScan.risk_level);
    const currentScore = riskWeight(latestScan.risk_level);

    if (currentScore < previousScore) {
      trend = 'Improving';
    } else if (currentScore > previousScore) {
      trend = 'Worsening';
    } else if (
      latestScan.risk_level === 'HIGH' ||
      latestScan.risk_level === 'MEDIUM'
    ) {
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
    scans: [...sorted].reverse(),
    trend,
    scan_count: sorted.length,
    current_risk: latestScan.risk_level,
    previous_risk: previousScan?.risk_level,
  };
};

export const HistoryService = {
  async getAllScans(): Promise<Scan[]> {
    const isMember =
      typeof window !== 'undefined' &&
      Boolean(localStorage.getItem('cyberproof_auth_token'));

    const endpoint = isMember
      ? '/api/history'
      : '/api/guest/history';

    const res = await apiFetch(endpoint);

    if (!res.ok) {
      throw new ApiHttpError(res.status);
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error('The history response was invalid.');
    }

    // Member history is grouped; guest history is a flat scan array.
    let allScans: Scan[] = [];

    if (
      Array.isArray(data) &&
      data.length > 0 &&
      Array.isArray(data[0]?.scans)
    ) {
      for (const group of data) {
        allScans = allScans.concat(group.scans || []);
      }
    } else if (Array.isArray(data)) {
      allScans = data;
    }

    return allScans.sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );
  },

  async getScanById(id: string): Promise<Scan | undefined> {
    const res = await apiFetch(`/api/scan/${id}`);
    if (!res.ok) return undefined;
    return res.json();
  },

  async getScansForDomain(domain: string): Promise<Scan[]> {
    const targetDomain = normalizeDomain(domain);
    const allScans = await this.getAllScans();

    return allScans.filter(
      scan => normalizeDomain(scan.domain) === targetDomain
    );
  },

  calculateDelta(
    currentScan: Scan,
    previousScan?: Scan
  ): DeltaComparison {
    if (!previousScan) {
      const currentChecks = currentScan.evidence.length;
      const currentAttention = currentScan.evidence.filter(
        e =>
          e.importance === 'critical' ||
          e.importance === 'high' ||
          e.status === 'Unable to Verify'
      ).length;
      const currentVerified = currentScan.evidence.filter(
        e => e.status === 'Verified'
      ).length;
      const currentUnverified = currentScan.evidence.filter(
        e => e.status === 'Unable to Verify' || e.status === 'Unknown'
      ).length;

      return {
        has_previous: false,
        current_scan: currentScan,
        risk_changed: false,
        current_risk: currentScan.risk_level,
        checks_count: {
          previous: 0,
          current: currentChecks,
          diff: currentChecks,
        },
        attention_count: {
          previous: 0,
          current: currentAttention,
          diff: currentAttention,
        },
        verified_count: {
          previous: 0,
          current: currentVerified,
          diff: currentVerified,
        },
        unverified_count: {
          previous: 0,
          current: currentUnverified,
          diff: currentUnverified,
        },
        what_changed_points: [
          'First scan recorded for this target.',
          'Run another analysis later to compare changes over time.',
        ],
      };
    }

    const prevChecks = previousScan.evidence.length;
    const curChecks = currentScan.evidence.length;

    const prevAttention = previousScan.evidence.filter(
      e =>
        e.importance === 'critical' ||
        e.importance === 'high' ||
        e.status === 'Unable to Verify'
    ).length;

    const curAttention = currentScan.evidence.filter(
      e =>
        e.importance === 'critical' ||
        e.importance === 'high' ||
        e.status === 'Unable to Verify'
    ).length;

    const prevVerified = previousScan.evidence.filter(
      e => e.status === 'Verified'
    ).length;

    const curVerified = currentScan.evidence.filter(
      e => e.status === 'Verified'
    ).length;

    const prevUnverified = previousScan.evidence.filter(
      e => e.status === 'Unable to Verify' || e.status === 'Unknown'
    ).length;

    const curUnverified = currentScan.evidence.filter(
      e => e.status === 'Unable to Verify' || e.status === 'Unknown'
    ).length;

    const riskChanged =
      currentScan.risk_level !== previousScan.risk_level;

    const whatChanged: string[] = [];

    if (riskChanged) {
      whatChanged.push(
        `Overall risk assessment changed from ${previousScan.risk_level} RISK to ${currentScan.risk_level} RISK.`
      );
    } else {
      whatChanged.push(
        `Assessment remained stable at ${currentScan.risk_level} RISK.`
      );
    }

    if (curAttention < prevAttention) {
      const resolved = prevAttention - curAttention;
      whatChanged.push(
        `${resolved} previous security concern${resolved > 1 ? 's are' : ' is'} no longer present in current signals.`
      );
    } else if (curAttention > prevAttention) {
      const added = curAttention - prevAttention;
      whatChanged.push(
        `${added} new signal${added > 1 ? 's require' : ' requires'} attention since the last check.`
      );
    }

    if (curChecks !== prevChecks) {
      whatChanged.push(
        `Security checks evaluated expanded from ${prevChecks} to ${curChecks} signals.`
      );
    }

    if (curVerified > prevVerified) {
      whatChanged.push(
        `Verified signals increased from ${prevVerified} to ${curVerified}.`
      );
    }

    return {
      has_previous: true,
      previous_scan: previousScan,
      current_scan: currentScan,
      risk_changed: riskChanged,
      previous_risk: previousScan.risk_level,
      current_risk: currentScan.risk_level,
      checks_count: {
        previous: prevChecks,
        current: curChecks,
        diff: curChecks - prevChecks,
      },
      attention_count: {
        previous: prevAttention,
        current: curAttention,
        diff: curAttention - prevAttention,
      },
      verified_count: {
        previous: prevVerified,
        current: curVerified,
        diff: curVerified - prevVerified,
      },
      unverified_count: {
        previous: prevUnverified,
        current: curUnverified,
        diff: curUnverified - prevUnverified,
      },
      what_changed_points: whatChanged,
    };
  },

  async getWebsiteHistory(domain: string): Promise<WebsiteHistory | null> {
    const scans = await this.getScansForDomain(domain);
    return buildWebsiteHistory(scans);
  },

  async getAllUniqueDomains(): Promise<WebsiteHistory[]> {
    const scans = await this.getAllScans();
    const grouped = new Map<string, Scan[]>();

    for (const scan of scans) {
      const key = normalizeDomain(scan.domain);
      const existing = grouped.get(key) || [];
      existing.push(scan);
      grouped.set(key, existing);
    }

    const histories: WebsiteHistory[] = [];

    for (const domainScans of grouped.values()) {
      const history = buildWebsiteHistory(domainScans);
      if (history) histories.push(history);
    }

    return histories.sort(
      (a, b) =>
        new Date(b.last_scan).getTime() -
        new Date(a.last_scan).getTime()
    );
  },
};
