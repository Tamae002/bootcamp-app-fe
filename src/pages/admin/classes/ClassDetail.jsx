import classApi from "@/apis/class.api";
import Calendar from "@/assets/icons/Calendar";
import KebabMenu from "@/assets/icons/KebabMenu";
import UserList from "@/components/class/UserList";
import Throbber from "@/components/misc/Throbber";
import { API_BASE_URL, DEFAULT_CLASS_IMAGE } from "@/constants";
import { useClass } from "@/contexts/class";
import formatDate from "@/lib/formatDate";
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useNavigate } from "react-router";

export default function ClassDetail() {
  const navigate = useNavigate();
  const { class: class_ } = useClass();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    const response = await classApi.delete(id);
    setDeleteLoading(false);
    if (response.status == 200) navigate("/classes");
  };

  return (
    <>
      <title>{`${class_?.nama_kelas} | Geeksfarm`}</title>
      <figure>
        <img
          src={API_BASE_URL + class_?.gambar || DEFAULT_CLASS_IMAGE}
          className="aspect-7/3 w-full rounded-md object-cover"
          onError={(e) => {
            // @ts-ignore
            e.target.src = DEFAULT_CLASS_IMAGE;
          }}
        />
      </figure>
      <header className="flex flex-col gap-2">
        <div className="flex items-start">
          <h1 className="mb-4 flex-1 text-5xl">
            {class_?.nama_kelas || <Skeleton />}
          </h1>
          <Popover>
            <PopoverTrigger
              className="hover:bg-overlay-md float-right rounded-lg"
            >
              <KebabMenu className="size-6" />
            </PopoverTrigger>
            <PopoverPortal>
              <PopoverContent className="popover-content">
                <Link to="edit" className="popover-button">
                  Edit
                </Link>
                <button
                  onClick={async () => await handleDelete(class_?.kelas_id)}
                  className="popover-button text-red"
                >
                  Hapus {deleteLoading && <Throbber />}
                </button>
              </PopoverContent>
            </PopoverPortal>
          </Popover>
        </div>

        <div className="bg-surface flex items-center gap-3 rounded-lg p-3">
          <Calendar className="text-primary size-5" />
          <div className="flex flex-col">
            <span className="text-foreground/60 text-xs">Tanggal Mulai</span>
            <span className="text-sm font-medium">
              {formatDate(class_?.tanggal_mulai, { showTime: false })}
            </span>
          </div>
        </div>

        <div className="bg-surface flex items-center gap-3 rounded-lg p-3">
          <Calendar className="text-primary size-5" />
          <div className="flex flex-col">
            <span className="text-foreground/60 text-xs">Tanggal Berakhir</span>
            <span className="text-sm font-medium">
              {formatDate(class_?.tanggal_berakhir, { showTime: false })}
            </span>
          </div>
        </div>

        <p>{class_?.deskripsi || <Skeleton />}</p>
      </header>
      <UserList title="Pengajar" users={class_?.list_mentor} />
      <UserList title="Siswa" users={class_?.list_peserta} />
    </>
  );
}
