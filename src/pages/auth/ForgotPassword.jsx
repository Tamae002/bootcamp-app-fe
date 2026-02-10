import authApi from "@/apis/auth.api";
import Input from "@/components/input/Input";
import formDataToJson from "@/lib/formDataToJson";
import parseYupErrors from "@/lib/parseYupErrors";
import ObjectReducer from "@/reducers/ObjectReducer";
import { forgotPasswordSchema } from "@/validations/auth.validation";
import { AxiosError } from "axios";
import { useReducer, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ValidationError } from "yup";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, dispatchErrors] = useReducer(ObjectReducer, {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatchErrors({ type: "clear" });
    const formData = new FormData(e.target);
    const parsedFormData = formDataToJson(formData);

    try {
      forgotPasswordSchema.validateSync(parsedFormData, { abortEarly: false });

      const response = await authApi.forgotPassword({
        email: parsedFormData.email,
      });

      if (response.status === 200) {
        navigate("/pending-approval");
      }
    } catch (err) {
      if (import.meta.env.VITE_ENV === "development") console.error(err);

      if (err instanceof ValidationError) parseYupErrors(err, dispatchErrors);
      else if (err instanceof AxiosError) {
        if (err.response?.status === 404)
          dispatchErrors({
            type: "set",
            key: "form",
            value: "Email tidak terdaftar.",
          });
        else if (err.response?.data?.message)
          dispatchErrors({
            type: "set",
            key: "form",
            value: err.response.data.message,
          });
        else
          dispatchErrors({
            type: "set",
            key: "form",
            value: "Terjadi kesalahan pada server.",
          });
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
            Lupa Password?
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
            <Input
              name="email"
              label="Alamat Email"
              type="email"
              error={errors?.email}
            />

            <button
              type="submit"
              className="button button-primary w-full"
              disabled={loading}
            >
              {loading ? "Mengirim..." : "Kirim Email"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
