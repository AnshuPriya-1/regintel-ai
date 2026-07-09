import { apiFetch } from "./api";
import type { ObligationRecord } from "@/types/obligation";

export interface UploadResponse {
  filename: string;
  pages: number;
  charactersExtracted: number;
  chunksProcessed: number;
  obligations: ObligationRecord[];
}

interface RawUploadResponse {
  filename: string;
  pages: number;
  characters_extracted: number;
  chunks_processed: number;
  obligations: RawObligationRecord[];
}

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
 * Uploads a SEBI regulatory PDF to the backend, which extracts its text,
 * sends it to Gemini, and returns structured compliance obligations.
 */
export async function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const raw = await apiFetch<RawUploadResponse>("/upload", {
    method: "POST",
    body: formData,
  });

  return {
    filename: raw.filename,
    pages: raw.pages,
    charactersExtracted: raw.characters_extracted,
    chunksProcessed: raw.chunks_processed,
    obligations: raw.obligations.map(toObligationRecord),
  };
}
