import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Login from "@/pages/auth/Login.jsx";
import AuthProvider from "@/contexts/auth/AuthProvider.jsx";

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={/* TODO: Halaman forgot password */ null} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
