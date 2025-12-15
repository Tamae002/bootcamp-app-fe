import ProtectedRoute from "@/layouts/ProtectedRoute";
import AdminLayout from "@/layouts/AdminLayout";
import ClassManagement from "@/pages/admin/ClassManagement";
import Dashboard from "@/pages/admin/Dashboard";
import Settings from "@/pages/admin/Settings";
import UserManagement from "@/pages/admin/UserManagement";
import { Route } from "react-router";

export default function AdminRoutes() {
  return (
    <Route element={<ProtectedRoute role={["admin", "mentor"]} />}>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="classes" element={<ClassManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Route>
  );
}
