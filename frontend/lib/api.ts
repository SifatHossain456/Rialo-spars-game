// Resolves backend base URL for both local dev and Claude Code deployment
export function getBackendUrl(): string {
  // Explicit env var takes priority
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  }
  // In Claude Code deployment the backend is at /_/backend (same origin)
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return "/_/backend";
  }
  return "http://localhost:4000";
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getBackendUrl();
  const url = `${base}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}
