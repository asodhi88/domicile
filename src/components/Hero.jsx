// src/components/Hero.jsx
import { useState } from "react";

const EXAMPLES = ["VFV", "VOO", "XEQT", "AAPL", "XIC"];

export default function Hero({ onSearch, loading }) {
  const [value, setValue] = useState("");

  function submit(e) {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  }

  return (
    <section className="relative z-10 px-6 pb-4 pt-10 sm:pt-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-[0.7rem] uppercase tracking-wider-2 text-brass-light/80">
          FHSA · TFSA · RRSP
        </p>
        <h1 className="mt-4 font-display text-[2.5rem] italic leading-[1.08] text-paper sm:text-[3.4rem]">
          Find the right account
          <br />
          for every dollar.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[1.02rem] leading-relaxed text-paper/55">
          Every ETF and stock has a registered account where the tax treaty
          treats it best. Search a ticker and Domicile tells you where to
          park it — and whether you've got room.
        </p>

        <form onSubmit={submit} className="mx-auto mt-9 flex max-w-md gap-2">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="VFV, AAPL, XEQT…"
            autoCapitalize="characters"
            className="flex-1 rounded-sm border border-paper/15 bg-ink-800 px-4 py-3 font-mono text-base text-paper placeholder:text-paper/30 focus:border-brass-light/60"
          />
          <button
            type="submit"
            disabled={loading}
            className="shrink-0 rounded-sm bg-brass px-5 py-3 font-mono text-xs uppercase tracking-wider-2 text-ink-900 transition hover:bg-brass-light disabled:opacity-50"
          >
            {loading ? "Looking…" : "Find address"}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="font-mono text-[0.65rem] uppercase tracking-wider text-paper/30">
            Try
          </span>
          {EXAMPLES.map((sym) => (
            <button
              key={sym}
              onClick={() => onSearch(sym)}
              className="rounded-full border border-paper/10 px-2.5 py-1 font-mono text-xs text-paper/55 transition hover:border-brass-light/50 hover:text-brass-light"
            >
              {sym}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
