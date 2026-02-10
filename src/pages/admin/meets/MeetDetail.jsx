import { linkPreviewApi } from "@/apis/link_preview.api";
import meetApi from "@/apis/meet.api";
import userApi from "@/apis/user.api";
import Download from "@/assets/icons/Download";
import KebabMenu from "@/assets/icons/KebabMenu";
import Person from "@/assets/icons/Person";
import Throbber from "@/components/misc/Throbber";
import { API_BASE_URL } from "@/constants";
import { useAuth } from "@/contexts/auth";
import { useClass } from "@/contexts/class";
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { Link, useNavigate, useParams } from "react-router";
import remarkGfm from "remark-gfm";

export default function MeetDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { class: class_ } = useClass();
  const { meetId } = useParams();

  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldCollapse, setShouldCollapse] = useState(false);
  const descriptionRef = useRef(null);

  const { data: response } = useQuery({
    queryKey: ["meet", meetId],
    queryFn: () => meetApi.getById(meetId),
  });

  const meet = response?.data;

  const { data: linkPreviewResponse } = useQuery({
    queryKey: ["linkPreview", meet?.link_lampiran],
    queryFn: () => linkPreviewApi.get(meet?.link_lampiran),
    enabled: !!meet?.link_lampiran,
  });

  const linkPreview = linkPreviewResponse?.data;

  useEffect(() => {
    if (descriptionRef.current && meet?.deskripsi_tugas) {
      const contentHeight = descriptionRef.current.scrollHeight;
      const screenHeight = window.innerHeight;
      // Collapse if content exceeds 60% of screen height
      setShouldCollapse(contentHeight > screenHeight * 0.6);
    }
  }, [meet?.deskripsi_tugas]);

  const userQueries = useQueries({
    queries: (meet?.jawaban || []).map((jawaban) => ({
      queryKey: ["user", jawaban.user_id],
      queryFn: () => userApi.getById(jawaban.user_id),
      enabled: !!jawaban.user_id,
    })),
  });

  const getUserData = (userId) => {
    const query = userQueries.find(
      // @ts-ignore
      (q) => q.data?.data?.user_id === userId,
    );
    // @ts-ignore
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
        <div
          ref={descriptionRef}
          className={`prose prose-sm dark:prose-invert my-4 overflow-hidden transition-all duration-300 ${
            !isExpanded && shouldCollapse ? "max-h-[60vh]" : "max-h-none"
          }`}
        >
          <Markdown remarkPlugins={[remarkGfm]}>
            {meet?.deskripsi_tugas}
          </Markdown>
        </div>
        {shouldCollapse && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary hover:text-primary-variant relative -mt-2 w-full text-sm font-medium transition-colors"
          >
            {!isExpanded && (
              <div className="from-background pointer-events-none absolute w-full bottom-[calc(100%+16px)] h-16 bg-linear-to-t to-transparent" />
            )}
            {isExpanded ? "Sembunyikan" : "Baca selengkapnya"}
          </button>
        )}
        {linkPreview && (
          <a
            href={linkPreview.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface hover:border-primary/50 mt-4 flex items-center gap-4 rounded-xl border-2 border-transparent p-4 transition-colors"
          >
            {linkPreview.image && (
              <img
                src={
                  linkPreview.image.startsWith("http")
                    ? linkPreview.image
                    : new URL(linkPreview.image, linkPreview.url).href
                }
                alt={linkPreview.title}
                className="bg-surface-variant h-20 w-32 shrink-0 rounded-lg object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {linkPreview.favicon && (
                  <img
                    src={
                      linkPreview.favicon.startsWith("http")
                        ? linkPreview.favicon
                        : new URL(linkPreview.favicon, linkPreview.url).href
                    }
                    alt=""
                    className="h-4 w-4"
                  />
                )}
                <span className="text-foreground/60 text-xs">
                  {linkPreview.siteName}
                </span>
              </div>
              <h3 className="mt-1 truncate text-base font-semibold">
                {linkPreview.title}
              </h3>
              <p className="text-foreground/70 line-clamp-2 text-sm">
                {linkPreview.description}
              </p>
            </div>
          </a>
        )}
      </header>
      <section>
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
                    <span className="text-foreground/80 text-sm font-medium">
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
                    href={API_BASE_URL + jawaban.file_path}
                    download
                    className="bg-primary hover:bg-primary-variant inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white"
                  >
                    <Download className="size-4" />
                    Unduh File
                  </a>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    Nilai: {jawaban.nilai}
                  </span>
                  <span className="text-foreground/60 text-xs">
                    {new Date(jawaban.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {(!meet?.jawaban || meet.jawaban.length === 0) && (
          <p className="text-foreground/60 mt-4 text-center text-sm">
            Belum ada jawaban yang dikumpulkan
          </p>
        )}
      </section>
    </>
  );
}
