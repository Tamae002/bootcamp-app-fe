import { ClassProvider } from "@/contexts/class";
import AdminLayout from "@/layouts/AdminLayout";
import ClassDetailLayout from "@/layouts/ClassDetailLayout";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import ClassDetail from "@/pages/admin/classes/ClassDetail";
import ClassList from "@/pages/admin/classes/ClassList";
import MeetDetail from "@/pages/admin/classes/MeetDetail";
import Dashboard from "@/pages/admin/Dashboard";
import Settings from "@/pages/admin/Settings";
import UserManagement from "@/pages/admin/UserManagement";
import { Route } from "react-router";

export default function AdminRoutes() {
  return (
    <Route element={<ProtectedRoute role={["admin", "mentor"]} />}>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="classes">
          <Route index element={<ClassList />} />
          <Route
            path=":id"
            element={
              <ClassProvider>
                <ClassDetailLayout />
              </ClassProvider>
            }
          >
            <Route index element={<ClassDetail />} />
            <Route path=":meetId" element={<MeetDetail />} />
          </Route>
        </Route>

        <Route path="users" element={<UserManagement />} />

        <Route path="settings" element={<Settings />} />
      </Route>
    </Route>
  );
}
