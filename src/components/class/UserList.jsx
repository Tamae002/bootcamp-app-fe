import ProfilePhoto from "@/components/misc/ProfilePhoto";

export default function UserList({ users, title }) {
  return (
    <article>
      <h2 className="border-surface mb-4 border-b-3 pb-2 text-4xl">{title}</h2>
      <div className="flex flex-col gap-4">
        {users?.map((user, id) => (
          <div key={id} className="flex items-center gap-2">
            <ProfilePhoto src={user.gambar} alt={user.name} size="lg" />
            <p>{user.name}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
