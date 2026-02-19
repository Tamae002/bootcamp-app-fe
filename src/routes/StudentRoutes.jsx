import { lazy } from 'react'
import { Navigate, Route } from 'react-router'
import StudentLayout from '@/layouts/StudentLayout'

const Dashboard = lazy(() => import('@/pages/student/Dashboard'))
const Kelas = lazy(() => import('@/pages/student/Kelas'))

export default function StudentRoutes() {  // ← PASTIKAN ADA 'export default'
  return (
    <Route path="/student" element={<StudentLayout />}>
      <Route index element={<Navigate to="/student/dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="kelas" element={<Kelas />} />
    </Route>
  )
}