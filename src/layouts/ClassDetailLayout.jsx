import ChevronLeft from "@/assets/icons/ChevronLeft";
import { useAuth } from "@/contexts/auth";
import { useClass } from "@/contexts/class";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";

export default function ClassDetailLayout({ prefix = "" }) {
  const { user } = useAuth();
  const { class: class_ } = useClass();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex w-full">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="button button-primary fixed top-20 right-4 z-40 rounded-full
          p-2 md:hidden"
        aria-label="Toggle sidebar"
      >
        <ChevronLeft
          className={`h-6 w-6 transition-transform
            ${sidebarOpen ? "rotate-180" : ""}`}
        />
      </button>

      <section className="min-h-screen flex-1 p-8 text-pretty md:mr-80">
        <div className="m-auto flex w-full max-w-5xl flex-col gap-8">
          <Outlet />
        </div>
      </section>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`scrollbar-hidden bg-surface-subtle fixed top-[72px] right-0
          z-40 h-[calc(100vh-72px)] w-80 pb-24 transition-all duration-300
          md:fixed md:top-[72px] md:right-0 md:h-[calc(100vh-72px)] md:w-80
          md:translate-x-0 md:overflow-y-auto ${
            sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
          }`}
      >
        <div className="flex w-full flex-col">
          <NavLink
            to={`${prefix}/classes/${class_?.kelas_id}`}
            end
            className="navlink px-2 py-4"
            onClick={() => setSidebarOpen(false)}
          >
            <h3>Halaman Depan</h3>
          </NavLink>

          {class_?.pertemuan.map((meet, id) => (
            <NavLink
              key={id}
              to={`${prefix}/classes/${class_?.kelas_id}/meet/${meet.pertemuan_id}`}
              className="navlink border-overlay-md border-t-3 px-2 py-4"
              onClick={() => setSidebarOpen(false)}
            >
              <h3>{meet.judul}</h3>
            </NavLink>
          ))}
        </div>
      </aside>

      {["mentor"].includes(user.role) && (
        <Link
          to={`${prefix}/classes/${class_?.kelas_id}/meet/create`}
          className="button button-primary border-overlay-md fixed right-4
            bottom-4 w-72 rounded-sm border-t-3 px-2 py-4 text-center text-white
            shadow-lg"
        >
          + Tambah Pertemuan
        </Link>
      )}
    </div>
  );
}
