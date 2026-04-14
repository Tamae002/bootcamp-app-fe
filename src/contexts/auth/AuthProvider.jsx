import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "./AuthContext";
import userApi from "@/apis/user.api";

export function AuthProvider({ children }) {
  const {
    data: user,
    isLoading,
    error,
    refetch: refetchAuthStatus,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await userApi.getMyself();
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const contextValue = {
    user: user ?? null,
    isAuthenticated: !!user,
    isLoading,
    error,
    refetchAuthStatus,
  };

  return <AuthContext value={contextValue}>{children}</AuthContext>;
}
