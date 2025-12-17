export default function Throbber({
  width = "16px",
  height = "16px",
  color = "var(--foreground)",
  backgroundColor = "var(--surface)",
  lineWidth = "3px",
  className = "",
  ...props
}) {
  return (
    <div
      style={{
        width,
        height,
        borderWidth: lineWidth,
        borderRightColor: color,
        borderTopColor: color,
        borderLeftColor: backgroundColor,
        borderBottomColor: backgroundColor,
      }}
      className={`aspect-square rounded-full animate-spin ${className}`}
    ></div>
  );
}
