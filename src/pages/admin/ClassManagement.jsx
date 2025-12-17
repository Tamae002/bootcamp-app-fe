import { useAuth } from "@/contexts/auth";

export default function ClassManagement() {
  const { user } = useAuth();
  return (
    <>
      <title>Manajemen Kelas | GeeksFarm</title>
      <div className="px-3 pt-10">
        <p className="text-2xl text-balance">{`Welcome, ${user.name}`}</p>
        <h1 className="text-6xl my-2">Manajemen Kelas</h1>
        <section>

        </section>
      </div>
    </>
  );
}
