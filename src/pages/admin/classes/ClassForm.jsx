import classApi from "@/api/class.api";
import UserSelect from "@/components/class/UserSelect";
import Throbber from "@/components/misc/Throbber";
import { ENV } from "@/constants";
import { useClass } from "@/contexts/class";
import formDataToJson from "@/lib/formDataToJson";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function ClassForm({ edit = false }) {
  const navigate = useNavigate();
  const { id: classId } = useParams();
  const { class: class_, fetchClass } = useClass();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const classNameInput = useRef(null);
  const descriptionInput = useRef(null);
  const startDateInput = useRef(null);
  const endDateInput = useRef(null);
  const mentorInput = useRef(null);
  const studentInput = useRef(null);

  useEffect(() => {
    if (edit) {
      classNameInput.current.value = class_.nama_kelas;
      descriptionInput.current.value = class_.deskripsi;
      startDateInput.current.value = class_.tanggal_mulai.slice(0, 10);
      endDateInput.current.value = class_.tanggal_berakhir.slice(0, 10);
    }
  }, [edit, class_]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.target);
    const parsedFormData = formDataToJson(formData);

    try {
      const payload = {
        nama_kelas: parsedFormData.nama_kelas,
        deskripsi: parsedFormData.deskripsi,
        gambar: null,
        tanggal_mulai:
          parsedFormData.tanggal_mulai &&
          new Date(parsedFormData.tanggal_mulai).toISOString(),
        tanggal_berakhir:
          parsedFormData.tanggal_berakhir &&
          new Date(parsedFormData.tanggal_berakhir).toISOString(),
        added_users: [
          ...mentorInput.current.getAddedUsers(),
          ...studentInput.current.getAddedUsers(),
        ],
        removed_users: [
          ...mentorInput.current.getRemovedUsers(),
          ...studentInput.current.getRemovedUsers(),
        ],
      };
      if (edit) {
        await classApi.update(classId, payload);
        fetchClass();
        navigate(`/classes/${classId}`);
      } else {
        await classApi.create(payload);
        fetchClass();
        navigate("/classes");
      }
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
    <div className="m-auto max-w-4xl p-8">
      <title>Buat Kelas | Geeksfarm</title>
      <header className="mb-8">
        <h1 className="h-rule text-5xl">Buat Kelas</h1>
      </header>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {error && <p className="text-red text-sm">{error}</p>}
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

        <div className="flex gap-8 *:w-full">
          <div>
            <label htmlFor="start-date">Tanggal Mulai</label>
            <input
              ref={startDateInput}
              id="start-date"
              name="tanggal_mulai"
              type="date"
              className="input"
            />
          </div>

          <div>
            <label htmlFor="end-date">Tanggal Berakhir</label>
            <input
              ref={endDateInput}
              id="end-date"
              name="tanggal_berakhir"
              type="date"
              className="input"
            />
          </div>
        </div>

        <div>
          <p>Mentor</p>
          <UserSelect
            role="mentor"
            defaultUsers={class_.list_mentor}
            ref={mentorInput}
          />
        </div>

        <div>
          <p>Peserta</p>
          <UserSelect
            role="user"
            defaultUsers={class_.list_peserta}
            ref={studentInput}
          />
        </div>

        <button className="button">
          {loading && <Throbber />} {edit ? "Simpan" : "Buat Kelas"}
        </button>
      </form>
    </div>
  );
}
