import LazyComponent from "@/components/misc/LazyComponent";
import ClassProviderLayout from "@/contexts/class/ClassProviderLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ClassDetailLayout from "@/layouts/ClassDetailLayout";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import { lazy } from "react";
import { Route } from "react-router";

const ClassDetail = lazy(() => import("@/pages/global/classes/ClassDetail"));
const ClassForm = lazy(() => import("@/pages/admin/classes/ClassForm"));
const ClassList = lazy(() => import("@/pages/admin/classes/ClassList"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const MeetDetail = lazy(() => import("@/pages/global/meets/MeetDetail"));
const MeetForm = lazy(() => import("@/pages/admin/meets/MeetForm"));
const UserManagement = lazy(() => import("@/pages/admin/users/UserList"));

export default function AdminRoutes() {
  return (
    <Route path="admin" element={<ProtectedRoute role={["admin", "mentor"]} />}>
      <Route element={<AdminLayout />}>
        <Route
          path="dashboard"
          element={
            <LazyComponent>
              <Dashboard />
            </LazyComponent>
          }
        />

        <Route path="classes">
          <Route
            index
            element={
              <LazyComponent>
                <ClassList />
              </LazyComponent>
            }
          />
          <Route
            path="create"
            element={
              <LazyComponent>
                <ClassForm />
              </LazyComponent>
            }
          />

          <Route element={<ClassProviderLayout />}>
            <Route path=":id" element={<ClassDetailLayout prefix="/admin" />}>
              <Route
                index
                element={
                  <LazyComponent>
                    <ClassDetail prefix="/admin" />
                  </LazyComponent>
                }
              />
              <Route
                path="meet/:meetId"
                element={
                  <LazyComponent>
                    <MeetDetail prefix="/admin" />
                  </LazyComponent>
                }
              />
            </Route>

            <Route
              path=":id/edit"
              element={
                <LazyComponent>
                  <ClassForm edit />
                </LazyComponent>
              }
            />

            <Route
              path=":id/meet/create"
              element={
                <LazyComponent>
                  <MeetForm />
                </LazyComponent>
              }
            />
            <Route
              path=":id/meet/:meetId/edit"
              element={
                <LazyComponent>
                  <MeetForm edit />
                </LazyComponent>
              }
            />
          </Route>
        </Route>

        <Route
          path="users"
          element={
            <LazyComponent>
              <UserManagement />
            </LazyComponent>
          }
        />
      </Route>
    </Route>
  );
}
