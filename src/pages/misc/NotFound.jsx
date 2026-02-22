import { Link } from "react-router";

export default function NotFound() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-6"
    >
      <h1 className="text-primary text-9xl font-bold">404</h1>
      <p className="text-foreground-muted text-xl">Halaman tidak ditemukan</p>
      <Link
        to="/"
        className="button button-primary"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
