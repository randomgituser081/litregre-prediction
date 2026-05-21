const BASE_URL =
  process.env.PREDICTION_API_BASE_URL ?? "https://mtn.lenhub.net";

// ─── Request / Response Types ────────────────────────────────────────────────

export interface CreateUserBody {
  number: string;
  pin: string;
  confirm_pin: string;
}

export interface LoginUserBody {
  number: string;
  pin: string;
}

/** Shape of a successful login response (exact fields depend on the backend). */
export interface LoginSuccessData {
  access?: string;
  token?: string;
  access_token?: string;
  refresh?: string;
  [key: string]: unknown;
}

export interface ApiResult<T = Record<string, unknown>> {
  ok: boolean;
  status: number;
  data: T;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Extracts the bearer token string from whatever the login endpoint returns. */
export function extractToken(data: LoginSuccessData): string | null {
  return data.access ?? data.token ?? data.access_token ?? null;
}

/** Extracts a human-readable error message from a failed response body. */
export function extractError(
  data: Record<string, unknown>,
  fallback = "Something went wrong. Please try again."
): string {
  if (typeof data.detail === "string") return data.detail;
  if (typeof data.error === "string") return data.error;
  if (typeof data.message === "string") return data.message;
  // Django-style field errors: { field: ["msg"] }
  const first = Object.values(data)[0];
  if (Array.isArray(first) && typeof first[0] === "string") return first[0];
  return fallback;
}

// ─── API Calls ───────────────────────────────────────────────────────────────

/**
 * POST /api/prediction/create/user/
 * Registers a new user on the prediction backend.
 */
export async function createUser(
  body: CreateUserBody
): Promise<ApiResult<Record<string, unknown>>> {
  const res = await fetch(`${BASE_URL}/api/prediction/create/user/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as Record<string, unknown>;
  return { ok: res.ok, status: res.status, data };
}

/**
 * POST /api/prediction/login/user/
 * Authenticates a user and returns a JWT access token.
 */
export async function loginUser(
  body: LoginUserBody
): Promise<ApiResult<LoginSuccessData>> {
  const res = await fetch(`${BASE_URL}/api/prediction/login/user/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as LoginSuccessData;
  return { ok: res.ok, status: res.status, data };
}
