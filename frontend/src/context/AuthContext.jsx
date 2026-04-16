import { createContext, useContext, useState, useEffect } from "react";
import { getMe, logoutUser } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, attempt to load current user from token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { setLoading(false); return; }

    getMe()
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem("accessToken"))
      .finally(() => setLoading(false));
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("accessToken", token);
    setUser(userData);
  };

  const logout = async () => {
    try { await logoutUser(); } catch {}
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
