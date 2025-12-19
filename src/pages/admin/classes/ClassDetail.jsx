import KebabMenu from "@/assets/icons/KebabMenu";
import UserList from "@/components/class/UserList";
import { DEFAULT_CLASS_IMAGE } from "@/constants";
import { useClass } from "@/contexts/class";
import { Popover, PopoverContent, PopoverPortal, PopoverTrigger } from "@radix-ui/react-popover";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router";

export default function ClassDetail() {
  const class_ = useClass();

  return (
    <>
      <title>{`${class_.nama_kelas} | Geeksfarm`}</title>
      <figure>
        <img
          src={class_.gambar || DEFAULT_CLASS_IMAGE}
          className="aspect-7/3 w-full rounded-md"
        />
      </figure>
      <header>
        <div className="flex items-start">
          <h1 className="mb-4 flex-1 text-5xl">
            {class_.nama_kelas || <Skeleton />}
          </h1>
          <Popover>
            <PopoverTrigger className="hover:bg-overlay-md rounded-lg float-right">
              <KebabMenu className="size-6" />
            </PopoverTrigger>
            <PopoverPortal>
              <PopoverContent className="popover-content">
                <Link to="edit" className="popover-button">
                  Edit
                </Link>
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
