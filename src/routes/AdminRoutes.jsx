import ClassProviderLayout from "@/contexts/class/ClassProviderLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ClassDetailLayout from "@/layouts/ClassDetailLayout";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import ClassDetail from "@/pages/admin/classes/ClassDetail";
import ClassForm from "@/pages/admin/classes/ClassForm";
import ClassList from "@/pages/admin/classes/ClassList";
import Dashboard from "@/pages/admin/Dashboard";
import MeetDetail from "@/pages/admin/meets/MeetDetail";
import MeetForm from "@/pages/admin/meets/MeetForm";
import Settings from "@/pages/admin/Settings";
import UserManagement from "@/pages/admin/users/UserList";
import { Route } from "react-router";

export default function AdminRoutes() {
  return (
    <Route element={<ProtectedRoute role={["admin", "mentor"]} />}>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="classes">
          <Route index element={<ClassList />} />
          <Route path="create" element={<ClassForm />} />

          <Route element={<ClassProviderLayout />}>
            <Route path=":id" element={<ClassDetailLayout />}>
              <Route index element={<ClassDetail />} />
              <Route path="meet/:meetId" element={<MeetDetail />} />
            </Route>

            <Route path=":id/edit" element={<ClassForm edit />} />

            <Route path=":id/meet/create" element={<MeetForm />} />
            <Route path=":id/meet/:meetId/edit" element={<MeetForm edit />} />
          </Route>
        </Route>

        <Route path="users" element={<UserManagement />} />

        <Route path="settings" element={<Settings />} />
      </Route>
    </Route>
  );
}
