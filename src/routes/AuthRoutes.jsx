import ForgotPassword from "@/pages/auth/ForgotPassword";
import Login from "@/pages/auth/Login";
import PendingApproval from "@/pages/auth/PendingApproval";
import ResetPassword from "@/pages/auth/ResetPassword";
import { Route, Routes } from "react-router";

export default function AuthRoutes() {
  return (
    <>
      <Route path="login" element={<Login />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="pending-approval" element={<PendingApproval />} />
      <Route path="reset-password" element={<ResetPassword />} />
    </>
  );
}
