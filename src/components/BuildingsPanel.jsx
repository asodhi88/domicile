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
    <section id="accounts" className="relative z-10 scroll-mt-8">
      <p className="font-mono text-[0.7rem] uppercase tracking-wider-2 text-brass-light">
        Step 2 · Add your room (optional)
      </p>
      <h2 className="mt-2 font-display font-medium text-xl italic text-paper">
        Do you have space for it?
      </h2>
      <p className="mt-2 max-w-prose text-[0.95rem] leading-relaxed text-paper/80">
        Add what's left in each account and every result will tell you
        whether it fits. Check your brokerage or CRA My Account.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        {BUILDINGS.map((b) => {
          const value = rawAccounts[b.key];
          return (
            <div
              key={b.key}
              className="rounded-sm border border-paper/12 bg-ink-800 p-5"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className="font-display font-medium text-lg italic text-paper"
                  title={b.fullName}
                >
                  {b.name}
                </span>
                <span className="font-mono text-[0.6rem] uppercase tracking-wider text-paper/75">
                  {b.tagline}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-paper/80">
                {b.blurb}
              </p>

              <label className="mt-4 block">
                <span className="font-mono text-[0.6rem] uppercase tracking-wider text-paper/75">
                  Room available
                </span>
                <div className="mt-1 flex items-center gap-1 border-b border-paper/15 pb-1.5 focus-within:border-brass-light/60">
                  <span className="font-mono text-paper/75">$</span>
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={value === null ? "" : value}
                    onChange={(e) => setRoom(b.key, e.target.value)}
                    placeholder="0"
                    aria-label={`${b.fullName} room available`}
                    className="w-full bg-transparent font-mono text-lg text-paper outline-none placeholder:text-paper/60"
                  />
                </div>
              </label>

              {value !== null && value > 0 && (
                <p className="mt-2 font-mono text-[0.65rem] text-moss-light">
                  {money(value)} available
                </p>
              )}
              {value !== null && value <= 0 && (
                <p className="mt-2 font-mono text-[0.65rem] text-paper/70">
                  No room left
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
