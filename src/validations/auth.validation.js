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

export const resetPasswordSchema = Yup.object({
  newPassword: Yup
    .string()
    .required("Password wajib diisi."),
  confirmPassword: Yup
    .string()
    .required("Konfirmasi password wajib diisi.")
    .oneOf([Yup.ref("newPassword")], "Password tidak sama."),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup
    .string()
    .required("Email wajib diisi.")
    .email("Format email tidak valid."),
});
