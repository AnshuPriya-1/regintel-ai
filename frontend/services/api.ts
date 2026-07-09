/**
 * Base API client for RegIntel-AI.
 *
 * Every other service module (`upload.ts`, `obligations.ts`, ...) calls
 * through `apiFetch` so there is exactly one place that knows about the
 * backend's base URL, error shape, and JSON handling.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | Record<string, unknown> | null;
}

/**
 * Thin wrapper around fetch() that:
 * - Prefixes requests with the backend base URL
 * - JSON-encodes plain object bodies (leaves FormData untouched)
 * - Throws ApiError with the backend's detail message on non-2xx responses
 * - Parses and returns JSON on success
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const finalBody = isFormData ? body : body != null ? JSON.stringify(body) : undefined;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: isFormData
      ? headers
      : { "Content-Type": "application/json", ...(headers ?? {}) },
    body: finalBody as BodyInit | undefined,
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const errorBody = await response.json();
      detail = errorBody?.detail ?? detail;
    } catch {
      // Response body wasn't JSON; fall back to statusText.
    }
    throw new ApiError(detail, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
