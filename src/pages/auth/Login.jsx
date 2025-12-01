export default function Login() {
  return (
    <main className="flex flex-row min-h-screen min-w-full">
      <aside className="flex-2 bg-linear-30 from-blue-800 to-"></aside>
      <form className="flex-1 flex flex-col gap-8 items-stretch justify-center px-8">
        <h1 className="text-bold text-5xl">Masuk</h1>
        <div>
          <label>Email</label>
          <input
            id="email"
            type="text"
            name="email"
            placeholder="name@example.com"
            className="text-input"
          />
        </div>
        <div>
          <label>Kata Sandi</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Kata sandi"
            className="text-input"
          />
        </div>
        <input type="submit" value="Masuk" className="button" />
      </form>
    </main>
  );
}
