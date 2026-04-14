import React, { memo, useCallback } from "react";
import DatePicker from "react-datepicker";
/** @import { DatePickerProps } from "react-datepicker"; */

/**
 * Reusable date input component with floating label and error display.
 * Supports both single date and date range selection.
 *
 * @typedef {object} DateInputProps
 * @property {string} [props.label] - Label text displayed above the input
 * @property {string} [props.className=""] - Additional CSS classes for styling
 * @property {string} [props.containerClassName=""] - Additional classes for the container (div) element
 * @property {string} [props.fieldsetClassName=""] - Additional classes for the fieldset wrapper element
 * @property {string} [props.error=null] - Error message to display below the input
 * @property {Date} [props.selected] - Selected date value (for single date mode)
 * @property {Date} [props.startDate] - Start date value (for range mode)
 * @property {Date} [props.endDate] - End date value (for range mode)
 * @property {boolean} [props.selectsRange=false] - Whether to select a date range
 * @property {function} [props.onChange] - Callback when date changes
 * @property {string} [props.name] - Name attribute for the input
 * @property {string} [props.id] - ID attribute for the input
 * @property {React.ReactNode} [children] - Element to be rendered inside the fieldset

 * @param {DateInputProps & DatePickerProps} props - Component props
 * @returns {React.JSX.Element}
 */
const DateInput = function DateInput(
  {
    label = null,
    className = "",
    containerClassName = "",
    fieldsetClassName = "",
    error = null,
    selected,
    startDate,
    endDate,
    onChange,
    name,
    id,
    children = null,
    ...props
  },
) {
  // Memoize the onChange handler to prevent unnecessary re-renders
  const handleChange = useCallback(
    (date) => {
      if (onChange) {
        onChange(date);
      }
    },
    [onChange]
  );

  const dateFormat =
    props.showTimeInput || props.showTimeSelect
      ? "dd/MM/yyyy HH:mm"
      : "dd/MM/yyyy";

  const popperProps = {
    /** @type {any} */
    strategy: "fixed",
    modifiers: [
      {
        name: "preventOverflow",
        options: {
          boundary: "viewport",
        },
      },
    ],
  };

  return (
    <div className={containerClassName}>
      <fieldset
        className={`input ${error ? "error" : ""} ${fieldsetClassName}`}
      >
        <DatePicker
          id={id}
          name={name}
          selected={selected}
          startDate={startDate}
          endDate={endDate}
          onChange={handleChange}
          dateFormat={dateFormat}
          placeholderText={label}
          className={`peer flex-1 bg-transparent outline-none ${className}`}
          wrapperClassName="flex-1"
          // Performance optimizations
          fixedHeight
          popperProps={popperProps}
          disabledKeyboardNavigation={false}
          {...props}
        />
        {label && <label htmlFor={id}>{label}</label>}
        {children}
      </fieldset>
      {error && <p className="text-red px-4 pt-1 text-sm">{error}</p>}
    </div>
  );
};

export default memo(DateInput);
