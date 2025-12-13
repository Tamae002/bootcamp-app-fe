import { Navigate, Route } from "react-router";
import Login from "@/pages/auth/Login";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import PendingApproval from "@/pages/auth/PendingApproval";
import ResetPassword from "@/pages/auth/ResetPassword";

export default function AuthRoutes() {
  return (
    <>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/pending-approval" element={<PendingApproval />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </>
  );
}
