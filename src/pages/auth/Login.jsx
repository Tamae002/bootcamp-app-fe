import loginImage from "@/assets/login_image.png";

export default function Login() {
  return (
    <main className="flex flex-row min-h-screen min-w-full">
      <aside className="flex-3 p-8">
        <div className="bg-primary w-full h-full rounded-[100px] px-10 flex flex-col justify-center gap-4">
          <h1 className="text-9xl text-white">
            Bootcamp <br />
            Platform
          </h1>
          <p className="text-white text-4xl font-light">
            Platform terpadu untuk mengakses kelas, pertemuan, dan tugas dengan
            efisien.
          </p>
        </div>
      </aside>

      <form className="flex-2 flex flex-col gap-9 items-stretch justify-center px-24">
        <h1 className="font-semibold text-5xl text-center tracking-[.25em]">
          Login
        </h1>
        <img src={loginImage} />
        <input
          id="email"
          type="text"
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
        <div class="text-primary font-semibold flex justify-between">
          <div class="flex gap-2">
            <input id="remember-me" type="checkbox" name="remember-me" />
            <label for="remember-me">Remember me?</label>
          </div>
          <a href="/forgot-password">Forgot Password?</a>
        </div>
        <input type="submit" value="Masuk" className="button" />
      </form>
    </main>
  );
}
