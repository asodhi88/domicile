// src/components/TickerSearch.jsx
import { useEffect, useState } from "react";

const TICKER_POOL = [
  "XIC", "VCN", "ZCN", "RY", "TD", "BNS", "ENB", "BCE", "CNR", "SHOP",
  "VOO", "VTI", "SPY", "QQQ", "SCHD", "AAPL", "MSFT", "GOOGL", "AMZN",
  "NVDA", "META", "JPM", "JNJ", "KO", "PG", "VFV", "VUN", "XEQT", "VEQT",
  "VGRO", "XGRO", "VBAL", "ZSP", "XUU", "HXS", "XEF", "VIU", "XEC",
];

function pickRandom(count) {
  const shuffled = [...TICKER_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function TickerSearch({ onSearch, loading }) {
  const [value, setValue] = useState("");
  const [examples, setExamples] = useState(() => pickRandom(5));

  useEffect(() => {
    const id = setInterval(() => setExamples(pickRandom(5)), 5000);
    return () => clearInterval(id);
  }, []);

  function submit(e) {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  }

  return (
    <section id="search" className="relative z-10">
      <p className="font-mono text-[0.7rem] uppercase tracking-wider-2 text-brass-deep">
        Step 1 · Enter a ticker
      </p>
      <h2 className="mt-2 font-display font-medium text-2xl italic text-paper sm:text-3xl">
        Which account should it live in?
      </h2>
      <p className="mt-2 max-w-[30rem] text-[0.95rem] leading-relaxed text-paper/80">
        Search any ETF or stock and Domicile tells you where it belongs. No
        setup required.
      </p>

      <form onSubmit={submit} className="mt-6 flex max-w-md gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="VFV, AAPL, XEQT…"
          autoCapitalize="characters"
          aria-label="Ticker symbol"
          className="flex-1 rounded-sm border border-paper/15 bg-ink-800 px-4 py-3 font-mono text-base text-paper placeholder:text-paper/60 focus:border-brass-light/60"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-sm bg-brass px-5 py-3 font-mono text-xs uppercase tracking-wider-2 text-night transition hover:bg-brass-light disabled:opacity-50"
        >
          {loading ? "Looking…" : "Search"}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[0.65rem] uppercase tracking-wider text-paper/70">
          Try tickers like
        </span>
        {examples.map((sym) => (
          <button
            key={sym}
            onClick={() => onSearch(sym)}
            className="rounded-full border border-paper/15 px-2.5 py-1 font-mono text-xs text-paper/85 transition hover:border-brass-light/50 hover:text-brass-light"
          >
            {sym}
          </button>
        ))}
      </div>
    </section>
  );
}
