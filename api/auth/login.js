import bcrypt from "bcryptjs";
import { sql, ensureSchema } from "../_db.js";
import { newSessionToken, expiryIso, publicUser } from "../_auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });
  await ensureSchema();

  const email    = String(req.body?.email    || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  const rows = await sql`SELECT * FROM users WHERE lower(email) = ${email} LIMIT 1`;
  const u = rows[0];
  if (!u) return res.status(401).json({ error: "Invalid email or password" });

  const ok = await bcrypt.compare(password, u.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid email or password" });

  const token = newSessionToken();
  await sql`
    INSERT INTO sessions (token, user_id, expires_at)
    VALUES (${token}, ${u.id}, ${expiryIso()})
  `;

  res.json({ token, user: publicUser(u) });
}
