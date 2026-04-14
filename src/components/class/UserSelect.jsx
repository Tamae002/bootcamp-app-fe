import userApi from "@/apis/user.api";
import ArrayReducer from "@/reducers/ArrayReducer";
import { useMemo, useReducer, useState } from "react";
import SearchBar from "../input/SearchBar";
import Throbber from "../misc/Throbber";
import { useCallback } from "react";

export default function UserSelect({
  role,
  error = null,
  defaultUsers = [],
  addedUsers = [],
  removedUsers = [],
  onAddedUsersChange,
  onRemovedUsersChange,
}) {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableError, setTableError] = useState("");
  const [data, setData] = useState([]);
  const [cachedUsers, dispatchCachedUsers] = useReducer(ArrayReducer, []);
  const [search, setSearch] = useState("");

  const userSet = useMemo(
    () => new Set(defaultUsers.map((e) => e.user_id)),
    [defaultUsers],
  );

  const onSearchEmpty = useCallback(() => {
    setSearch("");
    setData([...defaultUsers, ...cachedUsers]);
  }, [defaultUsers, cachedUsers]);

  const handleSearch = useCallback(
    async (query) => {
      setLoading(true);
      setSearch(query);
      try {
        const response = await userApi.getAll({
          page: currentPage,
          search: query,
          role,
        });
        setData(response.data.users);
      } catch {
        setTableError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, role],
  );

  const handleUserChange = (user) => {
    const id = user.user_id;

    if (userSet.has(id)) {
      if (removedUsers.includes(id)) {
        onRemovedUsersChange(removedUsers.filter((userId) => userId !== id));
      } else {
        onRemovedUsersChange([...removedUsers, id]);
      }
    } else if (addedUsers.includes(id)) {
      onAddedUsersChange(addedUsers.filter((userId) => userId !== id));
      dispatchCachedUsers({ type: "remove_by_value", data: user });
    } else {
      onAddedUsersChange([...addedUsers, id]);
      dispatchCachedUsers({ type: "add", data: user });
    }
  };

  return (
    <>
      <SearchBar
        onInput={useCallback(() => setCurrentPage(1), [])}
        onEmpty={onSearchEmpty}
        action={handleSearch}
        containerClassName="mb-4"
        placeholder="Ketik '%' untuk menampilkan semua user"
        error={error}
      />

      {loading ? (
        <div className="flex h-24 w-full items-center justify-center">
          <Throbber size="32px" />
        </div>
      ) : data.length == 0 ? (
        <div className="text-grey h-24 text-center">
          <p>{tableError || search ? "Pengguna tidak ditemukan" : "Tidak ada pengguna"}</p>
        </div>
      ) : (
        <div className="user-select-container bg-surface rounded-xl p-4">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th className="text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user, id) => {
                var isAdded =
                  (userSet.has(user.user_id) &&
                    !removedUsers.includes(user.user_id)) ||
                  addedUsers.includes(user.user_id);
                return (
                  <tr key={id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td className="flex justify-end">
                      <button
                        className={`button button-primary rounded-md px-2 py-1
                          font-semibold ${isAdded && "button-outline-primary"}`}
                        type="button"
                        onClick={() => handleUserChange(user)}
                      >
                        {isAdded ? "Ditambahkan" : "Tambah"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
