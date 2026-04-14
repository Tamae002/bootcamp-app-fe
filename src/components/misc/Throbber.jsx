export default function Throbber({
  size = "16px",
  color = "var(--primary)",
  lineWidth = "4px",
  className = "",
  ...props
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRightWidth: lineWidth,
        borderRightColor: color,
      }}
      className={`aspect-square rounded-full animate-spin ${className}`}
      {...props}
    ></div>
  );
}
