// src/components/Header.jsx
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="relative z-10">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-7">
        <div className="flex flex-col">
          <span className="font-display text-[2.75rem] italic leading-none tracking-tight text-paper">
            Domicile
          </span>
          <span className="mt-2 font-display text-[1.15rem] italic leading-tight text-paper">
            FHSA, TFSA, or RRSP — know where to hold it.
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <a
            href="#how-it-works"
            className="group flex shrink-0 items-center gap-2 rounded-full border border-paper/15 px-4 py-1.5 font-mono text-xs uppercase tracking-wider-2 text-paper/70 transition hover:border-brass/60 hover:text-brass-light"
          >
            <span className="relative inline-flex h-2 w-2 items-center justify-center">
              {/* Shares the flow line's dot color so it tracks the theme. */}
              <span
                className="absolute inline-flex h-2 w-2 animate-ping rounded-full opacity-70"
                style={{ backgroundColor: "var(--flow-dot)" }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ backgroundColor: "var(--flow-dot)" }}
              />
            </span>
            How it works
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
