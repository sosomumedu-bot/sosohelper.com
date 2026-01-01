export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://api.sosohelper.com";

export async function apiFetch(path: string, opts: { method?: string; token?: string; body?: any } = {}) {
  const r = await fetch(`${API_URL}${path}`, {
    method: opts.method ?? "GET",
    headers: {
      "content-type": "application/json",
      ...(opts.token ? { authorization: `Bearer ${opts.token}` } : {})
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });

  const json = await r.json();
  if (!json.ok) throw new Error(json?.error?.message ?? "Request failed");
  return json;
}
