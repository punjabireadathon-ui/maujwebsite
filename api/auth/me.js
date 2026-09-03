import { requireAuth, publicUser } from "../_auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "method not allowed" });
  const auth = await requireAuth(req, res);
  if (!auth) return;
  res.json({ user: publicUser(auth.user) });
}
