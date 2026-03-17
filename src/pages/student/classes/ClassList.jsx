import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth";
import homeApi from "@/apis/home.api";
import ClassCard from "@/components/class/ClassCard";
import Footer from "@/components/misc/Footer";
import Throbber from "@/components/misc/Throbber";
import bannerImage from "@/assets/images/class_banner.svg";

export default function ClassList() {
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
        <div className="mx-auto max-w-7xl px-6 pt-4">
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
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <p className="text-foreground/70 mb-1 text-sm">
            Welcome {user?.name || "Raya"}
          </p>
          <h1 className="text-foreground text-2xl font-bold">Halaman Kelas</h1>
        </div>

        {/* Banner */}
        <img className="mb-8 rounded-lg" src={bannerImage} />

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
    </div>
  );
}
