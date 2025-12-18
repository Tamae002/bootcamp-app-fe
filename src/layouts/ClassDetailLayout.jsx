import { useClass } from "@/contexts/class";
import { NavLink, Outlet } from "react-router";

export default function ClassDetailLayout() {
  const class_ = useClass();

  return (
    <>
      <section className="mr-80 p-8 text-pretty">
        <div className="m-auto flex w-full max-w-5xl flex-col gap-8">
          <Outlet/>
        </div>
      </section>

      <aside className="scrollbar-hidden fixed top-0 right-0 z-10 h-svh w-80 overflow-y-scroll py-8 pr-8">
        <div className="bg-surface-subtle flex h-fit w-full flex-col gap-4 rounded-md p-4">
          <NavLink
            to={`/classes/${class_.id_kelas}`}
            end
            className="bg-overlay-sm hover:bg-overlay-md rounded-sm p-2"
          >
            <h3>Halaman Depan</h3>
          </NavLink>
          {class_.pertemuan.map((item, id) => (
            <NavLink
              key={id}
              to={`/classes/${class_.id_kelas}/${id}`}
              className="bg-overlay-sm hover:bg-overlay-md rounded-sm p-2"
            >
              <h3>{item.judul}</h3>
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
}
