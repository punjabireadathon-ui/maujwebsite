import React, { useMemo, useState, useEffect, useRef } from "react";
import { Check, LogOut, Trash2, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { HABITS } from "../../constants.js";
import { toGurmukhi, dayCompletion, emptyEntry } from "../../utils.js";

const pad = (n) => String(n).padStart(2, "0");
const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const monthLabel = (y, m) =>
  new Date(y, m - 1, 1).toLocaleString(undefined, { month: "long", year: "numeric" });

export default function Tracker({ record, updateEntry, clearEntry, status, logout }) {
  const now = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const today = todayISO();

  const daysInMonth = useMemo(
    () => new Date(year, month, 0).getDate(),
    [year, month]
  );
  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );
  const dateFor = (day) => `${year}-${pad(month)}-${pad(day)}`;

  const entryFor = (day) => record.entries[dateFor(day)] || emptyEntry();
  const counts = days.map(d => dayCompletion(entryFor(d)));

  // month stats
  const loggedDays = counts.filter(c => c > 0).length;
  let streak = 0;
  const todayIdx = (year === now.getFullYear() && month === now.getMonth() + 1)
    ? now.getDate() - 1
    : counts.length - 1;
  for (let i = todayIdx; i >= 0; i--) {
    if (counts[i] > 0) streak++;
    else break;
  }

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  };
  const goToday = () => {
    setYear(now.getFullYear());
    setMonth(now.getMonth() + 1);
  };

  // scroll today into view when the current month is displayed
  const rowRefs = useRef({});
  useEffect(() => {
    if (year === now.getFullYear() && month === now.getMonth() + 1) {
      const el = rowRefs.current[today];
      if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const todayEntry = record.entries[today] || emptyEntry();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;

  return (
    <section className="au-tracker">
      <div className="au-tracker-head">
        <div>
          <h2 className="au-gur">{record.name}</h2>
          <p className="au-mono au-tracker-id">MAUJ ID: {record.studentId}</p>
        </div>
        <div className="au-tracker-stats">
          <div><span className="au-mono">{loggedDays}/{daysInMonth}</span><small>days logged</small></div>
          <div><span className="au-mono">{streak}</span><small>current streak</small></div>
          <button className="au-btn-secondary au-btn-small" onClick={logout}>
            <LogOut size={14} /> Switch student
          </button>
        </div>
      </div>

      {/* Log today card */}
      {isCurrentMonth && (
        <div className="au-today-card">
          <div className="au-today-head">
            <div>
              <div className="au-today-eyebrow"><CalendarDays size={14} /> Log Today</div>
              <h3 className="au-today-date">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</h3>
            </div>
            <div className="au-today-progress au-mono">
              {dayCompletion(todayEntry)}/8
            </div>
          </div>
          <div className="au-today-grid">
            {HABITS.map(h => renderTodayControl(h, todayEntry, updateEntry, today))}
          </div>
        </div>
      )}

      {/* Month nav */}
      <div className="au-month-nav">
        <button className="au-btn-secondary au-btn-small" onClick={prevMonth}><ChevronLeft size={14} /> Prev</button>
        <h3 className="au-month-title">{monthLabel(year, month)}</h3>
        <button className="au-btn-secondary au-btn-small" onClick={nextMonth}>Next <ChevronRight size={14} /></button>
        {!isCurrentMonth && (
          <button className="au-btn-secondary au-btn-small" onClick={goToday}>Today</button>
        )}
      </div>

      <div className="au-bars">
        {counts.map((c, i) => (
          <div key={i} className="au-bar" title={`Day ${i + 1}: ${c}/8`}>
            <div
              className="au-bar-fill"
              style={{
                height: `${(c / 8) * 100}%`,
                background: c >= 6 ? "var(--sage)" : c > 0 ? "var(--saffron)" : "var(--line)",
              }}
            />
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
              const date = dateFor(d);
              const e = entryFor(d);
              const c = dayCompletion(e);
              const isToday = date === today;
              return (
                <tr
                  key={d}
                  ref={el => { if (el) rowRefs.current[date] = el; }}
                  className={
                    (c === 8 ? "au-row-complete " : "") +
                    (isToday ? "au-row-today" : "")
                  }
                >
                  <td className="au-mono au-date-cell">
                    {toGurmukhi(d)}
                    {isToday && <span className="au-today-pill">TODAY</span>}
                  </td>
                  <td><input className="au-cell-input" value={e.sehajPaath} onChange={ev => updateEntry(date, "sehajPaath", ev.target.value)} placeholder="ਅੰਗ" /></td>
                  <td><input className="au-cell-input" type="number" min="0" value={e.readAloud} onChange={ev => updateEntry(date, "readAloud", ev.target.value)} placeholder="min" /></td>
                  <td><button className={"au-check" + (e.kanthBani ? " au-check-on" : "")} onClick={() => updateEntry(date, "kanthBani", !e.kanthBani)}>{e.kanthBani ? <Check size={14} /> : ""}</button></td>
                  <td><input className="au-cell-input" type="number" min="0" value={e.kasrat} onChange={ev => updateEntry(date, "kasrat", ev.target.value)} placeholder="min" /></td>
                  <td><button className={"au-check" + (e.natureWatch ? " au-check-on" : "")} onClick={() => updateEntry(date, "natureWatch", !e.natureWatch)}>{e.natureWatch ? <Check size={14} /> : ""}</button></td>
                  <td><button className={"au-check" + (e.visualization ? " au-check-on" : "")} onClick={() => updateEntry(date, "visualization", !e.visualization)}>{e.visualization ? <Check size={14} /> : ""}</button></td>
                  <td>
                    <div className="au-rating">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          className={"au-rating-dot" + (e.sim >= n ? " au-rating-dot-on" : "")}
                          onClick={() => updateEntry(date, "sim", e.sim === n ? 0 : n)}
                        />
                      ))}
                    </div>
                  </td>
                  <td><input className="au-cell-input" type="number" min="0" step="0.5" value={e.ptmHours} onChange={ev => updateEntry(date, "ptmHours", ev.target.value)} placeholder="hrs" /></td>
                  <td><button className="au-clear-btn" onClick={() => clearEntry(date)} title="Clear day"><Trash2 size={13} /></button></td>
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

function renderTodayControl(h, entry, updateEntry, date) {
  const Icon = h.icon;
  const value = entry[h.key === "ptm" ? "ptmHours" : h.key];
  if (h.type === "check") {
    const on = !!entry[h.key];
    return (
      <button
        key={h.key}
        className={"au-today-item au-today-check" + (on ? " au-today-item-on" : "")}
        onClick={() => updateEntry(date, h.key, !on)}
      >
        <span className="au-today-icon"><Icon size={18} /></span>
        <span className="au-gur">{h.gur}</span>
        {on && <Check size={16} className="au-today-tick" />}
      </button>
    );
  }
  if (h.type === "rating") {
    const val = entry.sim || 0;
    return (
      <div key={h.key} className={"au-today-item" + (val > 0 ? " au-today-item-on" : "")}>
        <span className="au-today-icon"><Icon size={18} /></span>
        <span className="au-gur">{h.gur}</span>
        <div className="au-rating" style={{ marginLeft: "auto" }}>
          {[1,2,3,4,5].map(n => (
            <button key={n}
              className={"au-rating-dot" + (val >= n ? " au-rating-dot-on" : "")}
              onClick={() => updateEntry(date, "sim", val === n ? 0 : n)}
            />
          ))}
        </div>
      </div>
    );
  }
  const field = h.key === "ptm" ? "ptmHours" : h.key;
  const placeholder = h.type === "hours" ? "hrs" : h.type === "ang" ? "ang" : "min";
  return (
    <div key={h.key} className={"au-today-item" + (value ? " au-today-item-on" : "")}>
      <span className="au-today-icon"><Icon size={18} /></span>
      <span className="au-gur">{h.gur}</span>
      <input
        className="au-cell-input au-today-input"
        type={h.type === "ang" ? "text" : "number"}
        min="0"
        step={h.type === "hours" ? "0.5" : "1"}
        value={value ?? ""}
        onChange={e => updateEntry(date, field, e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
