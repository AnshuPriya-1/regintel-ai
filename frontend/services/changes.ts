import type { ChangeDetection } from "@/types/change";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Fetches the latest change detection results from the backend.
 */
export async function getChangeDetection(): Promise<ChangeDetection> {
  const response = await fetch(`${API_URL}/changes`);

  if (!response.ok) {
    throw new Error("Failed to fetch change detection data");
  }

  const data: ChangeDetection = await response.json();

  return data;
}