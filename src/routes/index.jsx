import { AuthProvider } from "@/contexts/auth";
import { BrowserRouter, Routes } from "react-router";
import AuthRoutes from "./AuthRoutes";

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {AuthRoutes()}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
