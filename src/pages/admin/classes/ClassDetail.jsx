import classApi from "@/api/class.api";
import KebabMenu from "@/assets/icons/KebabMenu";
import UserList from "@/components/class/UserList";
import Throbber from "@/components/misc/Throbber";
import { DEFAULT_CLASS_IMAGE } from "@/constants";
import { useClass } from "@/contexts/class";
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router";
import { Link } from "react-router";

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
      <title>{`${class_.nama_kelas} | Geeksfarm`}</title>
      <figure>
        <img
          src={class_.gambar || DEFAULT_CLASS_IMAGE}
          className="aspect-7/3 w-full rounded-md"
          onError={(e) => {
            // @ts-ignore
            e.target.src = DEFAULT_CLASS_IMAGE;
          }}
        />
      </figure>
      <header>
        <div className="flex items-start">
          <h1 className="mb-4 flex-1 text-5xl">
            {class_.nama_kelas || <Skeleton />}
          </h1>
          <Popover>
            <PopoverTrigger className="hover:bg-overlay-md float-right rounded-lg">
              <KebabMenu className="size-6" />
            </PopoverTrigger>
            <PopoverPortal>
              <PopoverContent className="popover-content">
                <Link to="edit" className="popover-button">
                  Edit
                </Link>
                <button
                  onClick={async () => await handleDelete(class_.kelas_id)}
                  className="popover-button text-red"
                >
                  Hapus {deleteLoading && <Throbber />}
                </button>
              </PopoverContent>
            </PopoverPortal>
          </Popover>
        </div>
        <p>{class_.deskripsi || <Skeleton />}</p>
      </header>
      <UserList title="Pengajar" users={class_.list_mentor} />
      <UserList title="Siswa" users={class_.list_peserta} />
    </>
  );
}
