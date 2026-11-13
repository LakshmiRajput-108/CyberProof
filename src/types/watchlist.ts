import { RiskLevel } from './scan';

export interface WatchlistItem {
  id: string;
  domain: string;
  target: string;
  added_at: string;
  last_checked: string;
  current_risk: RiskLevel;
  scan_count: number;
  notes?: string;
  is_demo?: boolean;
}
