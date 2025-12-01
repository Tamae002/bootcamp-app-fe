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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
