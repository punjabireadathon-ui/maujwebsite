import React, { useState, useCallback, useMemo } from "react";
import { ChevronRight, Users, Shield, Trash2, RefreshCw, Search } from "lucide-react";
import { HABITS } from "../../constants.js";
import { dayCompletion } from "../../utils.js";
import { api } from "../../api.js";

export default function AdminGate() {
  const [passcode, setPasscode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [err, setErr] = useState("");
  const [users, setUsers] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [refFilter, setRefFilter] = useState("");

  const loadAll = useCallback(async (pc) => {
    setLoading(true);
    setErr("");
    try {
      const list = await api.adminListUsers(pc);
      setUsers(list);
    } catch (e) {
      setErr(e.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const tryUnlock = async () => {
    setErr("");
    try {
      await api.adminLogin(passcode);
      setUnlocked(true);
      loadAll(passcode);
    } catch (e) {
      setErr(e.message || "Incorrect passcode.");
    }
  };

  const removeUser = async (id, name) => {
    if (!window.confirm(`Delete account for "${name}"? All their entries will also be removed. This cannot be undone.`)) return;
    try {
      await api.adminDeleteUser(passcode, id);
      setUsers(prev => (prev || []).filter(u => u.id !== id));
      if (openId === id) setOpenId(null);
    } catch (e) {
      setErr(e.message || "Delete failed");
    }
  };

  const referenceCodes = useMemo(() => {
    const s = new Set();
    (users || []).forEach(u => { if (u.referenceCode) s.add(u.referenceCode); });
    return Array.from(s).sort();
  }, [users]);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = query.trim().toLowerCase();
    return users.filter(u => {
      if (refFilter && u.referenceCode !== refFilter) return false;
      if (!q) return true;
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q) ||
        u.referenceCode?.toLowerCase().includes(q)
      );
    });
  }, [users, query, refFilter]);

  if (!unlocked) {
    return (
      <section className="au-admin-gate">
        <Shield size={18} />
        <span>ਮੈਂਟਰ / ਐਡਮਿਨ ਪਹੁੰਚ · Mentor / Admin access</span>
        <input
          type="password"
          value={passcode}
          onChange={e => setPasscode(e.target.value)}
          placeholder="passcode"
          onKeyDown={e => e.key === "Enter" && tryUnlock()}
        />
        <button className="au-btn-secondary au-btn-small" onClick={tryUnlock}>Unlock</button>
        {err && <span className="au-form-error">{err}</span>}
      </section>
    );
  }

  return (
    <section className="au-admin-panel">
      <div className="au-admin-head">
        <h2 className="au-gur"><Users size={18} /> ਸਾਰੇ ਵਿਦਿਆਰਥੀ · All Users</h2>
        <button className="au-btn-secondary au-btn-small" onClick={() => loadAll(passcode)} disabled={loading}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="au-admin-toolbar">
        <div className="au-admin-search">
          <Search size={14} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search name, email, phone, reference code…"
          />
        </div>
        {referenceCodes.length > 0 && (
          <select
            className="au-admin-select"
            value={refFilter}
            onChange={e => setRefFilter(e.target.value)}
          >
            <option value="">All reference codes</option>
            {referenceCodes.map(rc => <option key={rc} value={rc}>{rc}</option>)}
          </select>
        )}
        <div className="au-admin-total">
          {filtered.length} of {users?.length || 0}
        </div>
      </div>

      {loading && <p>Loading records…</p>}
      {err && <p className="au-form-error">{err}</p>}
      {!loading && users && users.length === 0 && <p>No users registered yet.</p>}
      {!loading && users && users.length > 0 && filtered.length === 0 && <p>No users match this filter.</p>}

      {filtered.length > 0 && (
        <div className="au-admin-list">
          {filtered.map(u => {
            const dates = Object.keys(u.entries || {}).sort();
            const totalLogged = dates.length;
            const totalComplete = dates.filter(d => dayCompletion(u.entries[d]) === 8).length;
            const isOpen = openId === u.id;
            return (
              <div key={u.id} className={"au-admin-row" + (isOpen ? " au-admin-row-open" : "")}>
                <div className="au-admin-row-main" onClick={() => setOpenId(isOpen ? null : u.id)}>
                  <div className="au-admin-user">
                    <span className="au-gur au-admin-name">{u.name}</span>
                    <span className="au-admin-id">{u.email}</span>
                    {u.phone && <span className="au-admin-id">{u.phone}</span>}
                  </div>
                  {u.referenceCode && <span className="au-admin-ref">REF: {u.referenceCode}</span>}
                  <span className="au-admin-count au-mono">{totalLogged} days</span>
                  <span className="au-admin-count au-mono au-admin-count-good">{totalComplete} complete</span>
                  <ChevronRight
                    size={16}
                    style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .2s" }}
                  />
                </div>
                <button
                  className="au-clear-btn au-admin-delete"
                  onClick={() => removeUser(u.id, u.name)}
                  title="Delete user"
                >
                  <Trash2 size={14} />
                </button>

                {isOpen && (
                  <div className="au-admin-detail">
                    <div className="au-admin-detail-meta">
                      <span><strong>Joined:</strong> {new Date(u.createdAt).toLocaleDateString()}</span>
                      <span><strong>User ID:</strong> <span className="au-mono">{u.id}</span></span>
                    </div>
                    {dates.length === 0 ? (
                      <p className="au-form-hint">No entries yet.</p>
                    ) : (
                      <div className="au-admin-entries-wrap">
                        <table className="au-table au-admin-entries">
                          <thead>
                            <tr>
                              <th>Date</th>
                              {HABITS.map(h => (
                                <th key={h.key}><h.icon size={12} /><br /><span className="au-gur">{h.gur}</span></th>
                              ))}
                              <th>Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dates.slice().reverse().map(d => {
                              const e = u.entries[d];
                              const c = dayCompletion(e);
                              return (
                                <tr key={d} className={c === 8 ? "au-row-complete" : ""}>
                                  <td className="au-mono au-date-cell">{d}</td>
                                  <td>{e.sehajPaath || "—"}</td>
                                  <td>{e.readAloud || "—"}</td>
                                  <td>{e.kanthBani ? "✓" : "—"}</td>
                                  <td>{e.kasrat || "—"}</td>
                                  <td>{e.natureWatch ? "✓" : "—"}</td>
                                  <td>{e.visualization ? "✓" : "—"}</td>
                                  <td>{e.sim ? `${e.sim}/5` : "—"}</td>
                                  <td>{e.ptmHours || "—"}</td>
                                  <td className="au-mono">{c}/8</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
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
