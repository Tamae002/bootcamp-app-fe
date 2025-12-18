import ChevronRight from "@/assets/icons/ChevronRight";
import { useAuth } from "@/contexts/auth";
import dummyClasses from "@/dummy/classes.json";
import { useEffect } from "react";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { Link } from "react-router";

export default function ClassList() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [classes, setClasses] = useState([]);
  const limit = 9;
  const totalPage = Math.ceil(dummyClasses.length / limit);

  useEffect(() => {
    // TODO: fetch classes data here
    setClasses(dummyClasses.slice(0 + limit * (page - 1), limit * page));
  }, [setClasses, page, limit]);

  return (
    <>
      <title>Manajemen Kelas | Geeksfarm</title>
      <div className="px-8 py-10">
        <p className="text-xl text-balance">{`Welcome, ${user.name}`}</p>
        <h1 className="my-2 text-5xl h-rule">Manajemen Kelas</h1>

        <section className="mt-8 grid grid-cols-1 gap-x-12 gap-y-8 pb-24 md:grid-cols-3">
          {classes.map((class_, id) => (
            <article
              key={id}
              className="bg-surface relative m-auto h-fit w-full max-w-140 rounded-3xl p-2 shadow-lg transition-all hover:scale-105 hover:shadow-md"
            >
              <figure>
                <img
                  src="https://placehold.co/490x210/802EC0/white.png?text=Geeksfarm&font=poppins"
                  className="aspect-7/3 w-full rounded-2xl"
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

        <section className="bg-surface-subtle z-20 fixed right-8 bottom-8 flex gap-2 rounded-lg p-2 shadow-xl">
          {page - 1 > 0 && (
            <Link
              to={`?page=${page - 1}`}
              onClick={() => setPage(page - 1)}
              className="bg-primary hover:bg-primary-variant size-10 rounded-sm text-white"
            >
              <ChevronRight className="-scale-100" />
            </Link>
          )}
          {page + 1 <= totalPage && (
            <Link
              to={`?page=${page + 1}`}
              onClick={() => setPage(page + 1)}
              className="bg-primary hover:bg-primary-variant size-10 rounded-sm text-white"
            >
              <ChevronRight />
            </Link>
          )}
          <button className="bg-primary hover:bg-primary-variant size-10 rounded-sm text-white">
            +
          </button>
        </section>
      </div>
    </>
  );
}
