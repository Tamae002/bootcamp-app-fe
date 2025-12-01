import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status == 401)
      if (window.location.pathname != "/login")
        window.location.replace("/login");
    return Promise.reject(err);
  },
);

export default api;
