import ChevronRight from "@/assets/icons/ChevronRight";
import Gear from "@/assets/icons/Gear";
import People from "@/assets/icons/People";
import Person from "@/assets/icons/Person";
import SchoolHat from "@/assets/icons/SchoolHat";
import Tiles from "@/assets/icons/Tiles";
import Logotype from "@/assets/images/logo/logotype.png";
import LogotypeDark from "@/assets/images/logo/logotype_dark.png";
import { useAuth } from "@/contexts/auth";
import { useTheme } from "@/contexts/theme";
import { useState } from "react";
import { NavLink, Outlet } from "react-router";

export default function AdminLayout({ children = null }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    window.innerWidth <= 768,
  );

  const navItems = [
    { to: "/", label: "Beranda", icon: <Tiles /> },
    { to: "/classes", label: "Manajemen Kelas", icon: <SchoolHat /> },
    { to: "/users", label: "Manajemen Pengguna", icon: <People /> },
    { to: "/settings", label: "Pengaturan", icon: <Gear /> },
  ];

  return (
    <div className="flex">
      <aside className={`sidebar ${sidebarCollapsed ? "w-16" : "w-75"}`}>
        <div className="flex h-24 items-center justify-between px-2 pt-7 pb-3">
          <img
            src={theme == "dark" ? LogotypeDark : Logotype}
            className={`h-full shrink-0 object-contain ${sidebarCollapsed && "hidden"}`}
          />
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="aspect-square h-12 p-3"
          >
            <ChevronRight
              className={`inline-block aspect-square h-full transition-transform ${!sidebarCollapsed && "rotate-180"}`}
            />
          </button>
        </div>
        <nav className="flex flex-1 flex-col items-stretch gap-1 p-2">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.icon}
              {!sidebarCollapsed && item.label}
            </NavLink>
          ))}
        </nav>
        <section className="flex items-center gap-2 border-t border-grey p-3 text-nowrap text-ellipsis">
          {user.image ? (
            <img src={user.image} className="shrink-0" />
          ) : (
            <Person className="shrink-0 bg-neutral-400 w-10 h-10 text-white rounded-full" />
          )}
          <div className={`flex flex-col gap-px ${sidebarCollapsed && "hidden"}`}>
            <span className="text-grey text-sm">Welcome back 👋</span>
            {user.name}
          </div>
        </section>
      </aside>

      <main className="flex-1">
        {children}
        <Outlet />
      </main>
    </div>
  );
}
