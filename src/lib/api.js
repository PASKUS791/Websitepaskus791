const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

function buildUrl(path) {
  return `${API_BASE_URL}${path}`;
}

export async function apiFetch(path, options = {}) {
  const response = await fetch(buildUrl(path), {
    credentials: "include",
    headers: {
      ...(options.body && !(options.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...(options.headers || {}),
    },
    ...options,
    body:
      options.body && !(options.body instanceof FormData)
        ? JSON.stringify(options.body)
        : options.body,
  });

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = new Error(payload?.error || "API request failed.");
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export function createApiEventSource(path = "/api/events") {
  return new EventSource(buildUrl(path), { withCredentials: true });
}
