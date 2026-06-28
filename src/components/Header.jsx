// src/components/Header.jsx
export default function Header() {
  return (
    <header className="relative z-10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-7">
        <div className="flex items-baseline gap-2.5">
          <span className="font-display text-[1.45rem] italic tracking-tight text-paper">
            Domicile
          </span>
          <span className="hidden font-mono text-[0.65rem] uppercase tracking-wider-2 text-paper/40 sm:inline">
            registered-account locator
          </span>
        </div>
        <a
          href="#buildings"
          className="rounded-full border border-paper/15 px-4 py-1.5 font-mono text-xs uppercase tracking-wider-2 text-paper/70 transition hover:border-brass/60 hover:text-brass-light"
        >
          My buildings
        </a>
      </div>
    </header>
  );
}
