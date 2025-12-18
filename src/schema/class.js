import userSchema from "./user";
import meetSchema from "./meet";

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
