import { API_BASE_URL, DEFAULT_CLASS_IMAGE } from "@/constants";
import { Link } from "react-router";

export default function ClassCard({ classItem, to }) {
  return (
    <article
      className="bg-surface relative m-auto h-80 w-full max-w-140 rounded-3xl
        p-2 shadow-sm transition-all hover:scale-105 hover:shadow-md"
    >
      <figure>
        <img
          src={API_BASE_URL + classItem?.gambar || DEFAULT_CLASS_IMAGE}
          className="aspect-7/3 w-full rounded-2xl object-cover"
          onError={(e) => {
            // @ts-ignore
            e.target.src = DEFAULT_CLASS_IMAGE;
          }}
        />
      </figure>
      <div className="p-3 text-pretty">
        <h3 className="text-xl">
          <Link to={to} className="after:absolute after:inset-0 after:z-1">
            {classItem?.nama_kelas}
          </Link>
        </h3>
        <p className="text-justify text-xs">{classItem?.deskripsi}</p>
      </div>
    </article>
  );
}
