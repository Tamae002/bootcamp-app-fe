import Hourglass from "@/assets/icons/Hourglass";
import { Link } from "react-router";

export default function PendingApproval() {
  return (
    <div className="bg-surface flex min-h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-background flex flex-col items-center rounded-xl p-8 text-center">
          <h1 className="text-foreground mb-6 text-3xl font-bold">
            Menunggu
            <br />
            Persetujuan
          </h1>

          <div className="mb-6">
            <Hourglass className="text-foreground h-32 w-32" />
          </div>

          <p className="text-grey mb-8 text-sm">
            Kami telah mengirimkan email verifikasi kepada Anda. Silakan periksa
            email Anda untuk petunjuk selanjutnya.
          </p>

          <Link to="/" className="button button-primary w-full">
            Pergi ke beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
