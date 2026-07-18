// src/components/AddressCard.jsx
import { useState } from "react";
import PriceTag from "./PriceTag";

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

// Describes an account's room in words, including the "user hasn't told us"
// case — we never claim $0 for room we simply don't know.
function roomLabel(step) {
  if (!step.roomKnown) return "room not added yet";
  if (step.available <= 0) return "no room";
  return `${money(step.available)} left`;
}

function LogPurchase({ account, label, available, onLog }) {
  const [amount, setAmount] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  function submit(e) {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return;
    onLog(account, value);
    setConfirmed(true);
    setAmount("");
    setTimeout(() => setConfirmed(false), 2500);
  }

  return (
    <form onSubmit={submit} className="mt-5 border-t border-parchment-dark pt-5">
      <p className="font-mono text-[0.65rem] uppercase tracking-wider-2 text-parchment-text/90">
        Just bought this?
      </p>
      <div className="mt-2 flex items-center gap-2">
        <div className="flex flex-1 items-center gap-1 rounded-sm border border-parchment-dark bg-field px-3 py-2">
          <span className="font-mono text-parchment-text/80">$</span>
          <input
            type="number"
            min="0"
            step="1"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount purchased"
            className="w-full bg-transparent font-mono text-sm text-parchment-text outline-none placeholder:text-parchment-text/70"
          />
        </div>
        <button
          type="submit"
          disabled={!amount || Number(amount) <= 0}
          className="shrink-0 rounded-sm bg-brass px-4 py-2 font-mono text-xs uppercase tracking-wider-2 text-night transition hover:bg-brass-light disabled:cursor-not-allowed disabled:opacity-40"
        >
          Log it
        </button>
      </div>
      {confirmed ? (
        <p className="mt-2 font-mono text-[0.7rem] text-moss">
          ✓ Deducted from your {label} — {money(available)} left now
        </p>
      ) : (
        <p className="mt-2 text-[0.75rem] text-parchment-text/90">
          Deducts from your {label} room below, so your next search is accurate.
        </p>
      )}
    </form>
  );
}

function TaxDragCallout({ ticker, accountKey, onEstimate }) {
  const [amount, setAmount] = useState("");
  const drag = amount && Number(amount) > 0 ? onEstimate(ticker, accountKey, Number(amount)) : null;

  return (
    <div className="mt-6 border-t border-parchment-dark pt-5">
      <h4 className="font-display font-medium text-base italic text-parchment-text">
        See the actual dollar cost
      </h4>
      <div className="mt-2 flex items-center gap-1 rounded-sm border border-parchment-dark bg-field px-3 py-2">
        <span className="font-mono text-parchment-text/80">$</span>
        <input
          type="number"
          min="0"
          step="1"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="How much are you investing in this?"
          className="w-full bg-transparent font-mono text-sm text-parchment-text outline-none placeholder:text-parchment-text/70"
        />
      </div>

      {drag && drag.status === "unavailable" && (
        <p className="mt-3 max-w-[30rem] text-[0.85rem] leading-relaxed text-parchment-text/90">
          Domicile doesn't have a confident dividend yield for {ticker.symbol} yet,
          so it can't turn this into a dollar figure. The account recommendation
          above still holds.
        </p>
      )}

      {drag && drag.status === "sheltered" && (
        <p className="mt-3 font-mono text-2xl text-moss">
          $0<span className="ml-2 font-body text-sm font-normal text-parchment-text/90">/year withholding tax leak — fully sheltered here.</span>
        </p>
      )}

      {drag && drag.status === "permanent" && (
        <div className="mt-3">
          <p className="font-mono text-2xl text-clay">
            {money(drag.amount)}
            <span className="ml-2 font-body text-sm font-normal text-parchment-text/90">/year, gone for good.</span>
          </p>
          <p className="mt-1.5 max-w-[30rem] text-[0.85rem] leading-relaxed text-parchment-text/90">
            Based on {ticker.symbol}'s approximate yield, this account has no way
            to recover US withholding tax — unlike an RRSP or a non-registered
            account.
          </p>
        </div>
      )}

      {drag && drag.status === "recoverable" && (
        <div className="mt-3">
          <p className="font-mono text-2xl text-brass">
            {money(drag.amount)}
            <span className="ml-2 font-body text-sm font-normal text-parchment-text/90">/year withheld, but recoverable.</span>
          </p>
          <p className="mt-1.5 max-w-[30rem] text-[0.85rem] leading-relaxed text-parchment-text/90">
            You can claim this back as a foreign tax credit on your return —
            it's a cash-flow timing cost, not a permanent loss.
          </p>
        </div>
      )}

      {drag && drag.status === "unavoidable" && (
        <div className="mt-3">
          <p className="font-mono text-2xl text-clay">
            {money(drag.amount)}
            <span className="ml-2 font-body text-sm font-normal text-parchment-text/90">/year, baked into the fund — no account avoids it.</span>
          </p>
          <p className="mt-1.5 max-w-[30rem] text-[0.85rem] leading-relaxed text-parchment-text/90">
            This is deducted at the fund level before it reaches any account,
            RRSP included. Account choice doesn't change this number.
          </p>
        </div>
      )}

      {drag && drag.status === "unavoidable_recoverable" && (
        <div className="mt-3">
          <p className="font-mono text-2xl text-brass">
            {money(drag.amount)}
            <span className="ml-2 font-body text-sm font-normal text-parchment-text/90">/year withheld at the fund level, recoverable via foreign tax credit.</span>
          </p>
        </div>
      )}

      <p className="mt-3 max-w-[28rem] text-[0.8rem] leading-relaxed text-parchment-text/80">
        Estimate only — based on an approximate, hand-set dividend yield, not
        live market data. Actual yield moves with price and payout changes.
      </p>
    </div>
  );
}

// Shown in place of the room bar when the user hasn't told us their room
// yet. The recommendation above it stands on its own — this is an optional
// next step, not a gate.
function AddRoomPrompt({ label }) {
  return (
    <button
      type="button"
      onClick={() =>
        document
          .getElementById("accounts")
          ?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      className="mt-6 flex w-full items-center justify-between gap-3 rounded-sm border border-dashed border-parchment-dark px-4 py-3 text-left transition hover:border-brass focus-visible:border-brass"
    >
      <span className="text-[0.9rem] leading-snug text-parchment-text/95">
        Add your contribution room to see if you have space in your {label}
      </span>
      <span aria-hidden="true" className="shrink-0 text-brass">
        →
      </span>
    </button>
  );
}

export default function AddressCard({
  ticker,
  result,
  isExample = false,
  onLogPurchase,
  onEstimateTaxDrag,
}) {
  if (!ticker || !result) return null;

  // --- Cases where we deliberately don't assign an address ---
  if (result.status === "unsupported" || result.status === "verify") {
    const borderClass =
      result.status === "verify" ? "border-brass/40" : "border-clay/40";
    return (
      <div
        className={`relative mx-auto mt-8 max-w-xl rounded-sm border ${borderClass} bg-parchment-light p-7 shadow-card`}
      >
        <p className="font-mono text-[0.65rem] uppercase tracking-wider-2 text-parchment-text/90">
          {ticker.symbol} · {ticker.name}
        </p>
        <h3 className="mt-2 font-display font-medium text-xl italic text-parchment-text">
          {result.status === "verify" ? "Address unclear — check before assuming" : "Not fully supported yet"}
        </h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-parchment-text/95">
          {result.message}
        </p>
      </div>
    );
  }

  const isFallback = result.status === "fallback";
  const accountKeyForRoom = result.account === "NONREG" ? null : result.account;
  const roomKnown = result.roomKnown !== false;
  const total = result.available;

  return (
    <div className="relative mx-auto mt-8 max-w-xl">
      {/* stamp */}
      {!isFallback && !isExample && (
        <div className="absolute -right-3 -top-4 z-10 rotate-6 rounded-sm border-2 border-moss bg-moss-bg px-3 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-wider-2 text-moss shadow-stamp">
          Recommended Account
        </div>
      )}
      {isExample && (
        <div className="absolute -right-3 -top-4 z-10 rotate-6 rounded-sm border-2 border-brass bg-parchment px-3 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-wider-2 text-brass shadow-stamp">
          Example
        </div>
      )}

      <div className="rounded-sm border border-parchment-dark bg-parchment-light p-7 shadow-card sm:p-8">
        <p className="font-mono text-[0.65rem] uppercase tracking-wider-2 text-parchment-text/95">
          {ticker.symbol} · {ticker.name}
        </p>

        <PriceTag key={ticker.symbol} symbol={ticker.symbol} />

        <h3 className="mt-3 font-display font-medium text-2xl italic leading-snug text-parchment-text sm:text-3xl">
          {ticker.symbol} should live in your{" "}
          <span className="not-italic text-brass">{result.label}</span>
        </h3>

        <p className="mt-4 max-w-[30rem] text-[0.97rem] leading-relaxed text-parchment-text/95">
          {result.reason}
        </p>

        {isExample && (
          <p className="mt-4 text-[0.85rem] leading-relaxed text-parchment-text/80">
            This is an example. Search a ticker above to see your own →
          </p>
        )}

        {accountKeyForRoom && roomKnown && (
          <div className="mt-6">
            <div className="mb-1.5 flex items-baseline justify-between font-mono text-xs uppercase tracking-wider text-parchment-text/90">
              <span>Room left in {result.label}</span>
              <span className="text-parchment-text/95">{money(total)}</span>
            </div>
            <VacancyBar available={total} total={Math.max(total, 1)} />
          </div>
        )}

        {accountKeyForRoom && !roomKnown && !isExample && (
          <AddRoomPrompt label={result.label} />
        )}

        {accountKeyForRoom && roomKnown && onLogPurchase && (
          <LogPurchase
            account={accountKeyForRoom}
            label={result.label}
            available={total}
            onLog={onLogPurchase}
          />
        )}

        {["RRSP_EXEMPT", "ALWAYS_APPLIES"].includes(ticker.whtCategory) && onEstimateTaxDrag && (
          <TaxDragCallout
            ticker={ticker}
            accountKey={result.account}
            onEstimate={onEstimateTaxDrag}
          />
        )}

        {isFallback && result.steps && (
          <div className="mt-6 border-t border-parchment-dark pt-5">
            <h4 className="font-display font-medium text-base italic text-parchment-text">
              Why not a registered account?
            </h4>
            <ul className="mt-2 space-y-1.5">
              {result.steps.map((s) => (
                <li key={s.account} className="text-sm text-parchment-text/90">
                  <span className="font-medium text-parchment-text/95">{s.label}:</span>{" "}
                  {roomLabel(s)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isFallback && result.alternates?.length > 0 && (
          <details className="mt-6 border-t border-parchment-dark pt-4 text-sm text-parchment-text/90">
            <summary className="cursor-pointer font-display font-medium text-base italic text-parchment-text">
              Other accounts considered
            </summary>
            <ul className="mt-3 space-y-3">
              {result.alternates.map((alt) => (
                <li key={alt.account}>
                  <span className="font-medium text-parchment-text/95">{alt.label}</span>
                  {` — ${roomLabel(alt)}`}
                  <p className="mt-0.5 max-w-[30rem] text-[0.85rem] leading-relaxed text-parchment-text/90">
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
