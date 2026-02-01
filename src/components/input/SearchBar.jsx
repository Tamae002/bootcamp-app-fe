import Search from "@/assets/icons/Search";
import { useEffect, useState } from "react";

export default function SearchBar({
  delay = 500,
  onEmpty = (search) => {},
  onInput = (event) => {},
  action = (search) => {},
  containerClassName = "",
  inputClassName = "",
  placeholder = "",
}) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (search == "") {
      onEmpty(search);
    } else {
      let debounceTimer = setTimeout(() => action(search), search ? delay : 0);
      return () => clearTimeout(debounceTimer);
    }
  }, [search]);

  return (
    <div className={`input gap-4 ${containerClassName}`}>
      <Search />
      <input
        type="text"
        className={`flex-1 ${inputClassName}`}
        placeholder={placeholder}
        onChange={(e) => {
          setSearch(e.target.value);
          onInput(e);
        }}
      />
    </div>
  );
}
