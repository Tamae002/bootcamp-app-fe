import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { AxiosError } from "axios";
import authApi from "@/apis/auth.api";
import "@/assets/css/auth/ResetPassword.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams(); // ✅ AMBIL TOKEN DARI URL

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ VALIDASI FE
    if (!newPassword || !confirmPassword) {
      setError("Password wajib diisi.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Password tidak sama.");
      return;
    }

    try {
      setLoading(true);

      const response = await authApi.ResetPassword({
        token,
        newPassword,
        confirmPassword,
      });

      if (response.status === 200) {
        navigate("/login"); // ✅ BERHASIL → LOGIN
      }
    } catch (err) {
      if (import.meta.env.VITE_ENV === "development") {
        console.error(err);
      }

      if (err instanceof AxiosError) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Terjadi kesalahan pada server.");
        }
      } else {
        setError("Terjadi kesalahan.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rp-root">
      <div className="scale-wrapper">
        <div className="rp-card">
          <h1 className="rp-title">Reset Password</h1>

          <p className="rp-sub">
            Remember your password?{" "}
            <Link to="/login" className="rp-login">
              Login Here.
            </Link>
          </p>

          {error && <p className="status error">{error}</p>}

          <form className="rp-form" onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New Password"
              className="rp-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="rp-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button className="rp-btn" disabled={loading}>
              {loading ? "Memproses..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
