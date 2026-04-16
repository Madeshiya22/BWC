import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider }   from "./context/AuthContext";
import { ToastContainer } from "./components/Toast";
import ProtectedRoute     from "./components/ProtectedRoute";
import AuthPage           from "./pages/AuthPage";
import HomePage           from "./pages/HomePage";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer />
        <Routes>
          {/* Auth routes */}
          <Route path="/login"    element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          {/* Protected home */}
          <Route path="/" element={
            <ProtectedRoute><HomePage /></ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
