import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { randomBytes, randomUUID } from "crypto";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";
import { existsSync, mkdirSync, readdirSync, unlinkSync, statSync } from "fs";
import db, { closeDb, dbPath, dataDir } from "./db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json({ limit: "128kb" }));

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "KHALSA2049";
const PORT = Number(process.env.PORT || 3001);
const SESSION_DAYS = 30;
const BACKUP_INTERVAL_MS = Number(process.env.MAUJ_BACKUP_INTERVAL_MS || 24 * 60 * 60 * 1000);
const BACKUP_KEEP        = Number(process.env.MAUJ_BACKUP_KEEP || 14);

/* ---------- helpers ---------- */

const nowIso  = () => new Date().toISOString();
const isDate  = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

function newSessionToken() { return randomBytes(32).toString("hex"); }
function expiryIso(days = SESSION_DAYS) {
  return new Date(Date.now() + days * 86400 * 1000).toISOString();
}

function publicUser(u) {
  return {
    id: u.id, name: u.name, phone: u.phone, email: u.email,
    referenceCode: u.reference_code, createdAt: u.created_at,
  };
}

function rowToEntry(r) {
  return {
    sehajPaath:    r.sehaj_paath,
    sim:           r.sim,
    natureWatch:   !!r.nature_watch,
    kanthBani:     !!r.kanth_bani,
    ptmHours:      r.ptm_hours,
    readAloud:     r.read_aloud,
    visualization: !!r.visualization,
    kasrat:        r.kasrat,
    updatedAt:     r.updated_at,
  };
}

function getEntriesFor(userId) {
  const rows = db.prepare("SELECT * FROM daily_logs WHERE user_id = ? ORDER BY date").all(userId);
  const entries = {};
  for (const r of rows) entries[r.date] = rowToEntry(r);
  return entries;
}

/* ---------- auth middleware ---------- */

function requireAuth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "authentication required" });

  const s = db.prepare("SELECT * FROM sessions WHERE token = ?").get(token);
  if (!s || new Date(s.expires_at) < new Date()) {
    if (s) db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
    return res.status(401).json({ error: "session expired" });
  }
  const u = db.prepare("SELECT * FROM users WHERE id = ?").get(s.user_id);
  if (!u) return res.status(401).json({ error: "user not found" });

  req.user = u;
  req.token = token;
  next();
}

function requireAdmin(req, res, next) {
  if (req.headers["x-admin-passcode"] !== ADMIN_PASSCODE) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

/* ---------- auth routes ---------- */

app.post("/api/auth/register", async (req, res) => {
  const name  = String(req.body?.name  || "").trim();
  const phone = String(req.body?.phone || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password      = String(req.body?.password      || "");
  const referenceCode = String(req.body?.referenceCode || "").trim() || null;

  if (!name)                     return res.status(400).json({ error: "Name is required" });
  if (!isEmail(email))           return res.status(400).json({ error: "Enter a valid email" });
  if (password.length < 8)       return res.status(400).json({ error: "Password must be at least 8 characters" });
  if (phone && phone.length < 6) return res.status(400).json({ error: "Enter a valid phone number" });

  const existing = db.prepare("SELECT id FROM users WHERE lower(email) = ?").get(email);
  if (existing) return res.status(409).json({ error: "An account with this email already exists" });

  const id = randomUUID();
  const hash = await bcrypt.hash(password, 12);
  db.prepare(`
    INSERT INTO users (id, name, phone, email, password_hash, reference_code, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, name, phone || null, email, hash, referenceCode, nowIso());

  const token = newSessionToken();
  db.prepare("INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)")
    .run(token, id, nowIso(), expiryIso());

  const u = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  res.json({ token, user: publicUser(u) });
});

app.post("/api/auth/login", async (req, res) => {
  const email    = String(req.body?.email    || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  const u = db.prepare("SELECT * FROM users WHERE lower(email) = ?").get(email);
  if (!u) return res.status(401).json({ error: "Invalid email or password" });

  const ok = await bcrypt.compare(password, u.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid email or password" });

  const token = newSessionToken();
  db.prepare("INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)")
    .run(token, u.id, nowIso(), expiryIso());

  res.json({ token, user: publicUser(u) });
});

app.post("/api/auth/logout", requireAuth, (req, res) => {
  db.prepare("DELETE FROM sessions WHERE token = ?").run(req.token);
  res.json({ ok: true });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

/* ---------- entries (authenticated) ---------- */

app.get("/api/entries", requireAuth, (req, res) => {
  res.json({ entries: getEntriesFor(req.user.id) });
});

app.put("/api/entries/:date", requireAuth, (req, res) => {
  const { date } = req.params;
  if (!isDate(date)) return res.status(400).json({ error: "invalid date; expected YYYY-MM-DD" });

  const userId = req.user.id;
  const existing = db.prepare("SELECT * FROM daily_logs WHERE user_id = ? AND date = ?").get(userId, date);
  const base = existing ? rowToEntry(existing) : {
    sehajPaath: "", sim: 0, natureWatch: false, kanthBani: false,
    ptmHours: "", readAloud: "", visualization: false, kasrat: "",
  };
  const merged = { ...base, ...(req.body || {}) };

  db.prepare(`
    INSERT INTO daily_logs
      (user_id, date, sehaj_paath, sim, nature_watch, kanth_bani, ptm_hours, read_aloud, visualization, kasrat, updated_at)
    VALUES
      (@user_id, @date, @sehaj_paath, @sim, @nature_watch, @kanth_bani, @ptm_hours, @read_aloud, @visualization, @kasrat, @updated_at)
    ON CONFLICT(user_id, date) DO UPDATE SET
      sehaj_paath   = excluded.sehaj_paath,
      sim           = excluded.sim,
      nature_watch  = excluded.nature_watch,
      kanth_bani    = excluded.kanth_bani,
      ptm_hours     = excluded.ptm_hours,
      read_aloud    = excluded.read_aloud,
      visualization = excluded.visualization,
      kasrat        = excluded.kasrat,
      updated_at    = excluded.updated_at
  `).run({
    user_id:       userId,
    date,
    sehaj_paath:   String(merged.sehajPaath ?? ""),
    sim:           Number.isFinite(+merged.sim) ? Math.max(0, Math.min(5, +merged.sim)) : 0,
    nature_watch:  merged.natureWatch ? 1 : 0,
    kanth_bani:    merged.kanthBani ? 1 : 0,
    ptm_hours:     String(merged.ptmHours ?? ""),
    read_aloud:    String(merged.readAloud ?? ""),
    visualization: merged.visualization ? 1 : 0,
    kasrat:        String(merged.kasrat ?? ""),
    updated_at:    nowIso(),
  });

  const saved = db.prepare("SELECT * FROM daily_logs WHERE user_id = ? AND date = ?").get(userId, date);
  res.json(rowToEntry(saved));
});

app.delete("/api/entries/:date", requireAuth, (req, res) => {
  const { date } = req.params;
  if (!isDate(date)) return res.status(400).json({ error: "invalid date" });
  db.prepare("DELETE FROM daily_logs WHERE user_id = ? AND date = ?").run(req.user.id, date);
  res.json({ ok: true });
});

/* ---------- admin ---------- */

app.post("/api/admin/login", (req, res) => {
  if (req.body?.passcode === ADMIN_PASSCODE) return res.json({ ok: true });
  return res.status(401).json({ error: "Invalid passcode" });
});

app.get("/api/admin/users", requireAdmin, (_req, res) => {
  const users = db.prepare("SELECT * FROM users ORDER BY created_at DESC").all();
  const out = users.map(u => ({ ...publicUser(u), entries: getEntriesFor(u.id) }));
  res.json(out);
});

app.delete("/api/admin/users/:id", requireAdmin, (req, res) => {
  db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

/* ---------- health + stats (verify persistence at a glance) ---------- */

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    ts: nowIso(),
    dbPath,
    dataDir,
    users:      db.prepare("SELECT COUNT(*) AS c FROM users").get().c,
    entries:    db.prepare("SELECT COUNT(*) AS c FROM daily_logs").get().c,
    sessions:   db.prepare("SELECT COUNT(*) AS c FROM sessions").get().c,
    lastBackup: LAST_BACKUP,
  });
});

/* ---------- Automated backups ---------- */

const backupsDir = join(dataDir, "backups");
if (!existsSync(backupsDir)) mkdirSync(backupsDir, { recursive: true });
let LAST_BACKUP = null;

async function makeBackup() {
  const stamp = new Date().toISOString().replace(/[:]/g, "-").slice(0, 19);
  const target = join(backupsDir, `mauj-${stamp}.db`);
  try {
    await db.backup(target);
    LAST_BACKUP = { at: nowIso(), file: target };
    console.log(`[backup] ${target}`);

    // Rotate: keep the N most-recent backups.
    const files = readdirSync(backupsDir)
      .filter(f => f.startsWith("mauj-") && f.endsWith(".db"))
      .map(f => ({ name: f, path: join(backupsDir, f), mtime: statSync(join(backupsDir, f)).mtimeMs }))
      .sort((a, b) => b.mtime - a.mtime);
    for (const f of files.slice(BACKUP_KEEP)) {
      unlinkSync(f.path);
      console.log(`[backup] pruned ${f.name}`);
    }
  } catch (e) {
    console.error("[backup] failed:", e.message);
  }
}

setTimeout(makeBackup, 10 * 1000);
const backupTimer = setInterval(makeBackup, BACKUP_INTERVAL_MS);

/* ---------- Serve built frontend (production) ---------- */

const distDir = resolve(__dirname, "..", "dist");
if (existsSync(distDir)) {
  console.log(`[web] Serving built frontend from ${distDir}`);
  app.use(express.static(distDir));
  app.get(/^\/(?!api\/).*/, (_req, res) => res.sendFile(join(distDir, "index.html")));
}

/* ---------- Boot + graceful shutdown ---------- */

const server = app.listen(PORT, () => {
  console.log(`MAUJ API listening on http://localhost:${PORT}`);
  console.log(`   Data dir: ${dataDir}`);
  console.log(`   Backups:  ${backupsDir}`);
});

let shuttingDown = false;
function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`\n[server] ${signal} received — shutting down…`);
  clearInterval(backupTimer);
  server.close(() => {
    closeDb();
    process.exit(0);
  });
  setTimeout(() => {
    console.error("[server] Forced exit after 5s timeout.");
    closeDb();
    process.exit(1);
  }, 5000).unref();
}
process.on("SIGINT",  () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("uncaughtException",  (e) => console.error("[uncaught]", e));
process.on("unhandledRejection", (e) => console.error("[unhandled]", e));
