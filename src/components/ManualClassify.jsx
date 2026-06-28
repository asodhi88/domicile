// src/components/ManualClassify.jsx
import { useState } from "react";

const OPTIONS = [
  {
    key: "CA_DIRECT",
    title: "Canadian companies",
    hint: "e.g. banks, telecoms, TSX-listed stocks or ETFs holding them directly",
    whtCategory: "NONE",
  },
  {
    key: "US_DIRECT_USLISTED",
    title: "US companies — and it's listed on a US exchange (NYSE/NASDAQ)",
    hint: "An individual US stock, or a US-domiciled ETF",
    whtCategory: "RRSP_EXEMPT",
  },
  {
    key: "US_VIA_CA_WRAPPER",
    title: "US companies — but it's listed on the TSX",
    hint: "A Canadian-listed fund giving you US exposure",
    whtCategory: "ALWAYS_APPLIES",
  },
  {
    key: "INTL",
    title: "International / mixed / not sure",
    hint: "Anything outside Canada and the US, or you're not certain",
    whtCategory: "INTL_VARIES",
  },
];

export default function ManualClassify({ symbol, onClassify }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="mx-auto mt-8 max-w-xl rounded-sm border border-paper/12 bg-ink-800 p-7">
      <p className="font-mono text-[0.65rem] uppercase tracking-wider-2 text-paper/40">
        {symbol}
      </p>
      <h3 className="mt-2 font-display text-xl italic text-paper">
        Don't recognize this one — help me out
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-paper/55">
        Domicile doesn't have a confident classification for {symbol} yet.
        What does it mostly invest in?
      </p>

      <div className="mt-5 space-y-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSelected(opt.key)}
            className={`block w-full rounded-sm border px-4 py-3 text-left transition ${
              selected === opt.key
                ? "border-brass-light bg-ink-700"
                : "border-paper/10 hover:border-paper/25"
            }`}
          >
            <span className="block text-sm font-medium text-paper/90">{opt.title}</span>
            <span className="block text-xs text-paper/45">{opt.hint}</span>
          </button>
        ))}
      </div>

      <button
        disabled={!selected}
        onClick={() => {
          const opt = OPTIONS.find((o) => o.key === selected);
          onClassify({
            symbol,
            name: symbol,
            whtCategory: opt.whtCategory,
            structureNote:
              opt.key === "INTL"
                ? "Classified manually as international/uncertain — withholding rates vary by country and this is approximate."
                : undefined,
          });
        }}
        className="mt-5 w-full rounded-sm bg-brass py-2.5 font-mono text-xs uppercase tracking-wider-2 text-ink-900 transition hover:bg-brass-light disabled:cursor-not-allowed disabled:opacity-40"
      >
        Find its address
      </button>
    </div>
  );
}
