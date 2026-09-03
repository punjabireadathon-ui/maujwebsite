import { sql } from "../_db.js";
import { requireAuth, rowToEntry, isDate } from "../_auth.js";

export default async function handler(req, res) {
  const auth = await requireAuth(req, res);
  if (!auth) return;

  const date = String(req.query.date || "");
  if (!isDate(date)) return res.status(400).json({ error: "invalid date; expected YYYY-MM-DD" });

  if (req.method === "DELETE") {
    await sql`DELETE FROM daily_logs WHERE user_id = ${auth.user.id} AND date = ${date}`;
    return res.json({ ok: true });
  }

  if (req.method !== "PUT") return res.status(405).json({ error: "method not allowed" });

  const [existing] = await sql`
    SELECT * FROM daily_logs WHERE user_id = ${auth.user.id} AND date = ${date} LIMIT 1
  `;
  const base = existing ? rowToEntry(existing) : {
    sehajPaath: "", sim: 0, natureWatch: false, kanthBani: false,
    ptmHours: "", readAloud: "", visualization: false, kasrat: "",
  };
  const merged = { ...base, ...(req.body || {}) };
  const sim = Number.isFinite(+merged.sim) ? Math.max(0, Math.min(5, +merged.sim)) : 0;

  const [saved] = await sql`
    INSERT INTO daily_logs
      (user_id, date, sehaj_paath, sim, nature_watch, kanth_bani, ptm_hours, read_aloud, visualization, kasrat, updated_at)
    VALUES
      (${auth.user.id}, ${date}, ${String(merged.sehajPaath ?? "")}, ${sim},
       ${!!merged.natureWatch}, ${!!merged.kanthBani}, ${String(merged.ptmHours ?? "")},
       ${String(merged.readAloud ?? "")}, ${!!merged.visualization}, ${String(merged.kasrat ?? "")},
       NOW())
    ON CONFLICT (user_id, date) DO UPDATE SET
      sehaj_paath   = EXCLUDED.sehaj_paath,
      sim           = EXCLUDED.sim,
      nature_watch  = EXCLUDED.nature_watch,
      kanth_bani    = EXCLUDED.kanth_bani,
      ptm_hours     = EXCLUDED.ptm_hours,
      read_aloud    = EXCLUDED.read_aloud,
      visualization = EXCLUDED.visualization,
      kasrat        = EXCLUDED.kasrat,
      updated_at    = NOW()
    RETURNING *
  `;

  res.json(rowToEntry(saved));
}
