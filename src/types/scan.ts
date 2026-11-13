export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';

export type AnalysisType = 'url' | 'qr' | 'email' | 'message' | 'otp-situation';

export type EvidenceCategory = 'Identity' | 'Security' | 'Behavior' | 'Context';

export type EvidenceStatus = 'Verified' | 'Observed' | 'Unable to Verify' | 'Unknown';

export interface EvidenceItem {
  id: string;
  category: EvidenceCategory;
  label: string;
  value: string;
  status: EvidenceStatus;
  explanation: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
}

export interface Scan {
  id: string;
  target: string;
  domain: string;
  analysis_type: AnalysisType;
  risk_level: RiskLevel;
  summary: string;
  why_flagged: {
    overview: string;
    checked: string[];
    found: string[];
    unverified: string[];
    assessment_rationale: string;
  };
  evidence: EvidenceItem[];
  recommended_actions: string[];
  created_at: string;
  is_demo?: boolean;
}

export type ScanStage = 
  | 'idle'
  | 'preparing'
  | 'checking'
  | 'organizing'
  | 'explaining'
  | 'complete';
