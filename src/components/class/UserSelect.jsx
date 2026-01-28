import userApi from "@/apis/user.api";
import Search from "@/assets/icons/Search";
import { useState } from "react";
import Throbber from "../misc/Throbber";
import { useEffect } from "react";
import { useMemo } from "react";
import { useImperativeHandle } from "react";
import { useRef } from "react";
import { useReducer } from "react";
import ArrayReducer from "@/reducers/ArrayReducer";

export default function UserSelect({
  ref = useRef(null),
  role,
  defaultUsers = [],
}) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [addedUsers, dispatchAddedUsers] = useReducer(ArrayReducer, []);
  const [removedUsers, dispatchRemovedUsers] = useReducer(ArrayReducer, []);
  const [cachedUsers, dispatchCachedUsers] = useReducer(ArrayReducer, []);

  useImperativeHandle(ref, () => {
    return {
      getAddedUsers() {
        return addedUsers;
      },
      getRemovedUsers() {
        return removedUsers;
      },
    };
  });

  useEffect(() => {
    setLoading(true);

    if (search == "") {
      setData([...defaultUsers, ...cachedUsers]);
      setLoading(false);
    } else {
      let debounceTimer = setTimeout(
        async () => {
          try {
            const response = await userApi.getAll({
              page: currentPage,
              search,
              role,
            });
            setData(response.data.users);
          } catch (err) {
            setError("Failed to fetch data");
          } finally {
            setLoading(false);
          }
        },
        search ? 500 : 0,
      );
      return () => clearTimeout(debounceTimer);
    }

  }, [search, currentPage, limit]);

  const userSet = useMemo(
    () => new Set(defaultUsers.map((e) => e.user_id)),
    [defaultUsers],
  );

  const handleUserChange = (user) => {
    const id = user.user_id;

    if (userSet.has(id)) {

      if (removedUsers.includes(id)) {
        dispatchRemovedUsers({ type: "remove_by_value", data: id });
      }

      else {
        dispatchRemovedUsers({ type: "add", data: id });
      }

    } else if (addedUsers.includes(id)) {
      dispatchAddedUsers({ type: "remove_by_value", data: id });
      dispatchCachedUsers({ type: "remove_by_value", data: user });
    } else {
      dispatchAddedUsers({ type: "add", data: id });
      dispatchCachedUsers({ type: "add", data: user });
    }
  };

  return (
    <>
      <div className="input mb-4 flex h-13 gap-4">
        <Search />
        <input
          type="text"
          className="w-full outline-none"
          placeholder="Ketik '%' untuk menampilkan semua user"
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {loading ? (
        <div className="flex h-24 w-full items-center justify-center">
          <Throbber width="32px" height="32px" />
        </div>
      ) : (
        <div className="user-select-container input">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th className="text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => {
                var isAdded =
                  (userSet.has(user.user_id) &&
                    !removedUsers.includes(user.user_id)) ||
                  addedUsers.includes(user.user_id);
                return (
                  <tr>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td className="flex justify-end">
                      <button
                        className={`button text-primary-foreground disabled:text-primary rounded-md px-2 py-1 font-normal ${isAdded && "bg-red-400 hover:bg-red-600"}`}
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
