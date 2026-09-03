import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { sql, ensureSchema } from "../_db.js";
import { newSessionToken, expiryIso, publicUser, isEmail } from "../_auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });
  await ensureSchema();

  const name  = String(req.body?.name  || "").trim();
  const phone = String(req.body?.phone || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password      = String(req.body?.password      || "");
  const referenceCode = String(req.body?.referenceCode || "").trim() || null;

  if (!name)                     return res.status(400).json({ error: "Name is required" });
  if (!isEmail(email))           return res.status(400).json({ error: "Enter a valid email" });
  if (password.length < 8)       return res.status(400).json({ error: "Password must be at least 8 characters" });
  if (phone && phone.length < 6) return res.status(400).json({ error: "Enter a valid phone number" });

  const dup = await sql`SELECT id FROM users WHERE lower(email) = ${email} LIMIT 1`;
  if (dup.length) return res.status(409).json({ error: "An account with this email already exists" });

  const id   = randomUUID();
  const hash = await bcrypt.hash(password, 12);

  const [u] = await sql`
    INSERT INTO users (id, name, phone, email, password_hash, reference_code)
    VALUES (${id}, ${name}, ${phone || null}, ${email}, ${hash}, ${referenceCode})
    RETURNING *
  `;

  const token = newSessionToken();
  await sql`
    INSERT INTO sessions (token, user_id, expires_at)
    VALUES (${token}, ${id}, ${expiryIso()})
  `;

  res.json({ token, user: publicUser(u) });
}
