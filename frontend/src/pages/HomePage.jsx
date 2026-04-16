import { useAuth }      from "../context/AuthContext";
import { useNavigate }  from "react-router-dom";
import { addToast }     from "../components/Toast";
import MatrixRain       from "../components/MatrixRain";

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    addToast("MISSION ENDED — GOODBYE", "info");
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative" }}>
      <MatrixRain />
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        minHeight: "100vh", gap: 24, padding: 24,
        textAlign: "center"
      }}>
        {/* Logo */}
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: "0.75rem",
          letterSpacing: "0.3em", color: "var(--secondary)", marginBottom: -8
        }}>
          BATTLECODE GAMING ARENA
        </div>

        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem,6vw,4.5rem)",
          fontWeight: 700, letterSpacing: "-0.01em",
          color: "var(--primary)",
          textShadow: "0 0 30px var(--primary-glow), 0 0 60px rgba(181,0,255,0.15)"
        }}>
          WELCOME, {user?.username?.toUpperCase()}
        </h1>

        <p style={{
          fontFamily: "var(--font-mono)", fontSize: "0.85rem",
          color: "var(--text-secondary)", letterSpacing: "0.05em",
          maxWidth: 420
        }}>
          {">"} Arena access granted. Your battlefield awaits.
          <span className="cursor-blink" style={{ marginLeft: 4 }} />
        </p>

        {/* Stats card */}
        <div style={{
          background: "rgba(13,19,26,0.9)", border: "1px solid rgba(181,0,255,0.2)",
          padding: "24px 40px", display: "flex", gap: 40,
          boxShadow: "0 0 30px rgba(181,0,255,0.07)",
          marginTop: 8
        }}>
          {[
            { label: "RANK",   value: "#--" },
            { label: "SOLVED", value: "0"  },
            { label: "STREAK", value: "0d" },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem",
                fontWeight: 700, color: "var(--primary)" }}>{value}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem",
                letterSpacing: "0.15em", color: "var(--text-secondary)",
                textTransform: "uppercase", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Logout */}
        <button id="logout-btn" onClick={handleLogout} style={{
          marginTop: 12,
          padding: "10px 32px",
          background: "transparent",
          border: "1px solid rgba(255,115,81,0.4)",
          color: "var(--error)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.78rem",
          letterSpacing: "0.1em",
          cursor: "pointer",
          transition: "all 0.2s"
        }}
          onMouseEnter={(e) => { e.target.style.background = "rgba(255,115,81,0.1)"; e.target.style.borderColor = "var(--error)"; }}
          onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.borderColor = "rgba(255,115,81,0.4)"; }}
        >
          [ LOGOUT ]
        </button>
      </div>
    </div>
  );
}
