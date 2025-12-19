import userSchema from "./user";
import meetSchema from "./meet";

const classSchema = {
  kelas_id: "",
  nama_kelas: "",
  gambar: "",
  deskripsi: "",
  tanggal_mulai: "",
  tanggal_berakhir: "",
  list_mentor: [userSchema],
  list_peserta: [userSchema],
  pertemuan: [meetSchema]
}

export default classSchema;
