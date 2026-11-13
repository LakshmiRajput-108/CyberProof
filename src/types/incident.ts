export type IncidentCategory = 
  | 'suspicious_message' 
  | 'suspicious_website' 
  | 'account_warning' 
  | 'payment_message' 
  | 'otp_situation' 
  | 'unexpected_link';

export interface IncidentTriageInput {
  category: IncidentCategory;
  sender_channel?: string; // e.g. "SMS", "WhatsApp", "Email", "Browser Popup"
  urgency_claim?: string; // e.g. "Account will be suspended in 24 hours"
  action_requested?: string; // e.g. "Click link to verify identity", "Call number"
  context_description: string;
  has_financial_demand: boolean;
  has_link: boolean;
  claims_to_be_known_brand: boolean;
  brand_name?: string;
}

export interface IncidentAdvice {
  id: string;
  category: IncidentCategory;
  severity: 'high' | 'medium' | 'low';
  title: string;
  what_may_have_happened: string;
  why_it_may_be_suspicious: string[];
  what_to_check: string[];
  what_to_do_next: string[];
  caution_notes: string[];
}
