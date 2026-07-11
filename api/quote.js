// api/quote.js
//
// Vercel serverless function. Keeps the Twelve Data API key server-side —
// it's read from process.env.TWELVE_DATA_API_KEY and never sent to the
// browser. Set it in your Vercel project's Environment Variables, not in
// any committed file.
//
// GET /api/quote?symbol=AAPL
//
// Returns a trimmed, delayed quote:
//   { source: "twelvedata", symbol, price, change, percentChange,
//     currency, isPositive, asOf }
// or, on any failure, an HTTP 200 with { source: "unavailable", reason }
// so the frontend can simply hide the price rather than show an error.
//
// NOTE ON DELAY: Twelve Data's free tier is delayed (~15 min or more), not
// real-time. The UI must label it "delayed" / show a timestamp — never
// "live" or "real-time".

// In-memory cache keyed by symbol, 15-minute TTL. This is what keeps us
// under the free tier's 8 calls/min · 800/day limit: repeated searches for
// the same ticker (or many users hitting popular tickers) cost one upstream
// call per symbol per 15 min, not one per request.
//
// Best-effort only: Vercel serverless instances are ephemeral and each
// instance has its own memory, so the cache is not shared or guaranteed to
// survive between invocations. The edge Cache-Control header below is a
// second layer that covers the same window.
const TTL_MS = 15 * 60 * 1000;
const cache = new Map(); // symbol -> { payload, expiresAt }

export default async function handler(req, res) {
  const symbol = (req.query.symbol || "").trim().toUpperCase();

  if (!symbol) {
    res.status(400).json({ error: "Missing symbol" });
    return;
  }

  // Serve from the in-memory cache when it's still fresh.
  const cached = cache.get(symbol);
  if (cached && cached.expiresAt > Date.now()) {
    res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate");
    res.status(200).json(cached.payload);
    return;
  }

  const apiKey = process.env.TWELVE_DATA_API_KEY;

  if (!apiKey) {
    // No key configured — tell the frontend so it can hide the price.
    res.status(200).json({ source: "unavailable", reason: "no_api_key", symbol });
    return;
  }

  try {
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(
      symbol
    )}&apikey=${apiKey}`;

    const upstream = await fetch(url);

    // Twelve Data signals rate limiting with HTTP 429, and sometimes with a
    // 200 body carrying { status: "error", code: 429 }.
    if (upstream.status === 429) {
      res.status(200).json({ source: "unavailable", reason: "rate_limited", symbol });
      return;
    }

    const data = await upstream.json();

    if (!data || data.status === "error") {
      const reason = data?.code === 429 ? "rate_limited" : "not_found";
      res.status(200).json({ source: "unavailable", reason, symbol });
      return;
    }

    const price = Number(data.close);
    const change = Number(data.change);
    const percentChange = Number(data.percent_change);

    if (!Number.isFinite(price)) {
      res.status(200).json({ source: "unavailable", reason: "not_found", symbol });
      return;
    }

    const payload = {
      source: "twelvedata",
      symbol: data.symbol || symbol,
      price,
      change: Number.isFinite(change) ? change : 0,
      percentChange: Number.isFinite(percentChange) ? percentChange : 0,
      currency: data.currency || null,
      isPositive: (Number.isFinite(change) ? change : 0) >= 0,
      asOf: new Date().toISOString(),
    };

    cache.set(symbol, { payload, expiresAt: Date.now() + TTL_MS });

    // Second caching layer: let Vercel's edge hold the response for 15 min.
    res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate");
    res.status(200).json(payload);
  } catch {
    res.status(200).json({ source: "unavailable", reason: "upstream_failed", symbol });
  }
}
