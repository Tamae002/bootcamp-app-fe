import meetApi from "@/apis/meet.api";
import KebabMenu from "@/assets/icons/KebabMenu";
import Throbber from "@/components/misc/Throbber";
import { useClass } from "@/contexts/class";
import meetSchema from "@/schemas/meet";
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useMemo } from "react";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { useParams } from "react-router";

export default function MeetDetail() {
  const navigate = useNavigate();
  const { class: class_ } = useClass();
  const { id: classId, meetId } = useParams();
  const meet = useMemo(() =>
    class_.pertemuan.find((meet) => meet.pertemuan_id == meetId),
    [class_, meetId]
  );
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    const response = await meetApi.delete(id);
    setDeleteLoading(false);
    if (response.status == 200) navigate(`/classes/${classId}`);
  };

  return (
    <>
      <title>{`${meet?.judul} | ${class_.nama_kelas} | Geeksfarm`}</title>
      <header>
        <div className="flex items-start border-surface border-b-3">
          <h1 className="flex-1 pb-2 text-4xl">
            {meet?.judul}
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
        <div className="prose prose-sm dark:prose-invert my-4">
          <Markdown>{meet?.deskripsi_tugas}</Markdown>
        </div>
      </header>
      <article>
        <h2 className="border-surface border-b-3 pb-2 text-3xl">Tugas</h2>
      </article>
    </>
  );
}
