import { AuthProvider } from "@/contexts/auth";
import { BrowserRouter, Routes } from "react-router";
import AuthRoutes from "./AuthRoutes";
import { ThemeProvider } from "../contexts/theme";
import AdminRoutes from "./AdminRoutes";
import { Route } from "react-router";
import { Navigate } from "react-router";

export default function AppRoutes() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Navigate to="/login" replace />} />
            {AuthRoutes()}
            {AdminRoutes()}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
