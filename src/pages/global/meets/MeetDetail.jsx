import answerApi from "@/apis/answer.api";
import fileApi from "@/apis/file.api";
import { linkPreviewApi } from "@/apis/linkPreview.api";
import meetApi from "@/apis/meet.api";
import userApi from "@/apis/user.api";
import Calendar from "@/assets/icons/Calendar";
import Download from "@/assets/icons/Download";
import KebabMenu from "@/assets/icons/KebabMenu";
import AnswerCard from "@/components/answer/AnswerCard";
import DeleteConfirm from "@/components/dialog/DeleteConfirm";
import GradeDialog from "@/components/dialog/GradeDialog";
import { useAuth } from "@/contexts/auth";
import { useClass } from "@/contexts/class";
import { API_BASE_URL } from "@/constants";
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

export default function MeetDetail({ prefix = "" }) {
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
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState("");
  const descriptionRef = useRef(null);

  const handleCopyLink = async () => {
    const url = window.location.href.replace(prefix, "");
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { data: response } = useQuery({
    queryKey: ["meet", meetId],
    queryFn: () => meetApi.getById(meetId),
  });

  const meet = response?.data;

  const userAnswer = meet?.jawaban?.find((j) => j.user_id === user?.user_id);

  const { data: linkPreviewResponse } = useQuery({
    queryKey: ["linkPreview", meet?.link_lampiran],
    queryFn: () => linkPreviewApi.get(meet?.link_lampiran),
    enabled: !!meet?.link_lampiran,
  });

  const linkPreview = linkPreviewResponse?.data;

  useEffect(() => {
    document.querySelector("#root").scrollTo(0, 0);
  }, []);

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
      navigate(`${prefix}/classes/${meet.kelas_id}`);
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
    // @ts-ignore
    gradeMutation.mutate({
      jawabanId: gradedJawaban.jawaban_id,
      nilai: gradedJawaban.nilai,
    });
  };

  const uploadMutation = useMutation({
    mutationFn: async ({ file, deskripsi }) => {
      const uploadResponse = await fileApi.upload({
        files: file,
        nama: `answer-${meetId}-${user.user_id}-${Date.now()}`,
      });
      const filePath = uploadResponse.data.urls[0];
      return answerApi.create(meetId, { file_path: filePath, deskripsi });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meet", meetId] });
      setSelectedFile(null);
      setDescription("");
    },
  });

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    uploadMutation.mutate({ file: selectedFile, deskripsi: description });
  };

  return (
    <>
      <title>{`${meet?.judul} | ${class_?.nama_kelas} | Geeksfarm`}</title>
      <header>
        <div
          className="border-surface flex items-start border-b-3 max-md:flex-col
            max-md:gap-2"
        >
          <h1 className="flex-1 pb-2 text-4xl max-md:pb-1 max-md:text-2xl">
            {meet?.judul}
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
                {["mentor"].includes(user.role) && (
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
          className="bg-surface mt-4 flex items-center gap-3 rounded-lg p-3
            max-md:gap-2 max-md:p-2"
        >
          <Calendar className="text-primary size-5 max-md:size-4" />
          <div className="flex flex-col">
            <span className="text-foreground/60 text-xs max-md:text-[10px]">
              Tanggal Pertemuan
            </span>
            <span className="text-sm font-medium max-md:text-xs">
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
              gap-4 rounded-xl border-2 border-transparent p-4 transition-colors
              max-md:flex-col max-md:items-start max-md:gap-2 max-md:p-2"
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
                  object-cover max-md:h-24 max-md:w-full max-md:object-cover"
              />
            )}
            <div className="min-w-0 flex-1 max-md:w-full">
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
                <span className="text-foreground/60 text-xs max-md:text-[10px]">
                  {linkPreview?.siteName}
                </span>
              </div>
              <h3
                className="mt-1 truncate text-base font-semibold text-wrap
                  max-md:text-sm"
              >
                {linkPreview?.title}
              </h3>
              <p
                className="text-foreground/70 line-clamp-2 text-sm
                  max-md:text-xs"
              >
                {linkPreview?.description || meet.link_lampiran}
              </p>
            </div>
          </a>
        )}
      </header>

      {!["mentor", "admin"].includes(user.role) && (
        <section className="mt-6">
          <h2 className="border-surface border-b-3 pb-2 text-3xl max-md:text-xl">
            Jawaban Saya
          </h2>
          {userAnswer ? (
            <div className="bg-surface mt-4 rounded-xl p-4 shadow-sm max-md:p-3">
              <div
                className="flex items-center justify-between max-md:flex-col
                  max-md:items-start max-md:gap-2"
              >
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    userAnswer.status === "menunggu"
                      ? "bg-yellow text-black"
                      : userAnswer.status === "dinilai"
                        ? "bg-green text-black"
                        : "bg-grey text-white"
                    }`}
                >
                  {userAnswer.status}
                </span>
                <span className="text-foreground/60 text-xs">
                  {formatDate(userAnswer.createdAt, { showTime: true })}
                </span>
              </div>
              <div className="mt-3">
                <a
                  href={API_BASE_URL + userAnswer.file_path}
                  download
                  className="bg-primary hover:bg-primary-variant inline-flex
                    items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
                    text-white max-md:text-xs"
                >
                  <Download className="size-4" />
                  Unduh File
                </a>
              </div>
              {userAnswer.deskripsi && (
                <div className="mt-3">
                  <p className="text-foreground/70 text-sm max-md:text-xs">
                    {userAnswer.deskripsi}
                  </p>
                </div>
              )}
              <div className="mt-3">
                {userAnswer.nilai ? (
                  <span className="text-lg font-semibold max-md:text-base">
                    Nilai: {userAnswer.nilai}
                  </span>
                ) : (
                  <span className="text-lg font-semibold max-md:text-base">
                    Belum dinilai
                  </span>
                )}
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmitAnswer}
              className="mt-4 flex flex-col gap-4 max-md:gap-3"
            >
              <div>
                <label
                  htmlFor="file"
                  className="text-foreground/80 mb-2 block text-sm font-medium
                    max-md:mb-1 max-md:text-xs"
                >
                  File Jawaban *
                </label>
                <input
                  type="file"
                  id="file"
                  accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="file:bg-primary hover:file:bg-primary-variant block
                    w-full rounded-lg border border-gray-300 p-2 text-sm
                    file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2
                    file:text-sm file:font-medium file:text-white max-md:text-xs
                    dark:border-gray-600"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="text-foreground/80 mb-2 block text-sm font-medium
                    max-md:mb-1 max-md:text-xs"
                >
                  Deskripsi (Opsional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="border-surface focus:border-primary w-full
                    rounded-lg border p-3 text-sm transition-colors outline-none
                    max-md:p-2 max-md:text-xs"
                  placeholder="Tambahkan penjelasan tentang jawaban Anda..."
                />
              </div>
              <button
                type="submit"
                disabled={!selectedFile || uploadMutation.isPending}
                className="bg-primary hover:bg-primary-variant self-start
                  rounded-lg px-6 py-2.5 text-sm font-medium text-white
                  transition-colors disabled:cursor-not-allowed
                  disabled:bg-gray-400 max-md:px-4 max-md:py-2 max-md:text-xs"
              >
                {uploadMutation.isPending
                  ? "Mengunggah..."
                  : "Kumpulkan Jawaban"}
              </button>
            </form>
          )}
        </section>
      )}

      {["mentor", "admin"].includes(user.role) && (
        <section>
          <h2 className="border-surface border-b-3 pb-2 text-3xl max-md:text-xl">
            Tugas
          </h2>
          <div
            className="mt-4 grid grid-cols-2 gap-4 max-md:grid-cols-1
              max-md:gap-2"
          >
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
      )}

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
