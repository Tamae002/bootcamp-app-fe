export default function UserList({ users, title }) {
  return (
    <article>
      <h2 className="border-surface pb-2 mb-4 border-b-3 text-4xl">{title}</h2>
      <div className="flex flex-col gap-4">
        {users.map((user, id) => (
          <div key={id} className="flex items-center gap-2">
            <img src={user.gambar} className="size-12 rounded-full" />
            <p>{user.name}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
