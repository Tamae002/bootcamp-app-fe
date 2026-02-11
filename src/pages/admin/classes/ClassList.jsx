import classApi from "@/apis/class.api";
import Add from "@/assets/icons/Add";
import ChevronLeft from "@/assets/icons/ChevronLeft";
import ChevronRight from "@/assets/icons/ChevronRight";
import PageTitle from "@/components/typography/PageTitle";
import { API_BASE_URL, DEFAULT_CLASS_IMAGE } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Skeleton from "react-loading-skeleton";
import { Link, useNavigate, useSearchParams } from "react-router";

export default function ClassList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(parseInt(searchParams.get("limit")) || 9);

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["classes", { page, limit }],
    queryFn: () => classApi.getAll({ page, limit }),
  });

  const classes = response?.data?.data ?? [];
  const totalPage = response?.data?.meta?.lastPage ?? 0;

  useEffect(() => {
    setPage(parseInt(searchParams.get("page")) || 1);
    setLimit(parseInt(searchParams.get("limit")) || 9);
  }, [setPage, setLimit, searchParams]);

  return (
    <>
      <title>Manajemen Kelas | Geeksfarm</title>
      <div className="content-wrapper-wide">
        <PageTitle>Manajemen Kelas</PageTitle>

        <section
          className="grid grid-cols-1 gap-x-12 gap-y-8 pb-24 md:grid-cols-3"
        >
          {isLoading ? (
            Array.from({ length: 3 }).map((_, id) => (
              <Skeleton key={id} className="h-80" borderRadius={16} />
            ))
          ) : classes.length < 1 ? (
            <p>Tidak ada kelas</p>
          ) : (
            classes.map((class_, id) => (
              <article
                key={id}
                className="bg-surface relative m-auto h-80 w-full max-w-140
                  rounded-3xl p-2 shadow-sm transition-all hover:scale-105
                  hover:shadow-md"
              >
                <figure>
                  <img
                    src={API_BASE_URL + class_?.gambar || DEFAULT_CLASS_IMAGE}
                    className="aspect-7/3 w-full rounded-2xl object-cover"
                    onError={(e) => {
                      // @ts-ignore
                      e.target.src = DEFAULT_CLASS_IMAGE;
                    }}
                  />
                </figure>
                <div className="p-3 text-pretty">
                  <h3 className="text-xl">
                    <Link
                      to={`/classes/${class_?.kelas_id}`}
                      className="after:absolute after:inset-0 after:z-1"
                    >
                      {class_?.nama_kelas}
                    </Link>
                  </h3>
                  <p className="text-justify text-xs">{class_?.deskripsi}</p>
                </div>
              </article>
            ))
          )}
        </section>

        <section
          className="bg-surface-subtle fixed right-8 bottom-8 left-8 z-20 flex
            flex-wrap items-center justify-between gap-4 rounded-xl p-3
            shadow-2xl md:left-auto md:w-fit"
        >
          <ReactPaginate
            previousLabel={<ChevronLeft className="h-5 w-5" />}
            nextLabel={<ChevronRight className="h-5 w-5" />}
            breakLabel="..."
            pageCount={totalPage}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={({ selected }) => {
              navigate(`?page=${selected + 1}`);
            }}
            forcePage={page - 1}
            containerClassName="pagination-container"
            pageClassName="pagination-page"
            previousClassName="pagination-previous"
            nextClassName="pagination-next"
            activeClassName="selected"
            disabledClassName="disabled"
            renderOnZeroPageCount={null}
          />

          <div className="bg-surface h-8 w-px" />

          <Link
            to="create"
            className="button-primary flex items-center gap-2 rounded-xl px-5
              py-2.5 text-sm font-medium transition-all hover:scale-105
              hover:shadow-lg"
          >
            <Add className="h-5 w-5" />
            <span>Tambah Kelas</span>
          </Link>
        </section>
      </div>
    </>
  );
}
