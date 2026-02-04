import { useState } from "react";
import Visibility from "@/assets/icons/Visibility";
import VisibilityOff from "@/assets/icons/VisibilityOff";

export default function PasswordInput({
  value = "",
  onChange = () => { },
  placeholder = "Password",
  className = "",
  name = "password",
  autoComplete = "current-password",
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`input ${className}`}>
      <input
        id={name}
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="flex-1"
        value={value}
        onChange={onChange}
      />
      {showPassword ? (
        <VisibilityOff
          className="w-8"
          onClick={() => setShowPassword(false)}
        />
      ) : (
        <Visibility
          className="w-8"
          onClick={() => setShowPassword(true)}
        />
      )}
    </div>
  );
}
