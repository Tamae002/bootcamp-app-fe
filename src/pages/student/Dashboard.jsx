import homeApi from "@/apis/home.api";
import { Link } from "react-router";
import headerImg from "@/assets/images/H_UserHomepage.jpg";
import footerLogo from "@/assets/images/logo/Logo_Footer.png";
import ClassCard from "@/components/class/ClassCard";
import Throbber from "@/components/misc/Throbber";
import { useAuth } from "@/contexts/auth";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { user } = useAuth();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["homeData"],
    queryFn: () => homeApi.getHomeData(),
  });

  const upcomingCourses = response?.data?.data?.pertemuan_mendatang ?? [];
  const classes = response?.data?.data?.kelas_terdaftar ?? [];

  if (isLoading) {
    return (
      <div
        className="bg-background flex min-h-screen items-center justify-center"
      >
        <div className="text-center">
          <Throbber size="64px" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Error Alert */}
      {isError && (
        <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="rounded border-l-4 border-red-500 bg-red-500/10 p-4">
            <div className="flex">
              <div className="shrink-0">
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
                <p className="text-sm text-red-500">
                  {error?.response?.data?.message ||
                    "Gagal memuat data. Silakan coba lagi."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Card - Horizontal Rectangle */}
        <div className="relative mb-12">
          <div className="bg-surface flex overflow-hidden rounded-lg shadow-lg">
            <div className="w-full">
              <div className="relative h-58">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${headerImg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
                <div
                  className="absolute right-0 bottom-0 left-0"
                  style={{
                    height: "6.5rem",
                    background:
                      "linear-gradient(to top, rgba(124,58,237,0.85), rgba(124,58,237,0))",
                  }}
                />
                <div className="absolute top-41 left-52">
                  <div className="text-white">
                    <p className="text-sm opacity-95">
                      Welcome {user?.name || ""}
                    </p>
                    <p className="text-4xl">Homepage</p>
                  </div>
                </div>
              </div>
              <div className="min-h-28 px-8 pt-10 pb-10"></div>
            </div>
            <div className="absolute top-35 left-10">
              <div
                className="flex h-36 w-36 items-center justify-center
                  rounded-full border-4 border-white bg-gradient-to-br
                  from-purple-400 to-pink-400 text-6xl text-white"
              >
                {user?.name?.charAt(0).toUpperCase() || "R"}
              </div>
            </div>
            <div className="absolute bottom-7 left-10">
              <p className="text-foreground w-36 text-center text-2xl">
                {user?.name || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Upcoming Courses Section - Simplified */}
        <div className="mb-12">
          <h2 className="text-foreground mb-6 text-xl">Pertemuan mendatang</h2>
          {upcomingCourses.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {upcomingCourses.map((course, index) => {
                // Cari nama kelas dari array classes berdasarkan kelas_id
                const kelasInfo = classes.find(
                  (k) => k.kelas_id === course.kelas_id,
                );

                return (
                  <Link
                    key={index}
                    to={`/classes/${course.kelas_id}/meet/${course.pertemuan_id}`}
                    className="block after:absolute after:inset-0 after:z-1"
                  >
                    <div
                      className="border-foreground/20 bg-surface flex
                        items-center justify-between rounded-md border px-4
                        py-3"
                    >
                      <div className="flex-1 pr-4">
                        {/* Nama Kelas */}
                        <div className="text-foreground text-sm">
                          {kelasInfo?.nama_kelas || "Pertemuan"} :
                        </div>
                        {/* Judul Pertemuan */}
                        <div className="text-foreground mt-1 text-xs">
                          {course.judul || "Tidak ada judul"}
                        </div>
                      </div>
                      {/* Tanggal */}
                      <div className="text-foreground text-right text-sm">
                        {course.tanggal
                          ? new Date(course.tanggal).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              },
                            )
                          : "-"}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg py-8 text-center">
              <p className="text-grey">Tidak ada pertemuan mendatang</p>
            </div>
          )}
        </div>

        {/* Classes Section */}
        <div>
          <h2 className="text-foreground mb-6 text-xl">Kelas</h2>
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
          className="bg-linear-to-b from-purple-600 to-purple-800 text-white"
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
