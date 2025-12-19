import AppRoutes from "@/routes";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./contexts/auth";
import { ThemeProvider } from "./contexts/theme";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"

function App() {
  return (
    <SkeletonTheme
      // baseColor={document.documentElement.style.getPropertyValue("--surface")}
      // highlightColor={document.documentElement.style.getPropertyValue("--white")}
      baseColor="var(--surface)"
      highlightColor="var(--surface-variant)"
    >
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </SkeletonTheme>
  );
}

export default App;
