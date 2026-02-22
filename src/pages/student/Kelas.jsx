import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { getHomeData } from "@/apis/home.api";
import ClassCard from "@/components/class/ClassCard";
import footerLogo from "@/assets/images/logo/Logo_Footer.png";

export default function Kelas() {
  const { user } = useAuth();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getHomeData();

        // ✅ Sesuaikan dengan struktur API yang sebenarnya (SAMA DENGAN DASHBOARD)
        if (response.success && response.data) {
          setClasses(response.data.kelas_terdaftar || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div
        className="bg-background flex min-h-screen items-center justify-center"
      >
        <div className="text-center">
          <div
            className="border-primary mx-auto h-16 w-16 animate-spin
              rounded-full border-b-4"
          ></div>
          <p className="text-foreground/70 mt-4 text-lg">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Error Alert */}
      {error && (
        <div className="mx-auto max-w-7xl px-6 pt-4">
          <div className="rounded border-l-4 border-red-500 bg-red-500/10 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <p className="text-foreground/70 mb-1 text-sm">
            Welcome {user?.name || "Raya"}
          </p>
          <h1 className="text-foreground text-2xl font-bold">Halaman Kelas</h1>
        </div>

        {/* Banner */}
        <div
          className="mb-8 rounded-lg bg-gradient-to-r from-purple-600
            to-purple-700 px-8 py-32 text-center shadow-lg"
        >
          <h2 className="text-5xl font-bold text-white">Banner</h2>
        </div>

        {/* Kelas Saya Section */}
        <div className="mb-12">
          <h2
            className="text-foreground border-foreground/20 mb-6 border-b-2 pb-2
              text-2xl font-bold"
          >
            Kelas Saya
          </h2>

          {/* Grid 4 kolom */}
          {classes.length > 0 ? (
            <div
              className="grid grid-cols-1 gap-x-12 gap-y-8 pb-24 md:grid-cols-3"
            >
              {classes.map((classItem, index) => (
                <ClassCard
                  key={classItem.kelas_id || index}
                  classItem={classItem}
                  to={`/classes/${classItem.kelas_id}`}
                />
              ))}
            </div>
          ) : (
            <div className="bg-surface-subtle rounded-lg py-12 text-center">
              <p className="text-grey">Tidak ada kelas tersedia</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16">
        <div className="bg-purple-950 py-4">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-base text-white">
              <span className="font-semibold">Geeksfarm</span> Copyright © 2026
            </p>
          </div>
        </div>
        <div
          className="bg-gradient-to-b from-purple-600 to-purple-800 text-white"
        >
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              <div>
                <div className="mb-4">
                  <img
                    src={footerLogo}
                    alt="Geeksfarm Logo"
                    className="h-16 w-auto"
                  />
                </div>
                <p
                  className="mb-6 max-w-md text-sm leading-relaxed
                    text-purple-100"
                >
                  Accelerate your tech career with the cutting-edge curriculum
                  of Geeksfarm Bootcamp! by investing in your employees through
                  corporate training, you demonstrate your commitment to their
                  professional.
                </p>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center
                      rounded-full border-2 border-white bg-transparent
                      transition hover:bg-white hover:text-purple-600"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center
                      rounded-full border-2 border-white bg-transparent
                      transition hover:bg-white hover:text-purple-600"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center
                      rounded-full border-2 border-white bg-transparent
                      transition hover:bg-white hover:text-purple-600"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h4 className="mb-6 text-2xl font-bold">Kontak</h4>
                <div className="space-y-3">
                  <p className="text-sm text-purple-100">
                    Jln. Soekarno Hatta No.104, Bandung, Indonesia 40222
                  </p>
                  <p className="text-sm text-purple-100">www.geeksfarm.com</p>
                  <p className="text-sm text-purple-100">+62 8597-4029-559</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
