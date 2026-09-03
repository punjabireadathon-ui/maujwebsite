import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";
import { existsSync, mkdirSync, renameSync } from "fs";

const __dirname   = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

// Configurable data directory. Default: <project>/data. Override with MAUJ_DATA_DIR.
export const dataDir = process.env.MAUJ_DATA_DIR
  ? resolve(process.env.MAUJ_DATA_DIR)
  : join(projectRoot, "data");

if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

export const dbPath = join(dataDir, "mauj.db");

// One-time migration from the old <project>/server/data.db location.
const legacyPath = join(__dirname, "data.db");
if (existsSync(legacyPath) && !existsSync(dbPath)) {
  console.log(`[db] Migrating legacy DB: ${legacyPath} -> ${dbPath}`);
  renameSync(legacyPath, dbPath);
  for (const suffix of ["-wal", "-shm"]) {
    const src = legacyPath + suffix;
    if (existsSync(src)) renameSync(src, dbPath + suffix);
  }
}

console.log(`[db] Opening SQLite at ${dbPath}`);
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    joined_at  TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS entries (
    student_id     TEXT NOT NULL,
    date           TEXT NOT NULL,
    sehaj_paath    TEXT    DEFAULT '',
    sim            INTEGER DEFAULT 0,
    nature_watch   INTEGER DEFAULT 0,
    kanth_bani     INTEGER DEFAULT 0,
    ptm_hours      TEXT    DEFAULT '',
    read_aloud     TEXT    DEFAULT '',
    visualization  INTEGER DEFAULT 0,
    kasrat         TEXT    DEFAULT '',
    updated_at     TEXT NOT NULL,
    PRIMARY KEY (student_id, date),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_entries_date ON entries(date);

  CREATE TABLE IF NOT EXISTS users (
    id             TEXT PRIMARY KEY,
    name           TEXT NOT NULL,
    phone          TEXT,
    email          TEXT NOT NULL,
    password_hash  TEXT NOT NULL,
    reference_code TEXT,
    created_at     TEXT NOT NULL
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(lower(email));
  CREATE INDEX IF NOT EXISTS idx_users_ref ON users(reference_code);

  CREATE TABLE IF NOT EXISTS sessions (
    token       TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL,
    created_at  TEXT NOT NULL,
    expires_at  TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

  CREATE TABLE IF NOT EXISTS daily_logs (
    user_id        TEXT NOT NULL,
    date           TEXT NOT NULL,
    sehaj_paath    TEXT    DEFAULT '',
    sim            INTEGER DEFAULT 0,
    nature_watch   INTEGER DEFAULT 0,
    kanth_bani     INTEGER DEFAULT 0,
    ptm_hours      TEXT    DEFAULT '',
    read_aloud     TEXT    DEFAULT '',
    visualization  INTEGER DEFAULT 0,
    kasrat         TEXT    DEFAULT '',
    updated_at     TEXT NOT NULL,
    PRIMARY KEY (user_id, date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON daily_logs(date);
`);

let closed = false;
export function closeDb() {
  if (closed) return;
  closed = true;
  try {
    db.pragma("wal_checkpoint(TRUNCATE)");
    db.close();
    console.log("[db] Closed cleanly.");
  } catch (e) {
    console.error("[db] Close error:", e.message);
  }
}

// Safety net if the process exits without an explicit shutdown.
process.on("exit", closeDb);

export default db;
