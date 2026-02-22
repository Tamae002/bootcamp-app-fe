import { useAuth } from "@/contexts/auth";
import Loading from "@/pages/misc/Loading";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute({ guestOnly = false, role = [] }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <Loading />

  if (guestOnly == isAuthenticated) {
    console.log("guest only");
    return <Navigate to="/" replace />
  }

  if (isAuthenticated && !role?.includes(user.role)) {
    console.log("not role")
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
