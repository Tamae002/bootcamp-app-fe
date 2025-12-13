import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  refetchAuthStatus: () => { }, // Cek status login user.
});
