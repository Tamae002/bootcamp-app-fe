import meetApi from "@/apis/meet.api";
import userApi from "@/apis/user.api";
import Download from "@/assets/icons/Download";
import KebabMenu from "@/assets/icons/KebabMenu";
import Person from "@/assets/icons/Person";
import Throbber from "@/components/misc/Throbber";
import { useAuth } from "@/contexts/auth";
import { useClass } from "@/contexts/class";
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
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

  const userQueries = useQueries({
    queries: (meet?.jawaban || []).map((jawaban) => ({
      queryKey: ["user", jawaban.user_id],
      queryFn: () => userApi.getById(jawaban.user_id),
      enabled: !!jawaban.user_id,
    })),
  });

  const getUserData = (userId) => {
    const query = userQueries.find(
      (q) => q.data?.data?.user_id === userId
    );
    return query?.data?.data;
  };

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
        <div className="mt-4 grid grid-cols-2 gap-4">
          {meet?.jawaban?.map((jawaban) => {
            const userData = getUserData(jawaban.user_id);
            return (
            <div
              key={jawaban.jawaban_id}
              className="bg-surface rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {userData?.gambar ? (
                    <img
                      src={userData.gambar}
                      alt={userData.name}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="bg-primary/20 flex size-10 items-center justify-center rounded-full">
                      <Person className="text-primary size-5" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-foreground/80">
                    {userData?.name || "Memuat..."}
                  </span>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    jawaban.status === "menunggu"
                      ? "bg-yellow text-black"
                      : jawaban.status === "dinilai"
                        ? "bg-green text-white"
                        : "bg-grey text-white"
                  }`}
                >
                  {jawaban.status}
                </span>
              </div>
              <div className="mt-3">
                <a
                  href={jawaban.file_path}
                  download
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-variant"
                >
                  <Download className="size-4" />
                  Unduh File
                </a>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-semibold">
                  Nilai: {jawaban.nilai}
                </span>
                <span className="text-xs text-foreground/60">
                  {new Date(jawaban.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          );})}
        </div>
        {(!meet?.jawaban || meet.jawaban.length === 0) && (
          <p className="text-foreground/60 mt-4 text-center text-sm">
            Belum ada jawaban yang dikumpulkan
          </p>
        )}
      </article>
    </>
  );
}
