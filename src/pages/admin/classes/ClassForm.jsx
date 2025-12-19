import classApi from "@/api/class.api";
import Throbber from "@/components/misc/Throbber";
import { ENV } from "@/constants";
import formDataToJson from "@/lib/formDataToJson";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function ClassForm({ edit = false }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          type="text"
          id="title"
          name="nama_kelas"
          className="input"
          placeholder="Judul"
        />
        <textarea
          id="description"
          name="deskripsi"
          className="input"
          placeholder="Deskripsi"
        />
        <div className="flex gap-8">
          <input
            id="start-date"
            name="tanggal_mulai"
            type="date"
            className="input"
          />
          <input
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
