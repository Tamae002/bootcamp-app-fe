import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Login from "@/pages/auth/Login.jsx";
import AuthProvider from "@/contexts/auth/AuthProvider.jsx";
import ForgotPassword from "@/pages/ForgotPassword.jsx";
import PendingApproval from "@/pages/PendingApproval.jsx";
import ResetPassword from "@/pages/ResetPassword.jsx";

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
