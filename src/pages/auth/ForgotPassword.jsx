import authApi from "@/apis/auth.api";
import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { AxiosError } from "axios";
import "@/assets/css/auth/ForgotPassword.css";

export default function ForgotPassword({ onBack }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Masukkan email yang valid.");
      return;
    }

    try {
      setLoading(true);

      const response = await authApi.forgotPassword({ email });

      if (response.status === 200) {
        navigate("/pending-approval");
      }
    } catch (err) {
      if (import.meta.env.VITE_ENV === "development") {
        console.error(err);
      }

      if (err instanceof AxiosError) {
        if (err.response?.status === 404)
          setError("Email tidak terdaftar.");
        else if (err.response?.data?.message)
          setError(err.response.data.message);
        else
          setError("Terjadi kesalahan pada server.");
      } else {
        setError("Terjadi kesalahan.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-root">
      <div className="scale-wrapper">
        <div className="forgot-card">
          <h1 className="forgot-title">Forgot Password?</h1>

          <p className="forgot-sub">
            Remember your password?,
            <span className="back-login" onClick={onBack}>
              {" "}Login Here.
            </span>
          </p>

          {error && <p className="status error">{error}</p>}

          <form onSubmit={handleSubmit} className="forgot-form">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="forgot-input"
              required
            />

            <button type="submit" className="forgot-btn" disabled={loading}>
              {loading ? "Mengirim..." : "Send Email"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
