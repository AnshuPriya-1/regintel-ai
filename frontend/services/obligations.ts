import { apiFetch, ApiError } from "./api";
import type { ObligationRecord } from "@/types/obligation";
import mockObligations from "@/mock/obligations.json";

interface RawObligationRecord {
  clause: string;
  regulation: string;
  department: string;
  action: string;
  deadline: string;
  frequency: string;
  evidence: string;
  penalty: string;
  risk: "High" | "Medium" | "Low";
  id: string;
  source_document: string;
  extracted_at: string;
}

interface RawObligationsListResponse {
  count: number;
  obligations: RawObligationRecord[];
}

function toObligationRecord(raw: RawObligationRecord): ObligationRecord {
  return {
    clause: raw.clause,
    regulation: raw.regulation,
    department: raw.department,
    action: raw.action,
    deadline: raw.deadline,
    frequency: raw.frequency,
    evidence: raw.evidence,
    penalty: raw.penalty,
    risk: raw.risk,
    id: raw.id,
    sourceDocument: raw.source_document,
    extractedAt: raw.extracted_at,
  };
}

/**
 * Returns the latest AI-extracted compliance obligations from the backend.
 *
 * Falls back to bundled mock data if the backend hasn't processed any
 * documents yet (empty store) or is unreachable, so pages relying on this
 * service always have something to render.
 */
export async function getObligations(): Promise<ObligationRecord[]> {
  try {
    const raw = await apiFetch<RawObligationsListResponse>("/obligations");
    if (raw.obligations.length > 0) {
      return raw.obligations.map(toObligationRecord);
    }
    return mockObligations as ObligationRecord[];
  } catch (err) {
    if (err instanceof ApiError) {
      console.warn(`Falling back to mock obligations: ${err.message}`);
    } else {
      console.warn("Falling back to mock obligations: backend unreachable");
    }
    return mockObligations as ObligationRecord[];
  }
}
