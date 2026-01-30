"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="btn-secondary dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      type="button"
    >
      {theme === "dark" ? "Light" : "Dark"} mode
    </button>
  );
}

