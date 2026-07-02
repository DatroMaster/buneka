const TCMB_URL = "https://www.tcmb.gov.tr/kurlar/today.xml";
const REVALIDATE_SECONDS = 60 * 60 * 4;

export type CurrencyRates = {
  usdToTry: number;
  eurToTry: number;
};

function extractSellingRate(xml: string, code: "USD" | "EUR"): number | null {
  const block = xml.match(new RegExp(`<Currency[^>]*Kod="${code}"[^>]*>([\\s\\S]*?)</Currency>`));
  if (!block) return null;

  const selling = block[1].match(/<ForexSelling>([\d.,]*)<\/ForexSelling>/);
  if (!selling || !selling[1]) return null;

  const value = Number(selling[1].replace(",", "."));
  return Number.isFinite(value) && value > 0 ? value : null;
}

/** Fetches today's USD/EUR selling rate from TCMB. Returns null on any failure. */
export async function getCurrencyRates(): Promise<CurrencyRates | null> {
  try {
    const response = await fetch(TCMB_URL, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!response.ok) return null;

    const xml = await response.text();
    const usdToTry = extractSellingRate(xml, "USD");
    const eurToTry = extractSellingRate(xml, "EUR");
    if (!usdToTry || !eurToTry) return null;

    return { usdToTry, eurToTry };
  } catch {
    return null;
  }
}

/** Converts a USD amount to TRY, rounded up to the nearest whole lira. */
export function convertUsdToTry(amountUsd: number, usdToTry: number): number {
  return Math.ceil(amountUsd * usdToTry);
}
