import meetSchema from "./meet";
import userSchema from "./user";

const classSchema = {
  id_kelas: "",
  nama_kelas: "",
  gambar: "",
  deskripsi: "",
  tanggal_mulai: "",
  tanggal_berakhir: "",
  mentor: [userSchema],
  anggota: [userSchema],
  pertemuan: [meetSchema]
}

export default classSchema;
