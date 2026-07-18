// src/components/HowItWorks.jsx
//
// Educational section. Display serif is reserved for short headlines; every
// multi-sentence block is Inter body text at a readable size and measure.

const CATEGORIES = [
  {
    title: "US-domiciled holdings",
    examples: "VOO, AAPL",
    body: "The 15% US withholding tax on dividends drops to zero inside an RRSP under the treaty. In a TFSA or FHSA it's deducted permanently.",
  },
  {
    title: "Canadian-listed US funds",
    examples: "VFV, VUN",
    body: "Withholding is taken at the fund level before it reaches any account, so no Canadian account can shelter it. Choose on other priorities.",
  },
  {
    title: "Canadian equities",
    examples: "XIC, RY",
    body: "No foreign withholding applies anywhere. TFSA and FHSA shelter growth entirely; an RRSP defers the tax until withdrawal.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 scroll-mt-8 px-6 pb-20 pt-14">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[0.65rem] uppercase tracking-wider-2 text-paper/80">
          How it works
        </p>
        <h2 className="mt-2 font-display font-medium text-2xl italic text-paper sm:text-3xl">
          Where your investments should live
        </h2>
        <p className="mt-4 max-w-[35rem] text-[1.05rem] leading-relaxed text-paper/85">
          Every ETF and stock has a registered account where the Canada–US tax
          treaty treats it best. Most self-directed investors don't find out
          until they've already lost money to it. Domicile tells you which
          account minimizes the tax drag for a given holding, and whether you
          still have room in it.
        </p>

        <h3 className="mt-12 font-display font-medium text-lg italic text-paper">
          The three cases that matter
        </h3>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {CATEGORIES.map((c) => (
            <div
              key={c.title}
              className="rounded-sm border border-paper/12 bg-ink-800 p-5"
            >
              <h4 className="font-display font-medium text-base italic text-paper">
                {c.title}
              </h4>
              <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-wider text-brass-light">
                {c.examples}
              </p>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-paper/85">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
