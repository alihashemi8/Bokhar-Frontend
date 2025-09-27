import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function DarkMode({ className = "" }) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light" : "Dark"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={
        "flex items-center justify-center p-2 rounded-full transition  " +
        "hover:scale-110 active:scale-95 duration-200 " +
        "bg-black/10 dark:bg-black/10 hover:bg-black/20 dark:hover:bg-black/20 " +
        "border border-white/20 dark:border-white/20 shadow-md " +
        className
      }
    >
      {isDark ? (
        <Sun size={20} className="text-white hover:text-amber-400" />
      ) : (
        <Moon size={20} className="text-white hover:text-amber-400" />
      )}
    </button>
  );
}
