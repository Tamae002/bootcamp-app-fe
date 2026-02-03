import AppRoutes from "@/routes";
import "@mdxeditor/editor/style.css";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./contexts/auth";
import { ThemeProvider } from "./contexts/theme";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
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
