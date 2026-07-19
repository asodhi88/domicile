# Domicile — Registered Account Locator

> "FHSA, TFSA, or RRSP — know where to hold it."

Domicile tells Canadian self-directed investors which registered account (FHSA, TFSA, or RRSP) minimises tax drag for a given ETF or stock — and shows how much contribution room they have left before they need to spill into a non-registered account.

**Live demo:** domicile-mvp.vercel.app

---

## The problem it solves

Every ETF and stock has a registered account where the Canada–US tax treaty treats it best. Most self-directed investors don't know this until they've already lost money to it:

- **US-domiciled holdings** (VOO, AAPL, etc.) — the 15% US withholding tax on dividends is **zero inside an RRSP** under the treaty. Inside a TFSA or FHSA it is quietly deducted, permanently.
- **Canadian-listed wrappers of US equities** (VFV, VUN) — the withholding is taken at the fund level before it reaches any account. No Canadian account type can shelter it, so account choice shifts to other priorities.
- **Pure Canadian equities** — no foreign withholding applies anywhere. TFSA / FHSA shelter growth from Canadian tax entirely; RRSP defers it to withdrawal.

---

## What it does

**Search first, setup optional.** Enter a ticker and you get the full recommendation immediately — no account setup required. Contribution room is a second, optional step that refines the answer; it never gates it. Blank room is treated as *unknown*, not as `$0`, so a partially-configured account is never wrongly ruled out.

- **Account recommendation** — ranks FHSA / TFSA / RRSP by withholding treatment for the specific holding, falling back to non-registered only when every registered account is explicitly full. Shows the reasoning and the alternates considered.
- **Room tracking** *(optional)* — enter what's left in each account and every result tells you whether the holding fits. Log a purchase and it deducts from that account.
- **Tax-drag estimate** — enter an amount and see the annual withholding cost in dollars, labelled sheltered / permanent / recoverable / unavoidable.
- **Delayed price** — current price and day change on the result card, sourced from Twelve Data and clearly marked as delayed (never presented as real-time).
- **Manual classification** — when a ticker isn't in the curated list and the API can't classify it confidently, the user picks the category rather than the app guessing.
- **Light / dark themes** — light by default; the choice persists and is applied before first paint to avoid a flash.
- **Installable PWA**, feedback form, and back-to-top.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite | Fast dev loop, clean component model |
| Styling | Tailwind CSS v3 | Utility-first, no runtime overhead |
| Theming | CSS variables behind Tailwind tokens | One set of utilities drives both themes; opacity modifiers still work |
| Serverless API | Vercel Functions (`api/`) | Keeps the Twelve Data and Resend keys server-side |
| Market data | Twelve Data | Free tier; delayed quotes, cached to stay inside the rate limit |
| Curated dataset | `src/data/tickers.js` | Hand-verified withholding classifications for ~60 commonly held tickers |
| Persistence | localStorage | Simple, no auth required |
| PWA | vite-plugin-pwa | Installable, offline-capable, works as a home-screen app on mobile |
| Email | Resend | Delivers feedback-form submissions to the owner |

No runtime dependencies beyond React itself.

---

## Serverless functions

| Route | Method | Purpose |
|---|---|---|
| `/api/lookup` | GET | Classifies a ticker that isn't in the curated list, via Twelve Data symbol search. |
| `/api/quote` | GET | Returns a trimmed delayed quote. Cached in memory for 15 min per symbol, plus a matching `Cache-Control` for the Vercel edge — one upstream call per symbol per 15 min rather than one per visitor. |
| `/api/feedback` | POST | Emails a feedback submission via Resend. |

All three fail soft: on a missing key, rate limit, or upstream error they return HTTP 200 with a payload the frontend can detect, so the UI hides the affected piece instead of showing an error.

---

## Local development

```bash
# 1. Clone
git clone https://github.com/asodhi88/domicile.git
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

The plain Vite dev server does not serve the `api/` folder — that's a Vercel feature. `vite.config.js` therefore includes a small dev-only middleware that runs the **GET** functions (`/api/lookup`, `/api/quote`) locally, reading your keys from `.env.local`. POST endpoints (`/api/feedback`) only run on a real deployment.

Without a Twelve Data key the app still works: unknown tickers fall through to manual classification, and the price simply doesn't render.

```bash
npm run build   # production build
npm run lint    # eslint
```

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to vercel.com > Add New Project > import your repo.
3. In Environment Variables, add:

| Variable | Where to get it |
|---|---|
| `TWELVE_DATA_API_KEY` | Free key from [twelvedata.com](https://twelvedata.com) — enables live lookup and prices |
| `RESEND_API_KEY` | Free key from [resend.com](https://resend.com) — needed for feedback emails |
| `FEEDBACK_EMAIL` | The email address where feedback form submissions should be delivered |

4. Click Deploy. Vercel auto-detects Vite + the `/api` folder.
5. After deploy, go to Deployments > three-dot menu > Promote to Production to make it live on your main URL.

No additional config needed — `vercel.json` is intentionally omitted because Vercel zero-config detects this stack correctly.

---

## Project structure

```
domicile/
├── api/
│   ├── lookup.js              # Classifies uncurated tickers (Twelve Data)
│   ├── quote.js               # Delayed quote + 15 min cache
│   └── feedback.js            # Feedback email via Resend
├── public/
│   ├── favicon.svg
│   ├── icon-192.png
│   └── icon-512.png
├── src/
│   ├── components/
│   │   ├── Header.jsx         # Wordmark, how-it-works link, theme toggle
│   │   ├── TickerSearch.jsx   # Step 1 — the search entry point
│   │   ├── AddressCard.jsx    # Signature result component — the deed
│   │   ├── PriceTag.jsx       # Delayed price + day change
│   │   ├── ManualClassify.jsx # Fallback when the API cannot classify
│   │   ├── BuildingsPanel.jsx # Step 2 — FHSA/TFSA/RRSP room editor
│   │   ├── HowItWorks.jsx     # Educational section
│   │   ├── FeedbackForm.jsx
│   │   ├── ThemeToggle.jsx    # Light/dark switch
│   │   ├── BackToTop.jsx
│   │   └── Footer.jsx
│   ├── data/
│   │   ├── tickers.js         # Curated classification dataset
│   │   └── rules.js           # Pure recommendation logic (no UI)
│   ├── hooks/
│   │   └── useAccounts.js     # Contribution room state + localStorage persistence
│   ├── App.jsx
│   ├── index.css              # Tailwind layers + theme variables
│   └── main.jsx
├── .env.example
├── tailwind.config.js
└── vite.config.js             # Vite + PWA + dev-only api/ middleware
```

`rules.js` holds all the recommendation logic and is pure — it takes a classified ticker plus the user's room and returns a ranked answer, with no UI or network concerns.

---

## Accessibility and design notes

- Body copy is capped at roughly 65–75 characters per line; the display serif (Fraunces) is reserved for short headlines, with Inter for anything longer than a sentence.
- Text colours meet WCAG AA contrast in both light and dark themes.
- Animations respect `prefers-reduced-motion` via a global rule in `index.css`.
- Decorative SVG is `aria-hidden`; interactive elements are real buttons and links with visible focus states.

---

## Deliberate scope decisions (and what comes next)

| Decision | Reason | Next step |
|---|---|---|
| Manual room entry | No bank integration — avoids auth complexity that breaks vibe-coded apps in production | Plaid or Flinks open-banking integration |
| Curated ticker list + API fallback | Free API cannot reliably detect fund-of-funds structure | Expand curated list; fund-of-funds detection via holdings endpoint |
| FHSA/TFSA/RRSP only | Scope matches the investor profile this was designed for | Add RESP rules; refine non-reg FTC guidance |
| No auth | localStorage is enough for a single user | Supabase auth + sync across devices |
| US/Canada only | International WHT is too country-specific to get right quickly | Per-country withholding table |
| Hand-set dividend yields | Free tier has no reliable yield endpoint; used only for the dollar estimate | Pull yields from a data provider and refresh them |

---

## Disclaimer

Educational tool, not financial or tax advice. Rules are simplified, fund structures can change without notice, and the curated ticker list is hand-checked but not exhaustive. Confirm anything that matters with the fund provider's tax documentation or a qualified professional before acting on it.
