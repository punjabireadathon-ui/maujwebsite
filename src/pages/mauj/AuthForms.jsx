import React, { useState } from "react";
import { ArrowRight, Mail, Lock, User, Phone, Ticket, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function AuthForms() {
  const [mode, setMode] = useState("register"); // 'register' | 'login'
  return (
    <section className="au-auth">
      <div className="au-auth-card">
        <div className="au-auth-tabs">
          <button
            className={"au-auth-tab" + (mode === "register" ? " au-auth-tab-active" : "")}
            onClick={() => setMode("register")}
          >
            ਨਵਾਂ ਖਾਤਾ · Register
          </button>
          <button
            className={"au-auth-tab" + (mode === "login" ? " au-auth-tab-active" : "")}
            onClick={() => setMode("login")}
          >
            ਲੌਗਇਨ · Login
          </button>
        </div>
        {mode === "register" ? <RegisterForm /> : <LoginForm switchToRegister={() => setMode("register")} />}
      </div>
    </section>
  );
}

function RegisterForm() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "", phone: "", email: "", password: "", confirm: "", referenceCode: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.name.trim())              return setErr("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setErr("Please enter a valid email.");
    if (form.password.length < 8)       return setErr("Password must be at least 8 characters.");
    if (form.password !== form.confirm) return setErr("Passwords do not match.");
    setBusy(true);
    try {
      await register({
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
        referenceCode: form.referenceCode,
      });
    } catch (e2) {
      setErr(e2.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="au-auth-form" onSubmit={submit} autoComplete="on">
      <h2 className="au-gur">ਆਪਣਾ ਖਾਤਾ ਬਣਾਓ</h2>
      <p className="au-auth-lead">Create your account to begin the MAUJ journey.</p>

      <Field icon={User}   label="Full Name"        value={form.name}  onChange={set("name")}  placeholder="e.g. Sehajbir Singh" required />
      <Field icon={Phone}  label="Phone Number"     value={form.phone} onChange={set("phone")} placeholder="e.g. +91 98xxxxxxxx" type="tel" />
      <Field icon={Mail}   label="Email"            value={form.email} onChange={set("email")} placeholder="you@example.com" type="email" required autoComplete="email" />

      <Field
        icon={Lock}
        label="Password"
        value={form.password}
        onChange={set("password")}
        placeholder="At least 8 characters"
        type={showPw ? "text" : "password"}
        autoComplete="new-password"
        required
        rightSlot={
          <button type="button" className="au-field-toggle" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />
      <Field
        icon={Lock}
        label="Confirm Password"
        value={form.confirm}
        onChange={set("confirm")}
        placeholder="Repeat password"
        type={showPw ? "text" : "password"}
        autoComplete="new-password"
        required
      />

      <Field
        icon={Ticket}
        label={<>Reference Code <span className="au-field-optional">(optional)</span></>}
        value={form.referenceCode}
        onChange={set("referenceCode")}
        placeholder="Who told you about MAUJ?"
      />

      {err && <p className="au-form-error">{err}</p>}

      <button type="submit" className="au-btn-primary au-auth-submit" disabled={busy}>
        {busy ? "Creating account…" : "Create Account"} <ArrowRight size={16} />
      </button>
    </form>
  );
}

function LoginForm({ switchToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await login({ email, password });
    } catch (e2) {
      setErr(e2.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="au-auth-form" onSubmit={submit} autoComplete="on">
      <h2 className="au-gur">ਮੁੜ ਸਵਾਗਤ ਹੈ</h2>
      <p className="au-auth-lead">Log in to continue your MAUJ journey.</p>

      <Field
        icon={Mail}
        label="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        type="email"
        autoComplete="email"
        required
      />
      <Field
        icon={Lock}
        label="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Your password"
        type={showPw ? "text" : "password"}
        autoComplete="current-password"
        required
        rightSlot={
          <button type="button" className="au-field-toggle" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />

      {err && <p className="au-form-error">{err}</p>}

      <button type="submit" className="au-btn-primary au-auth-submit" disabled={busy}>
        {busy ? "Logging in…" : "Log In"} <ArrowRight size={16} />
      </button>

      <p className="au-auth-swap">
        No account yet?{" "}
        <button type="button" className="au-link-btn" onClick={switchToRegister}>Register here</button>
      </p>
    </form>
  );
}

function Field({ icon: Icon, label, rightSlot, ...inputProps }) {
  return (
    <label className="au-field">
      <span className="au-field-label">{label}</span>
      <span className="au-field-wrap">
        <span className="au-field-icon"><Icon size={16} /></span>
        <input className="au-field-input" {...inputProps} />
        {rightSlot}
      </span>
    </label>
  );
}
