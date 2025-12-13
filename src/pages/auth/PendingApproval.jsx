import '@/assets/css/auth/PendingApproval.css';
import { useNavigate } from "react-router";
import pendingIcon from '@/assets/hourglass.png';

export default function PendingApproval() {
  const navigate = useNavigate();

  return (
  <div className="pending-root">
    <div className="scale-wrapper">
      <div className="pending-card">
        <h1 className="pending-title">Menunggu<br/>Persetujuan</h1>

        <img 
          src={pendingIcon}
          alt="approval icon" 
          className="pending-icon"
        />

        <p className="pending-sub">
          Kami telah mengirimkan email verifikasi kepada anda. Silakan periksa email anda unuk petunjuk selanjutnya.
        </p>

        <button 
          className="pending-btn"
          onClick={() => navigate("/")}
        >
          Pergi ke beranda
        </button>

        </div>
      </div>
    </div>
  );
}
