import homeApi from "@/apis/home.api";
import { Link } from "react-router";
import headerImg from "@/assets/images/H_UserHomepage.jpg";
import ClassCard from "@/components/class/ClassCard";
import Footer from "@/components/misc/Footer";
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
                  <div
                    key={index}
                    className="border-foreground/20 bg-surface relative flex
                      items-center justify-between rounded-md border px-4 py-3"
                  >
                    <div className="flex-1 pr-4">
                      {/* Nama Kelas */}
                      <div className="text-foreground text-sm">
                        <Link
                          to={`/classes/${course.kelas_id}/meet/${course.pertemuan_id}`}
                          className="after:absolute after:inset-0 after:z-1"
                        >
                          {kelasInfo?.nama_kelas || "Pertemuan"} :
                        </Link>
                      </div>
                      {/* Judul Pertemuan */}
                      <div className="text-foreground mt-1 text-xs">
                        {course.judul || "Tidak ada judul"}
                      </div>
                    </div>
                    {/* Tanggal */}
                    <div className="text-foreground text-right text-sm">
                      {course.tanggal
                        ? new Date(course.tanggal).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "-"}
                    </div>
                  </div>
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
    </div>
  );
}
