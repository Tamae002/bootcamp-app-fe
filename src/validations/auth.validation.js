import * as Yup from "yup";

export const loginSchema = Yup.object({
  password: Yup
    .string()
    .required("Password wajib diisi."),
  email: Yup
    .string()
    .required("Email wajib diisi.")
    .email("Format email tidak valid."),
});
