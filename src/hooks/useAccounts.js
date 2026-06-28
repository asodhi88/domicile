// src/hooks/useAccounts.js
import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "domicile.accounts.v1";

const DEFAULT_STATE = {
  FHSA: null,
  TFSA: null,
  RRSP: null,
  updatedAt: null,
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

export function useAccounts() {
  const [accounts, setAccounts] = useState(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  }, [accounts]);

  const setRoom = useCallback((account, value) => {
    setAccounts((prev) => ({
      ...prev,
      [account]: value === "" ? null : Math.max(0, Number(value)),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const logPurchase = useCallback((account, amount) => {
    setAccounts((prev) => {
      const current = prev[account] ?? 0;
      return {
        ...prev,
        [account]: Math.max(0, current - Number(amount || 0)),
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const isSetUp = accounts.FHSA !== null || accounts.TFSA !== null || accounts.RRSP !== null;

  return {
    accounts: { FHSA: accounts.FHSA ?? 0, TFSA: accounts.TFSA ?? 0, RRSP: accounts.RRSP ?? 0 },
    rawAccounts: accounts,
    isSetUp,
    setRoom,
    logPurchase,
  };
}
