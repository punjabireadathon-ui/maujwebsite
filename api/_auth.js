import { randomBytes } from "crypto";
import { sql, ensureSchema } from "./_db.js";

export const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "KHALSA2049";
const SESSION_DAYS = 30;

export const newSessionToken = () => randomBytes(32).toString("hex");
export const nowIso   = () => new Date().toISOString();
export const expiryIso = (days = SESSION_DAYS) =>
  new Date(Date.now() + days * 86400 * 1000).toISOString();

export const isDate  = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
export const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export function publicUser(u) {
  return {
    id: u.id,
    name: u.name,
    phone: u.phone,
    email: u.email,
    referenceCode: u.reference_code,
    createdAt: u.created_at,
  };
}

export function rowToEntry(r) {
  return {
    sehajPaath:    r.sehaj_paath ?? "",
    sim:           r.sim ?? 0,
    natureWatch:   !!r.nature_watch,
    kanthBani:     !!r.kanth_bani,
    ptmHours:      r.ptm_hours ?? "",
    readAloud:     r.read_aloud ?? "",
    visualization: !!r.visualization,
    kasrat:        r.kasrat ?? "",
    updatedAt:     r.updated_at,
  };
}

export const dateStr = (d) => {
  if (!d) return "";
  if (typeof d === "string") return d.slice(0, 10);
  return new Date(d).toISOString().slice(0, 10);
};

export async function requireAuth(req, res) {
  await ensureSchema();
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) { res.status(401).json({ error: "authentication required" }); return null; }

  const rows = await sql`
    SELECT s.token, u.*
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token = ${token} AND s.expires_at > NOW()
    LIMIT 1
  `;
  if (!rows.length) { res.status(401).json({ error: "session expired" }); return null; }
  return { user: rows[0], token };
}

export function requireAdmin(req, res) {
  if (req.headers["x-admin-passcode"] !== ADMIN_PASSCODE) {
    res.status(401).json({ error: "unauthorized" });
    return false;
  }
  return true;
}
