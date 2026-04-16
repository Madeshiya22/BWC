import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'center',
        minHeight:'100vh', background:'var(--bg)',
        fontFamily:'var(--font-mono)', color:'var(--primary)',
        fontSize:'0.85rem', letterSpacing:'0.1em'
      }}>
        <span style={{ marginRight: 8 }}>⟩</span> AUTHENTICATING...
        <span className="cursor-blink" style={{ marginLeft: 4 }} />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
