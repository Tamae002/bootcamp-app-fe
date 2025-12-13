import React, { useState } from "react";
import "@/assets/css/auth/ResetPassword.css";
import { Link } from "react-router";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Password tidak sama!");
      return;
    }

    alert("Password berhasil direset!");
  };

  return (
    <div className="rp-root">
      <div className="scale-wrapper">
        <div className="rp-card">
          <h1 className="rp-title">Reset Password</h1>

          <p className="rp-sub">
            Remember your password?,{" "}
            <Link to="/login" className="rp-login">
              Login Here.
            </Link>
          </p>

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

            <button className="rp-btn">Reset Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}
