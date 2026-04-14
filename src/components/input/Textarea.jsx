import React from "react";

/**
 * Reusable textarea component with floating label and error display.
 *
 * @typedef {object} TextareaProps
 * @property {string} [props.label] - Label text displayed above the textarea (also used as placeholder fallback)
 * @property {string} [props.className=""] - Additional CSS classes for styling
 * @property {string} [props.containerClassName=""] - Additional classes for the container (fieldset) element
 * @property {string} [props.fieldsetClassName=""] - Additional classes for the fieldset wrapper element
 * @property {string} [props.error=null] - Error message to display below the textarea
 * @property {React.Ref<HTMLTextAreaElement>} [props.ref] - Ref object for the textarea element
 * @property {React.ReactNode} [children] - Element to be rendered inside the fieldset next to the input fields

 * @param {React.InputHTMLAttributes<HTMLTextAreaElement> & TextareaProps} props - Component props
 * @returns {React.JSX.Element}
 */
export default function Textarea({
  label = null,
  className = "",
  containerClassName = "",
  fieldsetClassName  = "",
  error = null,
  ref = null,
  children = null,
  ...props
}) {
  return (
    <div className={containerClassName}>
      <fieldset
        className={`input ${error ? "error" : ""} ${fieldsetClassName}`}
      >
        <textarea
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
