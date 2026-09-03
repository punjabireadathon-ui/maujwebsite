import { sql, ensureSchema } from "./_db.js";
import { nowIso } from "./_auth.js";

export default async function handler(_req, res) {
  try {
    await ensureSchema();
    const [{ c: users }]    = await sql`SELECT COUNT(*)::int AS c FROM users`;
    const [{ c: entries }]  = await sql`SELECT COUNT(*)::int AS c FROM daily_logs`;
    const [{ c: sessions }] = await sql`SELECT COUNT(*)::int AS c FROM sessions`;
    res.json({ ok: true, ts: nowIso(), users, entries, sessions });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
