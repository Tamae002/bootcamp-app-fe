import Gear from "@/assets/icons/Gear";
import People from "@/assets/icons/People";
import SchoolHat from "@/assets/icons/SchoolHat";
import Tiles from "@/assets/icons/Tiles";
import Sidebar from "@/components/misc/Sidebar";
import { Outlet } from "react-router";

export default function AdminLayout() {
  const navItems = [
    { to: "/", label: "Beranda", icon: <Tiles /> },
    { to: "/classes", label: "Manajemen Kelas", icon: <SchoolHat /> },
    { to: "/users", label: "Manajemen Pengguna", icon: <People /> },
    { to: "/settings", label: "Pengaturan", icon: <Gear /> },
  ];

  return (
    <div className="flex h-svh overflow-hidden">
      <Sidebar
        navItems={navItems}
      />

      <main className="flex-1 overflow-y-auto scrollbar-hidden">
        <Outlet />
      </main>
    </div>
  );
}
