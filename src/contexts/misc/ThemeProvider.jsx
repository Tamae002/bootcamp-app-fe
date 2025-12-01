import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext.js";

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    let previousTheme = localStorage.getItem("theme") || "light";
    switch (theme) {
      case "dark":
        document.documentElement.classList.add(theme);
        break;
      case "light":
        document.documentElement.classList.remove(previousTheme);
        break;
      default:
        return console.error("Theme name is not valid:", theme);
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}
