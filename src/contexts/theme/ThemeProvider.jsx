import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext.js";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const previousTheme = localStorage.getItem("theme") || "light";

    if (previousTheme !== theme) {
      document.documentElement.classList.remove(previousTheme);
      localStorage.setItem("theme", theme);
    }
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext
      value={{
        theme,
        // @ts-ignore
        setTheme,
      }}
    >
      {children}
    </ThemeContext>
  );
}
