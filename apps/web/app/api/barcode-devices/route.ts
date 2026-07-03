import { NextResponse } from "next/server";
import { barcodeDevices } from "@/lib/barcode-devices";

export const dynamic = "force-dynamic";

type LiveDevice = (typeof barcodeDevices)[number] & {
  livePrice: string;
  priceSource: "live" | "fallback";
  checkedAt: string;
};

function extractPrice(html: string) {
  const normalized = html
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .replace(/<[^>]+>/g, " ");

  const patterns = [
    /kargo dahil en ucuz fiyat seçeneği\s*([0-9]{1,3}(?:\.[0-9]{3})*,[0-9]{2})\s*TL/i,
    /Kargo Dahil En Ucuz\s*([0-9]{1,3}(?:\.[0-9]{3})\s*,[0-9]{2})\s*TL/i,
    /En Ucuz\s*%?\d*\s*([0-9]{1,3}(?:\.[0-9]{3})*,[0-9]{2})\s*TL/i,
    /([0-9]{1,3}(?:\.[0-9]{3})*,[0-9]{2})\s*TL\s*(?:Ücretsiz kargo|\+\s*[0-9])/i,
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match?.[1]) {
      return `${match[1].replace(/\s+/g, "")} TL`;
    }
  }

  return null;
}

async function fetchPrice(device: (typeof barcodeDevices)[number]): Promise<LiveDevice> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6500);

  try {
    const response = await fetch(device.sourceUrl, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.7,en;q=0.6",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
      },
    });
    const html = await response.text();
    const price = response.ok ? extractPrice(html) : null;

    return {
      ...device,
      livePrice: price || device.fallbackPrice,
      priceSource: price ? "live" : "fallback",
      checkedAt: new Date().toISOString(),
    };
  } catch {
    return {
      ...device,
      livePrice: device.fallbackPrice,
      priceSource: "fallback",
      checkedAt: new Date().toISOString(),
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  const devices = await Promise.all(barcodeDevices.map(fetchPrice));
  return NextResponse.json({ devices });
}
