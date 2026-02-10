import { useAuth } from "@/contexts/auth";
import AdminDashboard from "./admin/Dashboard";
import StudentDashboard from "./student/Dashboard";
import { Navigate } from "react-router";
import Loading from "./misc/Loading";
import AdminLayout from "@/layouts/AdminLayout";

export default function IndexPage() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading)
    return <Loading />
  if (!isAuthenticated)
    return <Navigate to="/login" replace />

  if (["admin", "mentor"].includes(user?.role))
    return (
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>)
  if (user?.role == "student")
    return <StudentDashboard />
}
