const TOKEN_KEY = "mauj_token";

export const tokenStore = {
  get: () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } },
  set: (t) => { try { localStorage.setItem(TOKEN_KEY, t); } catch { /* ignore */ } },
  clear: () => { try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ } },
};

async function request(url, opts = {}) {
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  const t = tokenStore.get();
  if (t && !headers.Authorization) headers.Authorization = `Bearer ${t}`;

  const res = await fetch(url, { ...opts, headers });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const j = await res.json(); if (j?.error) msg = j.error; } catch { /* ignore */ }
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  register: (data) => request("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login:    (data) => request("/api/auth/login",    { method: "POST", body: JSON.stringify(data) }),
  logout:   ()     => request("/api/auth/logout",   { method: "POST" }),
  me:       ()     => request("/api/auth/me"),

  getMyEntries: () => request("/api/entries"),
  saveEntry: (date, patch) =>
    request(`/api/entries/${date}`, { method: "PUT", body: JSON.stringify(patch) }),
  deleteEntry: (date) =>
    request(`/api/entries/${date}`, { method: "DELETE" }),

  adminLogin: (passcode) =>
    request("/api/admin/login", { method: "POST", body: JSON.stringify({ passcode }) }),
  adminListUsers: (passcode) =>
    request("/api/admin/users", { headers: { "X-Admin-Passcode": passcode } }),
  adminDeleteUser: (passcode, id) =>
    request(`/api/admin/users/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "X-Admin-Passcode": passcode },
    }),
};
