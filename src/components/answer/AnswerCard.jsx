import Download from "@/assets/icons/Download";
import ProfilePhoto from "@/components/misc/ProfilePhoto";
import { API_BASE_URL } from "@/constants";
import formatDate from "@/lib/formatDate";

export default function AnswerCard({
  jawaban,
  userData,
  onGradeClick,
  isMentor = false,
}) {
  return (
    <div className="bg-surface rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ProfilePhoto
            src={userData?.gambar}
            alt={userData?.name || "User"}
            size="md"
          />
          <span className="text-foreground/80 text-sm font-medium">
            {userData?.name || "Memuat..."}
          </span>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            jawaban.status === "menunggu"
              ? "bg-yellow text-black"
              : jawaban.status === "dinilai"
                ? "bg-green text-black"
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
          className="bg-primary hover:bg-primary-variant inline-flex
            items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
            text-white"
        >
          <Download className="size-4" />
          Unduh File
        </a>
      </div>
      <div className="mt-3 flex items-center justify-between">
        {jawaban.nilai ? (
          <span className="text-lg font-semibold">Nilai: {jawaban.nilai}</span>
        ) : isMentor ? (
          <button
            onClick={() => onGradeClick?.(jawaban)}
            className="text-primary hover:text-primary-variant text-sm
              font-medium"
          >
            Nilai
          </button>
        ) : (
          <span className="text-lg font-semibold">Belum dinilai</span>
        )}
        <span className="text-foreground/60 text-xs">
          {formatDate(jawaban.createdAt, { showTime: false })}
        </span>
      </div>
    </div>
  );
}
