import { useAuth } from "@/contexts/auth";
import AdminLayout from "@/layouts/AdminLayout";
import StudentLayout from "@/layouts/StudentLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import Loading from "@/pages/misc/Loading";
import StudentDashboard from "@/pages/student/Dashboard";
import { Navigate, Route, Routes } from "react-router";
import AdminRoutes from "./AdminRoutes";
import AuthRoutes from "./AuthRoutes";
import { useEffect } from "react";

export default function AppRoutes() {
  return (
    <Routes>
      {IndexRoute(useAuth())}
      {AuthRoutes()}
      {AdminRoutes()}
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
        <Route index element={<AdminDashboard />} />
      </Route>
    );
  else if (user.role == "user")
    return (
      <Route element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
      </Route>
    );
}
