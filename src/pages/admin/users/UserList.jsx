import userApi from "@/apis/user.api";
import Add from "@/assets/icons/Add";
import People from "@/assets/icons/People";
import Warning from "@/assets/icons/Warning";
import defaultUser from "@/assets/images/user.png";
import SearchBar from "@/components/input/SearchBar";
import Throbber from "@/components/misc/Throbber";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@radix-ui/react-dialog";
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import UserForm from "./UserForm";
import Person from "@/assets/icons/Person";

export default function UserManagement() {
  const [modal, setModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async (search = "") => {
    try {
      setLoading(true);
      setError(null);

      const response = await userApi.getAll({
        page: currentPage,
        limit: 10,
        search,
      });

      const data =
        response.data?.data || response.data?.users || response.data || [];

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      if (import.meta.env.VITE_ENV === "development") console.error(err);

      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message || "Gagal mengambil data pengguna",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const createUser = async (data) => {
    try {
      await userApi.createUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role || "admin",
      });

      fetchUsers();
    } catch (err) {
      alert("Gagal menambahkan user");
    }
  };

  const updateUser = async (data) => {
    try {
      await userApi.updateUser(selectedUser.user_id, {
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
      await userApi.deleteUser(selectedUser.user_id);
      fetchUsers();
      setModal(null);
      setSelectedUser(null);
    } catch (err) {
      console.log(err)
      alert("Gagal menghapus user");
    }
  };

  return (
    <section className="content-wrapper-wide">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h1 className="mb-1 text-3xl font-normal dark:text-white">
              Manajemen Peserta
            </h1>
          </div>
          {/* <img src={groupIcon} className="mt-1 h-10 w-10" />*/}
          <People className="mt-1 h-10 w-10" />
        </div>

        <SearchBar
          onInput={() => setCurrentPage(1)}
          onEmpty={fetchUsers}
          action={fetchUsers}
          containerClassName="mb-4"
          placeholder="Cari pengguna"
        />

        {error && (
          <div className="mb-3 rounded-xl bg-red-100 p-3 text-sm text-red-600 dark:bg-red-900/40 dark:text-red-300">
            {error}
          </div>
        )}

        <table className="table">
          <thead>
            <tr>
              <th className="text-left">Nama</th>
              <th className="text-center">Role</th>
              <th className="text-center">Email</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="">
                  <Throbber size="32px" className="m-auto" />
                </td>
              </tr>
            )}

            {!loading && users.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-gray-500 dark:text-gray-400"
                >
                  Tidak ada data
                </td>
              </tr>
            )}

            {!loading &&
              users.map((u, id) => (
                <tr key={id}>
                  <td
                    className="flex cursor-pointer items-center gap-3"
                    onClick={() => {
                      setSelectedUser(u);
                      setModal(null);
                    }}
                  >
                    {u.gambar ? (
                      <img src={u.gambar} className="size-8 rounded-full" />
                    ) : (
                      <Person className="size-8" />
                    )}
                    <span className="font-medium">{u.name}</span>
                  </td>
                  <td className="text-center">
                    <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold">
                      {u.role}
                    </span>
                  </td>
                  <td className="text-center">{u.email}</td>
                  <td className="text-right">
                    <Popover>
                      <PopoverTrigger className="bg-surface hover:bg-overlay-sm rounded-lg px-3 py-1">
                        •••
                      </PopoverTrigger>
                      <PopoverPortal>
                        <PopoverContent className="popover-content">
                          <button
                            className="popover-button"
                            onClick={() => {
                              setModal("edit");
                              setSelectedUser(u);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="popover-button text-red"
                            onClick={() => {
                              setModal("delete");
                              setSelectedUser(u);
                            }}
                          >
                            Hapus
                          </button>
                        </PopoverContent>
                      </PopoverPortal>
                    </Popover>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* READ PROFILE */}
      {selectedUser && !modal && (
        <aside className="fixed top-14 right-6 z-30 w-80 rounded-3xl border bg-white p-5 shadow-xl dark:border-gray-800 dark:bg-gray-900">
          <button
            onClick={() => setSelectedUser(null)}
            className="absolute top-4 right-4 dark:text-white"
          >
            ✕
          </button>

          <p className="mb-3 text-sm font-medium dark:text-white">
            Foto Profil
          </p>

          <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
            {selectedUser.gambar ? (
              <img src={selectedUser.gambar} className="size-24 rounded-full" />
            ) : (
              <Person className="size-24" />
            )}
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
                <div className="mt-1 rounded-xl bg-gray-200 px-4 py-2 text-center font-medium dark:bg-gray-800 dark:text-white">
                  {selectedUser[item.key]}
                </div>
              </div>
            ))}

            <div>
              <label className="text-xs dark:text-gray-300">Badge</label>
              <div className="mt-1 rounded-xl bg-gray-200 px-4 py-2 text-center font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
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
        className="button-primary fixed right-6 bottom-6 z-40 h-14 w-14 rounded-full p-3"
      >
        <Add />
      </button>

      <Dialog
        open={modal}
        onOpenChange={(open) => {
          if (!open) {
            setModal(null);
            setSelectedUser(null);
          }
        }}
      >
        <DialogPortal>
          <DialogOverlay className="dialog-overlay">
            {(modal == "create" || modal == "edit") && (
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
          </DialogOverlay>
        </DialogPortal>
      </Dialog>
    </section>
  );
}

/* DELETE */
function DeleteConfirm({ onDelete, onClose }) {
  return (
    <DialogContent className="dialog-content space-y-4 text-center dark:text-white">
      <Warning className="mx-auto h-16 w-16" />
      <DialogTitle>Apakah anda yakin ingin menghapus data ini?</DialogTitle>
      <div className="bg-op flex justify-center gap-3">
        <button onClick={onDelete} className="button button-danger">
          Hapus
        </button>
        <button
          onClick={onClose}
          className="bg-primary rounded-xl px-6 py-2 text-white"
        >
          Batalkan
        </button>
      </div>
    </DialogContent>
  );
}
