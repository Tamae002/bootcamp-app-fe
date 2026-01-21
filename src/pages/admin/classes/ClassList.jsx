import classApi from "@/api/class.api";
import Add from "@/assets/icons/Add";
import ChevronRight from "@/assets/icons/ChevronRight";
import { DEFAULT_CLASS_IMAGE } from "@/constants";
import { useAuth } from "@/contexts/auth";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useSearchParams } from "react-router";

export default function ClassList() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [totalPage, setTotalPage] = useState(0);
  const [classes, setClasses] = useState([]);
  const [limit, setLimit] = useState(parseInt(searchParams.get("limit")) || 9);
  const [error, setError] = useState(null);

  const fetchClasses = async () => {
    try {
      const response = await classApi.getAll({ page, limit });
      setClasses(response.data.data);
      setTotalPage(response.data.meta.lastPage);
    } catch (err) {
      if (import.meta.env.VITE_ENV == "development") console.error(err);

      if (err instanceof AxiosError) {
        if (err.status) setError(err.response.data?.message);
        else setError("Terjadi kesalahaan pada server. Mohon coba lagi nanti.");
      }
    }
  };

  useEffect(() => {
    setPage(parseInt(searchParams.get("page")) || 1);
    setLimit(parseInt(searchParams.get("limit")) || 9);
  }, [setPage, setLimit, searchParams]);

  useEffect(() => {
    fetchClasses();
  }, [setClasses, page, limit]);

  return (
    <>
      <title>Manajemen Kelas | Geeksfarm</title>
      <div className="px-8 py-10">
        <p className="text-xl text-balance">{`Welcome, ${user.name}`}</p>
        <h1 className="h-rule my-2 text-5xl">Manajemen Kelas</h1>

        <section className="mt-8 grid grid-cols-1 gap-x-12 gap-y-8 pb-24 md:grid-cols-3">
          {classes.length > 0 ? classes.map((class_, id) => (
            <article
              key={id}
              className="bg-surface relative m-auto h-80 w-full max-w-140 rounded-3xl p-2 shadow-lg transition-all hover:scale-105 hover:shadow-md"
            >
              <figure>
                <img
                  src={class_.gambar || DEFAULT_CLASS_IMAGE}
                  className="aspect-7/3 w-full rounded-2xl"
                />
              </figure>
              <div className="p-3 text-pretty">
                <h3 className="text-xl">
                  <Link
                    to={`/classes/${class_.kelas_id}`}
                    className="after:absolute after:inset-0 after:z-1"
                  >
                    {class_.nama_kelas}
                  </Link>
                </h3>
                <p className="text-justify text-xs">{class_.deskripsi}</p>
              </div>
            </article>
          )) : Array.from({ length: 3 }).map((_, id) => (
            <Skeleton key={id} className="h-80" />
          )) }
        </section>

        <section className="bg-surface-subtle shadow-2xl fixed right-8 bottom-8 z-20 flex gap-2 rounded-xl p-2">
          {page - 1 > 0 && (
            <Link
              to={`?page=${page - 1}`}
              className="bg-primary hover:bg-primary-variant size-10 rounded-xl text-white"
            >
              <ChevronRight className="-scale-100" />
            </Link>
          )}
          {page + 1 <= totalPage && (
            <Link
              to={`?page=${page + 1}`}
              className="bg-primary hover:bg-primary-variant size-10 rounded-xl text-white"
            >
              <ChevronRight />
            </Link>
          )}
          <Link to="create" className="bg-primary hover:bg-primary-variant size-10 rounded-xl text-white">
            <Add />
          </Link>
        </section>
      </div>
    </>
  );
}
