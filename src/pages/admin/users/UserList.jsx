import userApi from "@/apis/user.api";
import Add from "@/assets/icons/Add";
import People from "@/assets/icons/People";
import Person from "@/assets/icons/Person";
import Warning from "@/assets/icons/Warning";
import SearchBar from "@/components/input/SearchBar";
import Throbber from "@/components/misc/Throbber";
import PageTitle from "@/components/typography/PageTitle";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import UserForm from "./UserForm";

export default function UserManagement() {
  const [modal, setModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", { page, search }],
    queryFn: () =>
      userApi.getAll({
        page,
        limit: 10,
        search,
      }),
  });

  const users = data?.data?.data || data?.data?.users || data?.data || [];

  const createUserMutation = useMutation({
    // @ts-ignore
    mutationFn: ({ name, email, password, role }) =>
      userApi.createUser({
        name: name,
        email: email,
        password: password,
        role: role || "admin",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      alert("Gagal menambahkan user");
    },
  });

  const updateUserMutation = useMutation({
    // @ts-ignore
    mutationFn: ({ name, email }) =>
      userApi.updateUser(selectedUser.user_id, {
        name,
        email,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      alert("Gagal update user");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: () => userApi.deleteUser(selectedUser.user_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setModal(null);
      setSelectedUser(null);
    },
    onError: () => {
      alert("Gagal menghapus user");
    },
  });

  const createUser = (data) => {
    createUserMutation.mutate(data);
  };

  const updateUser = (data) => {
    updateUserMutation.mutate(data);
  };

  const deleteUser = () => {
    deleteUserMutation.mutate();
  };

  return (
    <section className="content-wrapper-wide">
      <div>
        <PageTitle className="flex justify-between">
          <span>Manajemen Peserta</span>
          {/* <img src={groupIcon} className="mt-1 h-10 w-10" />*/}
          <People className="mt-1 h-10 w-10" />
        </PageTitle>

        <SearchBar
          onInput={() => setPage(1)}
          action={setSearch}
          containerClassName="mb-4"
          placeholder="Cari pengguna"
        />

        {error instanceof AxiosError && (
          <div className="mb-3 rounded-xl bg-red-100 p-3 text-sm text-red-600 dark:bg-red-900/40 dark:text-red-300">
            {error.response.data.message}
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
            {isLoading && (
              <tr>
                <td colSpan={4} className="">
                  <Throbber size="32px" className="m-auto" />
                </td>
              </tr>
            )}

            {!isLoading && users.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-gray-500 dark:text-gray-400"
                >
                  Tidak ada data
                </td>
              </tr>
            )}

            {!isLoading &&
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
          className="button button-primary"
        >
          Batalkan
        </button>
      </div>
    </DialogContent>
  );
}
