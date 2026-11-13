import { z } from "zod";

export const forbiddenKeys = [
  "password",
  "otp",
  "pin",
  "recovery",
  "authtoken",
  "secret",
  "credential",
  "cardnumber",
  "cvv",
  "ssn"
];

export const containsForbiddenKeys = (obj: any): boolean => {
  if (!obj || typeof obj !== 'object') return false;
  const keys = Object.keys(obj).map(k => k.toLowerCase());
  return keys.some(k => forbiddenKeys.some(forbidden => k.includes(forbidden)));
};

export const ScanPayloadSchema = z.object({
  target: z.string().min(1),
  domain: z.string().default(''),
  risk_level: z.string().default('UNKNOWN'),
  summary: z.string().default(''),
  why_flagged: z.any().optional(),
  evidence: z.any().optional(),
  recommended_actions: z.any().optional(),
  is_demo: z.boolean().default(false)
});
