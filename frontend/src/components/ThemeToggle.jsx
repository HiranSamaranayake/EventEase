import { useTheme } from "../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`px-3.5 py-2.5 rounded-xl border transition-all duration-300 flex items-center gap-2 text-xs font-extrabold shadow-sm ${
        isDark
          ? "bg-slate-900 border-purple-500/30 text-amber-300 hover:bg-slate-800 hover:border-amber-400/50"
          : "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 hover:border-purple-300"
      }`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <>
          <FaSun className="text-amber-400 text-sm animate-spin-slow" />
          <span className="hidden sm:inline">Light Mode</span>
        </>
      ) : (
        <>
          <FaMoon className="text-purple-600 text-sm" />
          <span className="hidden sm:inline">Dark Mode</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
