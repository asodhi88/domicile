// src/components/HowItWorks.jsx
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 px-6 pb-20 pt-4">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-[0.65rem] uppercase tracking-wider-2 text-paper/70">
          How it works
        </p>
        <h2 className="mt-2 font-display text-2xl italic text-paper sm:text-3xl">
          Domicile tells Canadian self-directed investors which registered
          account (FHSA, TFSA, or RRSP) minimizes the tax drag for a given
          ETF or stock — and shows how much contribution room they have left
          before they need to spill into a non-registered account.
        </h2>

        <div className="mt-10">
          <h3 className="font-display text-lg italic text-paper">
            The problem it solves
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-paper/70">
            Every ETF and stock has a registered account where the Canada–US
            tax treaty treats it best. Most self-directed investors don't
            know this until they've already lost money to it:
          </p>

          <ul className="mt-5 space-y-4">
            <li className="text-sm leading-relaxed text-paper/70">
              <span className="font-mono text-xs uppercase tracking-wider text-brass-light/80">
                US-domiciled holdings (VOO, AAPL, etc.)
              </span>
              <br />
              The 15% US withholding tax on dividends is zero inside an RRSP
              under the treaty. Inside a TFSA or FHSA it is quietly
              deducted, permanently.
            </li>
            <li className="text-sm leading-relaxed text-paper/70">
              <span className="font-mono text-xs uppercase tracking-wider text-brass-light/80">
                Canadian-listed wrappers of US equities (VFV, VUN)
              </span>
              <br />
              The withholding is taken at the fund level before it reaches
              any account. No Canadian account type can shelter it, so
              account choice shifts to other priorities.
            </li>
            <li className="text-sm leading-relaxed text-paper/70">
              <span className="font-mono text-xs uppercase tracking-wider text-brass-light/80">
                Pure Canadian equities
              </span>
              <br />
              No foreign withholding applies anywhere. TFSA / FHSA shelter
              growth from Canadian tax entirely; RRSP defers it to
              withdrawal.
            </li>
          </ul>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-paper/70">
            Domicile also tracks contribution room manually — users update
            it themselves, and the tool tells them whether they have room in
            the recommended account before buying.
          </p>
        </div>
      </div>
    </section>
  );
}
