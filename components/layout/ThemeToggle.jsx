"use client";

import { cn } from "@/lib/utils";
import Magnetic from "@/components/ui/Magnetic";
import { useTheme } from "./ThemeProvider";

function SunIcon({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <span className={cn("inline-flex", className)}>
      <Magnetic strength={10}>
        <button
          type="button"
          onClick={toggleTheme}
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)]",
            "bg-[var(--surface)]/80 text-[var(--foreground)] backdrop-blur-md",
            "transition-all duration-300 hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)] hover:rotate-12",
            "active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
          )}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
      </Magnetic>
    </span>
  );
}
