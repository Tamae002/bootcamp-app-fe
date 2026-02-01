import userApi from "@/apis/user.api";
import ArrayReducer from "@/reducers/ArrayReducer";
import {
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import SearchBar from "../input/SearchBar";
import Throbber from "../misc/Throbber";

export default function UserSelect({
  ref = useRef(null),
  role,
  defaultUsers = [],
}) {
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

  const userSet = useMemo(
    () => new Set(defaultUsers.map((e) => e.user_id)),
    [defaultUsers],
  );

  const onSearchEmpty = () => {
    setData([...defaultUsers, ...cachedUsers]);
  };

  const handleSearch = async (search) => {
    setLoading(true);
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
  };

  const handleUserChange = (user) => {
    const id = user.user_id;

    if (userSet.has(id)) {
      if (removedUsers.includes(id)) {
        dispatchRemovedUsers({ type: "remove_by_value", data: id });
      } else {
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
      <SearchBar
        onInput={() => setCurrentPage(1)}
        onEmpty={onSearchEmpty}
        action={handleSearch}
        containerClassName="mb-4"
        placeholder="Ketik '%' untuk menampilkan semua user"
      />

      {loading ? (
        <div className="flex h-24 w-full items-center justify-center">
          <Throbber size="32px" />
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
                        className={`button font-semibold button-primary rounded-md px-2 py-1 ${isAdded && "button-outline-primary"}`}
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
