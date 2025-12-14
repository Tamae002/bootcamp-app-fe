import ResetPassword from "@/pages/auth/ResetPassword";
import api from "./client";
import API_ENDPOINTS from "./endpoints";

const authApi = {
  login: async ({ email, password }) =>
    api.post(API_ENDPOINTS.AUTH.LOGIN, {
      email, password
    }),

  logout: async () =>
    api.get(API_ENDPOINTS.AUTH.LOGOUT),

  forgotPassword: async ({ email }) =>
    api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),

  ResetPassword: async ({ token, newPassword, confirmPassword }) =>
    api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD(token), {
      newPassword,
      confirmPassword,
    }),
};

export default authApi;
