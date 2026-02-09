import Search from "@/assets/icons/Search";
import { useEffect, useState } from "react";
import Input from "./Input";
/** @import { InputProps } from "./Input"; */

/**
 * Search input component with debounced search functionality.
 *
 * @typedef {object} SearchBarProps
 * @property {number} [props.delay=500] - Debounce delay in milliseconds before triggering the action
 * @property {Function|null} [props.onEmpty=null] - Callback function when search input becomes empty
 * @property {Function} [props.onInput=(event) => {}] - Callback function called on every input change
 * @property {Function} [props.action=(search) => {}] - Callback function called with the search value after debounce delay
 *
 * @param {React.InputHTMLAttributes<HTMLInputElement> & SearchBarProps & InputProps} props - Component props
 * @returns {React.JSX.Element}
 */
export default function SearchBar({
  delay = 500,
  onEmpty = null,
  onInput,
  action,
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
      fieldsetClassName={`flex-row-reverse ${props.fieldsetClassName}`}
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
