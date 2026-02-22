import classApi from "@/apis/class.api";
import ClassCard from "@/components/class/ClassCard";
import Add from "@/assets/icons/Add";
import ChevronLeft from "@/assets/icons/ChevronLeft";
import ChevronRight from "@/assets/icons/ChevronRight";
import SearchBar from "@/components/input/SearchBar";
import PageTitle from "@/components/typography/PageTitle";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Skeleton from "react-loading-skeleton";
import { useNavigate, useSearchParams } from "react-router";
import { Link } from "react-router";

export default function ClassList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(parseInt(searchParams.get("limit")) || 9);
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["classes", { page, limit, search }],
    queryFn: () => classApi.getAll({ page, limit, search }),
  });

  const classes = response?.data?.data ?? [];
  const totalPage = response?.data?.meta?.lastPage ?? 0;

  useEffect(() => {
    setPage(parseInt(searchParams.get("page")) || 1);
    setLimit(parseInt(searchParams.get("limit")) || 9);
    setSearch(searchParams.get("search") || "");
  }, [setPage, setLimit, setSearch, searchParams]);

  return (
    <>
      <title>Manajemen Kelas | Geeksfarm</title>
      <div className="content-wrapper-wide">
        <PageTitle>Manajemen Kelas</PageTitle>

        <SearchBar
          onInput={() => setPage(1)}
          action={(value) => navigate(`?page=1&search=${value}`)}
          onEmpty={() => navigate(`?page=1`)}
          containerClassName="mb-6"
          placeholder="Cari kelas"
        />

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
              <ClassCard
                key={id}
                classItem={class_}
                to={`/admin/classes/${class_?.kelas_id}`}
              />
            ))
          )}
        </section>

        <section
          className="bg-surface-subtle fixed right-4 bottom-4 z-20 flex
            flex-wrap items-center justify-center gap-2 rounded-xl p-3
            shadow-2xl max-md:right-4 max-md:left-18 md:right-4 md:bottom-8
            md:left-auto md:w-fit md:gap-4 md:p-3"
        >
          <ReactPaginate
            previousLabel={<ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />}
            nextLabel={<ChevronRight className="h-4 w-4 md:h-5 md:w-5" />}
            breakLabel="..."
            pageCount={totalPage}
            marginPagesDisplayed={1}
            pageRangeDisplayed={1}
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

          <div className="bg-surface h-6 w-px md:mx-2 md:h-8" />

          <Link
            to="create"
            className="button button-primary h-8 gap-1 px-3 text-xs font-medium
              transition-all md:gap-2 md:px-5 md:py-2.5 md:text-sm"
          >
            <Add className="h-4 w-4 md:h-5 md:w-5" />
            <span className="md:hidden">Tambah</span>
            <span className="hidden md:inline">Tambah Kelas</span>
          </Link>
        </section>
      </div>
    </>
  );
}
