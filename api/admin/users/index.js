import { sql, ensureSchema } from "../../_db.js";
import { requireAdmin, publicUser, rowToEntry, dateStr } from "../../_auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "method not allowed" });
  if (!requireAdmin(req, res)) return;
  await ensureSchema();

  const users = await sql`SELECT * FROM users ORDER BY created_at DESC`;
  const logs  = await sql`SELECT * FROM daily_logs ORDER BY user_id, date`;

  const byUser = new Map();
  for (const l of logs) {
    const arr = byUser.get(l.user_id) || {};
    arr[dateStr(l.date)] = rowToEntry(l);
    byUser.set(l.user_id, arr);
  }

  res.json(users.map(u => ({ ...publicUser(u), entries: byUser.get(u.id) || {} })));
}
