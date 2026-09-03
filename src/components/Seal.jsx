import React from "react";
import { Lock, Check, RefreshCw } from "lucide-react";

// state: "open" | "progress" | "locked"
export default function Seal({ label, sub, state }) {
  const color =
    state === "open" ? "var(--saffron)" :
    state === "progress" ? "var(--sage)" : "var(--line)";
  const textColor = state === "locked" ? "#9a8f6f" : "var(--ink)";
  return (
    <div className="au-seal" style={{ borderColor: color }}>
      <div className="au-seal-ring" style={{ borderColor: color }}>
        {state === "locked"   ? <Lock size={20} color={textColor} /> :
         state === "progress" ? <RefreshCw size={20} color={textColor} /> :
                                <Check size={22} color={textColor} />}
      </div>
      <div className="au-seal-label au-gur" style={{ color: textColor }}>{label}</div>
      <div className="au-seal-sub" style={{ color: textColor }}>{sub}</div>
    </div>
  );
}
