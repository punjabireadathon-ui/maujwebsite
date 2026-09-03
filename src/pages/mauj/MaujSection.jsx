import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronRight, LogOut, Loader2 } from "lucide-react";
import SectionEyebrow from "../../components/SectionEyebrow.jsx";
import Rule from "../../components/Rule.jsx";
import Seal from "../../components/Seal.jsx";
import { HABITS } from "../../constants.js";
import { emptyEntry } from "../../utils.js";
import { api } from "../../api.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import Tracker from "./Tracker.jsx";
import AdminGate from "./AdminGate.jsx";
import AuthForms from "./AuthForms.jsx";

export default function MaujSection() {
  const { user, loading, logout } = useAuth();
  const [entries, setEntries] = useState({});
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [status, setStatus] = useState("");
  const pending = useRef(new Map());
  const saveTimers = useRef(new Map());

  useEffect(() => {
    if (!user) { setEntries({}); return; }
    setEntriesLoading(true);
    api.getMyEntries()
      .then(r => setEntries(r.entries || {}))
      .catch(() => setEntries({}))
      .finally(() => setEntriesLoading(false));
  }, [user?.id]);

  const flushSave = useCallback(async (date) => {
    const patch = pending.current.get(date);
    if (!patch) return;
    pending.current.delete(date);
    setStatus("ਸੇਵ ਹੋ ਰਿਹਾ ਹੈ… saving…");
    try {
      const saved = await api.saveEntry(date, patch);
      setEntries(prev => ({ ...prev, [date]: saved }));
      setStatus("ਸੇਵ ਹੋ ਗਿਆ ✓ saved");
      setTimeout(() => setStatus(""), 1200);
    } catch (e) {
      setStatus("save failed — " + (e.message || "will retry"));
    }
  }, []);

  const scheduleSave = useCallback((date, patch) => {
    const prev = pending.current.get(date) || {};
    pending.current.set(date, { ...prev, ...patch });
    if (saveTimers.current.has(date)) clearTimeout(saveTimers.current.get(date));
    saveTimers.current.set(date, setTimeout(() => flushSave(date), 500));
  }, [flushSave]);

  const updateEntry = (date, field, value) => {
    setEntries(prev => {
      const current = prev[date] || emptyEntry();
      return { ...prev, [date]: { ...current, [field]: value } };
    });
    scheduleSave(date, { [field]: value });
  };

  const clearEntry = async (date) => {
    try {
      await api.deleteEntry(date);
      setEntries(prev => {
        const next = { ...prev };
        delete next[date];
        return next;
      });
      setStatus("ਹਟਾਇਆ ਗਿਆ ✓ cleared");
      setTimeout(() => setStatus(""), 1200);
    } catch (e) {
      setStatus("clear failed — " + (e.message || ""));
    }
  };

  const record = user ? { studentId: user.id, name: user.name, entries } : null;

  return (
    <div>
      <section className="au-page-head">
        <SectionEyebrow>8 Atomic Habits · Just 30 minutes a day</SectionEyebrow>
        <h1 className="au-gur">MAUJ — My Att Uttam Journey</h1>
        <p className="au-lead">A roadmap to excellence in life, one small, honest day at a time.</p>
      </section>

      <section className="au-habits-grid">
        {HABITS.map(h => (
          <div className="au-habit-card" key={h.key}>
            <h.icon size={20} />
            <div>
              <div className="au-gur au-habit-gur">{h.gur}</div>
              <div className="au-habit-en">{h.en}</div>
            </div>
            <div className="au-habit-target au-mono">{h.target}</div>
          </div>
        ))}
      </section>

      <Rule />

      <section className="au-roadmap-strip">
        <Seal label="MAUJ ੧" sub="Unlocked · 3–5 months" state="open" />
        <div className="au-roadmap-arrow"><ChevronRight size={18} /></div>
        <Seal label="MAUJ ੨" sub="In progress" state="progress" />
        <div className="au-roadmap-arrow"><ChevronRight size={18} /></div>
        <Seal label="MAUJ ੩+" sub="Mentor-guided paths" state="locked" />
      </section>
      <p className="au-roadmap-note">Complete MAUJ 1, meet your mentors, and chart your own specific career path into the phases ahead.</p>

      <Rule />

      {loading && (
        <div className="au-loading"><Loader2 className="au-spin" size={22} /> Loading…</div>
      )}

      {!loading && !user && <AuthForms />}

      {!loading && user && (
        <>
          <div className="au-user-bar">
            <div>
              <div className="au-user-hi">ਸਤ ਸ੍ਰੀ ਅਕਾਲ · Welcome</div>
              <div className="au-user-name au-gur">{user.name}</div>
              <div className="au-user-meta au-mono">{user.email}</div>
            </div>
            <button className="au-btn-secondary au-btn-small" onClick={logout}>
              <LogOut size={14} /> Log out
            </button>
          </div>

          {entriesLoading ? (
            <div className="au-loading"><Loader2 className="au-spin" size={22} /> Loading your tracker…</div>
          ) : (
            <Tracker
              record={record}
              updateEntry={updateEntry}
              clearEntry={clearEntry}
              status={status}
              logout={logout}
            />
          )}
        </>
      )}

      <Rule />

      <AdminGate />
    </div>
  );
}
