import userSchema from "./user";
import meetSchema from "./meet";

const classSchema = {
  kelas_id: null,
  nama_kelas: "",
  gambar: "",
  deskripsi: "",
  tanggal_mulai: "",
  tanggal_berakhir: "",
  list_mentor: [],
  list_peserta: [],
  pertemuan: []
}

export default classSchema;
