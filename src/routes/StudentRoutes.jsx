import LazyComponent from "@/components/misc/LazyComponent";
import ClassProviderLayout from "@/contexts/class/ClassProviderLayout";
import ClassDetailLayout from "@/layouts/ClassDetailLayout";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import StudentLayout from "@/layouts/StudentLayout";
import { lazy } from "react";
import { Route } from "react-router";

const ClassList = lazy(() => import("@/pages/student/classes/ClassList"));
const ClassDetail = lazy(() => import("@/pages/global/classes/ClassDetail"));
const MeetDetail = lazy(() => import("@/pages/global/meets/MeetDetail"));

export default function StudentRoutes() {
  return (
    <Route element={<ProtectedRoute role={["user"]} />}>
      <Route element={<StudentLayout />}>
        <Route path="classes">
          <Route
            index
            element={
              <LazyComponent>
                <ClassList />
              </LazyComponent>
            }
          />

          <Route element={<ClassProviderLayout />}>
            <Route path=":id" element={<ClassDetailLayout />}>
              <Route
                index
                element={
                  <LazyComponent>
                    <ClassDetail />
                  </LazyComponent>
                }
              />

              <Route
                path="meet/:meetId"
                element={
                  <LazyComponent>
                    <MeetDetail />
                  </LazyComponent>
                }
              />
            </Route>
          </Route>
        </Route>
      </Route>
    </Route>
  );
}
