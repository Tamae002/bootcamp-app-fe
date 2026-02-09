import React from "react";

/**
 * Reusable input component with floating label and error display.
 *
 * @typedef {object} InputProps
 * @property {string} [props.label] - Label text displayed above the input (also used as placeholder fallback)
 * @property {string} [props.className=""] - Additional CSS classes for styling
 * @property {string} [props.containerClassName=""] - Additional classes for the container (div) element
 * @property {string} [props.fieldsetClassName=""] - Additional classes for the fieldset wrapper element
 * @property {string} [props.error=null] - Error message to display below the input
 * @property {React.Ref<HTMLInputElement>} [props.ref] - Ref object for the input element
 * @property {React.ReactNode} [children] - Element to be rendered inside the fieldset next to the input fields

 * @param {React.InputHTMLAttributes<HTMLInputElement> & InputProps} props - Component props
 * @returns {React.JSX.Element}
 */
export default function Input({
  label = null,
  className = "",
  containerClassName = "",
  fieldsetClassName = "",
  error = null,
  ref = null,
  children = null,
  ...props
}) {
  return (
    <div className={containerClassName}>
      <fieldset className={`input ${error ? "error" : ""} ${fieldsetClassName}`}>
        <input
          type={props.type}
          placeholder={props.placeholder || label}
          className={`peer ${className}`}
          ref={ref}
          {...props}
        />
        {label && <label>{label}</label>}
        {children}
      </fieldset>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
