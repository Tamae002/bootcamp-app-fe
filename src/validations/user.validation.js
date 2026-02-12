import * as Yup from "yup";

export const createUserSchema = Yup.object({
  name: Yup.string().required("Nama wajib diisi."),
  email: Yup.string()
    .required("Email wajib diisi.")
    .email("Format email tidak valid."),
  password: Yup.string().required("Password wajib diisi."),
  role: Yup.string().required("Role wajib dipilih."),
});

export const updateUserSchema = Yup.object({
  name: Yup.string().required("Nama wajib diisi."),
  email: Yup.string()
    .required("Email wajib diisi.")
    .email("Format email tidak valid."),
});
