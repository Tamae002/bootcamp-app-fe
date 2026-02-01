import { useClass } from "@/contexts/class";
import { Link } from "react-router";
import { NavLink, Outlet } from "react-router";

export default function ClassDetailLayout() {
  const { class: class_ } = useClass();

  return (
    <div className="flex w-full scrollbar-hidden">
      <section className="p-8 text-pretty flex-1 min-h-screen">
        <div className="m-auto flex w-full max-w-5xl flex-col gap-8">
          <Outlet />
        </div>
      </section>

      <aside className="scrollbar-hidden bg-surface-subtle relative flex w-80 flex-col overflow-y-scroll pb-24">
        <NavLink
          to={`/classes/${class_.kelas_id}`}
          end
          className="navlink px-2 py-4"
        >
          <h3>Halaman Depan</h3>
        </NavLink>

        {class_.pertemuan.map((meet, id) => (
          <NavLink
            key={id}
            to={`/classes/${class_.kelas_id}/meet/${meet.pertemuan_id}`}
            className="navlink border-overlay-md border-t-3 px-2 py-4"
          >
            <h3>{meet.judul}</h3>
          </NavLink>
        ))}
      </aside>

      <Link to={`/classes/${class_.kelas_id}/meet/create`} className="bg-primary hover:bg-primary-variant border-overlay-md fixed bottom-4 right-6 shadow-lg w-72 rounded-sm border-t-3 px-2 py-4 text-white">
        + Tambah Pertemuan
      </Link>
    </div>
  );
}
