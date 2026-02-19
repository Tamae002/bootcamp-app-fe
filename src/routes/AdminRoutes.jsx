import { lazy } from "react";
import LazyComponent from "@/components/misc/LazyComponent";
import ClassProviderLayout from "@/contexts/class/ClassProviderLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ClassDetailLayout from "@/layouts/ClassDetailLayout";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import { Route } from "react-router";

const ClassDetail = lazy(() => import("@/pages/admin/classes/ClassDetail"));
const ClassForm = lazy(() => import("@/pages/admin/classes/ClassForm"));
const ClassList = lazy(() => import("@/pages/admin/classes/ClassList"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const MeetDetail = lazy(() => import("@/pages/admin/meets/MeetDetail"));
const MeetForm = lazy(() => import("@/pages/admin/meets/MeetForm"));
const Settings = lazy(() => import("@/pages/admin/Settings"));
const UserManagement = lazy(() => import("@/pages/admin/users/UserList"));

export default function AdminRoutes() {
  return (
    <Route element={<ProtectedRoute role={["admin", "mentor"]} />}>
      <Route element={<AdminLayout />}>
        <Route
          path="dashboard"
          element={<LazyComponent component={Dashboard} />}
        />

        <Route path="classes">
          <Route index element={<LazyComponent component={ClassList} />} />
          <Route
            path="create"
            element={<LazyComponent component={ClassForm} />}
          />

          <Route element={<ClassProviderLayout />}>
            <Route path=":id" element={<ClassDetailLayout />}>
              <Route
                index
                element={<LazyComponent component={ClassDetail} />}
              />
              <Route
                path="meet/:meetId"
                element={<LazyComponent component={MeetDetail} />}
              />
            </Route>

            <Route
              path=":id/edit"
              element={<LazyComponent component={ClassForm} edit />}
            />

            <Route
              path=":id/meet/create"
              element={<LazyComponent component={MeetForm} />}
            />
            <Route
              path=":id/meet/:meetId/edit"
              element={<LazyComponent component={MeetForm} edit />}
            />
          </Route>
        </Route>

        <Route
          path="users"
          element={<LazyComponent component={UserManagement} />}
        />

        <Route
          path="settings"
          element={<LazyComponent component={Settings} />}
        />
      </Route>
    </Route>
  );
}
