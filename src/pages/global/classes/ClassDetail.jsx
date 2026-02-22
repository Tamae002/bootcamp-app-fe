import classApi from "@/apis/class.api";
import Calendar from "@/assets/icons/Calendar";
import KebabMenu from "@/assets/icons/KebabMenu";
import UserList from "@/components/class/UserList";
import DeleteConfirm from "@/components/dialog/DeleteConfirm";
import { API_BASE_URL, DEFAULT_CLASS_IMAGE } from "@/constants";
import { useClass } from "@/contexts/class";
import formatDate from "@/lib/formatDate";
import { Dialog, DialogOverlay, DialogPortal } from "@radix-ui/react-dialog";
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useNavigate } from "react-router";

export default function ClassDetail({ prefix = "" }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const { class: class_ } = useClass();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    setDeleteLoading(true);
    const response = await classApi.delete(class_?.kelas_id);
    setDeleteLoading(false);
    setIsDeleteDialogOpen(false);
    if (response.status == 200) navigate(`${prefix}/classes`);
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
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="popover-button text-red"
                >
                  Hapus
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogPortal>
          <DialogOverlay className="dialog-overlay">
            <DeleteConfirm
              onDelete={handleDelete}
              onClose={() => setIsDeleteDialogOpen(false)}
              isLoading={deleteLoading}
            />
          </DialogOverlay>
        </DialogPortal>
      </Dialog>
    </>
  );
}
