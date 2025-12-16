import AppRoutes from "@/routes";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./contexts/auth";
import { ThemeProvider } from "./contexts/theme";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
