import { apiFetch } from "./api";
import type { ChangeDetection } from "@/types/change";

/**
 * Fetches the latest change detection results from the backend.
 */
export async function getChangeDetection(): Promise<ChangeDetection> {
  return apiFetch<ChangeDetection>("/changes");
}