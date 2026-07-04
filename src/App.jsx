// src/App.jsx
import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TickerSearch from "./components/TickerSearch";
import AddressCard from "./components/AddressCard";
import ManualClassify from "./components/ManualClassify";
import BuildingsPanel from "./components/BuildingsPanel";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import { findTicker } from "./data/tickers";
import { recommend } from "./data/rules";
import { useAccounts } from "./hooks/useAccounts";

export default function App() {
  const { accounts, rawAccounts, setRoom } = useAccounts();
  const [loading, setLoading] = useState(false);
  const [ticker, setTicker] = useState(null);
  const [result, setResult] = useState(null);
  const [needsManual, setNeedsManual] = useState(null); // symbol string or null

  // Step 1 → Step 2 guidance: once all three accounts have a value, scroll
  // the user down to the ticker search. Only fires on the transition so it
  // doesn't hijack scrolling on every keystroke afterwards.
  const allAccountsSet =
    rawAccounts.FHSA !== null && rawAccounts.TFSA !== null && rawAccounts.RRSP !== null;
  const wasAllSet = useRef(allAccountsSet);
  useEffect(() => {
    if (allAccountsSet && !wasAllSet.current) {
      document.getElementById("search")?.scrollIntoView({ behavior: "smooth" });
    }
    wasAllSet.current = allAccountsSet;
  }, [allAccountsSet]);

  async function handleSearch(rawSymbol) {
    const symbol = rawSymbol.trim().toUpperCase();
    setLoading(true);
    setNeedsManual(null);
    setResult(null);
    setTicker(null);

    const curated = findTicker(symbol);
    if (curated) {
      setTicker(curated);
      setResult(recommend(curated, accounts));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/lookup?symbol=${encodeURIComponent(symbol)}`);
      const data = await res.json();

      if (data.source === "twelvedata" && data.suggestion?.confidence === "auto") {
        const liveTicker = {
          symbol: data.symbol || symbol,
          name: data.name || symbol,
          whtCategory: data.suggestion.whtCategory,
        };
        setTicker(liveTicker);
        setResult(recommend(liveTicker, accounts));
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
    setResult(recommend(manualTicker, accounts));
  }

  return (
    <div className="min-h-screen bg-ink-900 bg-noise">
      <Header />
      <main>
        <Hero />

        <BuildingsPanel rawAccounts={rawAccounts} setRoom={setRoom} />

        <div className="mx-auto max-w-4xl border-t border-paper/10" />

        <TickerSearch onSearch={handleSearch} loading={loading} />

        <div className="min-h-[60px] px-6 pb-8">
          {needsManual && (
            <ManualClassify symbol={needsManual} onClassify={handleManualClassify} />
          )}
          {!needsManual && ticker && result && (
            <AddressCard ticker={ticker} result={result} accounts={accounts} />
          )}
        </div>

        <div className="mx-auto max-w-4xl border-t border-paper/10" />

        <HowItWorks />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
