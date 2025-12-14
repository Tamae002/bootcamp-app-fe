import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminLayout from "@/layouts/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import { Route, Routes } from "react-router";

export default function AdminRoutes() {
  return (
    <Route element={
      <ProtectedRoute role={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    }>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="classes" element={<Dashboard />} />
      <Route path="users" element={<Dashboard />} />
      <Route path="settings" element={<Dashboard />} />
    </Route>
  );
}
