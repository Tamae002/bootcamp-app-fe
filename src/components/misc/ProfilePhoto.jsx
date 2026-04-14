import Person from "@/assets/icons/Person";
import { API_BASE_URL } from "@/constants";

export default function ProfilePhoto({
  src,
  alt = "User",
  size = "md",
  className = "",
  fallbackClassName = "",
  useApiBaseUrl = true,
}) {
  const sizeClasses = {
    sm: "size-8",
    md: "size-10",
    lg: "size-12",
    xl: "size-24",
  };

  const imageUrl = src && useApiBaseUrl ? API_BASE_URL + src : src;

  if (src) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`bg-primary/20 flex items-center justify-center rounded-full
        ${sizeClasses[size]} ${className}`}
    >
      <Person
        className={`text-primary
          ${size === "xl" ? "size-16" : size === "lg" ? "size-6" : "size-5"}
          ${fallbackClassName}`}
      />
    </div>
  );
}
