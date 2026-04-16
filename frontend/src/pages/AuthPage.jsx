import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { registerUser, loginUser } from "../api/auth";
import { useAuth }                  from "../context/AuthContext";
import { addToast }                 from "../components/Toast";
import MatrixRain                   from "../components/MatrixRain";
import "./Auth.css";

/* ─── tiny SVG icons ─── */
const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
const LogoIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" fill="none"/>
    {/* Crossed swords / code brackets */}
    <text x="4" y="32" fontFamily="JetBrains Mono,monospace" fontSize="26" fontWeight="700" fill="#b500ff">&lt;/&gt;</text>
    <line x1="8" y1="36" x2="36" y2="8" stroke="#b500ff" strokeWidth="2" strokeLinecap="square"/>
    <line x1="36" y1="36" x2="8" y2="8" stroke="#00f4fe" strokeWidth="2" strokeLinecap="square" strokeDasharray="3 2"/>
  </svg>
);

export default function AuthPage() {
  const { login, user } = useAuth();
  const navigate        = useNavigate();
  const location        = useLocation();

  // Which tab: 'login' | 'register'
  const [tab, setTab] = useState(
    location.pathname === "/register" ? "register" : "login"
  );

  // If already logged in → go home
  useEffect(() => { if (user) navigate("/", { replace: true }); }, [user]);

  // Sync URL with tab
  useEffect(() => {
    navigate(tab === "login" ? "/login" : "/register", { replace: true });
  }, [tab]);

  return (
    <div className="auth-page">
      <MatrixRain />

      <div className="auth-card animate-flicker">
        {/* ── Header ── */}
        <div className="auth-header">
          <div className="auth-logo">
            <LogoIcon />
          </div>
          <h1 className="auth-title">BATTLECODE</h1>
          <p className="auth-subtitle">GAMING ARENA</p>
          <p className="auth-cmd">
            <span className="auth-prompt">{">"}</span>
            {tab === "login" ? " ENTER THE BATTLEFIELD" : " CREATE YOUR ACCOUNT"}
            <span className="cursor-blink" />
          </p>
        </div>

        {/* ── Tab bar ── */}
        <div className="auth-tabs">
          <button
            id="tab-login"
            className={`auth-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => setTab("login")}
          >
            [ LOGIN ]
          </button>
          <button
            id="tab-register"
            className={`auth-tab ${tab === "register" ? "active" : ""}`}
            onClick={() => setTab("register")}
          >
            [ REGISTER ]
          </button>
        </div>

        {/* ── Form ── */}
        <div className="auth-form-wrap">
          {tab === "login"
            ? <LoginForm  onSwitch={() => setTab("register")} login={login} navigate={navigate} />
            : <RegisterForm onSwitch={() => setTab("login")}  login={login} navigate={navigate} />
          }
        </div>

        {/* ── Footer ── */}
        <div className="auth-footer">
          <span className="pulse-dot" />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-secondary)", letterSpacing: "0.08em" }}>
            12,847 CODERS ACTIVE NOW
          </span>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   LOGIN FORM
════════════════════════════════════ */
function LoginForm({ onSwitch, login, navigate }) {
  const [form, setForm]       = useState({ identifier: "", password: "" });
  const [errors, setErrors]   = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.identifier.trim()) e.identifier = "CALLSIGN REQUIRED";
    if (!form.password)          e.password   = "PASSWORD REQUIRED";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data.user, data.accessToken);
      addToast(`WELCOME BACK, ${data.user.username.toUpperCase()}`, "success");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "LOGIN FAILED";
      addToast(msg.toUpperCase(), "error");
      setErrors({ server: msg });
    } finally { setLoading(false); }
  };

  const change = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: null }));
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate id="login-form">
      {/* Identifier */}
      <div className="field-group">
        <label className="field-label">USERNAME / EMAIL</label>
        <div className="field-wrap">
          <span className="field-prefix">{">"}</span>
          <input
            id="login-identifier"
            className={`field-input ${errors.identifier ? "error" : ""}`}
            type="text"
            placeholder="enter your callsign..."
            value={form.identifier}
            onChange={change("identifier")}
            autoComplete="username"
          />
        </div>
        {errors.identifier && <span className="field-error">! {errors.identifier}</span>}
      </div>

      {/* Password */}
      <div className="field-group">
        <label className="field-label">PASSWORD</label>
        <div className="field-wrap">
          <span className="field-prefix">{">"}</span>
          <input
            id="login-password"
            className={`field-input ${errors.password ? "error" : ""}`}
            type={showPwd ? "text" : "password"}
            placeholder="enter access code..."
            value={form.password}
            onChange={change("password")}
            autoComplete="current-password"
          />
          <button type="button" className="field-suffix" onClick={() => setShowPwd((v) => !v)}>
            {showPwd ? <EyeOff /> : <EyeOpen />}
          </button>
        </div>
        {errors.password && <span className="field-error">! {errors.password}</span>}
        <span style={{ textAlign: "right" }}>
          <a href="#" className="auth-link-sm" id="forgot-password-link">FORGOT PASSWORD?</a>
        </span>
      </div>

      {errors.server && (
        <p className="field-error" style={{ textAlign: "center" }}>⚠ {errors.server.toUpperCase()}</p>
      )}

      {/* Submit */}
      <button type="submit" className="btn-primary" disabled={loading} id="login-submit-btn">
        {loading ? <><div className="spinner" /> AUTHENTICATING...</> : "[ INITIATE LOGIN ]"}
      </button>

      {/* Divider */}
      <div className="divider">OR CONTINUE WITH</div>

      {/* Google (placeholder — wire OAuth later) */}
      <button type="button" className="btn-ghost" id="google-login-btn"
        onClick={() => addToast("GOOGLE AUTH — COMING SOON", "info")}>
        <GoogleIcon />
        Continue with Google
      </button>

      {/* Switch */}
      <p className="auth-switch-text">
        New to the arena?{" "}
        <button type="button" className="auth-link" onClick={onSwitch} id="switch-to-register">
          CREATE ACCOUNT
        </button>
      </p>
    </form>
  );
}

/* ════════════════════════════════════
   REGISTER FORM
════════════════════════════════════ */
function RegisterForm({ onSwitch, login, navigate }) {
  const [form, setForm]       = useState({ username: "", email: "", password: "", confirm: "" });
  const [errors, setErrors]   = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.username.trim())           e.username = "CALLSIGN REQUIRED";
    else if (form.username.length < 3)   e.username = "MIN 3 CHARACTERS";
    if (!form.email.includes("@"))       e.email    = "VALID EMAIL REQUIRED";
    if (form.password.length < 6)        e.password = "MIN 6 CHARACTERS";
    if (form.password !== form.confirm)  e.confirm  = "PASSWORDS DO NOT MATCH";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const { data } = await registerUser({
        username: form.username,
        email:    form.email,
        password: form.password,
      });
      login(data.user, data.accessToken);
      addToast(`WELCOME, ${data.user.username.toUpperCase()}! ARENA JOINED`, "success");
      navigate("/");       // ← no login needed after register
    } catch (err) {
      const msg = err.response?.data?.message || "REGISTRATION FAILED";
      addToast(msg.toUpperCase(), "error");
      setErrors({ server: msg });
    } finally { setLoading(false); }
  };

  const change = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: null }));
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate id="register-form">
      {/* Username */}
      <div className="field-group">
        <label className="field-label">CALLSIGN (USERNAME)</label>
        <div className="field-wrap">
          <span className="field-prefix">{">"}</span>
          <input
            id="register-username"
            className={`field-input ${errors.username ? "error" : ""}`}
            type="text"
            placeholder="choose your callsign..."
            value={form.username}
            onChange={change("username")}
            autoComplete="username"
          />
        </div>
        {errors.username && <span className="field-error">! {errors.username}</span>}
      </div>

      {/* Email */}
      <div className="field-group">
        <label className="field-label">EMAIL ADDRESS</label>
        <div className="field-wrap">
          <span className="field-prefix">{">"}</span>
          <input
            id="register-email"
            className={`field-input ${errors.email ? "error" : ""}`}
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={change("email")}
            autoComplete="email"
          />
        </div>
        {errors.email && <span className="field-error">! {errors.email}</span>}
      </div>

      {/* Password */}
      <div className="field-group">
        <label className="field-label">SET PASSWORD</label>
        <div className="field-wrap">
          <span className="field-prefix">{">"}</span>
          <input
            id="register-password"
            className={`field-input ${errors.password ? "error" : ""}`}
            type={showPwd ? "text" : "password"}
            placeholder="min 6 characters..."
            value={form.password}
            onChange={change("password")}
            autoComplete="new-password"
          />
          <button type="button" className="field-suffix" onClick={() => setShowPwd((v) => !v)}>
            {showPwd ? <EyeOff /> : <EyeOpen />}
          </button>
        </div>
        {errors.password && <span className="field-error">! {errors.password}</span>}
      </div>

      {/* Confirm Password */}
      <div className="field-group">
        <label className="field-label">CONFIRM PASSWORD</label>
        <div className="field-wrap">
          <span className="field-prefix">{">"}</span>
          <input
            id="register-confirm"
            className={`field-input ${errors.confirm ? "error" : ""}`}
            type={showPwd ? "text" : "password"}
            placeholder="repeat password..."
            value={form.confirm}
            onChange={change("confirm")}
            autoComplete="new-password"
          />
        </div>
        {errors.confirm && <span className="field-error">! {errors.confirm}</span>}
      </div>

      {errors.server && (
        <p className="field-error" style={{ textAlign: "center" }}>⚠ {errors.server.toUpperCase()}</p>
      )}

      {/* Submit */}
      <button type="submit" className="btn-primary" disabled={loading} id="register-submit-btn">
        {loading ? <><div className="spinner" /> REGISTERING...</> : "[ JOIN THE ARENA ]"}
      </button>

      <div className="divider">OR CONTINUE WITH</div>

      <button type="button" className="btn-ghost" id="google-register-btn"
        onClick={() => addToast("GOOGLE AUTH — COMING SOON", "info")}>
        <GoogleIcon />
        Continue with Google
      </button>

      <p className="auth-switch-text">
        Already a fighter?{" "}
        <button type="button" className="auth-link" onClick={onSwitch} id="switch-to-login">
          SIGN IN
        </button>
      </p>
    </form>
  );
}
