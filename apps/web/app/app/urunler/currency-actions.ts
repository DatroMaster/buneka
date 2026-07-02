"use server";

import { getCurrencyRates } from "@/lib/currency/tcmb";

export async function fetchUsdRateAction() {
  const rates = await getCurrencyRates();
  return rates;
}
