import classApi from "@/apis/class.api";
import Calendar from "@/assets/icons/Calendar";
import KebabMenu from "@/assets/icons/KebabMenu";
import UserList from "@/components/class/UserList";
import DeleteConfirm from "@/components/dialog/DeleteConfirm";
import { API_BASE_URL, DEFAULT_CLASS_IMAGE } from "@/constants";
import { useAuth } from "@/contexts/auth";
import { useClass } from "@/contexts/class";
import formatDate from "@/lib/formatDate";
import { Dialog, DialogOverlay, DialogPortal } from "@radix-ui/react-dialog";
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useEffect } from "react";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useNavigate } from "react-router";

export default function ClassDetail({ prefix = "" }) {
  useEffect(() => {
    document.querySelector("#root").scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { class: class_ } = useClass();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const url = window.location.href.replace(prefix, "");
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          className="aspect-7/3 w-full rounded-md object-cover
            max-md:aspect-video"
          onError={(e) => {
            // @ts-ignore
            e.target.src = DEFAULT_CLASS_IMAGE;
          }}
        />
      </figure>
      <header className="flex flex-col gap-2">
        <div className="flex items-start max-md:flex-col max-md:gap-2">
          <h1 className="mb-4 flex-1 text-5xl max-md:mb-2 max-md:text-2xl">
            {class_?.nama_kelas || <Skeleton />}
          </h1>
          <Popover>
            <PopoverTrigger
              className="hover:bg-overlay-md float-right rounded-lg
                max-md:self-end"
            >
              <KebabMenu className="size-6" />
            </PopoverTrigger>
            <PopoverPortal>
              <PopoverContent className="popover-content">
                <button onClick={handleCopyLink} className="popover-button">
                  {copied ? "Tersalin" : "Salin link"}
                </button>

                {["admin", "mentor"].includes(user.role) && (
                  <>
                    <Link to="edit" className="popover-button">
                      Edit
                    </Link>
                    <button
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="popover-button text-red"
                    >
                      Hapus
                    </button>
                  </>
                )}
              </PopoverContent>
            </PopoverPortal>
          </Popover>
        </div>

        <div
          className="bg-surface flex items-center gap-3 rounded-lg p-3
            max-md:gap-2 max-md:p-2"
        >
          <Calendar className="text-primary size-5 max-md:size-4" />
          <div className="flex flex-col">
            <span className="text-foreground/60 text-xs max-md:text-[10px]">
              Tanggal Mulai
            </span>
            <span className="text-sm font-medium max-md:text-xs">
              {formatDate(class_?.tanggal_mulai, { showTime: false })}
            </span>
          </div>
        </div>

        <div
          className="bg-surface flex items-center gap-3 rounded-lg p-3
            max-md:gap-2 max-md:p-2"
        >
          <Calendar className="text-primary size-5 max-md:size-4" />
          <div className="flex flex-col">
            <span className="text-foreground/60 text-xs max-md:text-[10px]">
              Tanggal Berakhir
            </span>
            <span className="text-sm font-medium max-md:text-xs">
              {formatDate(class_?.tanggal_berakhir, { showTime: false })}
            </span>
          </div>
        </div>

        <p className="max-md:text-sm">{class_?.deskripsi || <Skeleton />}</p>
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
