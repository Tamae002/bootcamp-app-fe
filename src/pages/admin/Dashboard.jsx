import { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/auth/useAuth";
import { statisticsService } from "../../apis/statisticsService";
import PageSubtitle from '@/components/typography/PageSubtitle';
import PageTitle from '@/components/typography/PageTitle';


export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState([
    { label: 'Total Peserta', value: 0 },
    { label: 'Total Mentor', value: 0 },
    { label: 'Total kelas', value: 0 },
    { label: 'Pertemuan Mendatang', value: 0 },
  ]);

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await statisticsService.getStatistics();

      setStats([
        { label: 'Total Peserta', value: data.jumlah_peserta || 0 },
        { label: 'Total Mentor', value: data.jumlah_mentor || 0 },
        { label: 'Total kelas', value: data.jumlah_kelas || 0 },
        { label: 'Pertemuan Mendatang', value: data.jumlah_pertemuan || 0 },
      ]);

      if (data.kelas_aktif && Array.isArray(data.kelas_aktif)) {
        const mappedClasses = data.kelas_aktif.map(kelas => ({
          id: kelas.kelas_id,
          title: kelas.nama_kelas,
          mentor: '-',
          participants: kelas.total_peserta || 0
        }));
        setClasses(mappedClasses);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data statistik');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-full overflow-x-hidden">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-full overflow-x-hidden">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchStatistics}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper-wide">
      <PageSubtitle>Welcome {user.name}</PageSubtitle>
      <PageTitle>Beranda</PageTitle>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-[minmax(300px,1fr)_minmax(300px,1fr)] gap-3 sm:gap-4 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-gray-100 dark:bg-[#262626] rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-sm"
          >
            <p className="text-xs sm:text-sm text-slate-600 dark:text-white">{s.label}</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mt-2 sm:mt-3">{s.value}</p>
          </div>
        ))}
      </div>

      {classes.length > 0 && (
        <div className="rounded-lg sm:rounded-2xl bg-white dark:bg-[#1f1f1f] p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-100">Class active</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {classes.map((c) => (
              <div key={c.id} className="bg-gray-100 dark:bg-[#262626] rounded-lg p-3 sm:p-3">
                <h3 className="text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight line-clamp-2">
                  {c.title}
                </h3>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-100">
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
