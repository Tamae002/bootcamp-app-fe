import meetApi from "@/apis/meet.api";
import KebabMenu from "@/assets/icons/KebabMenu";
import Throbber from "@/components/misc/Throbber";
import { useAuth } from "@/contexts/auth";
import { useClass } from "@/contexts/class";
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Markdown from "react-markdown";
import { Link, useNavigate, useParams } from "react-router";
import remarkGfm from "remark-gfm";

export default function MeetDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { class: class_ } = useClass();
  const { meetId } = useParams();

  const { data: response } = useQuery({
    queryKey: ["meet", meetId],
    queryFn: () => meetApi.getById(meetId),
  });

  const meet = response?.data;

  const deleteMutation = useMutation({
    mutationFn: (id) => meetApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class", meet.kelas_id] });
      navigate(`/classes/${meet.kelas_id}`);
    },
  });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  return (
    <>
      <title>{`${meet?.judul} | ${class_.nama_kelas} | Geeksfarm`}</title>
      <header>
        <div className="border-surface flex items-start border-b-3">
          <h1 className="flex-1 pb-2 text-4xl">{meet?.judul}</h1>
          {["mentor"].includes(user.role) && (
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
                    onClick={() => handleDelete(meet?.pertemuan_id)}
                    className="popover-button text-red"
                  >
                    Hapus {deleteMutation.isPending && <Throbber />}
                  </button>
                </PopoverContent>
              </PopoverPortal>
            </Popover>
          )}
        </div>
        <div className="prose prose-sm dark:prose-invert my-4">
          <Markdown remarkPlugins={[remarkGfm]}>
            {meet?.deskripsi_tugas}
          </Markdown>
        </div>
      </header>
      <article>
        <h2 className="border-surface border-b-3 pb-2 text-3xl">Tugas</h2>
      </article>
    </>
  );
}
