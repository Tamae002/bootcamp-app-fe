import { useState } from "react";

import searchIcon from "../../assets/icons/search-line.svg";
import groupIcon from "../../assets/icons/group-line.svg";
import errorIcon from "../../assets/icons/error-warning-line.svg";

export default function UserManagement() {
  const [modal, setModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Raya",
      email: "TEST123@gmail.com",
      role: "Admin",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: 2,
      name: "Raya",
      email: "TEST123@gmail.com",
      role: "Mentor",
      avatar: "https://i.pravatar.cc/150?img=13",
    },
  ]);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const createUser = (data) => {
    setUsers((prev) => [
      ...prev,
      { ...data, id: Date.now(), avatar: data.avatar || "https://i.pravatar.cc/150" },
    ]);
  };

  const updateUser = (data) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? { ...u, ...data } : u))
    );
  };

  const deleteUser = () => {
    setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
    setModal(null);
    setSelectedUser(null);
  };

  return (
    <section className="relative flex gap-6">
      <div className={`flex-1 ${modal ? "blur-sm" : ""}`}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-3xl font-normal mb-1">Manajemen Peserta</h1>
            <p className="text-sm text-gray-500">
              Pengaturan dan pemeliharaan data pengguna
            </p>
          </div>
          <img src={groupIcon} className="w-10 h-10 mt-1" />
        </div>

        <div className="relative w-full mb-4">
          <img
            src={searchIcon}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 opacity-60"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search People"
            className="pl-9 py-2 text-sm rounded-xl w-full bg-gray-200 focus:outline-none"
          />
        </div>

        <div className="bg-white rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-4 text-left">Nama</th>
                <th className="p-4 text-center">Role</th>
                <th className="p-4 text-center">Email</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td
                    className="p-4 flex items-center gap-3 cursor-pointer"
                    onClick={() => {
                      setSelectedUser(u);
                      setModal(null);
                    }}
                  >
                    <img src={u.avatar} className="w-8 h-8 rounded-full" />
                    <span className="font-medium text-primary">{u.name}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-center">{u.email}</td>
                  <td className="p-4 text-right">
                    <button
                      className="px-3 py-1 rounded-lg bg-gray-100"
                      onClick={() => {
                        setSelectedUser(u);
                        setModal("action");
                      }}
                    >
                      •••
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* READ PROFILE */}
      {selectedUser && !modal && (
        <aside className="fixed right-6 top-14 w-80 bg-white rounded-3xl p-5 z-30 shadow-xl border">
          <button
            onClick={() => setSelectedUser(null)}
            className="absolute right-4 top-4"
          >
            ✕
          </button>

          <p className="text-sm font-medium mb-3">Foto Profil</p>

          <div className="w-32 h-32 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <img
              src={selectedUser.avatar}
              className="w-24 h-24 rounded-full"
            />
          </div>

          <div className="space-y-3">
            {[
              { label: "Nama", key: "name" },
              { label: "Email", key: "email" },
              { label: "Role", key: "role" },
            ].map((item, i) => (
              <div key={i}>
                <label className="text-xs">{item.label}</label>
                <div className="mt-1 px-4 py-2 rounded-xl bg-gray-200 text-center font-medium">
                  {selectedUser[item.key]}
                </div>
              </div>
            ))}

            {/* BADGE */}
            <div>
              <label className="text-xs">Badge</label>
              <div className="mt-1 px-4 py-2 rounded-xl bg-gray-200 text-center font-medium text-gray-600">
                {selectedUser.role}
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* ADD */}
      <button
        onClick={() => {
          setSelectedUser(null);
          setModal("create");
        }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white text-3xl z-40"
      >
        +
      </button>

      {/* MODAL */}
      {modal && (
        <Modal
          onClose={() => {
            setModal(null);
            setSelectedUser(null);
          }}
        >
          {modal === "action" && (
            <div className="space-y-3 text-center">
              <button onClick={() => setModal("edit")} className="button w-full">
                Perbarui
              </button>
              <button
                onClick={() => setModal("delete")}
                className="w-full bg-red-600 text-white py-2 rounded-xl"
              >
                Hapus
              </button>
            </div>
          )}

          {(modal === "edit" || modal === "create") && (
            <UserForm
              initial={modal === "edit" ? selectedUser : null}
              onSubmit={(data) => {
                modal === "edit" ? updateUser(data) : createUser(data);
                setModal(null);
                setSelectedUser(null);
              }}
              onClose={() => {
                setModal(null);
                setSelectedUser(null);
              }}
              isEdit={modal === "edit"}
            />
          )}

          {modal === "delete" && (
            <DeleteConfirm
              onDelete={deleteUser}
              onClose={() => {
                setModal(null);
                setSelectedUser(null);
              }}
            />
          )}
        </Modal>
      )}
    </section>
  );
}

/* MODAL */
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-80 relative">
        <button onClick={onClose} className="absolute right-4 top-4">✕</button>
        {children}
      </div>
    </div>
  );
}

/* FORM */
function UserForm({ initial, onSubmit, onClose, isEdit }) {
  const [form, setForm] = useState(
    initial || { name: "", email: "", role: "User", avatar: "https://i.pravatar.cc/150" }
  );

  return (
    <div className="space-y-3">
      <h2 className="font-bold text-center">
        {isEdit ? "Edit Peserta" : "Tambah Peserta"}
      </h2>

      <div className="w-24 h-24 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center">
        <img src={form.avatar} className="w-16 h-16 rounded-full" />
      </div>

      {[
        { label: "Nama", key: "name" },
        { label: "Email", key: "email" },
      ].map((item, i) => (
        <div key={i}>
          <label className="text-xs">{item.label}</label>
          <input
            className="mt-1 px-4 py-2 rounded-xl bg-gray-200 w-full text-center focus:outline-none"
            value={form[item.key]}
            onChange={(e) => setForm({ ...form, [item.key]: e.target.value })}
          />
        </div>
      ))}

      <div>
        <label className="text-xs">Role</label>
        <select
          className="mt-1 px-4 py-2 rounded-xl bg-gray-200 w-full text-center"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option>Admin</option>
          <option>Mentor</option>
          <option>User</option>
        </select>
      </div>

      <button onClick={() => onSubmit(form)} className="w-full bg-primary text-white py-2 rounded-xl">
        {isEdit ? "Perbarui" : "Buat"}
      </button>

      <button onClick={onClose} className="w-full bg-red-600 text-white py-2 rounded-xl">
        Batalkan
      </button>
    </div>
  );
}

/* DELETE */
function DeleteConfirm({ onDelete, onClose }) {
  return (
    <div className="text-center space-y-4">
      <img src={errorIcon} className="w-16 h-16 mx-auto" />
      <p>Apakah anda yakin ingin menghapus data ini?</p>
      <div className="flex gap-3 justify-center">
        <button onClick={onDelete} className="bg-red-600 text-white px-6 py-2 rounded-xl">
          Hapus
        </button>
        <button onClick={onClose} className="bg-primary text-white px-6 py-2 rounded-xl">
          Batalkan
        </button>
      </div>
    </div>
  );
}
