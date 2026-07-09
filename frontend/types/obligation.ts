export type RiskLevel = "High" | "Medium" | "Low";

/**
 * A single compliance obligation, matching the backend's Gemini extraction
 * schema (see backend/app/schemas/obligation.py).
 */
export interface Obligation {
  clause: string;
  regulation: string;
  department: string;
  action: string;
  deadline: string;
  frequency: string;
  evidence: string;
  penalty: string;
  risk: RiskLevel;
}

/** An obligation as returned by the backend, including storage metadata. */
export interface ObligationRecord extends Obligation {
  id: string;
  sourceDocument: string;
  extractedAt: string;
}

export interface ObligationsListResponse {
  count: number;
  obligations: ObligationRecord[];
}
