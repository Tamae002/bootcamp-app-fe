import LoginImage from "@/assets/images/login_image.png";
import Logotype from "@/assets/images/logo/logotype.png";

export default function Login() {
  return (
    <>
      <title>Login - Geeksfarm</title>
      <main className="flex flex-col-reverse md:flex-row min-h-screen min-w-full">
        <form className="flex-1 flex flex-col gap-9 items-stretch justify-center px-6 md:px-28 md:py-auto max-md:-translate-y-24">
          <img className="max-md:hidden" src={Logotype} />
          <img src={LoginImage} />
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            className="text-input"
          />
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            className="text-input"
          />
          <div className="text-primary font-semibold flex justify-between text-sm">
            <div className="flex gap-2">
              <input id="remember-me" type="checkbox" name="remember-me" />
              <label htmlFor="remember-me">Ingat saya?</label>
            </div>
            <a href="/forgot-password">Lupa Password?</a>
          </div>
          <input type="submit" value="Masuk" className="button" />
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
