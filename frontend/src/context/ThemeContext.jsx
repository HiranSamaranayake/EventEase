import { createContext, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.classList.add("light");
    localStorage.setItem("eventease_theme", "light");
  }, []);

  const toggleTheme = () => {
    // Lock to light/normal mode
  };

  return (
    <ThemeContext.Provider value={{ theme: "light", toggleTheme, setTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
