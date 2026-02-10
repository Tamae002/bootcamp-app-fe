export default function Throbber({
  size = "16px",

  color = "var(--foreground)",
  backgroundColor = "var(--surface)",
  lineWidth = "3px",
  className = "",
  ...props
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderWidth: lineWidth,
        borderRightColor: color,
        borderTopColor: color,
        borderLeftColor: backgroundColor,
        borderBottomColor: backgroundColor,
      }}
      className={`aspect-square rounded-full animate-spin ${className}`}
      {...props}
    ></div>
  );
}
