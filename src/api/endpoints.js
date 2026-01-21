const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: (token) => `/auth/reset-password/${token}`,
  },
  USER: {
    GET_ALL: "/user",
    GET_BY_ID: (id) => `/user/${id}`,
    GET_BY_SEARCH: "/user",
    CREATE: "/user",
    UPDATE: (id) => `/user/${id}`,
    DELETE: (id) => `/user/${id}`,
    ME: "/user/me",
  },
  ANSWER: {
    GRADE: (id) => `/jawaban/${id}/nilai`,
  },
  CLASS: {
    GET_ALL: "/kelas",
    GET_BY_ID: (id) => `/kelas/${id}`,
    CREATE: "/kelas",
    DELETE: (id) => `/kelas/${id}`,
    UPDATE: (id) => `/kelas/${id}`,
  },
};

export default API_ENDPOINTS;
