import { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/auth/useAuth";
import { statisticsService } from "../../api/statisticsService";

export default function Dashboard() {
  const { user } = useAuth();
  const displayName = user?.name || user?.fullName || user?.full_name || user?.username || "Raya";

  const [stats, setStats] = useState([
    { label: 'Total Peserta', value: 0 },
    { label: 'Total Mentor', value: 0 },
    { label: 'Total kelas', value: 0 },
    { label: 'Upcoming Meetings', value: 0 },
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
        { label: 'Upcoming Meetings', value: data.jumlah_pertemuan_mendatang?.length || 0 },
      ]);

      if (data.jumlah_pertemuan_mendatang && Array.isArray(data.jumlah_pertemuan_mendatang)) {
        const mappedClasses = data.jumlah_pertemuan_mendatang.map(kelas => ({
          id: kelas.kelas_id,
          title: kelas.nama_kelas,
          mentor: '-',
          participants: 0
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
    <div className="p-6 max-w-full overflow-x-hidden">
      <div className="mb-6">
        <p className="text-sm text-slate-500 dark:text-slate-100">Welcome {displayName}</p>
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-800 dark:text-slate-100">Beranda</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(300px,1fr)_minmax(300px,1fr)] gap-4 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-gray-100 dark:bg-[#262626] rounded-2xl p-6 shadow-sm"
          >
            <p className="text-sm text-slate-600 dark:text-white">{s.label}</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-white mt-3">{s.value}</p>
          </div>
        ))}
      </div>

      {classes.length > 0 && (
        <div className="rounded-2xl bg-white dark:bg-[#1f1f1f] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100">Class active</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {classes.map((c) => (
              <div key={c.id} className="bg-gray-100 dark:bg-[#262626] rounded-lg p-3">
                <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight line-clamp-2">
                  {c.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-100 mt-1 truncate">
                  Mentor: {c.mentor}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-slate-600 dark:text-slate-100">
                    {c.participants} Peserta
                  </span>
                  <button className="text-slate-600 dark:text-slate-400 text-lg leading-none">⋯</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}