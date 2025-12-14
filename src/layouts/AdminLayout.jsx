import { Outlet } from "react-router";
import { NavLink } from "react-router";
import Logotype from "@/assets/images/logo/logotype.png";
import LogotypeDark from "@/assets/images/logo/logotype_dark.png";
import { useTheme } from "@/contexts/theme";


export default function AdminLayout() {
  const { theme } = useTheme();

  return (
    <>
      <aside className="sidebar">
        <img src={theme == "dark" ? LogotypeDark : Logotype} className="px-7 pt-7" />
        <nav className="p-7 flex flex-col items-stretch gap-">
          <NavLink to="/dashboard">Beranda</NavLink>
          <NavLink to="/classes">Manajemen Kelas</NavLink>
          <NavLink to="/users">Manajemen Pengguna</NavLink>
          <NavLink to="/settings">Pengaturan</NavLink>
          <button>Keluar Pengguna</button>
        </nav>
      </aside>

      <main className="">
        <Outlet />
      </main>
    </>
  )
}
