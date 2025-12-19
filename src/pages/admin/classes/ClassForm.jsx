import classApi from "@/api/class.api";
import Throbber from "@/components/misc/Throbber";
import { ENV } from "@/constants";
import { useClass } from "@/contexts/class";
import formDataToJson from "@/lib/formDataToJson";
import { AxiosError } from "axios";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";

export default function ClassForm({ edit = false }) {
  const navigate = useNavigate();
  const { id: classId } = useParams();
  const class_ = useClass();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const classNameInput = useRef(null);
  const descriptionInput = useRef(null);
  const startDateInput = useRef(null);
  const endDateInput = useRef(null);

  useEffect(() => {
    if (edit) {
      console.dir(class_)
      classNameInput.current.value = class_.nama_kelas;
      descriptionInput.current.value = class_.deskripsi;
      startDateInput.current.value = class_.tanggal_mulai.slice(0, 10);
      endDateInput.current.value = class_.tanggal_berakhir.slice(0, 10);
    }
  }, [edit, class_])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.target);
    const parsedFormData = formDataToJson(formData);

    try {
      const response = await classApi.create({
        nama_kelas: parsedFormData.nama_kelas,
        deskripsi: parsedFormData.deskripsi,
        gambar: null,
        tanggal_mulai: new Date(parsedFormData.tanggal_mulai).toISOString(),
        tanggal_berakhir: new Date(parsedFormData.tanggal_berakhir).toISOString(),
      });

      navigate("/classes");
    } catch (err) {
      if (ENV == "development") console.error(err);

      if (err instanceof AxiosError) {
        if (err.status) setError(err.response.data?.message);
        else setError("Terjadi kesalahan pada server. Mohon  coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-auto max-w-2xl p-8">
      <title>Buat Kelas | Geeksfarm</title>
      <header className="mb-8">
        <h1 className="h-rule text-5xl">Buat Kelas</h1>
      </header>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {error && <p className="text-red mb-4 text-sm">{error}</p>}
        <input
          ref={classNameInput}
          type="text"
          id="title"
          name="nama_kelas"
          className="input"
          placeholder="Judul"
        />
        <textarea
          ref={descriptionInput}
          id="description"
          name="deskripsi"
          className="input"
          placeholder="Deskripsi"
        />
        <div className="flex gap-8">
          <input
            ref={startDateInput}
            id="start-date"
            name="tanggal_mulai"
            type="date"
            className="input"
          />
          <input
            ref={endDateInput}
            id="end-date"
            name="tanggal_berakhir"
            type="date"
            className="input"
          />
        </div>
        <button className="button">{loading && <Throbber />} Buat Kelas</button>
      </form>
    </div>
  );
}
