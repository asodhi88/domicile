// api/lookup.js
//
// Vercel serverless function. Keeps the Twelve Data API key server-side —
// it's read from process.env.TWELVE_DATA_API_KEY and never sent to the
// browser. Set it in your Vercel project's Environment Variables, not in
// any committed file.
//
// GET /api/lookup?symbol=AAPL

export default async function handler(req, res) {
  const symbol = (req.query.symbol || "").trim().toUpperCase();

  if (!symbol) {
    res.status(400).json({ error: "Missing symbol" });
    return;
  }

  const apiKey = process.env.TWELVE_DATA_API_KEY;

  if (!apiKey) {
    // No key configured — tell the frontend so it can fall back to manual
    // classification instead of showing a broken search.
    res.status(200).json({ source: "none", reason: "no_api_key", symbol });
    return;
  }

  try {
    const url = `https://api.twelvedata.com/symbol_search?symbol=${encodeURIComponent(
      symbol
    )}&apikey=${apiKey}`;

    const upstream = await fetch(url);
    const data = await upstream.json();

    if (!data || !Array.isArray(data.data) || data.data.length === 0) {
      res.status(200).json({ source: "twelvedata", reason: "not_found", symbol });
      return;
    }

    // Prefer an exact symbol match over a fuzzy one.
    const match =
      data.data.find((d) => d.symbol?.toUpperCase() === symbol) || data.data[0];

    const country = (match.country || "").toLowerCase();
    const instrumentType = (match.instrument_type || "").toLowerCase();
    const isCanada = country.includes("canada");
    const isUS = country.includes("united states");
    const isETF = instrumentType.includes("etf") || instrumentType.includes("fund");

    let suggestion = null;

    if (isCanada && !isETF) {
      suggestion = { whtCategory: "NONE", confidence: "auto" };
    } else if (isUS && !isETF) {
      suggestion = { whtCategory: "RRSP_EXEMPT", confidence: "auto" };
    } else if (isUS && isETF) {
      // US-listed ETF — likely holds US equities directly, but we can't
      // see inside it from this endpoint, so mark it lower confidence.
      suggestion = { whtCategory: "RRSP_EXEMPT", confidence: "low" };
    } else if (isCanada && isETF) {
      // Canadian-listed ETF — direct vs wrapped structure can't be
      // determined from search metadata. Don't guess.
      suggestion = { whtCategory: "VERIFY", confidence: "auto" };
    } else {
      suggestion = { whtCategory: "INTL_VARIES", confidence: "low" };
    }

    res.status(200).json({
      source: "twelvedata",
      symbol: match.symbol,
      name: match.instrument_name,
      exchange: match.exchange,
      country: match.country,
      instrumentType: match.instrument_type,
      suggestion,
    });
  } catch {
    res.status(200).json({ source: "error", reason: "upstream_failed", symbol });
  }
}
