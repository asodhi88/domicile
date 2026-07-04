// src/components/BackToTop.jsx
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-paper/15 bg-ink-800 text-paper/80 shadow-card transition hover:border-brass-light/60 hover:text-brass-light"
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className="h-4 w-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 15V5" />
        <path d="M5 10l5-5 5 5" />
      </svg>
    </button>
  );
}
