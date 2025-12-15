import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import userApi from "@/api/user.api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAuthStatus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userApi.getMyself();

      setUser(response.data);
      console.log("Fetched user:", response.data);
      setIsAuthenticated(true);
    } catch (err) {
      if (import.meta.env.NODE_ENV == "development") console.error(err);

      setUser(null);
      setIsAuthenticated(false);
      setError(err);
    } finally {
      setIsLoading(false);
      console.log("Finishing")
    }
  };

  useEffect(() => {
    fetchAuthStatus();
  }, []);

  const refetchAuthStatus = () => fetchAuthStatus();

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    error,
    refetchAuthStatus,
  };

  return <AuthContext value={contextValue}>{children}</AuthContext>;
};
