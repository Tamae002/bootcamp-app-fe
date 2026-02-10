import Visibility from "@/assets/icons/Visibility";
import VisibilityOff from "@/assets/icons/VisibilityOff";
import { useState } from "react";
import Input from "./Input";
/** @import { InputProps } from "./Input" */

/**
 * Password input component with visibility toggle functionality.
 *
 * @typedef {object} PasswordInputProps
 * @property {string} [props.value=""] - Current password value
 * @property {(event: React.ChangeEvent<HTMLInputElement>) => void} [props.onChange=() => {}] - Callback when password value changes
 * @property {string} [props.autoComplete="current-password"] - Autocomplete attribute for the password field
 *
 * @param {React.InputHTMLAttributes<HTMLInputElement> & PasswordInputProps & InputProps} props - Component props
 * @returns {React.JSX.Element}
 */
export default function PasswordInput({
  value = undefined,
  onChange = () => {},
  autoComplete = "current-password",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      type={showPassword ? "text" : "password"}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      {...props}
    >
      {showPassword ? (
        <VisibilityOff
          className="icon cursor-pointer"
          onClick={() => setShowPassword(false)}
        />
      ) : (
        <Visibility
          className="icon cursor-pointer"
          onClick={() => setShowPassword(true)}
        />
      )}
    </Input>
  );
}
