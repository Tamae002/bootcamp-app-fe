import './PendingApproval.css';
import { useNavigate } from "react-router";

export default function PendingApproval() {
  const navigate = useNavigate();

  return (
    <div className="pending-root">
      <div className="scale-wrapper">
        <div className="pending-card">
          <h1 className="pending-title">Pending<br />Approval</h1>

          <img
            src="/hourglass.png"
            alt="approval icon"
            className="pending-icon"
          />

          <p className="pending-sub">
            We’ve sent you an email verification<br />
            please check your email for further<br />
            instructions
          </p>

          <button
            className="pending-btn"
            onClick={() => navigate("/")}
          >
            Go to Homepage
          </button>

        </div>
      </div>
    </div>
  );
}
