import { AuthProvider } from "@/contexts/auth";
import { BrowserRouter, Routes } from "react-router";
import AuthRoutes from "./AuthRoutes";
import { ThemeProvider } from "../contexts/theme";

export default function AppRoutes() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {AuthRoutes()}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
