import classApi from "@/apis/class.api";
import fileApi from "@/apis/file.api";
import UserSelect from "@/components/class/UserSelect";
import Throbber from "@/components/misc/Throbber";
import { API_BASE_URL, DEFAULT_CLASS_IMAGE, ENV } from "@/constants";
import { useClass } from "@/contexts/class";
import formDataToJson from "@/lib/formDataToJson";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function ClassForm({ edit = false }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id: classId } = useParams();
  const { class: class_ } = useClass();
  const [error, setError] = useState("");
  const classNameInput = useRef(null);
  const descriptionInput = useRef(null);
  const startDateInput = useRef(null);
  const endDateInput = useRef(null);
  const mentorInput = useRef(null);
  const studentInput = useRef(null);
  const bannerInput = useRef(null);
  const bannerPreview = useRef(null);

  useEffect(() => {
    if (edit) {
      classNameInput.current.value = class_.nama_kelas;
      descriptionInput.current.value = class_.deskripsi;
      startDateInput.current.value = class_.tanggal_mulai?.slice(0, 10);
      endDateInput.current.value = class_.tanggal_berakhir?.slice(0, 10);
    }
  }, [edit, class_]);

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // @ts-ignore
        bannerPreview.current.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const createMutation = useMutation({
    // @ts-ignore
    mutationFn: (payload) => classApi.create(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      navigate(`/classes/${response.data.kelas_id}`);
    },
    onError: (err) => {
      if (ENV == "development") console.error(err);

      if (err instanceof AxiosError) {
        if (err.response?.status) setError(err.response.data?.message);
        else setError("Terjadi kesalahan pada server. Mohon coba lagi nanti.");
      } else {
        setError("Terjadi kesalahan yang tidak terduga.");
      }
    },
  });

  const updateMutation = useMutation({
    // @ts-ignore
    mutationFn: (payload) => classApi.update(classId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      navigate(`/classes/${classId}`);
    },
    onError: (err) => {
      if (ENV == "development") console.error(err);

      if (err instanceof AxiosError) {
        if (err.response?.status) setError(err.response.data?.message);
        else setError("Terjadi kesalahan pada server. Mohon coba lagi nanti.");
      } else {
        setError("Terjadi kesalahan yang tidak terduga.");
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.target);
    const parsedFormData = formDataToJson(formData);

    let uploadedImageUrl = class_.gambar || DEFAULT_CLASS_IMAGE;

    const bannerFile = bannerInput.current?.files?.[0];
    if (bannerFile) {
      const uploadResponse = await fileApi.upload(bannerFile);
      uploadedImageUrl = uploadResponse.data.urls[0];
    }

    const payload = {
      nama_kelas: parsedFormData.nama_kelas,
      deskripsi: parsedFormData.deskripsi,
      gambar: uploadedImageUrl,
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

    if (edit) {
      // @ts-ignore
      updateMutation.mutate(payload);
    } else {
      // @ts-ignore
      createMutation.mutate(payload);
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
            ref={bannerPreview}
            src={API_BASE_URL + class_.gambar || DEFAULT_CLASS_IMAGE}
            className="aspect-7/3 w-full rounded-md object-cover group-hover:opacity-70"
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
            ref={bannerInput}
            type="file"
            name="gambar"
            id="banner"
            accept="image/*"
            className="hidden"
            onChange={handleBannerChange}
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
          {(createMutation.isPending || updateMutation.isPending) && (
            <Throbber />
          )}{" "}
          {edit ? "Simpan" : "Buat Kelas"}
        </button>
      </form>
    </div>
  );
}
