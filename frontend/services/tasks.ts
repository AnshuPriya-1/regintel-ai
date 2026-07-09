import type { Task } from "@/types/task";
import mockTasks from "@/mock/tasks.json";

/**
 * Returns workflow tasks.
 *
 * No backend task endpoint exists yet (out of scope for Phase 3, which only
 * covers /upload and /obligations). This resolves from bundled mock data so
 * consuming pages have a stable shape to code against. Once a backend route
 * such as GET /tasks exists, only this function needs to change to an
 * `apiFetch<Task[]>("/tasks")` call — callers are unaffected.
 */
export async function getTasks(): Promise<Task[]> {
  return mockTasks as Task[];
}
