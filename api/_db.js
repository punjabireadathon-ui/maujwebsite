import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Add it in Vercel → Project → Settings → Environment Variables.");
}

export const sql = neon(process.env.DATABASE_URL);

let ready = false;
export async function ensureSchema() {
  if (ready) return;
  await sql`CREATE TABLE IF NOT EXISTS users (
    id             UUID PRIMARY KEY,
    name           TEXT NOT NULL,
    phone          TEXT,
    email          TEXT NOT NULL,
    password_hash  TEXT NOT NULL,
    reference_code TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (lower(email))`;
  await sql`CREATE INDEX IF NOT EXISTS idx_users_ref ON users (reference_code)`;

  await sql`CREATE TABLE IF NOT EXISTS sessions (
    token       TEXT PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at  TIMESTAMPTZ NOT NULL
  )`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions (user_id)`;

  await sql`CREATE TABLE IF NOT EXISTS daily_logs (
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date           DATE NOT NULL,
    sehaj_paath    TEXT    DEFAULT '',
    sim            INTEGER DEFAULT 0,
    nature_watch   BOOLEAN DEFAULT FALSE,
    kanth_bani     BOOLEAN DEFAULT FALSE,
    ptm_hours      TEXT    DEFAULT '',
    read_aloud     TEXT    DEFAULT '',
    visualization  BOOLEAN DEFAULT FALSE,
    kasrat         TEXT    DEFAULT '',
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, date)
  )`;
  await sql`CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON daily_logs (date)`;
  ready = true;
}
