// src/components/BuildingsPanel.jsx
const BUILDINGS = [
  {
    key: "FHSA",
    name: "FHSA",
    fullName: "First Home Savings Account",
    tagline: "The Starter",
    blurb: "$8,000/year, carries forward, $40,000 lifetime cap.",
  },
  {
    key: "TFSA",
    name: "TFSA",
    fullName: "Tax-Free Savings Account",
    tagline: "The Forever Home",
    blurb: "Growth here is never taxed — withdrawals included.",
  },
  {
    key: "RRSP",
    name: "RRSP",
    fullName: "Registered Retirement Savings Plan",
    tagline: "The Retirement Tower",
    blurb: "Tax-deferred, and the only floor with a US treaty exemption.",
  },
];

function money(n) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export default function BuildingsPanel({ rawAccounts, setRoom }) {
  return (
    <section id="buildings" className="relative z-10 px-6 pb-20 pt-10">
      <div className="mx-auto max-w-4xl">
        <p
          id="step1-kicker"
          className="font-mono text-[0.7rem] uppercase tracking-wider-2 text-brass-light"
        >
          Step 1 · Update your accounts
        </p>
        <h2 className="mt-2 font-display text-2xl italic text-paper sm:text-3xl">
          How much room is left in each account?
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-paper/70">
          Enter what's actually left in each account right now — check your
          brokerage or CRA My Account. Update it whenever you make a
          purchase; Domicile doesn't track this for you automatically yet.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {BUILDINGS.map((b) => {
            const value = rawAccounts[b.key];
            return (
              <div
                key={b.key}
                className="rounded-sm border border-paper/12 bg-ink-800 p-5"
              >
                <div className="flex items-baseline justify-between">
                  <span
                    className="font-display text-lg italic text-paper"
                    title={b.fullName}
                  >
                    {b.name}
                  </span>
                  <span className="font-mono text-[0.6rem] uppercase tracking-wider text-paper/70">
                    {b.tagline}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-paper/65">
                  {b.blurb}
                </p>

                <label className="mt-4 block">
                  <span className="font-mono text-[0.6rem] uppercase tracking-wider text-paper/60">
                    Room available
                  </span>
                  <div className="mt-1 flex items-center gap-1 border-b border-paper/15 pb-1.5 focus-within:border-brass-light/60">
                    <span className="font-mono text-paper/60">$</span>
                    <input
                      type="number"
                      min="0"
                      inputMode="numeric"
                      value={value === null ? "" : value}
                      onChange={(e) => setRoom(b.key, e.target.value)}
                      placeholder="0"
                      className="w-full bg-transparent font-mono text-lg text-paper outline-none placeholder:text-paper/45"
                    />
                  </div>
                </label>

                {value !== null && (
                  <p className="mt-2 font-mono text-[0.65rem] text-moss-light">
                    {money(value)} of vacancy
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
