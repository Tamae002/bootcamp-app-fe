import { useAuth } from "@/contexts/auth";
import dummyClasses from "@/dummy/classes.json";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router";

export default function ClassList() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [classes, setClasses] = useState([]);
  const limit = 10;

  useEffect(() => {
    // TODO: fetch classes data here
    setClasses(dummyClasses.slice(0 + limit * (page - 1), limit * page));
  }, [setClasses, page, limit]);

  return (
    <>
      <title>Manajemen Kelas | Geeksfarm</title>
      <div className="px-8 py-10">
        <p className="text-2xl text-balance">{`Welcome, ${user.name}`}</p>
        <h1 className="my-2 text-6xl">Manajemen Kelas</h1>

        <section className="mt-8 grid grid-cols-2 gap-x-12 gap-y-8">
          {classes.map((class_, id) => (
            <article key={id} className="bg-surface relative h-80 w-full rounded-3xl p-2 shadow-lg transition-all hover:scale-105 hover:shadow-md">
              <figure>
                <img
                  src="https://placehold.co/490x210/802EC0/white.png?text=Geeksfarm&font=poppins"
                  className="aspect-7/3 rounded-2xl"
                />
              </figure>
              <div className="p-3 text-pretty">
                <h3 className="text-xl">
                  <Link
                    to={`/classes/${id}`}
                    className="after:absolute after:inset-0 after:z-1"
                  >
                    {class_.nama_kelas}
                  </Link>
                </h3>
                <p className="text-justify text-sm">{class_.deskripsi}</p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </>
  );
}
