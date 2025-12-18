import { useClass } from "@/contexts/class";
import meetSchema from "@/schema/meet";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function MeetDetail() {
  const class_ = useClass();
  const { meetId } = useParams();
  const [meet, setMeet] = useState(meetSchema);

  useEffect(() => {
    setMeet(class_.pertemuan[meetId]);
  }, [setMeet, class_, meetId]);

  return (
    <>
      <title>{`${meet.judul} | ${class_.nama_kelas} | Geeksfarm`}</title>
      <header>
        <h1 className="border-surface border-b-3 pb-2 text-4xl">
          {meet.judul}
        </h1>
        <p className="my-4">{meet.deskripsi_tugas}</p>
      </header>
      <article>
        <h2 className="border-surface border-b-3 pb-2 text-3xl">Tugas</h2>
      </article>
    </>
  );
}
