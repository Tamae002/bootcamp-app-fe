import React from "react";
import ReactSelect from "react-select";

/**
 * Reusable select component with floating label, matching Input component styling.
 *
 * @typedef {object} SelectInputProps
 * @property {string} [props.label] - Label text displayed above the input
 * @property {Array<{value: string, label: string}>} props.options - Options for the select
 * @property {string} [props.className=""] - Additional CSS classes for styling
 * @property {string} [props.containerClassName=""] - Additional classes for the container element
 * @property {string} [props.error=null] - Error message to display below the input
 * @property {string} props.value - Current selected value
 * @property {function} props.onChange - Callback when selection changes
 * @property {boolean} [props.disabled=false] - Whether the select is disabled
 * @property {string} [props.placeholder] - Placeholder text
 *
 * @param {SelectInputProps} props - Component props
 * @returns {React.JSX.Element}
 */
export default function SelectInput({
  label = null,
  options = [],
  className = "",
  containerClassName = "",
  error = null,
  value,
  onChange,
  disabled = false,
  placeholder,
  ...props
}) {
  const selectedOption = options.find((opt) => opt.value === value) || null;

  const customClassNames = {
    control: (state) =>
      `bg-transparent flex items-center w-full rounded-2xl px-4 transition-all duration-150 ${
        error ? "border-red outline-red" : ""
      } ${state.isDisabled ? "opacity-50 cursor-not-allowed" : ""}`,
    valueContainer: () => "flex-1 py-4",
    input: () => "text-foreground m-0 p-0",
    placeholder: () => "text-grey",
    singleValue: () => "text-foreground",
    menu: () =>
      "bg-surface rounded-xl border border-overlay-md overflow-hidden mt-1 z-50",
    menuList: () => "p-1",
    option: (state) =>
      `cursor-pointer rounded-lg px-3 py-2.5 transition-colors ${
        state.isSelected
          ? "bg-primary text-white"
          : state.isFocused
            ? "bg-overlay-sm text-foreground"
            : "text-foreground"
      }`,
    dropdownIndicator: (state) =>
      `text-grey transition-transform duration-200 ${
        state.selectProps.menuIsOpen ? "rotate-180" : ""
      }`,
    indicatorSeparator: () => "hidden",
    noOptionsMessage: () => "text-grey py-2 px-3 text-sm",
    loadingMessage: () => "text-grey py-2 px-3 text-sm",
  };

  return (
    <div>
      <fieldset
        className={`input px-0 ${error ? "error" : ""} ${containerClassName}`}
      >
        <ReactSelect
          options={options}
          value={selectedOption}
          onChange={(selected) => onChange(selected?.value || "")}
          isDisabled={disabled}
          placeholder={placeholder || label}
          unstyled
          classNames={customClassNames}
          className={`peer w-full ${className}`}
          classNamePrefix="react-select"
          {...props}
        />
        {label && <label>{label}</label>}
      </fieldset>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
