// src/components/PriceTag.jsx
//
// Small, secondary price + day-change display for the AddressCard. Fetches
// a delayed quote from /api/quote once on mount. The price is a bonus, not a
// dependency: if the quote is unavailable for any reason, this renders
// nothing so the card still looks complete.
//
// The data is delayed (Twelve Data free tier, ~15 min+), never real-time —
// hence the "delayed · as of [time]" caption.

import { useEffect, useState } from "react";

function formatPrice(price, currency) {
  try {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 2,
    }).format(price);
  } catch {
    // Unknown/invalid currency code — fall back to a plain number.
    return price.toFixed(2);
  }
}

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString("en-CA", {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function PriceTag({ symbol }) {
  const [state, setState] = useState({ status: "loading", quote: null });

  useEffect(() => {
    let active = true;

    fetch(`/api/quote?symbol=${encodeURIComponent(symbol)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.source === "twelvedata" && Number.isFinite(data.price)) {
          setState({ status: "ready", quote: data });
        } else {
          setState({ status: "unavailable", quote: null });
        }
      })
      .catch(() => {
        if (active) setState({ status: "unavailable", quote: null });
      });

    return () => {
      active = false;
    };
  }, [symbol]);

  if (state.status === "unavailable") return null;

  if (state.status === "loading") {
    return (
      <div className="mt-3 flex items-center gap-2" aria-hidden="true">
        <span className="h-4 w-20 animate-pulse rounded-sm bg-parchment-dark/70" />
        <span className="h-4 w-24 animate-pulse rounded-sm bg-parchment-dark/50" />
      </div>
    );
  }

  const { price, change, percentChange, currency, isPositive, asOf } = state.quote;
  const changeColor = isPositive ? "text-moss" : "text-clay";
  const sign = isPositive ? "+" : "−";
  const absChange = Math.abs(change).toFixed(2);
  const absPct = Math.abs(percentChange).toFixed(2);

  return (
    <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className="font-mono text-base text-parchment-text">
        {formatPrice(price, currency)}
      </span>
      <span className={`font-mono text-sm ${changeColor}`}>
        {sign}
        {absChange} ({sign}
        {absPct}%)
      </span>
      <span className="font-mono text-[0.6rem] uppercase tracking-wider text-parchment-text/70">
        delayed · as of {formatTime(asOf)}
      </span>
    </div>
  );
}
