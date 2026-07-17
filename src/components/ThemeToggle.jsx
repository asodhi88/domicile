// src/components/ThemeToggle.jsx
//
// Light/dark switch for the whole page. Light is the default; the choice is
// persisted to localStorage and applied via the data-theme attribute on
// <html> (see index.css for the token values, and index.html for the
// before-paint script that prevents a flash on load).

import { useEffect, useState } from "react";

const STORAGE_KEY = "domicile.theme";

function getInitialTheme() {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);
  const isLight = theme === "light";

  useEffect(() => {
    const root = document.documentElement;
    if (isLight) {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", "dark");
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage failures (private mode, etc.) — theme still applies.
    }
  }, [theme, isLight]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-paper/20 bg-ink-800 transition-colors hover:border-brass/60"
    >
      {/* Sliding knob with a sun (light) / moon (dark) glyph. */}
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full bg-brass text-night transition-transform duration-300 ${
          isLight ? "translate-x-6" : "translate-x-1"
        }`}
      >
        {isLight ? (
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="8" cy="8" r="3" />
            <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3 3l1 1M12 12l1 1M13 3l-1 1M4 12l-1 1" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor">
            <path d="M6 1.5A6.5 6.5 0 1 0 14.5 10 5 5 0 0 1 6 1.5z" />
          </svg>
        )}
      </span>
    </button>
  );
}
