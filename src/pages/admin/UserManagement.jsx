import { useState, useEffect } from "react";

import searchIcon from "../../assets/icons/search-line.svg";
import groupIcon from "../../assets/icons/group-line.svg";
import errorIcon from "../../assets/icons/error-warning-line.svg";
import defaultUser from "../../assets/images/user.png";
import { useTheme } from "@/contexts/theme";
import userApi from "@/apis/user.api";
import { AxiosError } from "axios";

export default function UserManagement() {
  const { theme } = useTheme();
  const [modal, setModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await userApi.getAll({ page, limit: 10 });

      const data =
        response.data?.data ||
        response.data?.users ||
        response.data || [];

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      if (import.meta.env.VITE_ENV === "development") console.error(err);

      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message || "Gagal mengambil data pengguna"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const createUser = async (data) => {
    try {
      await userApi.createUser({
        name: data.name,
        email: data.email,
        password: "password123",
        role: data.role,
      });

      fetchUsers();
    } catch (err) {
      alert("Gagal menambahkan user");
    }
  };

  const updateUser = async (data) => {
    try {
      await userApi.updateUser(selectedUser.id || selectedUser._id, {
        name: data.name,
        email: data.email,
      });

      fetchUsers();
    } catch (err) {
      alert("Gagal update user");
    }
  };

  const deleteUser = async () => {
    try {
      await userApi.deleteUser(selectedUser.id || selectedUser._id);
      fetchUsers();
      setModal(null);
      setSelectedUser(null);
    } catch (err) {
      alert("Gagal menghapus user");
    }
  };

  return (
    <section
      className={`relative flex gap-6 px-6 ${theme === "dark" ? "dark" : ""}`}
    >
      <div className={`flex-1 ${modal ? "blur-sm" : ""}`}>
        <div className="flex justify-between items-center mb-3 mt-7">
          <div>
            <h1 className="text-3xl font-normal mb-1 dark:text-white">
              Manajemen Peserta
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
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
            className="pl-9 py-2 text-sm rounded-xl w-full bg-gray-200 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
        </div>

        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-100 p-3 rounded-xl dark:bg-red-900/40 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl overflow-hidden dark:bg-gray-900">
          <table className="w-full text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-4 text-left">Nama</th>
                <th className="p-4 text-center">Role</th>
                <th className="p-4 text-center">Email</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="dark:text-gray-200">
              {loading && (
                <tr>
                  <td colSpan={4} className="p-4 text-center">
                    Memuat data...
                  </td>
                </tr>
              )}

              {!loading && filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    Tidak ada data
                  </td>
                </tr>
              )}

              {!loading &&
                filteredUsers.map((u) => (
                  <tr
                    key={u.id || u._id}
                    className="border-t hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                  >
                    <td
                      className="p-4 flex items-center gap-3 cursor-pointer"
                      onClick={() => {
                        setSelectedUser(u);
                        setModal(null);
                      }}
                    >
                      <img
                        src={u.avatar || defaultUser}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="font-medium text-primary">
                        {u.name}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-center">{u.email}</td>
                    <td className="p-4 text-right">
                      <button
                        className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700"
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
        <aside className="fixed right-6 top-14 w-80 bg-white rounded-3xl p-5 z-30 shadow-xl border dark:bg-gray-900 dark:border-gray-800">
          <button
            onClick={() => setSelectedUser(null)}
            className="absolute right-4 top-4 dark:text-white"
          >
            ✕
          </button>

          <p className="text-sm font-medium mb-3 dark:text-white">
            Foto Profil
          </p>

          <div className="w-32 h-32 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-4 dark:bg-gray-800">
            <img
              src={selectedUser.avatar || defaultUser}
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
                <label className="text-xs dark:text-gray-300">
                  {item.label}
                </label>
                <div className="mt-1 px-4 py-2 rounded-xl bg-gray-200 text-center font-medium dark:bg-gray-800 dark:text-white">
                  {selectedUser[item.key]}
                </div>
              </div>
            ))}

            <div>
              <label className="text-xs dark:text-gray-300">Badge</label>
              <div className="mt-1 px-4 py-2 rounded-xl bg-gray-200 text-center font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
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
      <div className="bg-white rounded-2xl p-6 w-80 relative dark:bg-gray-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 dark:text-white"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

/* FORM */
function UserForm({ initial, onSubmit, onClose, isEdit }) {
  const [form, setForm] = useState(
    initial || {
      name: "",
      email: "",
      role: "User",
      avatar: defaultUser,
    }
  );

  return (
    <div className="space-y-3 dark:text-white">
      <h2 className="font-bold text-center">
        {isEdit ? "Edit Peserta" : "Tambah Peserta"}
      </h2>

      <div className="w-24 h-24 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center dark:bg-gray-800">
        <img src={form.avatar} className="w-16 h-16 rounded-full" />
      </div>

      {[{ label: "Nama", key: "name" }, { label: "Email", key: "email" }].map(
        (item, i) => (
          <div key={i}>
            <label className="text-xs dark:text-gray-300">
              {item.label}
            </label>
            <input
              className="mt-1 px-4 py-2 rounded-xl bg-gray-200 w-full text-center focus:outline-none dark:bg-gray-800 dark:text-white"
              value={form[item.key]}
              onChange={(e) =>
                setForm({ ...form, [item.key]: e.target.value })
              }
            />
          </div>
        )
      )}

      <div>
        <label className="text-xs dark:text-gray-300">Role</label>
        <select
          className="mt-1 px-4 py-2 rounded-xl bg-gray-200 w-full text-center dark:bg-gray-800 dark:text-white"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option>Admin</option>
          <option>Mentor</option>
          <option>User</option>
        </select>
      </div>

      <button
        onClick={() => onSubmit(form)}
        className="w-full bg-primary text-white py-2 rounded-xl"
      >
        {isEdit ? "Perbarui" : "Buat"}
      </button>

      <button
        onClick={onClose}
        className="w-full bg-red-600 text-white py-2 rounded-xl"
      >
        Batalkan
      </button>
    </div>
  );
}

/* DELETE */
function DeleteConfirm({ onDelete, onClose }) {
  return (
    <div className="text-center space-y-4 dark:text-white">
      <img src={errorIcon} className="w-16 h-16 mx-auto" />
      <p>Apakah anda yakin ingin menghapus data ini?</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onDelete}
          className="bg-red-600 text-white px-6 py-2 rounded-xl"
        >
          Hapus
        </button>
        <button
          onClick={onClose}
          className="bg-primary text-white px-6 py-2 rounded-xl"
        >
          Batalkan
        </button>
      </div>
    </div>
  );
}
