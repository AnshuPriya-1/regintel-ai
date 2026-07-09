import type { ChangeDetection } from "@/types/change";
import mockChanges from "@/mock/changes.json";

/**
 * Returns the current regulatory change-detection comparison.
 *
 * No backend change-detection endpoint exists yet. This resolves from
 * bundled mock data so consuming pages have a stable shape to code against.
 * Once a backend route such as GET /changes exists, only this function needs
 * to change to an `apiFetch<ChangeDetection>("/changes")` call.
 */
export async function getChangeDetection(): Promise<ChangeDetection> {
  return mockChanges as ChangeDetection;
}
