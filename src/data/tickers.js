// src/data/tickers.js
//
// Curated dataset of common tickers Canadian self-directed investors hold,
// classified by how US withholding tax interacts with account type.
//
// whtCategory values:
//   "NONE"            — Canadian equity exposure only. No foreign withholding
//                        tax in any account. Account choice is about general
//                        tax-shelter strategy, not withholding.
//   "RRSP_EXEMPT"     — A literal US-domiciled stock or fund holding US
//                        equities directly. The Canada-US tax treaty exempts
//                        this from US withholding tax ONLY inside an RRSP/RRIF.
//   "ALWAYS_APPLIES"  — A Canadian-listed fund that wraps US equities (either
//                        directly or via an underlying US-listed fund). The
//                        withholding happens at the fund level before it ever
//                        reaches your account, so no Canadian account type
//                        can shelter it — RRSP included.
//   "VERIFY"          — Fund-of-funds / asset-allocation product where the
//                        underlying structure can change over time. We don't
//                        assert a withholding classification for these —
//                        check the provider's tax documentation.
//   "INTL_VARIES"      — International (non-US) equity exposure. Withholding
//                        rates vary by country and the RRSP/treaty shortcut
//                        that applies to US assets doesn't generalize. Not
//                        fully supported yet.
//
// This list is intentionally short. It is a starting point, not a market
// database — extend it as you go, and when you're not sure, lean on "VERIFY"
// rather than guessing. Getting this wrong costs real money.

export const TICKERS = [
  // ---- Canadian equities — no foreign withholding tax anywhere ----
  { symbol: "XIC", name: "iShares Core S&P/TSX Capped Composite Index ETF", exchange: "TSX", assetClass: "equity-etf", region: "CA", whtCategory: "NONE" },
  { symbol: "VCN", name: "Vanguard FTSE Canada All Cap Index ETF", exchange: "TSX", assetClass: "equity-etf", region: "CA", whtCategory: "NONE" },
  { symbol: "ZCN", name: "BMO S&P/TSX Capped Composite Index ETF", exchange: "TSX", assetClass: "equity-etf", region: "CA", whtCategory: "NONE" },
  { symbol: "RY", name: "Royal Bank of Canada", exchange: "TSX", assetClass: "stock", region: "CA", whtCategory: "NONE" },
  { symbol: "TD", name: "Toronto-Dominion Bank", exchange: "TSX", assetClass: "stock", region: "CA", whtCategory: "NONE" },
  { symbol: "BNS", name: "Bank of Nova Scotia", exchange: "TSX", assetClass: "stock", region: "CA", whtCategory: "NONE" },
  { symbol: "ENB", name: "Enbridge Inc.", exchange: "TSX", assetClass: "stock", region: "CA", whtCategory: "NONE" },
  { symbol: "BCE", name: "BCE Inc.", exchange: "TSX", assetClass: "stock", region: "CA", whtCategory: "NONE" },
  { symbol: "CNR", name: "Canadian National Railway", exchange: "TSX", assetClass: "stock", region: "CA", whtCategory: "NONE" },
  { symbol: "SHOP", name: "Shopify Inc.", exchange: "TSX", assetClass: "stock", region: "CA", whtCategory: "NONE" },

  // ---- US-domiciled, holds US equities directly — RRSP shelters the WHT ----
  { symbol: "VOO", name: "Vanguard S&P 500 ETF", exchange: "NYSE Arca", assetClass: "equity-etf", region: "US", whtCategory: "RRSP_EXEMPT" },
  { symbol: "VTI", name: "Vanguard Total Stock Market ETF", exchange: "NYSE Arca", assetClass: "equity-etf", region: "US", whtCategory: "RRSP_EXEMPT" },
  { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", exchange: "NYSE Arca", assetClass: "equity-etf", region: "US", whtCategory: "RRSP_EXEMPT" },
  { symbol: "QQQ", name: "Invesco QQQ Trust", exchange: "NASDAQ", assetClass: "equity-etf", region: "US", whtCategory: "RRSP_EXEMPT" },
  { symbol: "SCHD", name: "Schwab U.S. Dividend Equity ETF", exchange: "NYSE Arca", assetClass: "equity-etf", region: "US", whtCategory: "RRSP_EXEMPT" },
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", assetClass: "stock", region: "US", whtCategory: "RRSP_EXEMPT" },
  { symbol: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ", assetClass: "stock", region: "US", whtCategory: "RRSP_EXEMPT" },
  { symbol: "GOOGL", name: "Alphabet Inc. Class A", exchange: "NASDAQ", assetClass: "stock", region: "US", whtCategory: "RRSP_EXEMPT" },
  { symbol: "AMZN", name: "Amazon.com Inc.", exchange: "NASDAQ", assetClass: "stock", region: "US", whtCategory: "RRSP_EXEMPT" },
  { symbol: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ", assetClass: "stock", region: "US", whtCategory: "RRSP_EXEMPT" },
  { symbol: "META", name: "Meta Platforms Inc.", exchange: "NASDAQ", assetClass: "stock", region: "US", whtCategory: "RRSP_EXEMPT" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", exchange: "NYSE", assetClass: "stock", region: "US", whtCategory: "RRSP_EXEMPT" },
  { symbol: "JNJ", name: "Johnson & Johnson", exchange: "NYSE", assetClass: "stock", region: "US", whtCategory: "RRSP_EXEMPT" },
  { symbol: "KO", name: "Coca-Cola Co.", exchange: "NYSE", assetClass: "stock", region: "US", whtCategory: "RRSP_EXEMPT" },
  { symbol: "PG", name: "Procter & Gamble Co.", exchange: "NYSE", assetClass: "stock", region: "US", whtCategory: "RRSP_EXEMPT" },

  // ---- Canadian-listed wrappers of US equities — WHT baked in everywhere ----
  { symbol: "VFV", name: "Vanguard S&P 500 Index ETF (CAD)", exchange: "TSX", assetClass: "equity-etf", region: "US", whtCategory: "ALWAYS_APPLIES", structureNote: "Canadian-listed, holds the US-listed VOO underneath. Withholding is assessed at the fund level before it reaches any account." },
  { symbol: "VUN", name: "Vanguard U.S. Total Market Index ETF (CAD)", exchange: "TSX", assetClass: "equity-etf", region: "US", whtCategory: "ALWAYS_APPLIES", structureNote: "Canadian-listed, wraps the US-listed VTI. Same fund-level withholding applies in every account." },

  // ---- Fund-of-funds / asset allocation — structure can shift, don't guess ----
  { symbol: "XEQT", name: "iShares Core Equity ETF Portfolio", exchange: "TSX", assetClass: "mixed-etf", region: "MIXED", whtCategory: "VERIFY" },
  { symbol: "VEQT", name: "Vanguard All-Equity ETF Portfolio", exchange: "TSX", assetClass: "mixed-etf", region: "MIXED", whtCategory: "VERIFY" },
  { symbol: "VGRO", name: "Vanguard Growth ETF Portfolio", exchange: "TSX", assetClass: "mixed-etf", region: "MIXED", whtCategory: "VERIFY" },
  { symbol: "XGRO", name: "iShares Core Growth ETF Portfolio", exchange: "TSX", assetClass: "mixed-etf", region: "MIXED", whtCategory: "VERIFY" },
  { symbol: "VBAL", name: "Vanguard Balanced ETF Portfolio", exchange: "TSX", assetClass: "mixed-etf", region: "MIXED", whtCategory: "VERIFY" },
  { symbol: "ZSP", name: "BMO S&P 500 Index ETF", exchange: "TSX", assetClass: "equity-etf", region: "US", whtCategory: "VERIFY" },
  { symbol: "XUU", name: "iShares Core S&P U.S. Total Market Index ETF", exchange: "TSX", assetClass: "equity-etf", region: "US", whtCategory: "VERIFY" },
  { symbol: "HXS", name: "Global X S&P 500 Index Corporate Class ETF", exchange: "TSX", assetClass: "equity-etf", region: "US", whtCategory: "VERIFY", structureNote: "Uses a total-return swap structure, not a direct/wrapped equity holding — withholding tax mechanics are different from a regular ETF. Don't apply the usual rule here." },

  // ---- International — not fully supported in v1 ----
  { symbol: "XEF", name: "iShares Core MSCI EAFE IMI Index ETF", exchange: "TSX", assetClass: "equity-etf", region: "INTL", whtCategory: "INTL_VARIES" },
  { symbol: "VIU", name: "Vanguard FTSE Developed All Cap ex North America Index ETF", exchange: "TSX", assetClass: "equity-etf", region: "INTL", whtCategory: "INTL_VARIES" },
  { symbol: "XEC", name: "iShares Core MSCI Emerging Markets IMI Index ETF", exchange: "TSX", assetClass: "equity-etf", region: "INTL", whtCategory: "INTL_VARIES" },
];

export function findTicker(symbol) {
  const clean = symbol.trim().toUpperCase();
  return TICKERS.find((t) => t.symbol === clean) || null;
}
