import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  BookOpen, Volume2, Repeat, Dumbbell, TreePine, Eye, Smile, Phone,
  Lock, ChevronRight, Check, X, Users, Shield, LogOut, Sparkles,
  Menu, Home as HomeIcon, GraduationCap, Info, ArrowRight, Trash2,
  Compass, Award, Save, RefreshCw
} from "lucide-react";

/* ---------------------------------------------------------------- *
 *  ਅਤਿ ਊਤਮ ਹੋਵਹੁ  —  data + helpers
 * ---------------------------------------------------------------- */

const ADMIN_PASSCODE = "KHALSA2049";

const GURMUKHI_DIGITS = ["੦","੧","੨","੩","੪","੫","੬","੭","੮","੯"];
const toGurmukhi = (n) => String(n).split("").map(d => GURMUKHI_DIGITS[+d] || d).join("");

const HABITS = [
  { key: "sehajPaath",   gur: "ਸਹਿਜ ਪਾਠ",        en: "Sehaj Paath",     target: "5 min",  icon: BookOpen,  type: "ang" },
  { key: "readAloud",    gur: "ਉੱਚੀ ਪੜ੍ਹਨਾ",      en: "Read Aloud",      target: "10 min", icon: Volume2,   type: "mins" },
  { key: "kanthBani",    gur: "ਬਾਣੀ ਕੰਠ",         en: "Bani Kanth",      target: "3 min",  icon: Repeat,    type: "check" },
  { key: "kasrat",       gur: "ਕਸਰਤ",             en: "Kasrat",          target: "10 min", icon: Dumbbell,  type: "mins" },
  { key: "natureWatch",  gur: "ਕੁਦਰਤ ਨਿਹਾਰਨਾ",     en: "Nature Watch",    target: "1 min",  icon: TreePine,  type: "check" },
  { key: "visualization",gur: "ਦ੍ਰਿਸ਼ਟੀਕਰਨ",       en: "Visualisation",   target: "1 min",  icon: Eye,       type: "check" },
  { key: "sim",          gur: "SIM",              en: "Smile is Must",   target: "—",      icon: Smile,     type: "rating" },
  { key: "ptm",          gur: "PTM",              en: "Phone to Mother", target: "—",      icon: Phone,     type: "hours" },
];

const CHAR_STRENGTHS = {
  "ਸਿਆਣਪ · Wisdom": ["Curiosity","Love of Learning","Creativity","Perspective","Judgment"],
  "ਦਲੇਰੀ · Courage": ["Courage","Honesty","Perseverance","Zest"],
  "ਮਨੁੱਖਤਾ · Humanity": ["Love","Kindness","Social Intelligence"],
  "ਨਿਆਂ · Justice": ["Fairness","Leadership","Teamwork"],
  "ਸੰਜਮ · Temperance": ["Forgiveness","Humility","Prudence","Self-Regulation"],
  "ਪਾਰਗਾਮਤਾ · Transcendence": ["Appreciation of Beauty","Gratitude","Hope","Humour","Spirituality"],
};

function emptyEntry() {
  return { sehajPaath: "", sim: 0, natureWatch: false, kanthBani: false, ptmHours: "", readAloud: "", visualization: false, kasrat: "" };
}
function emptyRecord(name, id) {
  const entries = {};
  for (let d = 1; d <= 31; d++) entries[d] = emptyEntry();
  return { name, studentId: id, joinedAt: new Date().toISOString(), entries };
}
function dayCompletion(e) {
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

/* ---------------------------------------------------------------- *
 *  Shared visual bits
 * ---------------------------------------------------------------- */

function Seal({ label, sub, state }) {
  // state: "open" | "progress" | "locked"
  const color = state === "open" ? "var(--saffron)" : state === "progress" ? "var(--sage)" : "var(--line)";
  const textColor = state === "locked" ? "#9a8f6f" : "var(--ink)";
  return (
    <div className="au-seal" style={{ borderColor: color }}>
      <div className="au-seal-ring" style={{ borderColor: color }}>
        {state === "locked" ? <Lock size={20} color={textColor} /> : state === "progress" ? <RefreshCw size={20} color={textColor} /> : <Check size={22} color={textColor} />}
      </div>
      <div className="au-seal-label au-gur" style={{ color: textColor }}>{label}</div>
      <div className="au-seal-sub" style={{ color: textColor }}>{sub}</div>
    </div>
  );
}

function Rule() {
  return <div className="au-rule" />;
}

function SectionEyebrow({ children }) {
  return <div className="au-eyebrow">{children}</div>;
}

/* ---------------------------------------------------------------- *
 *  Nav
 * ---------------------------------------------------------------- */

function Nav({ page, setPage }) {
  const [open, setOpen] = useState(false);
  const items = [
    { id: "home", gur: "ਘਰ", en: "Home", icon: HomeIcon },
    { id: "mauj", gur: "MAUJ", en: "My Att Uttam Journey", icon: Compass },
    { id: "academic", gur: "ਵਿਦਿਅਕ ਪ੍ਰਫੁੱਲਤਾ", en: "Academic Excellence @2049", icon: GraduationCap },
    { id: "about", gur: "ਬਾਰੇ", en: "About & Roadmap", icon: Info },
  ];
  return (
    <header className="au-nav">
      <div className="au-nav-inner">
        <button className="au-brand" onClick={() => { setPage("home"); setOpen(false); }}>
          <span className="au-brand-mark">ੴ</span>
          <span className="au-brand-text au-gur">ਅਤਿ ਊਤਮ ਹੋਵਹੁ</span>
        </button>
        <nav className="au-nav-links">
          {items.map(it => (
            <button key={it.id} className={"au-nav-link" + (page === it.id ? " au-nav-link-active" : "")} onClick={() => setPage(it.id)}>
              <span className="au-gur">{it.gur}</span>
            </button>
          ))}
        </nav>
        <button className="au-nav-burger" onClick={() => setOpen(o => !o)} aria-label="Menu">
          <Menu size={22} />
        </button>
      </div>
      {open && (
        <div className="au-nav-mobile">
          {items.map(it => (
            <button key={it.id} className="au-nav-mobile-link" onClick={() => { setPage(it.id); setOpen(false); }}>
              <it.icon size={16} />
              <span className="au-gur">{it.gur}</span>
              <span className="au-nav-mobile-en">{it.en}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

/* ---------------------------------------------------------------- *
 *  Home
 * ---------------------------------------------------------------- */

function Home({ setPage }) {
  return (
    <div>
      <section className="au-hero">
        <SectionEyebrow>ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ</SectionEyebrow>
        <h1 className="au-hero-shabad au-gur">
          ਅਤਿ ਊਤਮ ਅਤਿ ਊਤਮ ਹੋਵਹੁ<br />ਸਭ ਸ੍ਰਿਸਟਿ ਚਰਨ ਤਲ ਦੀਜੈ ॥੨॥
        </h1>
        <p className="au-hero-gloss">
          Become truly exalted, truly exalted — by placing yourself at the feet of all creation.
          Real greatness is reached through humility, not above others but in service of them.
        </p>
        <p className="au-hero-mission">
          This is the spirit behind everything here: a generation of Khalsa youth who rise in
          learning and character alike, without ever losing the ground beneath their feet.
        </p>
        <div className="au-hero-actions">
          <button className="au-btn-primary" onClick={() => setPage("mauj")}>
            ਸ਼ੁਰੂ ਕਰੋ MAUJ 1 <ArrowRight size={16} />
          </button>
          <button className="au-btn-secondary" onClick={() => setPage("academic")}>
            Why 2049?
          </button>
        </div>
      </section>

      <Rule />

      <section className="au-pillars">
        <div className="au-pillar" onClick={() => setPage("mauj")}>
          <Compass size={26} />
          <h3 className="au-gur">MAUJ</h3>
          <p>My Att Uttam Journey — 8 atomic habits, just 30 minutes a day, tracked and saved.</p>
          <span className="au-pillar-link">ਸ਼ੁਰੂ ਕਰੋ <ChevronRight size={14} /></span>
        </div>
        <div className="au-pillar" onClick={() => setPage("academic")}>
          <GraduationCap size={26} />
          <h3 className="au-gur">ਵਿਦਿਅਕ ਪ੍ਰਫੁੱਲਤਾ</h3>
          <p>Academic Excellence of Khalsa @2049 — reclaiming 200 years of lost academic glory.</p>
          <span className="au-pillar-link">ਪੜ੍ਹੋ <ChevronRight size={14} /></span>
        </div>
        <div className="au-pillar" onClick={() => setPage("about")}>
          <Info size={26} />
          <h3 className="au-gur">ਬਾਰੇ</h3>
          <p>The roadmap beyond MAUJ 1, and the 24 character strengths we're building toward.</p>
          <span className="au-pillar-link">ਵੇਖੋ <ChevronRight size={14} /></span>
        </div>
      </section>

      <Rule />

      <section className="au-quote-strip">
        <p className="au-gur">"ਸਿਰਜਣਹਾਰ ਕੌਣ? ਜੋ ਅਸਫਲ ਹੋਣ ਤੇ ਵੀ ਸਫਲਤਾ ਲਈ ਉੱਦਮ ਕਰਦਾ ਹੀ ਰਹੇ"</p>
        <p className="au-quote-en">The truly creative one keeps striving for success, even through failure.</p>
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 *  MAUJ  (login + CRUD tracker + admin)
 * ---------------------------------------------------------------- */

function MaujSection() {
  const [view, setView] = useState("intro"); // intro | login | tracker | admin
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [record, setRecord] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const saveTimer = useRef(null);

  // try to remember last-used id on this device (convenience only)
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("mauj_last_id", false);
        if (r && r.value) setStudentId(r.value);
      } catch (e) { /* no previous session on this device */ }
    })();
  }, []);

  const loadOrCreate = async (nm, id) => {
    setError("");
    if (!nm.trim() || !id.trim()) { setError("Please enter both your name and a MAUJ ID."); return; }
    const cleanId = id.trim().toLowerCase().replace(/\s+/g, "-");
    try {
      const existing = await window.storage.get(`mauj1:${cleanId}`, true);
      if (existing && existing.value) {
        setRecord(JSON.parse(existing.value));
      } else {
        const fresh = emptyRecord(nm.trim(), cleanId);
        await window.storage.set(`mauj1:${cleanId}`, JSON.stringify(fresh), true);
        setRecord(fresh);
      }
      setStudentId(cleanId);
      try { await window.storage.set("mauj_last_id", cleanId, false); } catch (e) {}
      setView("tracker");
    } catch (e) {
      setError("Could not reach storage right now — please try again.");
    }
  };

  const scheduleSave = useCallback((rec) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setStatus("ਸੇਵ ਹੋ ਰਿਹਾ ਹੈ… saving…");
    saveTimer.current = setTimeout(async () => {
      try {
        await window.storage.set(`mauj1:${rec.studentId}`, JSON.stringify(rec), true);
        setStatus("ਸੇਵ ਹੋ ਗਿਆ ✓ saved");
        setTimeout(() => setStatus(""), 1500);
      } catch (e) {
        setStatus("save failed — will retry on next edit");
      }
    }, 700);
  }, []);

  const updateDay = (day, field, value) => {
    setRecord(prev => {
      const next = { ...prev, entries: { ...prev.entries, [day]: { ...prev.entries[day], [field]: value } } };
      scheduleSave(next);
      return next;
    });
  };

  const clearDay = (day) => {
    setRecord(prev => {
      const next = { ...prev, entries: { ...prev.entries, [day]: emptyEntry() } };
      scheduleSave(next);
      return next;
    });
  };

  const logout = () => { setRecord(null); setView("intro"); setName(""); };

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

      {view === "intro" && (
        <section className="au-login-block">
          <h2 className="au-gur">ਆਪਣੀ ਯਾਤਰਾ ਸ਼ੁਰੂ ਕਰੋ</h2>
          <p>Begin or continue your MAUJ 1 tracker. Your daily entries are saved automatically so your mentor can follow your journey — please don't put anything private or sensitive in the sheet.</p>
          <button className="au-btn-primary" onClick={() => setView("login")}>Start / Continue Journey <ArrowRight size={16} /></button>
        </section>
      )}

      {view === "login" && (
        <section className="au-login-block">
          <h2 className="au-gur">ਪਹਿਚਾਣ</h2>
          <div className="au-form-row">
            <label>Your Name<br /><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sehajbir Singh" /></label>
            <label>Choose a MAUJ ID<br /><input value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="e.g. sehajbir01" /></label>
          </div>
          <p className="au-form-hint">Remember your MAUJ ID — you'll use it to return to this exact sheet next time.</p>
          {error && <p className="au-form-error">{error}</p>}
          <button className="au-btn-primary" onClick={() => loadOrCreate(name, studentId)}>Continue <ArrowRight size={16} /></button>
        </section>
      )}

      {view === "tracker" && record && (
        <Tracker record={record} updateDay={updateDay} clearDay={clearDay} status={status} logout={logout} />
      )}

      <Rule />

      <AdminGate />
    </div>
  );
}

function Tracker({ record, updateDay, clearDay, status, logout }) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const counts = days.map(d => dayCompletion(record.entries[d]));
  const loggedDays = counts.filter(c => c > 0).length;
  let streak = 0;
  for (let i = 0; i < counts.length; i++) { if (counts[i] > 0) streak++; else break; }

  return (
    <section className="au-tracker">
      <div className="au-tracker-head">
        <div>
          <h2 className="au-gur">{record.name}</h2>
          <p className="au-mono au-tracker-id">MAUJ ID: {record.studentId}</p>
        </div>
        <div className="au-tracker-stats">
          <div><span className="au-mono">{loggedDays}/31</span><small>days logged</small></div>
          <div><span className="au-mono">{streak}</span><small>current streak</small></div>
          <button className="au-btn-secondary au-btn-small" onClick={logout}><LogOut size={14} /> Switch student</button>
        </div>
      </div>

      <div className="au-bars">
        {counts.map((c, i) => (
          <div key={i} className="au-bar" title={`Day ${i + 1}: ${c}/8`}>
            <div className="au-bar-fill" style={{ height: `${(c / 8) * 100}%`, background: c >= 6 ? "var(--sage)" : c > 0 ? "var(--saffron)" : "var(--line)" }} />
          </div>
        ))}
      </div>

      <div className="au-table-wrap">
        <table className="au-table">
          <thead>
            <tr>
              <th>ਮਿਤੀ<br /><small>Date</small></th>
              {HABITS.map(h => (
                <th key={h.key}><h.icon size={14} /><br /><span className="au-gur">{h.gur}</span></th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {days.map(d => {
              const e = record.entries[d];
              const c = dayCompletion(e);
              return (
                <tr key={d} className={c === 8 ? "au-row-complete" : ""}>
                  <td className="au-mono au-date-cell">{toGurmukhi(d)}</td>
                  <td><input className="au-cell-input" value={e.sehajPaath} onChange={ev => updateDay(d, "sehajPaath", ev.target.value)} placeholder="ਅੰਗ" /></td>
                  <td><input className="au-cell-input" type="number" min="0" value={e.readAloud} onChange={ev => updateDay(d, "readAloud", ev.target.value)} placeholder="min" /></td>
                  <td><button className={"au-check" + (e.kanthBani ? " au-check-on" : "")} onClick={() => updateDay(d, "kanthBani", !e.kanthBani)}>{e.kanthBani ? <Check size={14} /> : ""}</button></td>
                  <td><input className="au-cell-input" type="number" min="0" value={e.kasrat} onChange={ev => updateDay(d, "kasrat", ev.target.value)} placeholder="min" /></td>
                  <td><button className={"au-check" + (e.natureWatch ? " au-check-on" : "")} onClick={() => updateDay(d, "natureWatch", !e.natureWatch)}>{e.natureWatch ? <Check size={14} /> : ""}</button></td>
                  <td><button className={"au-check" + (e.visualization ? " au-check-on" : "")} onClick={() => updateDay(d, "visualization", !e.visualization)}>{e.visualization ? <Check size={14} /> : ""}</button></td>
                  <td>
                    <div className="au-rating">
                      {[1,2,3,4,5].map(n => (
                        <button key={n} className={"au-rating-dot" + (e.sim >= n ? " au-rating-dot-on" : "")} onClick={() => updateDay(d, "sim", e.sim === n ? 0 : n)} />
                      ))}
                    </div>
                  </td>
                  <td><input className="au-cell-input" type="number" min="0" step="0.5" value={e.ptmHours} onChange={ev => updateDay(d, "ptmHours", ev.target.value)} placeholder="hrs" /></td>
                  <td><button className="au-clear-btn" onClick={() => clearDay(d)} title="Clear day"><Trash2 size={13} /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="au-save-status au-mono">{status}</div>
    </section>
  );
}

function AdminGate() {
  const [unlocked, setUnlocked] = useState(false);
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [students, setStudents] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(false);

  const tryUnlock = () => {
    if (pass === ADMIN_PASSCODE) { setUnlocked(true); setErr(""); loadAll(); }
    else setErr("Incorrect passcode.");
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const listed = await window.storage.list("mauj1:", true);
      const keys = (listed && listed.keys) || [];
      const recs = [];
      for (const k of keys) {
        try {
          const r = await window.storage.get(k, true);
          if (r && r.value) recs.push(JSON.parse(r.value));
        } catch (e) {}
      }
      setStudents(recs);
    } catch (e) {
      setStudents([]);
    }
    setLoading(false);
  };

  const removeStudent = async (id) => {
    try {
      await window.storage.delete(`mauj1:${id}`, true);
      setStudents(prev => prev.filter(s => s.studentId !== id));
      if (openId === id) setOpenId(null);
    } catch (e) {}
  };

  if (!unlocked) {
    return (
      <section className="au-admin-gate">
        <Shield size={18} />
        <span>ਮੈਂਟਰ / ਐਡਮਿਨ ਪਹੁੰਚ · Mentor / Admin access</span>
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="passcode" onKeyDown={e => e.key === "Enter" && tryUnlock()} />
        <button className="au-btn-secondary au-btn-small" onClick={tryUnlock}>Unlock</button>
        {err && <span className="au-form-error">{err}</span>}
      </section>
    );
  }

  return (
    <section className="au-admin-panel">
      <h2 className="au-gur"><Users size={18} /> ਸਾਰੇ ਵਿਦਿਆਰਥੀ · All Students</h2>
      {loading && <p>Loading records…</p>}
      {students && students.length === 0 && <p>No students have registered yet.</p>}
      {students && students.length > 0 && (
        <div className="au-admin-list">
          {students.map(s => {
            const counts = Array.from({ length: 31 }, (_, i) => dayCompletion(s.entries[i + 1]));
            const logged = counts.filter(c => c > 0).length;
            return (
              <div key={s.studentId} className="au-admin-row">
                <div className="au-admin-row-main" onClick={() => setOpenId(openId === s.studentId ? null : s.studentId)}>
                  <span className="au-gur">{s.name}</span>
                  <span className="au-mono">{s.studentId}</span>
                  <span className="au-mono">{logged}/31 days</span>
                  <ChevronRight size={16} style={{ transform: openId === s.studentId ? "rotate(90deg)" : "none" }} />
                </div>
                <button className="au-clear-btn" onClick={() => removeStudent(s.studentId)} title="Remove record"><Trash2 size={14} /></button>
                {openId === s.studentId && (
                  <div className="au-admin-detail">
                    <div className="au-bars">
                      {counts.map((c, i) => (
                        <div key={i} className="au-bar" title={`Day ${i + 1}: ${c}/8`}>
                          <div className="au-bar-fill" style={{ height: `${(c / 8) * 100}%`, background: c >= 6 ? "var(--sage)" : c > 0 ? "var(--saffron)" : "var(--line)" }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ---------------------------------------------------------------- *
 *  Academic Excellence @2049
 * ---------------------------------------------------------------- */

function Academic({ setPage }) {
  const cards = [
    { gur: "ਉੱਚ ਇਰਾਦੇ ਸਾਨੂੰ ਸ਼ਕਤੀਸ਼ਾਲੀ ਬਣਾਉਂਦੇ ਹਨ", en: "High ideals make us powerful." },
    { gur: "ਵੱਡੇ ਨਿਸ਼ਾਨਿਆਂ ਨਾਲ ਹੌਂਸਲੇ ਵੀ ਵੱਡੇ ਹੋ ਜਾਂਦੇ ਹਨ", en: "Big goals grow big courage." },
    { gur: "ਵੰਗਾਰ! ਅੱਜ ਤੱਕ ਕਿਸੇ ਗੁਰਸਿੱਖ ਨੂੰ ਨੋਬਲ ਪ੍ਰਾਈਜ਼ ਨਹੀਂ ਮਿਲਿਆ", en: "A challenge: no Gursikh has won a Nobel Prize yet." },
    { gur: "ਕੰਮ ਵਿੱਚ ਹੀ ਆਨੰਦ ਹੈ", en: "Work is more fun than fun." },
    { gur: "ਪੜ੍ਹਾਉਣ ਵਾਲੇ ਨੂੰ ਕਦੇ ਵੀ ਸਿੱਖਣਾ ਨਹੀਂ ਛੱਡਣਾ ਚਾਹੀਦਾ", en: "One who teaches should never stop learning." },
    { gur: "ਵਿਦਿਆ ਰਾਹੀਂ ਮਨੁੱਖ ਔਖਿਆਈ ਤੋਂ ਮਸ਼ਾਲ ਬਣ ਜਾਂਦਾ ਹੈ", en: "Through education, hardship is turned into a torch." },
  ];
  return (
    <div>
      <section className="au-page-head">
        <SectionEyebrow>@੨੦੪੯</SectionEyebrow>
        <h1 className="au-gur">ਖਾਲਸਾ ਜੀ ਦੀ ਵਿਦਿਅਕ ਪ੍ਰਫੁੱਲਤਾ</h1>
        <p className="au-lead">Academic Excellence of Khalsa @2049 — excellence in academic life, in any discipline, stream, or specialisation.</p>
      </section>

      <section className="au-timeline">
        <div className="au-timeline-point">
          <div className="au-timeline-year au-mono">੧੮੪੯</div>
          <p>Punjab was annexed by the British. The first act was the deliberate dismantling of the Khalsa Raj's education system.</p>
        </div>
        <div className="au-timeline-line" />
        <div className="au-timeline-point au-timeline-point-now">
          <div className="au-timeline-year au-mono">ਅੱਜ</div>
          <p>2026 — the work of rebuilding is underway.</p>
        </div>
        <div className="au-timeline-line" />
        <div className="au-timeline-point">
          <div className="au-timeline-year au-mono">੨੦੪੯</div>
          <p>200 years since. The challenge: reach that lost glory of academic excellence again, by this time.</p>
        </div>
      </section>

      <Rule />

      <section className="au-vision">
        <h2 className="au-gur">ਪੰਜ ਖਾਲਸਾ</h2>
        <ul>
          <li><span className="au-gur">ਪ੍ਰਬੁੱਧ ਹੋਵੇ</span> — the Panj Khalsa becomes enlightened, awakened.</li>
          <li><span className="au-gur">ਹਰ ਗੁਰਸਿੱਖ ਮਾਈ-ਭਾਈ ਵਿਦਿਅਕ ਮਾਹਿਰ ਹੋਵੇ, ਗੁਰਮੁਖ ਵਿਦਵਾਨ ਹੋਵੇ</span> — every Gursikh mother and brother becomes an education specialist, a Gurmukh scholar.</li>
          <li><span className="au-gur">ਪਾਯਾ, ਬੀਨਾ, ਪ੍ਰਬੀਨ ਬਣੀਏ</span> — become learned, discerning, and skilled.</li>
          <li><span className="au-gur">ਖਾਲਸਾ — ਵਿਦਵਾਨ ਹੋਵੇ, ਸਕਾਲਰ ਹੋਵੇ</span> — sardars of the academic field too.</li>
        </ul>
        <p className="au-vision-note">ਗੁਰੂ ਕੇ ਲਾਲ ਜੀਓ — strive hard enough, search deep enough, that the good of all humanity comes of it, and be honoured with recognitions like the Nobel Prize and the World Food Prize.</p>
      </section>

      <Rule />

      <section className="au-five-s">
        <h2 className="au-gur">੫ 'ਸ' ਵਿਦਿਅਕ ਪ੍ਰਫੁੱਲਤਾ ਦੇ</h2>
        <div className="au-five-s-grid">
          {["ਸਹਿਜ ਪਾਠ · Sehaj Paath","ਸੈਲਫ ਸਟੱਡੀ · Self Study","ਸਕਿਲਸ · Skills","ਸਕਾਲਰਸ਼ਿਪ · Scholarship","ਸ਼ੇਅਰਿੰਗ · Sharing"].map((s,i) => (
            <div className="au-five-s-item" key={i}><span className="au-mono">{toGurmukhi(i+1)}</span><span className="au-gur">{s}</span></div>
          ))}
        </div>
      </section>

      <Rule />

      <section className="au-motivate-grid">
        {cards.map((c, i) => (
          <div className="au-motivate-card" key={i}>
            <p className="au-gur">{c.gur}</p>
            <p className="au-motivate-en">{c.en}</p>
          </div>
        ))}
      </section>

      <section className="au-cta-band">
        <p>Who can join? Anyone who wishes to excel in life — no age bar.</p>
        <button className="au-btn-primary" onClick={() => setPage("mauj")}>Start with MAUJ 1 <ArrowRight size={16} /></button>
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 *  About / Roadmap
 * ---------------------------------------------------------------- */

function About({ setPage }) {
  return (
    <div>
      <section className="au-page-head">
        <SectionEyebrow>Vision &amp; Roadmap</SectionEyebrow>
        <h1 className="au-gur">ਬਾਰੇ</h1>
        <p className="au-lead">MAUJ focuses on non-cognitive traits as much as academic ones — the character strengths that carry a person through a real, long journey.</p>
      </section>

      <section className="au-roadmap-strip">
        <Seal label="MAUJ ੧" sub="8 atomic habits" state="open" />
        <div className="au-roadmap-arrow"><ChevronRight size={18} /></div>
        <Seal label="MAUJ ੨" sub="In progress" state="progress" />
        <div className="au-roadmap-arrow"><ChevronRight size={18} /></div>
        <Seal label="Mentorship" sub="Illustrative" state="locked" />
        <div className="au-roadmap-arrow"><ChevronRight size={18} /></div>
        <Seal label="Career Paths" sub="Illustrative" state="locked" />
      </section>
      <p className="au-roadmap-note">Phases beyond MAUJ 1 are still unfolding — this order is illustrative, not final.</p>

      <Rule />

      <section className="au-strengths">
        <h2 className="au-gur"><Award size={20} /> ੨੪ ਕਿਰਦਾਰ ਸ਼ਕਤੀਆਂ · 24 Character Strengths</h2>
        <div className="au-strengths-grid">
          {Object.entries(CHAR_STRENGTHS).map(([virtue, list]) => (
            <div className="au-strength-group" key={virtue}>
              <h4 className="au-gur">{virtue}</h4>
              <ul>{list.map(s => <li key={s}>{s}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <Rule />

      <section className="au-cta-band">
        <p>Ready to begin your own MAUJ 1 sheet?</p>
        <button className="au-btn-primary" onClick={() => setPage("mauj")}>Go to MAUJ <ArrowRight size={16} /></button>
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 *  App shell
 * ---------------------------------------------------------------- */

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="au-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600;700&family=Mukta+Mahee:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        .au-root {
          --ink:#1B2A4A; --ink-soft:#3C4C74; --saffron:#E8871E; --saffron-deep:#C96A10;
          --parchment:#F7F1DE; --parchment-deep:#EFE2BC; --maroon:#7A2331; --sage:#4F7A5B;
          --line:#D8C9A3; --white:#FFFDF7;
          font-family:'Work Sans', sans-serif; color:var(--ink); background:var(--parchment);
          min-height:100vh; line-height:1.5;
        }
        .au-root * { box-sizing:border-box; }
        .au-gur { font-family:'Mukta Mahee', sans-serif; }
        .au-mono { font-family:'JetBrains Mono', monospace; }
        .au-root h1, .au-root h2, .au-root h3 { font-family:'Fraunces', serif; font-weight:700; margin:0; }

        .au-rule { border-top:3px solid var(--ink); border-bottom:1px solid var(--ink); height:0; margin:2.5rem auto; max-width:1100px; }

        /* Nav */
        .au-nav { position:sticky; top:0; z-index:20; background:var(--parchment); border-bottom:2px solid var(--ink); }
        .au-nav-inner { max-width:1200px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; padding:0.9rem 1.5rem; }
        .au-brand { display:flex; align-items:center; gap:0.5rem; background:none; border:none; cursor:pointer; }
        .au-brand-mark { font-size:1.6rem; color:var(--saffron-deep); }
        .au-brand-text { font-size:1.15rem; font-weight:700; color:var(--ink); }
        .au-nav-links { display:none; gap:1.75rem; }
        .au-nav-link { background:none; border:none; font-size:1rem; cursor:pointer; color:var(--ink-soft); padding:0.25rem 0; border-bottom:2px solid transparent; }
        .au-nav-link-active { color:var(--maroon); border-bottom-color:var(--saffron); font-weight:700; }
        .au-nav-burger { background:none; border:none; cursor:pointer; color:var(--ink); }
        .au-nav-mobile { display:flex; flex-direction:column; border-top:1px solid var(--line); padding:0.5rem 1.5rem 1rem; }
        .au-nav-mobile-link { display:flex; align-items:center; gap:0.6rem; background:none; border:none; text-align:left; padding:0.6rem 0; font-size:1rem; cursor:pointer; color:var(--ink); }
        .au-nav-mobile-en { color:var(--ink-soft); font-size:0.8rem; }
        @media (min-width:840px) { .au-nav-links{ display:flex; } .au-nav-burger{ display:none; } }

        .au-eyebrow { text-transform:uppercase; letter-spacing:0.14em; font-size:0.75rem; color:var(--maroon); font-weight:600; margin-bottom:0.75rem; }

        /* Hero */
        .au-hero { max-width:900px; margin:0 auto; padding:4rem 1.5rem 2rem; text-align:center; }
        .au-hero-shabad { font-size:1.9rem; color:var(--maroon); line-height:1.6; margin-bottom:1.25rem; }
        .au-hero-gloss { font-size:1.05rem; color:var(--ink-soft); max-width:620px; margin:0 auto 0.9rem; }
        .au-hero-mission { font-size:0.95rem; color:var(--ink); max-width:600px; margin:0 auto 1.75rem; }
        .au-hero-actions { display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; }

        .au-btn-primary, .au-btn-secondary { display:inline-flex; align-items:center; gap:0.4rem; font-weight:600; padding:0.75rem 1.4rem; border-radius:2px; cursor:pointer; font-size:0.95rem; }
        .au-btn-primary { background:var(--saffron); color:#fff; border:2px solid var(--ink); box-shadow:3px 3px 0 var(--ink); transition:transform .12s, box-shadow .12s; }
        .au-btn-primary:hover { transform:translate(-2px,-2px); box-shadow:5px 5px 0 var(--ink); }
        .au-btn-secondary { background:transparent; color:var(--ink); border:2px solid var(--ink); }
        .au-btn-secondary:hover { background:var(--parchment-deep); }
        .au-btn-small { padding:0.4rem 0.8rem; font-size:0.82rem; }

        /* Pillars */
        .au-pillars { max-width:1100px; margin:0 auto; padding:0 1.5rem; display:grid; grid-template-columns:1fr; gap:1.25rem; }
        @media (min-width:768px) { .au-pillars{ grid-template-columns:repeat(3,1fr); } }
        .au-pillar { background:var(--white); border:2px solid var(--ink); padding:1.5rem; cursor:pointer; transition:transform .12s; }
        .au-pillar:hover { transform:translateY(-3px); }
        .au-pillar h3 { margin:0.7rem 0 0.4rem; font-size:1.15rem; color:var(--maroon); }
        .au-pillar p { font-size:0.9rem; color:var(--ink-soft); margin:0 0 0.75rem; }
        .au-pillar-link { font-size:0.85rem; color:var(--saffron-deep); font-weight:600; display:inline-flex; align-items:center; gap:0.2rem; }

        .au-quote-strip { max-width:700px; margin:0 auto; text-align:center; padding:1rem 1.5rem 3rem; }
        .au-quote-strip p:first-child { font-size:1.2rem; color:var(--maroon); }
        .au-quote-en { color:var(--ink-soft); font-size:0.9rem; margin-top:0.4rem; }

        /* Page head generic */
        .au-page-head { max-width:900px; margin:0 auto; padding:3rem 1.5rem 1.5rem; text-align:center; }
        .au-page-head h1 { font-size:2rem; color:var(--maroon); margin-bottom:0.75rem; }
        .au-lead { color:var(--ink-soft); max-width:620px; margin:0 auto; }

        /* Habits grid */
        .au-habits-grid { max-width:1100px; margin:2rem auto 0; padding:0 1.5rem; display:grid; grid-template-columns:1fr; gap:0.75rem; }
        @media (min-width:640px){ .au-habits-grid{ grid-template-columns:repeat(2,1fr);} }
        @media (min-width:1000px){ .au-habits-grid{ grid-template-columns:repeat(4,1fr);} }
        .au-habit-card { background:var(--white); border:1px solid var(--line); border-left:4px solid var(--saffron); padding:0.9rem 1rem; display:flex; align-items:center; gap:0.75rem; }
        .au-habit-gur { font-weight:700; font-size:0.95rem; }
        .au-habit-en { font-size:0.75rem; color:var(--ink-soft); }
        .au-habit-target { margin-left:auto; font-size:0.78rem; color:var(--maroon); }

        /* Roadmap seals */
        .au-roadmap-strip { display:flex; align-items:center; justify-content:center; gap:0.75rem; flex-wrap:wrap; padding:2.5rem 1.5rem 0.5rem; max-width:1000px; margin:0 auto; }
        .au-roadmap-arrow { color:var(--line); }
        .au-roadmap-note { text-align:center; color:var(--ink-soft); font-size:0.85rem; max-width:520px; margin:0.5rem auto 2rem; }
        .au-seal { width:120px; text-align:center; border:2px dashed var(--line); border-radius:50%; padding:1rem 0.5rem; aspect-ratio:1/1; display:flex; flex-direction:column; align-items:center; justify-content:center; }
        .au-seal-ring { width:38px; height:38px; border-radius:50%; border:2px solid; display:flex; align-items:center; justify-content:center; margin-bottom:0.4rem; }
        .au-seal-label { font-weight:700; font-size:0.95rem; }
        .au-seal-sub { font-size:0.65rem; margin-top:0.15rem; }

        /* Login / tracker */
        .au-login-block { max-width:640px; margin:0 auto; padding:1rem 1.5rem 3rem; text-align:center; }
        .au-login-block h2 { color:var(--maroon); margin-bottom:0.6rem; }
        .au-form-row { display:flex; gap:1rem; flex-wrap:wrap; justify-content:center; margin:1.25rem 0; text-align:left; }
        .au-form-row label { font-size:0.85rem; color:var(--ink-soft); font-weight:600; }
        .au-form-row input { display:block; margin-top:0.3rem; padding:0.55rem 0.7rem; border:2px solid var(--ink); border-radius:2px; font-size:0.95rem; width:220px; background:var(--white); }
        .au-form-hint { font-size:0.8rem; color:var(--ink-soft); margin-bottom:1rem; }
        .au-form-error { color:var(--maroon); font-size:0.85rem; margin-bottom:0.75rem; }

        .au-tracker { max-width:1200px; margin:0 auto; padding:1rem 1.5rem 3rem; }
        .au-tracker-head { display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1rem; margin-bottom:1.25rem; }
        .au-tracker-head h2 { color:var(--maroon); font-size:1.3rem; }
        .au-tracker-id { color:var(--ink-soft); }
        .au-tracker-stats { display:flex; align-items:center; gap:1.25rem; }
        .au-tracker-stats div { text-align:center; }
        .au-tracker-stats span { display:block; font-size:1.2rem; color:var(--saffron-deep); }
        .au-tracker-stats small { color:var(--ink-soft); font-size:0.7rem; }

        .au-bars { display:flex; gap:2px; height:44px; align-items:flex-end; margin-bottom:1.25rem; background:var(--white); border:1px solid var(--line); padding:6px; }
        .au-bar { flex:1; height:100%; display:flex; align-items:flex-end; background:var(--parchment); }
        .au-bar-fill { width:100%; min-height:2px; }

        .au-table-wrap { overflow-x:auto; border:1px solid var(--ink); }
        .au-table { border-collapse:collapse; width:100%; min-width:920px; background:var(--white); }
        .au-table th { background:var(--parchment-deep); font-size:0.68rem; padding:0.5rem 0.35rem; border-bottom:2px solid var(--ink); border-left:1px solid var(--line); text-align:center; font-weight:600; }
        .au-table td { padding:0.25rem 0.3rem; border-bottom:1px solid var(--line); border-left:1px solid var(--line); text-align:center; }
        .au-date-cell { color:var(--maroon); font-weight:700; }
        .au-row-complete { background:#F3F8F1; }
        .au-cell-input { width:52px; padding:0.3rem; border:1px solid var(--line); text-align:center; font-size:0.8rem; border-radius:2px; }
        .au-check { width:24px; height:24px; border:1px solid var(--ink); background:var(--white); cursor:pointer; display:inline-flex; align-items:center; justify-content:center; border-radius:2px; }
        .au-check-on { background:var(--sage); color:#fff; border-color:var(--sage); }
        .au-rating { display:flex; gap:2px; justify-content:center; }
        .au-rating-dot { width:12px; height:12px; border-radius:50%; border:1px solid var(--saffron-deep); background:transparent; cursor:pointer; padding:0; }
        .au-rating-dot-on { background:var(--saffron); }
        .au-clear-btn { background:none; border:none; color:var(--ink-soft); cursor:pointer; padding:0.2rem; }
        .au-clear-btn:hover { color:var(--maroon); }
        .au-save-status { min-height:1.2rem; text-align:right; font-size:0.75rem; color:var(--sage); margin-top:0.4rem; }

        /* Admin */
        .au-admin-gate { max-width:640px; margin:0 auto; padding:1rem 1.5rem 3rem; display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap; font-size:0.85rem; color:var(--ink-soft); }
        .au-admin-gate input { padding:0.4rem 0.6rem; border:1px solid var(--line); border-radius:2px; }
        .au-admin-panel { max-width:1000px; margin:0 auto; padding:1rem 1.5rem 3rem; }
        .au-admin-panel h2 { display:flex; align-items:center; gap:0.5rem; color:var(--maroon); font-size:1.2rem; margin-bottom:1rem; }
        .au-admin-list { display:flex; flex-direction:column; gap:0.5rem; }
        .au-admin-row { background:var(--white); border:1px solid var(--line); padding:0.6rem 1rem; position:relative; }
        .au-admin-row-main { display:flex; align-items:center; gap:1.5rem; cursor:pointer; }
        .au-admin-row .au-clear-btn { position:absolute; right:0.75rem; top:0.6rem; }
        .au-admin-detail { margin-top:0.75rem; }

        /* Academic page */
        .au-timeline { max-width:900px; margin:2rem auto 0; padding:0 1.5rem; display:flex; align-items:flex-start; gap:0.5rem; }
        .au-timeline-point { flex:1; text-align:center; }
        .au-timeline-point-now .au-timeline-year { color:var(--sage); }
        .au-timeline-year { font-size:1.3rem; color:var(--maroon); font-weight:700; margin-bottom:0.5rem; }
        .au-timeline-point p { font-size:0.82rem; color:var(--ink-soft); }
        .au-timeline-line { flex:0 0 40px; height:2px; background:var(--line); margin-top:14px; }
        @media (max-width:640px){ .au-timeline{ flex-direction:column; } .au-timeline-line{ width:2px; height:24px; margin:0 auto; } }

        .au-vision { max-width:800px; margin:0 auto; padding:2rem 1.5rem 0; }
        .au-vision h2 { color:var(--maroon); text-align:center; margin-bottom:1rem; }
        .au-vision ul { list-style:none; padding:0; display:flex; flex-direction:column; gap:0.75rem; }
        .au-vision li { font-size:0.92rem; color:var(--ink-soft); border-left:3px solid var(--saffron); padding-left:0.9rem; }
        .au-vision-note { text-align:center; font-size:0.88rem; color:var(--maroon); margin-top:1.5rem; font-style:italic; }

        .au-five-s { max-width:900px; margin:0 auto; padding:1.5rem; text-align:center; }
        .au-five-s h2 { color:var(--maroon); margin-bottom:1.25rem; }
        .au-five-s-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:0.75rem; }
        @media (min-width:700px){ .au-five-s-grid{ grid-template-columns:repeat(5,1fr);} }
        .au-five-s-item { background:var(--white); border:1px solid var(--line); padding:1rem 0.5rem; display:flex; flex-direction:column; gap:0.35rem; align-items:center; font-size:0.85rem; }
        .au-five-s-item .au-mono { color:var(--saffron-deep); font-size:1.1rem; }

        .au-motivate-grid { max-width:1100px; margin:2rem auto 0; padding:0 1.5rem; display:grid; grid-template-columns:1fr; gap:1rem; }
        @media (min-width:700px){ .au-motivate-grid{ grid-template-columns:repeat(2,1fr);} }
        @media (min-width:1050px){ .au-motivate-grid{ grid-template-columns:repeat(3,1fr);} }
        .au-motivate-card { background:var(--white); border:1px solid var(--ink); padding:1.25rem; position:relative; }
        .au-motivate-card:before { content:""; position:absolute; top:6px; left:6px; right:6px; bottom:6px; border:1px solid var(--line); pointer-events:none; }
        .au-motivate-card p:first-child { color:var(--maroon); font-size:1rem; margin-bottom:0.5rem; }
        .au-motivate-en { font-size:0.8rem; color:var(--ink-soft); }

        .au-cta-band { max-width:700px; margin:3rem auto; text-align:center; padding:0 1.5rem; }
        .au-cta-band p { margin-bottom:1rem; color:var(--ink-soft); }

        /* About */
        .au-strengths { max-width:1100px; margin:0 auto; padding:1rem 1.5rem 2.5rem; }
        .au-strengths h2 { display:flex; align-items:center; gap:0.5rem; justify-content:center; color:var(--maroon); margin-bottom:1.5rem; text-align:center; }
        .au-strengths-grid { display:grid; grid-template-columns:1fr; gap:1rem; }
        @media (min-width:700px){ .au-strengths-grid{ grid-template-columns:repeat(2,1fr);} }
        @media (min-width:1000px){ .au-strengths-grid{ grid-template-columns:repeat(3,1fr);} }
        .au-strength-group { background:var(--white); border:1px solid var(--line); padding:1rem 1.25rem; }
        .au-strength-group h4 { color:var(--saffron-deep); font-size:0.9rem; margin-bottom:0.5rem; }
        .au-strength-group ul { margin:0; padding-left:1.1rem; font-size:0.85rem; color:var(--ink-soft); }
        .au-strength-group li { margin-bottom:0.2rem; }

        .au-footer { text-align:center; padding:2rem 1.5rem; border-top:2px solid var(--ink); color:var(--ink-soft); font-size:0.8rem; }
      `}</style>

      <Nav page={page} setPage={setPage} />
      {page === "home" && <Home setPage={setPage} />}
      {page === "mauj" && <MaujSection />}
      {page === "academic" && <Academic setPage={setPage} />}
      {page === "about" && <About setPage={setPage} />}

      <footer className="au-footer">
        <p className="au-gur">ਅਤਿ ਊਤਮ ਹੋਵਹੁ · ਸਾਂਝੀ ਟਰੱਸਟ</p>
        <p>Building academic and character excellence for 2049.</p>
      </footer>
    </div>
  );
}