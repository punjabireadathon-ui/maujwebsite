import { sql } from "../../_db.js";
import { requireAdmin } from "../../_auth.js";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).json({ error: "method not allowed" });
  if (!requireAdmin(req, res)) return;

  const id = String(req.query.id || "");
  if (!id) return res.status(400).json({ error: "user id required" });

  await sql`DELETE FROM users WHERE id = ${id}`;
  res.json({ ok: true });
}
