import classApi from "@/apis/class.api";
import UserSelect from "@/components/class/UserSelect";
import Throbber from "@/components/misc/Throbber";
import { DEFAULT_CLASS_IMAGE, ENV } from "@/constants";
import { useClass } from "@/contexts/class";
import formDataToJson from "@/lib/formDataToJson";
import { MDXEditor } from "@mdxeditor/editor";
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
      startDateInput.current.value = class_.tanggal_mulai?.slice(0, 10);
      endDateInput.current.value = class_.tanggal_berakhir?.slice(0, 10);
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
          parsedFormData.tanggal_mulai === ""
            ? null
            : new Date(parsedFormData.tanggal_mulai).toISOString(),
        tanggal_berakhir:
          parsedFormData.tanggal_berakhir === ""
            ? null
            : new Date(parsedFormData.tanggal_berakhir).toISOString(),
        added_users: [
          ...mentorInput.current.getAddedUsers(),
          ...studentInput.current.getAddedUsers(),
        ],
        removed_users: [
          ...mentorInput.current.getRemovedUsers(),
          ...studentInput.current.getRemovedUsers(),
        ],
      };

      let newClassId = classId;
      if (edit) {
        await classApi.update(classId, payload);
      } else {
        const response = await classApi.create(payload);
        newClassId = response.data.kelas_id;
      }
      fetchClass();
      navigate(`/classes/${newClassId}`);
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
    <div className="content-wrapper">
      <title>{`${edit ? "Edit" : "Buat"} Kelas | Geeksfarm`}</title>
      <header className="mb-8">
        <h1 className="h-rule text-5xl">{edit ? "Edit" : "Buat"} Kelas</h1>
      </header>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <figure className="group relative">
          <img
            id="banner-preview"
            src={class_.gambar || DEFAULT_CLASS_IMAGE}
            className="aspect-7/3 w-full rounded-md group-hover:opacity-70"
            onError={(e) => {
              // @ts-ignore
              e.target.src = DEFAULT_CLASS_IMAGE;
            }}
          />

          <label
            htmlFor="banner"
            className="button button-primary absolute top-1/2 left-1/2 hidden -translate-1/2 font-bold shadow-2xl group-hover:block"
          >
            Upload Gambar
          </label>
          <input
            type="file"
            name="gambar"
            id="banner"
            accept="image/*"
            className="hidden"
          />
        </figure>

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
          className="input h-26 resize-none"
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

        <button className="button button-primary font-bold">
          {loading && <Throbber />} {edit ? "Simpan" : "Buat Kelas"}
        </button>
      </form>
    </div>
  );
}
