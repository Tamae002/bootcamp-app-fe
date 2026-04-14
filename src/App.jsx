import AppRoutes from "@/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SkeletonTheme } from "react-loading-skeleton";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./contexts/auth";
import { ThemeProvider } from "./contexts/theme";
import "./index.css";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 2 * 60e3,
        gcTime: 15 * 60e3,
      },
    },
  });

  return (
    <SkeletonTheme
      baseColor="var(--surface)"
      highlightColor="var(--surface-variant)"
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SkeletonTheme>
  );
}

export default App;
