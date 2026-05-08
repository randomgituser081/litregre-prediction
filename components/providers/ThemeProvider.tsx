"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "eaglelight" | "eagledark";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({ theme: "eaglelight", toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("eaglelight");

  useEffect(() => {
    const stored = localStorage.getItem("ep-theme") as Theme | null;
    if (stored === "eaglelight" || stored === "eagledark") {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ep-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "eaglelight" ? "eagledark" : "eaglelight"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
