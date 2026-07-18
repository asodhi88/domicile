// src/App.jsx
import { useMemo, useState } from "react";
import Header from "./components/Header";
import TickerSearch from "./components/TickerSearch";
import AddressCard from "./components/AddressCard";
import ManualClassify from "./components/ManualClassify";
import BuildingsPanel from "./components/BuildingsPanel";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import { findTicker } from "./data/tickers";
import { recommend, estimateTaxDrag } from "./data/rules";
import { useAccounts } from "./hooks/useAccounts";

export default function App() {
  const { rawAccounts, setRoom, logPurchase } = useAccounts();
  const [loading, setLoading] = useState(false);
  const [ticker, setTicker] = useState(null);
  const [needsManual, setNeedsManual] = useState(null); // symbol string or null

  // The recommendation is derived, not stored, so it re-runs whenever the
  // user edits their room. That matters now that setup comes *after* the
  // search: adding room updates the card in place.
  const result = useMemo(
    () => (ticker ? recommend(ticker, rawAccounts) : null),
    [ticker, rawAccounts]
  );

  async function handleSearch(rawSymbol) {
    const symbol = rawSymbol.trim().toUpperCase();
    setLoading(true);
    setNeedsManual(null);
    setTicker(null);

    const curated = findTicker(symbol);
    if (curated) {
      setTicker(curated);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/lookup?symbol=${encodeURIComponent(symbol)}`);
      const data = await res.json();

      if (data.source === "twelvedata" && data.suggestion?.confidence === "auto") {
        setTicker({
          symbol: data.symbol || symbol,
          name: data.name || symbol,
          whtCategory: data.suggestion.whtCategory,
        });
      } else {
        // Low confidence, no key configured, not found, or upstream error —
        // hand it to the user rather than guessing.
        setNeedsManual(symbol);
      }
    } catch {
      setNeedsManual(symbol);
    } finally {
      setLoading(false);
    }
  }

  function handleManualClassify(manualTicker) {
    setNeedsManual(null);
    setTicker(manualTicker);
  }

  return (
    <div className="min-h-screen bg-ink-900 bg-noise">
      <Header />
      <main>
        {/* Primary loop: search + result first, room setup alongside it on
            desktop and below it on mobile. */}
        <div className="mx-auto max-w-6xl px-6 pt-10 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-14">
          <div>
            <TickerSearch onSearch={handleSearch} loading={loading} />

            <div className="min-h-[60px] pb-8">
              {needsManual && (
                <ManualClassify
                  symbol={needsManual}
                  onClassify={handleManualClassify}
                />
              )}

              {!needsManual && ticker && result && (
                <AddressCard
                  ticker={ticker}
                  result={result}
                  onLogPurchase={logPurchase}
                  onEstimateTaxDrag={estimateTaxDrag}
                />
              )}

              {!needsManual && !ticker && !loading && (
                <p className="pt-2 text-sm text-paper/70">
                  Your result will appear here.
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-paper/10 pt-10 lg:border-t-0 lg:pt-0">
            <BuildingsPanel rawAccounts={rawAccounts} setRoom={setRoom} />
          </div>
        </div>

        <div className="mx-auto mt-4 max-w-6xl px-6">
          <div className="border-t border-paper/10" />
        </div>

        <HowItWorks />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
