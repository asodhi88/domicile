// src/data/rules.js
//
// Pure logic, no UI. Takes a classified ticker + the user's current room
// across FHSA / TFSA / RRSP and returns a ranked list of accounts with
// plain-English reasoning, ending in a non-registered fallback when
// registered room runs out.

const ACCOUNT_LABEL = {
  RRSP: "RRSP",
  TFSA: "TFSA",
  FHSA: "FHSA",
  NONREG: "Non-registered",
};

// Priority order of registered accounts per withholding category.
// Non-registered is never first — it's always the fallback once
// registered room is exhausted.
const PRIORITY = {
  RRSP_EXEMPT: ["RRSP", "TFSA", "FHSA"],
  ALWAYS_APPLIES: ["TFSA", "FHSA", "RRSP"],
  NONE: ["TFSA", "FHSA", "RRSP"],
};

function reasonFor(category, account) {
  switch (category) {
    case "RRSP_EXEMPT":
      if (account === "RRSP")
        return "This is a US-domiciled holding, taxed directly by the US. The Canada-US tax treaty exempts US dividends from withholding tax specifically inside an RRSP — full amount, no leakage.";
      if (account === "NONREG")
        return "RRSP room is gone. In a non-registered account the 15% US withholding tax still applies, but you can claim it back as a foreign tax credit on your return — so it's recoverable, not lost.";
      // Shown both as the winner (when RRSP room is exhausted) and as an
      // alternate under an RRSP recommendation, so it can't assume the RRSP
      // is unavailable.
      return "This is a US-domiciled holding, so the 15% US withholding tax applies here and there's no mechanism to recover it inside a TFSA or FHSA — a quiet, permanent leak. Worth using only once RRSP room is gone.";
    case "ALWAYS_APPLIES":
      if (account === "NONREG")
        return "This fund wraps US equities at the Canadian-fund level, so the ~15% withholding is deducted before it ever reaches your account — RRSP included. Account choice doesn't change that here. In a non-registered account you can at least claim a foreign tax credit for it.";
      return "This fund wraps US equities at the Canadian-fund level, so the ~15% withholding is deducted before it ever reaches your account — moving it to an RRSP wouldn't change that. Keeping it in a registered account still shelters the rest of the growth from Canadian tax, which is the main lever left.";
    case "NONE":
      if (account === "NONREG")
        return "No US or foreign withholding tax applies to this holding either way. Outside a registered account you'll pay regular Canadian tax on dividends and capital gains, so this is the least efficient option here — only use it once FHSA, TFSA, and RRSP room are all gone.";
      return "Pure Canadian equity exposure — no foreign withholding tax in any account. The choice here is about general tax shelter, not withholding: TFSA/FHSA gains are never taxed, RRSP gains are taxed later on withdrawal.";
    default:
      return "";
  }
}

export function recommend(ticker, room) {
  if (!ticker) return null;

  if (ticker.whtCategory === "INTL_VARIES") {
    return {
      status: "unsupported",
      message:
        "This holds international (non-US) equities. Withholding rates vary by country and the RRSP shortcut that works for US assets doesn't generalize the same way — Domicile doesn't have confident rules for this yet. Treat any guess here as approximate, and check the fund's own tax documentation.",
    };
  }

  if (ticker.whtCategory === "VERIFY") {
    return {
      status: "verify",
      message:
        ticker.structureNote ||
        "This is a fund-of-funds or asset-allocation product. Its underlying structure can change over time and determines whether RRSP shelters any withholding tax — we don't guess on these. Check the provider's tax / fund facts page before assuming an RRSP advantage.",
    };
  }

  const order = PRIORITY[ticker.whtCategory] || ["TFSA", "FHSA", "RRSP"];
  const steps = [];

  // Room the user hasn't filled in yet is *unknown*, not zero. Only an
  // explicitly entered $0 blocks an account. This is what lets someone
  // search with no setup at all and still get the real recommendation —
  // the advice is about tax treatment, not about whether we know their room.
  for (const account of order) {
    const entered = room?.[account];
    const known = entered !== null && entered !== undefined && entered !== "";
    const available = known ? Number(entered) : null;
    steps.push({
      account,
      label: ACCOUNT_LABEL[account],
      available,
      roomKnown: known,
      reason: reasonFor(ticker.whtCategory, account),
      blocked: known && available <= 0,
    });
  }

  const winner = steps.find((s) => !s.blocked);

  if (winner) {
    return {
      status: "assigned",
      account: winner.account,
      label: winner.label,
      reason: winner.reason,
      available: winner.available,
      roomKnown: winner.roomKnown,
      alternates: steps.filter((s) => s.account !== winner.account),
    };
  }

  // Every registered account has a known balance of $0 — fall back to
  // non-registered. (Unreachable while any account's room is unknown.)
  return {
    status: "fallback",
    account: "NONREG",
    label: ACCOUNT_LABEL.NONREG,
    reason: reasonFor(ticker.whtCategory, "NONREG", ticker),
    roomKnown: true,
    steps,
  };
}

// ---------------------------------------------------------------------------
// Tax drag dollar estimate
// ---------------------------------------------------------------------------
// Turns "this leaks withholding tax" into a concrete annual dollar figure,
// given how much someone is planning to invest. Only meaningful where
// withholding tax can actually apply (RRSP_EXEMPT / ALWAYS_APPLIES) and
// where we have a yield to calculate against.
//
// Returns null when there's nothing useful to show (no withholding tax
// possible here, or we don't have a confident yield to calculate with).
// Never fabricates a number for VERIFY / INTL_VARIES / NONE tickers.

const US_WHT_RATE = 0.15;

export function estimateTaxDrag(ticker, accountKey, amount) {
  if (!ticker || !amount || amount <= 0) return null;
  if (!["RRSP_EXEMPT", "ALWAYS_APPLIES"].includes(ticker.whtCategory)) return null;
  if (ticker.yieldPct == null) {
    return { status: "unavailable" };
  }

  const annualDrag = amount * (ticker.yieldPct / 100) * US_WHT_RATE;

  if (ticker.whtCategory === "RRSP_EXEMPT") {
    if (accountKey === "RRSP") {
      return { status: "sheltered", amount: 0 };
    }
    if (accountKey === "NONREG") {
      return { status: "recoverable", amount: annualDrag };
    }
    // TFSA or FHSA — no mechanism to recover it here.
    return { status: "permanent", amount: annualDrag };
  }

  // ALWAYS_APPLIES — the fund-level withholding happens no matter which
  // account holds it. Non-registered at least allows a foreign tax credit.
  return {
    status: accountKey === "NONREG" ? "unavoidable_recoverable" : "unavoidable",
    amount: annualDrag,
  };
}
