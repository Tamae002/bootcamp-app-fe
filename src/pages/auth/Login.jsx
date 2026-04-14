import authApi from "@/apis/auth.api";
import LoginImage from "@/assets/images/login_image.png";
import Logo from "@/assets/images/logo/logotype.png";
import LogoDark from "@/assets/images/logo/logotype_dark.png";
import Input from "@/components/input/Input";
import PasswordInput from "@/components/input/PasswordInput";
import Throbber from "@/components/misc/Throbber";
import { useAuth } from "@/contexts/auth";
import { useTheme } from "@/contexts/theme";
import formDataToJson from "@/lib/formDataToJson";
import parseYupErrors from "@/lib/parseYupErrors";
import ObjectReducer from "@/reducers/ObjectReducer";
import { loginSchema } from "@/validations/auth.validation";
import { AxiosError } from "axios";
import { useReducer, useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { ValidationError } from "yup";

export default function Login() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { refetchAuthStatus } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, dispatchErrors] = useReducer(ObjectReducer, {});

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatchErrors({ type: "clear" });
    const formData = new FormData(e.target);
    const parsedFormData = formDataToJson(formData);

    try {
      loginSchema.validateSync(parsedFormData, { abortEarly: false });

      const response = await authApi.login({
        email: parsedFormData.email,
        password: parsedFormData.password,
      });

      if (response.status == 200) {
        refetchAuthStatus();
        navigate("/");
      }
    } catch (err) {
      if (import.meta.env.VITE_ENV == "development") console.error(err);

      if (err instanceof ValidationError) parseYupErrors(err, dispatchErrors);
      else if (err instanceof AxiosError) {
        if (err.status == 400)
          dispatchErrors({
            type: "set",
            key: "form",
            value: "Email atau password salah.",
          });
        else if (err.status < 500)
          dispatchErrors({
            type: "set",
            key: "form",
            value: err.response.data?.message,
          });
        else
          dispatchErrors({
            type: "set",
            key: "form",
            value: "Terjadi kesalahan pada server. Mohon coba lagi nanti.",
          });
      } else if (err instanceof Error) {
        dispatchErrors({ type: "set", key: "form", value: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>Login - Geeksfarm</title>
      <main
        className="scrollbar-hidden flex min-h-svh w-full flex-col-reverse
          overflow-y-scroll md:flex-row"
      >
        <form
          noValidate
          onSubmit={handleLogin}
          className="md:py-auto scrollbar-hidden flex flex-1 flex-col
            items-stretch justify-center gap-9 overflow-y-scroll px-6 py-0
            max-md:m-auto max-md:w-full max-md:max-w-120 max-md:-translate-y-24
            md:h-svh md:min-w-140 md:px-28 lg:px-20"
        >
          <img
            className="max-md:hidden"
            src={theme == "dark" ? LogoDark : Logo}
          />
          <img
            className="max-h-54 object-contain object-center"
            src={LoginImage}
          />
          <div>
            {errors?.form && (
              <p className="text-red mb-4 text-sm">{errors.form}</p>
            )}
            <Input
              type="email"
              name="email"
              label="Email"
              autoComplete="email"
              error={errors?.email}
            />
          </div>
          <PasswordInput
            label="Password"
            name="password"
            error={errors?.password}
          />
          <div
            className="text-primary-contrast flex justify-between text-sm
              font-semibold"
          >
            <Link to="/forgot-password">Lupa Password?</Link>
          </div>
          <button type="submit" className="button button-primary font-bold">
            {loading && <Throbber />}
            Masuk
          </button>
        </form>

        <aside className="flex-2">
          <div
            className="bg-primary flex h-full w-full flex-col justify-center
              gap-4 px-5 pt-20 pb-32 md:px-20 md:py-0"
          >
            <h1
              className="text-6xl text-white lg:text-7xl xl:text-8xl
                2xl:text-9xl"
            >
              Bootcamp Platform
            </h1>
            <p
              className="font-light text-pretty text-white md:text-2xl
                xl:text-3xl 2xl:text-4xl"
            >
              Platform terpadu untuk mengakses kelas, pertemuan, dan tugas
              dengan efisien.
            </p>
          </div>
        </aside>
      </main>
    </>
  );
}
