export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.sosohelper.com";

export type ApiResult<T> = { ok: true } & T;
export type ApiError = { ok: false; error: { message: string; details?: unknown } };

export async function apiFetch<T>(path: string, opts: { method?: string; token?: string; body?: unknown } = {}) {
  const r = await fetch(`${API_URL}${path}`, {
    method: opts.method ?? "GET",
    headers: {
      "content-type": "application/json",
      ...(opts.token ? { authorization: `Bearer ${opts.token}` } : {})
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    cache: "no-store"
  });

  const json = (await r.json()) as ApiResult<T> | ApiError;
  if (!json.ok) throw new Error(json.error.message);
  return json;
}
