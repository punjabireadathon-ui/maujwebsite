import { sql } from "../_db.js";
import { requireAuth, rowToEntry, dateStr } from "../_auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "method not allowed" });
  const auth = await requireAuth(req, res);
  if (!auth) return;

  const rows = await sql`
    SELECT * FROM daily_logs WHERE user_id = ${auth.user.id} ORDER BY date
  `;
  const entries = {};
  for (const r of rows) entries[dateStr(r.date)] = rowToEntry(r);
  res.json({ entries });
}
