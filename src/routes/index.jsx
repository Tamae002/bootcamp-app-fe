import { lazy } from "react";
import LazyComponent from "@/components/misc/LazyComponent";
import { useAuth } from "@/contexts/auth";
import AdminLayout from "@/layouts/AdminLayout";
import StudentLayout from "@/layouts/StudentLayout";
import { Navigate, Route, Routes } from "react-router";
import AdminRoutes from "./AdminRoutes";
import AuthRoutes from "./AuthRoutes";
import Loading from "@/pages/misc/Loading";
import NotFound from "@/pages/misc/NotFound";

const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const StudentDashboard = lazy(() => import("@/pages/student/Dashboard"));
import StudentRoutes from "./StudentRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      {IndexRoute(useAuth())}
      {AuthRoutes()}
      {AdminRoutes()}
      {StudentRoutes()}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function IndexRoute(authContext) {
  const { isAuthenticated, isLoading, user } = authContext;

  if (isLoading) return <Route index element={<Loading />} />;
  if (!isAuthenticated)
    return <Route index element={<Navigate to="/login" replace />} />;

  if (["admin", "mentor"].includes(user.role))
    return (
      <Route element={<AdminLayout />}>
        <Route
          index
          element={
            <LazyComponent>
              <AdminDashboard />
            </LazyComponent>
          }
        />
      </Route>
    );
  else if (user.role == "user")
    return (
      <Route element={<StudentLayout />}>
        <Route
          index
          element={
            <LazyComponent>
              <StudentDashboard />
            </LazyComponent>
          }
        />
      </Route>
    );
}
