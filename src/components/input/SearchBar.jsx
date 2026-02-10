import Search from "@/assets/icons/Search";
import { useEffect, useState } from "react";
import Input from "./Input";

export default function SearchBar({
  delay = 500,
  onEmpty = null,
  onInput = (event) => {},
  action = (search) => {},
  ...props
}) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (search == "" && onEmpty) {
      onEmpty();
    } else {
      let debounceTimer = setTimeout(() => action(search), search ? delay : 0);
      return () => clearTimeout(debounceTimer);
    }
  }, [search, delay, onEmpty, action]);

  return (
    <Input
      {...props}
      containerClassName={`flex-row-reverse ${props.containerClassName}`}
      type="text"
      placeholder={props.placeholder}
      onChange={(e) => {
        setSearch(e.target.value);
        onInput(e);
      }}
    >
      <Search className="h-5" />
    </Input>
  );
}
