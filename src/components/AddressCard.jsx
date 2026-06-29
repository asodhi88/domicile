// src/components/AddressCard.jsx

function VacancyBar({ available, total }) {
  const pct = total > 0 ? Math.min(100, Math.round((available / total) * 100)) : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
      <div
        className="h-full rounded-full bg-moss-light transition-all duration-700 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function money(n) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export default function AddressCard({ ticker, result, accounts }) {
  if (!ticker || !result) return null;

  // --- Cases where we deliberately don't assign an address ---
  if (result.status === "unsupported" || result.status === "verify") {
    const borderClass =
      result.status === "verify" ? "border-brass/40" : "border-clay/40";
    return (
      <div
        className={`relative mx-auto mt-8 max-w-xl rounded-sm border ${borderClass} bg-parchment p-7 shadow-card`}
      >
        <p className="font-mono text-[0.65rem] uppercase tracking-wider-2 text-parchment-text/50">
          {ticker.symbol} · {ticker.name}
        </p>
        <h3 className="mt-2 font-display text-xl italic text-parchment-text">
          {result.status === "verify" ? "Address unclear — check before assuming" : "Not fully supported yet"}
        </h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-parchment-text/80">
          {result.message}
        </p>
      </div>
    );
  }

  const isFallback = result.status === "fallback";
  const accountKeyForRoom = result.account === "NONREG" ? null : result.account;
  const total = accountKeyForRoom ? accounts[accountKeyForRoom] : null;

  return (
    <div className="relative mx-auto mt-8 max-w-xl">
      {/* stamp */}
      {!isFallback && (
        <div className="absolute -right-3 -top-4 z-10 rotate-6 rounded-sm border-2 border-moss bg-moss-bg px-3 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-wider-2 text-moss shadow-stamp">
          Recommended Account
        </div>
      )}

      <div className="rounded-sm border border-parchment-dark bg-parchment p-7 shadow-card sm:p-8">
        <p className="font-mono text-[0.65rem] uppercase tracking-wider-2 text-parchment-text/80">
          {ticker.symbol} · {ticker.name}
        </p>

        <h3 className="mt-3 font-display text-2xl italic leading-snug text-parchment-text sm:text-3xl">
          {ticker.symbol} should live in your{" "}
          <span className="not-italic text-brass">{result.label}</span>
        </h3>

        <p className="mt-4 text-[0.97rem] leading-relaxed text-parchment-text/85">
          {result.reason}
        </p>

        {accountKeyForRoom && (
          <div className="mt-6">
            <div className="mb-1.5 flex items-baseline justify-between font-mono text-xs uppercase tracking-wider text-parchment-text/55">
              <span>Room left in {result.label}</span>
              <span className="text-parchment-text/80">{money(total)}</span>
            </div>
            <VacancyBar available={total} total={Math.max(total, 1)} />
          </div>
        )}

        {isFallback && result.steps && (
          <div className="mt-6 border-t border-parchment-dark pt-5">
            <p className="font-mono text-[0.65rem] uppercase tracking-wider-2 text-parchment-text/45">
              Why Not Registered Accounts
            </p>
            <ul className="mt-2 space-y-1.5">
              {result.steps.map((s) => (
                <li key={s.account} className="text-sm text-parchment-text/70">
                  <span className="font-medium text-parchment-text/85">{s.label}:</span>{" "}
                  {money(s.available)} left{s.available <= 0 ? " — no room" : ""}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isFallback && result.alternates?.length > 0 && (
          <details className="mt-6 border-t border-parchment-dark pt-4 text-sm text-parchment-text/65">
            <summary className="cursor-pointer font-mono text-[0.65rem] uppercase tracking-wider-2 text-parchment-text/45">
              Other Accounts Considered
            </summary>
            <ul className="mt-3 space-y-3">
              {result.alternates.map((alt) => (
                <li key={alt.account}>
                  <span className="font-medium text-parchment-text/85">{alt.label}</span>
                  {alt.blocked ? " — no room" : ` — ${money(alt.available)} left`}
                  <p className="mt-0.5 text-[0.85rem] leading-relaxed text-parchment-text/60">
                    {alt.reason}
                  </p>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}
