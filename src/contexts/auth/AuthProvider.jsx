import { useState, useEffect } from "react";
import { AuthContext } from "@/contexts/auth/AuthContext.js";

// Provider component
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAuthStatus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // const response = await apiGet(GET_USER_ME);
      //
      // if (response.status != 200) {
      //   // Handle non-2xx responses (e.g., 401 Unauthorized)
      //   throw new Error("Authentication check failed");
      // }
      //
      // setUser(response.data.data);
      // setIsAuthenticated(true);
    } catch (err) {
      // console.error("Error fetching auth status:", err);
      // setUser(null);
      // setIsAuthenticated(false);
      // setError(err); // Store the error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthStatus();
  }, []); // Run once on component mount

  // You might want a way to re-fetch auth status, e.g., after login/logout
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

