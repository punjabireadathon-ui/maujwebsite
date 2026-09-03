import { sql } from "../_db.js";
import { requireAuth } from "../_auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });
  const auth = await requireAuth(req, res);
  if (!auth) return;
  await sql`DELETE FROM sessions WHERE token = ${auth.token}`;
  res.json({ ok: true });
}
