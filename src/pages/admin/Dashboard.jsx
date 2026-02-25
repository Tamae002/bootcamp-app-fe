import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth";
import statisticsApi from "@/apis/statisticsService";
import PageSubtitle from "@/components/typography/PageSubtitle";
import PageTitle from "@/components/typography/PageTitle";

export default function Dashboard() {
  const { user } = useAuth();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["statistics"],
    queryFn: () => statisticsApi.getStatistics(),
  });

  const stats = [
    { label: "Total Peserta", value: data?.jumlah_peserta || 0 },
    { label: "Total Mentor", value: data?.jumlah_mentor || 0 },
    { label: "Total kelas", value: data?.jumlah_kelas || 0 },
    { label: "Pertemuan Mendatang", value: data?.jumlah_pertemuan || 0 },
  ];

  const classes =
    data?.kelas_aktif?.map((kelas) => ({
      id: kelas.kelas_id,
      title: kelas.nama_kelas,
      mentor: "-",
      participants: kelas.total_peserta || 0,
    })) || [];

  if (isLoading) {
    return (
      <div className="max-w-full overflow-x-hidden p-6">
        <div className="flex h-64 items-center justify-center">
          <div
            className="h-12 w-12 animate-spin rounded-full border-b-2
              border-slate-800"
          ></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-full overflow-x-hidden p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-600">
            {error?.response?.data?.message || "Gagal memuat data statistik"}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-2 rounded bg-red-600 px-4 py-2 text-white
              hover:bg-red-700"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper-wide">
      <PageSubtitle>Welcome {user?.name}</PageSubtitle>
      <PageTitle>Beranda</PageTitle>

      <div
        className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4
          md:grid-cols-[minmax(300px,1fr)_minmax(300px,1fr)]"
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg bg-gray-100 p-4 shadow-sm sm:rounded-2xl
              sm:p-6 dark:bg-[#262626]"
          >
            <p className="text-xs text-slate-600 sm:text-sm dark:text-white">
              {s.label}
            </p>
            <p
              className="mt-2 text-2xl font-bold text-slate-800 sm:mt-3
                sm:text-3xl dark:text-white"
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {classes.length > 0 && (
        <div
          className="rounded-lg bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6
            dark:bg-[#1f1f1f]"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2
              className="text-base font-medium text-slate-800 sm:text-lg
                dark:text-slate-100"
            >
              Class active
            </h2>
          </div>

          <div
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3
              md:grid-cols-4 lg:grid-cols-5"
          >
            {classes.map((c) => (
              <div
                key={c.id}
                className="rounded-lg bg-gray-100 p-3 sm:p-3 dark:bg-[#262626]"
              >
                <h3
                  className="line-clamp-2 text-[11px] leading-tight
                    font-semibold text-slate-800 sm:text-xs dark:text-slate-100"
                >
                  {c.title}
                </h3>
                <div className="mt-3 flex items-center justify-between">
                  <span
                    className="text-[10px] text-slate-600 sm:text-[11px]
                      dark:text-slate-100"
                  >
                    {c.participants} Peserta
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
