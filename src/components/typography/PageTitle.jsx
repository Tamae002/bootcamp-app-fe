export default function PageTitle({ children, className = "", ...props }) {
  return (
    <h1
      className={`h-rule mb-8 text-3xl font-semibold ${className}`}
      {...props}
    >
      {children}
    </h1>
  );
}
