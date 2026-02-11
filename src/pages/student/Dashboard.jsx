import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth'
import { getHomeData } from '@/apis/home.api'
import headerImg from '@/assets/images/H_UserHomepage.jpg'
import footerLogo from '@/assets/images/logo/Logo_Footer.png'

export default function Dashboard() {
  const { user } = useAuth()

  const [upcomingCourses, setUpcomingCourses] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await getHomeData()
        
        // ✅ Sesuaikan dengan struktur API yang sebenarnya
        if (response.success && response.data) {
          setUpcomingCourses(response.data.pertemuan_mendatang || [])
          setClasses(response.data.kelas_terdaftar || [])
        }
        
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Gagal memuat data. Silakan coba lagi.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Alert */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card - Horizontal Rectangle */}
        <div className="relative mb-12">
          <div className="rounded-lg overflow-hidden shadow-lg bg-white flex">
            <div className="w-full">
              <div className="relative h-58">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${headerImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
                <div
                  className="absolute left-0 right-0 bottom-0"
                  style={{
                    height: '6.5rem',
                    background: 'linear-gradient(to top, rgba(124,58,237,0.85), rgba(124,58,237,0))',
                  }}
                />
                <div className="absolute top-41 left-52">
                  <div className="text-white">
                    <p className="text-sm opacity-95">Welcome {user?.name || ''}</p>
                    <p className="text-4xl">Homepage</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 px-8 pb-10 pt-10 min-h-28"></div>
            </div>
            <div className="absolute left-10 top-35">
              <div className="w-36 h-36 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-6xl border-4 border-white">
                {user?.name?.charAt(0).toUpperCase() || 'R'}
              </div>
            </div>
            <div className="absolute left-10 bottom-7">
              <p className="text-center text-gray-900 text-2xl w-36">{user?.name || ''}</p>
            </div>
          </div>
        </div>

        {/* Upcoming Courses Section - Simplified */}
<div className="mb-12">
  <h2 className="text-xl text-gray-900 mb-6">Pertemuan mendatang</h2>
  {upcomingCourses.length > 0 ? (
    <div className="grid grid-cols-1 gap-3">
      {upcomingCourses.map((course, index) => {
        // Cari nama kelas dari array classes berdasarkan kelas_id
        const kelasInfo = classes.find(k => k.kelas_id === course.kelas_id);
        
        return (
          <div
            key={course.pertemuan_id || index}
            className="rounded-md border border-black bg-gray-50 px-4 py-3 flex items-center justify-between"
          >
            <div className="flex-1 pr-4">
              {/* Nama Kelas */}
              <div className="text-sm text-black">
                {kelasInfo?.nama_kelas || 'Pertemuan'} :
              </div>
              {/* Judul Pertemuan */}
              <div className="text-xs text-black mt-1">
                {course.judul || 'Tidak ada judul'}
              </div>
            </div>
            {/* Tanggal */}
            <div className="text-sm text-black text-right">
              {course.tanggal 
                ? new Date(course.tanggal).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })
                : '-'}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="text-center py-8 bg-gray-100 rounded-lg">
      <p className="text-gray-500">Tidak ada pertemuan mendatang</p>
    </div>
  )}
</div>

{/* Classes Section */}
<div className="mb-12">
  <h2 className="text-xl text-gray-900 mb-6">Kelas</h2>
  {classes.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((classItem, index) => (
        <div 
          key={classItem.kelas_id || index} 
          className="bg-gray-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          {/* Image dengan padding dari tepi card */}
          <div className="p-4 pb-0">
            <div 
              className="h-44 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center overflow-hidden"
              style={{
                backgroundImage: classItem.gambar ? `url(${classItem.gambar})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {!classItem.gambar && (
                <span className="text-white text-3xl font-bold">Geeksfarm</span>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="px-5 py-4">
            {/* Title */}
        <h3 className="text-gray-900 font-medium text-xl mb-5 line-clamp-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {classItem.nama_kelas || 'Tidak ada nama'}
        </h3>
            
            {/* Description */}
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 mb-4">
              {classItem.deskripsi || 'Tidak ada deskripsi'}
            </p>
            
            {/* Divider */}
            <div className="pt-3 border-t border-gray-400">
              <p className="text-xs text-gray-600">
                Mulai: {classItem.tanggal_mulai 
                  ? new Date(classItem.tanggal_mulai).toLocaleDateString('id-ID', { 
                      day: 'numeric', 
                      month: 'numeric', 
                      year: 'numeric' 
                    }) 
                  : '5/2/2026'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-12 bg-gray-100 rounded-lg">
      <p className="text-gray-500">Tidak ada kelas tersedia</p>
    </div>
  )}
</div>
      </div>

      {/* Footer */}
      <footer className="mt-16">
        <div className="bg-purple-950 py-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-base text-white">
              <span className="font-semibold">Geeksfarm</span> Copyright © 2026
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-b from-purple-600 to-purple-800 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <div className="mb-4">
                  <img 
                    src={footerLogo} 
                    alt="Geeksfarm Logo" 
                    className="h-16 w-auto"
                  />
                </div>
                <p className="text-sm text-purple-100 leading-relaxed mb-6 max-w-md">
                  Accelerate your tech career with the cutting-edge curriculum of Geeksfarm Bootcamp! by investing in your employees through corporate training, you demonstrate your commitment to their professional.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 bg-transparent border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:text-purple-600 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-transparent border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:text-purple-600 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-transparent border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:text-purple-600 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-6">Kontak</h4>
                <div className="space-y-3">
                  <p className="text-sm text-purple-100">
                    Jln. Soekarno Hatta No.104, Bandung, Indonesia 40222
                  </p>
                  <p className="text-sm text-purple-100">
                    www.geeksfarm.com
                  </p>
                  <p className="text-sm text-purple-100">
                    +62 8597-4029-559
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}