import { Outlet } from "react-router";
import { ClassProvider } from "./ClassProvider";

export default function ClassProviderLayout() {
  return (
    <ClassProvider>
      <Outlet />
    </ClassProvider>
  );
}
