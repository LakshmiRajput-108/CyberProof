import { RiskLevel, Scan } from './scan';

export type HistoryTrend = 
  | 'Improving' 
  | 'Stable' 
  | 'Needs Attention' 
  | 'Worsening' 
  | 'Insufficient Historical Data';

export interface DeltaComparison {
  has_previous: boolean;
  previous_scan?: Scan;
  current_scan: Scan;
  risk_changed: boolean;
  previous_risk?: RiskLevel;
  current_risk: RiskLevel;
  checks_count: {
    previous: number;
    current: number;
    diff: number;
  };
  attention_count: {
    previous: number;
    current: number;
    diff: number;
  };
  verified_count: {
    previous: number;
    current: number;
    diff: number;
  };
  unverified_count: {
    previous: number;
    current: number;
    diff: number;
  };
  what_changed_points: string[];
}

export interface WebsiteHistory {
  domain: string;
  target: string;
  first_scan: string;
  last_scan: string;
  scans: Scan[];
  trend: HistoryTrend;
  scan_count: number;
  current_risk: RiskLevel;
  previous_risk?: RiskLevel;
}
