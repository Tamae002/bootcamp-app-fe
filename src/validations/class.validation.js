import * as Yup from "yup";

export const classSchema = Yup.object({
  nama_kelas: Yup
    .string()
    .required("Nama kelas wajib diisi."),
  deskripsi: Yup
    .string()
    .required("Deskripsi wajib diisi."),
  tanggal_mulai: Yup
    .date()
    .required("Tanggal mulai wajib diisi."),
  tanggal_berakhir: Yup
    .date()
    .required("Tanggal berakhir wajib diisi.")
    .min(Yup.ref("tanggal_mulai"), "Tanggal berakhir harus setelah atau sama dengan tanggal mulai."),
  mentor_added_users: Yup
    .array()
    .when("$isEdit", {
      is: false,
      then: (schema) => schema.min(1, "Minimal satu mentor wajib ditambahkan."),
      otherwise: (schema) => schema,
    }),
  mentor_removed_users: Yup
    .array()
    .when("$isEdit", {
      is: true,
      then: (schema) =>
        schema.test({
          name: "min-remaining-mentors",
          message: "Minimal harus tersisa satu mentor dalam kelas.",
          test: function (value) {
            const defaultMentorCount = this.options.context?.defaultMentorCount || 0;
            const addedMentors = this.parent.mentor_added_users?.length || 0;
            const removedMentors = value?.length || 0;
            const totalMentors = defaultMentorCount + addedMentors;
            return removedMentors < totalMentors;
          },
        }),
      otherwise: (schema) => schema,
    }),
  student_added_users: Yup.array(),
  student_removed_users: Yup.array(),
});
