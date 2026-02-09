import { useAuth } from "@/contexts/auth";
import { useClass } from "@/contexts/class";
import { Link } from "react-router";
import { NavLink, Outlet } from "react-router";

export default function ClassDetailLayout() {
  const { user } = useAuth();
  const { class: class_ } = useClass();

  return (
    <div className="scrollbar-hidden flex w-full">
      <section className="min-h-screen flex-1 p-8 text-pretty">
        <div className="m-auto flex w-full max-w-5xl flex-col gap-8">
          <Outlet />
        </div>
      </section>

      <aside
        className="scrollbar-hidden bg-surface-subtle relative flex w-80
          flex-col overflow-y-scroll pb-24"
      >
        <NavLink
          to={`/classes/${class_?.kelas_id}`}
          end
          className="navlink px-2 py-4"
        >
          <h3>Halaman Depan</h3>
        </NavLink>

        {class_?.pertemuan.map((meet, id) => (
          <NavLink
            key={id}
            to={`/classes/${class_?.kelas_id}/meet/${meet.pertemuan_id}`}
            className="navlink border-overlay-md border-t-3 px-2 py-4"
          >
            <h3>{meet.judul}</h3>
          </NavLink>
        ))}
      </aside>

      {["mentor"].includes(user.role) && (
        <Link
          to={`/classes/${class_?.kelas_id}/meet/create`}
          className="button button-primary border-overlay-md fixed
            right-4 bottom-4 w-72 rounded-sm border-t-3 px-2 py-4 text-white
            shadow-lg text-center"
        >
          + Tambah Pertemuan
        </Link>
      )}
    </div>
  );
}
