import { GURMUKHI_DIGITS } from "./constants.js";

export const toGurmukhi = (n) =>
  String(n).split("").map(d => GURMUKHI_DIGITS[+d] || d).join("");

export function emptyEntry() {
  return {
    sehajPaath: "",
    sim: 0,
    natureWatch: false,
    kanthBani: false,
    ptmHours: "",
    readAloud: "",
    visualization: false,
    kasrat: "",
  };
}

export function emptyRecord(name, id) {
  const entries = {};
  for (let d = 1; d <= 31; d++) entries[d] = emptyEntry();
  return { name, studentId: id, joinedAt: new Date().toISOString(), entries };
}

export function dayCompletion(e) {
  if (!e) return 0;
  let c = 0;
  if (e.sehajPaath) c++;
  if (e.sim > 0) c++;
  if (e.natureWatch) c++;
  if (e.kanthBani) c++;
  if (e.ptmHours) c++;
  if (e.readAloud) c++;
  if (e.visualization) c++;
  if (e.kasrat) c++;
  return c;
}
