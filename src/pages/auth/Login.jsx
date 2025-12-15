import authApi from "@/api/auth.api";
import LoginImage from "@/assets/images/login_image.png";
import Logotype from "@/assets/images/logo/logotype.png";
import LogotypeDark from "@/assets/images/logo/logotype_dark.png";
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
        navigate("/")
      }
    } catch (err) {
      if (import.meta.env.NODE_ENV == "development") console.error(err);

      if (err instanceof AxiosError) {
        if (err.status == 400)
          setError("Email atau password salah.")
        else if (err.status)
          setError(err.response.data.message);
        else setError("Terjadi kesalahan pada server. Mohon coba lagi nanti.");

      } else if (err instanceof ValidationError || err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <title>Login - Geeksfarm</title>
      <main className="flex flex-col-reverse md:flex-row min-h-screen min-w-full">
        <form noValidate onSubmit={handleLogin} className="flex-1 flex flex-col gap-9 items-stretch justify-center px-6 md:px-28 md:py-auto max-md:-translate-y-24">
          <img className="max-md:hidden" src={theme == "dark" ? LogotypeDark : Logotype} />

          <img src={LoginImage} />

          <div>
            {error && <p className="mb-4 text-sm text-red">{error}</p>}
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              className="text-input"
            />
          </div>

          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            className="text-input"
          />

          <div className="text-primary-contrast font-semibold flex justify-between text-sm">
            <div className="flex gap-2">
              <input id="remember-me" type="checkbox" name="remember-me" />
              <label htmlFor="remember-me">Ingat saya?</label>
            </div>
            <a href="/forgot-password">Lupa Password?</a>
          </div>

          <input type="submit" value={loading ? "Memproses..." : "Masuk"} className="button" />

        </form>

        <aside className="flex-2">
          <div className="bg-primary w-full h-full pt-20 pb-32 px-5 md:py-0 md:px-20 flex flex-col justify-center gap-4">
            <h1 className="text-6xl md:text-9xl text-white">
              Bootcamp <br />
              Platform
            </h1>
            <p className="text-white md:text-4xl font-light">
              Platform terpadu untuk mengakses kelas, pertemuan, dan tugas dengan
              efisien.
            </p>
          </div>
        </aside>
      </main>
    </>
  );
}
