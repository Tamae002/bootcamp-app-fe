import { Link, useNavigate, useParams } from "react-router";
import { AxiosError } from "axios";
import { useReducer, useState } from "react";
import { ValidationError } from "yup";
import authApi from "@/apis/auth.api";
import PasswordInput from "@/components/input/PasswordInput";
import formDataToJson from "@/lib/formDataToJson";
import parseYupErrors from "@/lib/parseYupErrors";
import ObjectReducer from "@/reducers/ObjectReducer";
import { resetPasswordSchema } from "@/validations/auth.validation";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [loading, setLoading] = useState(false);
  const [errors, dispatchErrors] = useReducer(ObjectReducer, {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatchErrors({ type: "clear" });
    const formData = new FormData(e.target);
    const parsedFormData = formDataToJson(formData);

    try {
      resetPasswordSchema.validateSync(parsedFormData, { abortEarly: false });

      const response = await authApi.ResetPassword({
        token,
        newPassword: parsedFormData.newPassword,
        confirmPassword: parsedFormData.confirmPassword,
      });

      if (response.status === 200) {
        navigate("/login");
      }
    } catch (err) {
      if (import.meta.env.VITE_ENV === "development") console.error(err);

      if (err instanceof ValidationError) parseYupErrors(err, dispatchErrors);
      else if (err instanceof AxiosError) {
        if (err.response?.data?.message) {
          dispatchErrors({
            type: "set",
            key: "form",
            value: err.response.data.message,
          });
        } else {
          dispatchErrors({
            type: "set",
            key: "form",
            value: "Terjadi kesalahan pada server.",
          });
        }
      } else if (err instanceof Error) {
        dispatchErrors({ type: "set", key: "form", value: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface flex min-h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-background rounded-xl p-8">
          <h1 className="text-foreground mb-4 text-center text-3xl font-bold">
            Reset Password
          </h1>

          <p className="text-grey mb-8 text-center text-sm">
            Ingat password Anda?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login disini.
            </Link>
          </p>

          {errors?.form && (
            <p className="bg-red/20 text-red mb-6 rounded-lg px-4 py-2 text-center text-sm">
              {errors.form}
            </p>
          )}

          <form noValidate onSubmit={handleSubmit} className="space-y-6">
            <PasswordInput
              name="newPassword"
              label="Password Baru"
              error={errors?.newPassword}
              autoComplete="new-password"
            />

            <PasswordInput
              name="confirmPassword"
              label="Konfirmasi Password"
              error={errors?.confirmPassword}
              autoComplete="new-password"
            />

            <button
              type="submit"
              className="button button-primary w-full"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
