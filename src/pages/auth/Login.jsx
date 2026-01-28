import authApi from "@/apis/auth.api";
import Visibility from "@/assets/icons/Visibility";
import VisibilityOff from "@/assets/icons/VisibilityOff";
import LoginImage from "@/assets/images/login_image.png";
import Logo from "@/assets/images/logo/logotype.png";
import LogoDark from "@/assets/images/logo/logotype_dark.png";
import Throbber from "@/components/misc/Throbber";
import { useAuth } from "@/contexts/auth";
import { useTheme } from "@/contexts/theme";
import formDataToJson from "@/lib/formDataToJson";
import { loginSchema } from "@/validations/auth.validation";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ValidationError } from "yup";

export default function Login() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { refetchAuthStatus } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.target);
    const parsedFormData = formDataToJson(formData);

    try {
      loginSchema.validateSync(parsedFormData);

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

      if (err instanceof AxiosError) {
        if (err.status == 400) setError("Email atau password salah.");
        else if (err.status) setError(err.response.data?.message);
        else setError("Terjadi kesalahan pada server. Mohon coba lagi nanti.");
      } else if (err instanceof ValidationError || err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>Login - Geeksfarm</title>
      <main className="scrollbar-hidden flex min-h-svh min-w-full flex-col-reverse overflow-y-scroll md:flex-row">
        <form
          noValidate
          onSubmit={handleLogin}
          className="md:py-auto scrollbar-hidden flex flex-1 flex-col items-stretch justify-center gap-9 overflow-y-scroll px-6 py-20 max-md:m-auto max-md:max-w-120 max-md:-translate-y-24 md:h-svh md:min-w-140 md:px-28"
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
            {error && <p className="text-red mb-4 text-sm">{error}</p>}
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email"
              className="input"
            />
          </div>
          <div className="input flex h-13">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              className="flex-1 outline-none"
            />
            {showPassword ? (
              <VisibilityOff
                className="w-8"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <Visibility
                className="w-8"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          <div className="text-primary-contrast flex justify-between text-sm font-semibold">
            <div className="flex gap-2">
              <input id="remember-me" type="checkbox" name="remember-me" />
              <label htmlFor="remember-me">Ingat saya?</label>
            </div>
            <a href="/forgot-password">Lupa Password?</a>
          </div>
          <button type="submit" className="button">
            {loading && <Throbber />}
            Masuk
          </button>
        </form>

        <aside className="flex-2">
          <div className="bg-primary flex h-full w-full flex-col justify-center gap-4 px-5 pt-20 pb-32 md:px-20 md:py-0">
            <h1 className="text-6xl text-white lg:text-7xl xl:text-8xl 2xl:text-9xl">
              Bootcamp Platform
            </h1>
            <p className="font-light text-pretty text-white md:text-2xl xl:text-3xl 2xl:text-4xl">
              Platform terpadu untuk mengakses kelas, pertemuan, dan tugas
              dengan efisien.
            </p>
          </div>
        </aside>
      </main>
    </>
  );
}
