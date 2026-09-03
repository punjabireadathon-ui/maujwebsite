import { ADMIN_PASSCODE } from "../_auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });
  if (req.body?.passcode === ADMIN_PASSCODE) return res.json({ ok: true });
  return res.status(401).json({ error: "Invalid passcode" });
}
