import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-neutral-700 dark:border-white/10
                 bg-neutral-100 dark:bg-neutral-900
                 text-neutral-700 dark:text-neutral-300
                 hover:bg-neutral-200 dark:hover:bg-neutral-800
                 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggle;