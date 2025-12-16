import axios from "axios";
import { useNavigate } from "react-router";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const navigate = useNavigate();
    if (err?.response?.status == 401)
      if (window.location.pathname != "/login")
        navigate("/login", { replace: true });
    return Promise.reject(err);
  },
);

export default api;
