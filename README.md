# Domicile — Registered Account Locator

> "Find the right address for every dollar."

Domicile tells Canadian self-directed investors which registered account (FHSA, TFSA, or RRSP) minimises tax drag for a given ETF or stock — and shows how much contribution room they have left before they need to spill into a non-registered account.

**Live demo:** [domicile-rust.vercel.app](https://domicile-rust.vercel.app)

---

## The problem it solves

Every ETF and stock has a registered account where the Canada–US tax treaty treats it best. Most self-directed investors don't know this until they've already lost money to it:

- **US-domiciled holdings** (VOO, AAPL, etc.) — the 15% US withholding tax on dividends is **zero inside an RRSP** under the treaty. Inside a TFSA or FHSA it is quietly deducted, permanently.
- **Canadian-listed wrappers of US equities** (VFV, VUN) — the withholding is taken at the fund level before it reaches any account. No Canadian account type can shelter it, so account choice shifts to other priorities.
- **Pure Canadian equities** — no foreign withholding applies anywhere. TFSA / FHSA shelter growth from Canadian tax entirely; RRSP defers it to withdrawal.

Domicile also tracks contribution room manually — users update it themselves, and the tool tells them whether they have room in the recommended account before buying.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite | Fast dev loop, clean component model |
| Styling | Tailwind CSS v3 | Utility-first, no runtime overhead |
| Serverless API | Vercel Functions (api/lookup.js) | Proxies Twelve Data so the API key never reaches the browser |
| Live data | Twelve Data | Free tier, CORS-safe via the proxy, covers tickers the curated list misses |
| Curated dataset | src/data/tickers.js | Hand-verified withholding classifications for ~40 common Canadian-held tickers |
| Persistence | localStorage | Simple, no auth required for v1 |
| PWA | vite-plugin-pwa | Installable, offline-capable, works as a home-screen app on mobile |
| Email | Resend | Delivers user feedback emails to the owner via a serverless function |

---

## Local development

```bash
# 1. Clone
git clone https://github.com/your-username/domicile.git
cd domicile

# 2. Install
npm install

# 3. Add your environment variables (copy the template first)
cp .env.example .env.local
# Then edit .env.local and fill in:
# TWELVE_DATA_API_KEY=your_key_here       (from twelvedata.com, optional)
# RESEND_API_KEY=re_your_key_here         (from resend.com, needed for feedback emails)
# FEEDBACK_EMAIL=your@email.com           (where feedback submissions get sent to)

# 4. Run
npm run dev
```

The /api/lookup serverless function runs automatically via Vercel CLI locally. For a purely local dev run without the function, the app degrades gracefully — unknown tickers fall through to the manual classification flow.

---

## Deploy to Vercel (5 minutes)

1. Push this repo to GitHub.
2. Go to vercel.com > Add New Project > import your repo.
3. In Environment Variables, add all three:

| Variable | Where to get it |
|---|---|
| `TWELVE_DATA_API_KEY` | Free key from [twelvedata.com](https://twelvedata.com) |
| `RESEND_API_KEY` | Free key from [resend.com](https://resend.com) — needed for feedback emails |
| `FEEDBACK_EMAIL` | The email address where feedback form submissions should be delivered |

4. Click Deploy. Vercel auto-detects Vite + the /api folder.
5. After deploy, go to Deployments > three-dot menu > Promote to Production to make it live on your main URL.

No additional config needed — the vercel.json is intentionally omitted because Vercel zero-config detects this stack correctly.

---

## Project structure

```
domicile/
├── api/
│   └── lookup.js              # Serverless function — proxies Twelve Data
├── public/
│   ├── favicon.svg
│   ├── icon-192.png
│   └── icon-512.png
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── AddressCard.jsx    # Signature result component — the deed
│   │   ├── ManualClassify.jsx # Fallback when API cannot classify
│   │   ├── BuildingsPanel.jsx # FHSA/TFSA/RRSP room editor
│   │   └── Footer.jsx
│   ├── data/
│   │   ├── tickers.js         # Curated classification dataset
│   │   └── rules.js           # Pure recommendation logic (no UI)
│   ├── hooks/
│   │   └── useAccounts.js     # Contribution room state + localStorage persistence
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── tailwind.config.js
└── vite.config.js
```

---

## Deliberate v1 scope decisions (and what v2 looks like)

| Decision | Reason | V2 path |
|---|---|---|
| Manual room entry | No bank integration — avoids auth complexity that breaks vibe-coded apps in production | Plaid or Flinks open-banking integration |
| Curated ticker list + API fallback | Free API cannot reliably detect fund-of-funds structure | Expand curated list; fund-of-funds detection via holdings endpoint |
| FHSA/TFSA/RRSP only | Scope matches the investor profile this was designed for | Add RESP rules; refine non-reg FTC guidance |
| No auth | localStorage is enough for a single user | Supabase auth + sync across devices |
| US/Canada only | International WHT is too country-specific to get right quickly | Per-country withholding table |

---

## Disclaimer

Educational tool, not financial or tax advice. Rules are simplified, fund structures can change without notice, and the curated ticker list is hand-checked but not exhaustive. Confirm anything that matters with the fund provider's tax documentation or a qualified professional before acting on it.
