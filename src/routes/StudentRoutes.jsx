import { lazy } from "react";
import { Navigate, Route } from "react-router";
import StudentLayout from "@/layouts/StudentLayout";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import LazyComponent from "@/components/misc/LazyComponent";
import ClassProviderLayout from "@/contexts/class/ClassProviderLayout";
import ClassDetailLayout from "@/layouts/ClassDetailLayout";

const Kelas = lazy(() => import("@/pages/student/Kelas"));
const ClassDetail = lazy(() => import("@/pages/global/classes/ClassDetail"));
const MeetDetail = lazy(() => import("@/pages/global/meets/MeetDetail"));

export default function StudentRoutes() {
  return (
    <Route element={<ProtectedRoute role={["user"]} />}>
      <Route element={<StudentLayout />}>
        <Route path="classes">
          <Route index element={<LazyComponent component={Kelas} />} />

          <Route element={<ClassProviderLayout />}>
            <Route path=":id" element={<ClassDetailLayout />}>
              <Route
                index
                element={<LazyComponent component={ClassDetail} />}
              />

              <Route path="meet/:meetId" element={<LazyComponent component={MeetDetail} />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Route>
  );
}
