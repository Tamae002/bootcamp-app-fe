import { createContext, useContext } from "react";

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  refetchAuthStatus: () => {}, // Cek status login user. 
});

export const useAuth = () => useContext(AuthContext);
