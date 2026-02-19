import answerApi from "@/apis/answer.api";
import { linkPreviewApi } from "@/apis/link_preview.api";
import meetApi from "@/apis/meet.api";
import userApi from "@/apis/user.api";
import Calendar from "@/assets/icons/Calendar";
import KebabMenu from "@/assets/icons/KebabMenu";
import AnswerCard from "@/components/answer/AnswerCard";
import DeleteConfirm from "@/components/dialog/DeleteConfirm";
import GradeDialog from "@/components/dialog/GradeDialog";
import { useAuth } from "@/contexts/auth";
import { useClass } from "@/contexts/class";
import formatDate from "@/lib/formatDate";
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Dialog, DialogOverlay, DialogPortal } from "@radix-ui/react-dialog";
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false);
  const [selectedJawaban, setSelectedJawaban] = useState(null);
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
    if (descriptionRef.current) {
      const contentHeight = descriptionRef.current.scrollHeight;
      const screenHeight = window.innerHeight;
      // Collapse if content exceeds 60% of screen height
      setShouldCollapse(contentHeight > screenHeight * 0.6);
      setIsExpanded(false);
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
    mutationFn: () => meetApi.delete(meet?.pertemuan_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class", meet.kelas_id] });
      setIsDeleteDialogOpen(false);
      navigate(`/classes/${meet.kelas_id}`);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleOpenGradeDialog = (jawaban) => {
    setSelectedJawaban(jawaban);
    setIsGradeDialogOpen(true);
  };

  const gradeMutation = useMutation({
    mutationFn: ({ jawabanId, nilai }) => answerApi.grade(jawabanId, { nilai }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meet", meetId] });
      setIsGradeDialogOpen(false);
      setSelectedJawaban(null);
    },
  });

  const handleGrade = (gradedJawaban) => {
    gradeMutation.mutate({
      jawabanId: gradedJawaban.jawaban_id,
      nilai: gradedJawaban.nilai,
    });
  };

  return (
    <>
      <title>{`${meet?.judul} | ${class_?.nama_kelas} | Geeksfarm`}</title>
      <header>
        <div className="border-surface flex items-start border-b-3">
          <h1 className="flex-1 pb-2 text-4xl">{meet?.judul}</h1>
          {["mentor"].includes(user.role) && (
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
          )}
        </div>
        <div className="bg-surface mt-4 flex items-center gap-3 rounded-lg p-3">
          <Calendar className="text-primary size-5" />
          <div className="flex flex-col">
            <span className="text-foreground/60 text-xs">
              Tanggal Pertemuan
            </span>
            <span className="text-sm font-medium">
              {formatDate(meet?.tanggal)}
            </span>
          </div>
        </div>
        <div
          ref={descriptionRef}
          className={`prose prose-sm dark:prose-invert my-4 overflow-hidden
            transition-all duration-300 ${
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
            className="text-primary hover:text-primary-variant relative -mt-2
              w-full text-sm font-medium transition-colors"
          >
            {!isExpanded && (
              <div
                className="from-background pointer-events-none absolute
                  bottom-[calc(100%+16px)] h-16 w-full bg-linear-to-t
                  to-transparent"
              />
            )}
            {isExpanded ? "Sembunyikan" : "Baca selengkapnya"}
          </button>
        )}
        {meet?.link_lampiran && (
          <a
            href={linkPreview?.url || meet.link_lampiran}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface hover:border-primary/50 mt-4 flex items-center
              gap-4 rounded-xl border-2 border-transparent p-4
              transition-colors"
          >
            {linkPreview?.image && (
              <img
                src={
                  linkPreview?.image.startsWith("http")
                    ? linkPreview?.image
                    : new URL(linkPreview?.image, linkPreview?.url).href
                }
                alt={linkPreview?.title}
                className="bg-surface-variant h-20 w-32 shrink-0 rounded-lg
                  object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {linkPreview?.favicon && (
                  <img
                    src={
                      linkPreview?.favicon.startsWith("http")
                        ? linkPreview?.favicon
                        : new URL(linkPreview?.favicon, linkPreview?.url).href
                    }
                    alt=""
                    className="h-4 w-4"
                  />
                )}
                <span className="text-foreground/60 text-xs">
                  {linkPreview?.siteName}
                </span>
              </div>
              <h3 className="mt-1 truncate text-base font-semibold text-wrap">
                {linkPreview?.title}
              </h3>
              <p className="text-foreground/70 line-clamp-2 text-sm">
                {linkPreview?.description || meet.link_lampiran}
              </p>
            </div>
          </a>
        )}
      </header>
      <section>
        <h2 className="border-surface border-b-3 pb-2 text-3xl">Tugas</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {meet?.jawaban?.map((jawaban) => (
            <AnswerCard
              key={jawaban.jawaban_id}
              jawaban={jawaban}
              userData={getUserData(jawaban.user_id)}
              onGradeClick={handleOpenGradeDialog}
              isMentor={user.role === "mentor"}
            />
          ))}
        </div>
        {(!meet?.jawaban || meet.jawaban.length === 0) && (
          <p className="text-foreground/60 mt-4 text-center text-sm">
            Belum ada jawaban yang dikumpulkan
          </p>
        )}
      </section>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogPortal>
          <DialogOverlay className="dialog-overlay">
            <DeleteConfirm
              onDelete={handleDelete}
              onClose={() => setIsDeleteDialogOpen(false)}
              isLoading={deleteMutation.isPending}
            />
          </DialogOverlay>
        </DialogPortal>
      </Dialog>

      <Dialog open={isGradeDialogOpen} onOpenChange={setIsGradeDialogOpen}>
        <DialogPortal>
          <DialogOverlay className="dialog-overlay">
            <GradeDialog
              jawaban={selectedJawaban}
              onGrade={handleGrade}
              onClose={() => {
                setIsGradeDialogOpen(false);
                setSelectedJawaban(null);
              }}
              isLoading={gradeMutation.isPending}
            />
          </DialogOverlay>
        </DialogPortal>
      </Dialog>
    </>
  );
}
