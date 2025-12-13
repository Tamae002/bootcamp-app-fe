import { useState } from 'react'
import { useNavigate } from "react-router"
import './ForgotPassword.css'


export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)

  const navigate = useNavigate()

  function validateEmail(e) {
    return /\S+@\S+\.\S+/.test(e)
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validateEmail(email)) {
      setStatus({ type: 'error', message: 'Masukkan email valid.' })
      return
    }

    // 🔥 LANGSUNG REDIRECT TANPA DELAY, TANPA STATUS
    navigate("/pending-approval")
  }

  return (
    <div className="forgot-root">
      <div className="scale-wrapper">
        <div className="forgot-card">

          <h1 className="forgot-title">Forgot Password?</h1>

          <p className="forgot-sub">
            Remember your password?,
            <span className="back-login" onClick={onBack}> Login Here.</span>
          </p>

          <form onSubmit={handleSubmit} className="forgot-form">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="forgot-input"
            />

            <button type="submit" className="forgot-btn">Send Email</button>
          </form>

          {status && (
            <div className={`status ${status.type}`}>
              {status.message}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
