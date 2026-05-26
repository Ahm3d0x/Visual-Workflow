"use client";

import { useTheme } from "next-themes";
import { Moon, SunMedium } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const Icon = theme === "dark" ? SunMedium : Moon;

  return (
    <button className="button" type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
      <Icon size={17} />
    </button>
  );
}
