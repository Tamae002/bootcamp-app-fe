import * as yup from "yup";

export const meetSchema = yup.object({
  judul: yup.string().required("Judul wajib diisi"),
  tanggal: yup.date().required("Tanggal wajib diisi"),
  deskripsi_tugas: yup.string().optional(),
  link_lampiran: yup.string().url("Link tidak valid").optional().nullable(),
});
