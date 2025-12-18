import UserList from "@/components/class/UserList";
import { useClass } from "@/contexts/class";

export default function ClassDetail() {
  const class_ = useClass();

  return (
    <>
      <title>{`${class_.nama_kelas} | Geeksfarm`}</title>
      <figure>
        <img
          src="https://placehold.co/490x210@3x/802EC0/white.png?text=Geeksfarm&font=poppins"
          className="aspect-7/3 w-full rounded-md"
        />
      </figure>
      <header>
        <h1 className="mb-4 text-5xl">{class_.nama_kelas}</h1>
        <p>{class_.deskripsi}</p>
      </header>
      <UserList title="Pengajar" users={class_.mentor} />
      <UserList title="Siswa" users={class_.anggota} />
    </>
  );
}
