"use server";

import Anthropic from "@anthropic-ai/sdk";

// Vision model used to read the invoice photo. Opus 4.8 gives the most
// accurate extraction; switch to "claude-sonnet-4-6" or "claude-haiku-4-5"
// to lower the per-scan cost if needed.
const INVOICE_MODEL = "claude-opus-4-8";

export type ScannedInvoiceItem = {
  name: string;
  barcode: string;
  quantity: number;
  unitPrice: number;
};

export type ScanInvoiceResult =
  | {
      ok: true;
      supplier: string;
      invoiceDate: string;
      items: ScannedInvoiceItem[];
    }
  | { ok: false; error: "no-key" | "empty" | "failed"; message?: string };

const INVOICE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    supplier: {
      type: "string",
      description: "Faturayı kesen tedarikçi / satıcı firma ünvanı. Bulunamazsa boş bırak.",
    },
    invoice_date: {
      type: "string",
      description: "Fatura tarihi, mümkünse GG.AA.YYYY biçiminde. Bulunamazsa boş bırak.",
    },
    items: {
      type: "array",
      description: "Faturadaki satır satır ürün kalemleri.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string", description: "Ürün / mal adı." },
          barcode: { type: "string", description: "Varsa ürün barkodu, yoksa boş." },
          quantity: { type: "number", description: "Satın alınan miktar/adet. Bilinmiyorsa 0." },
          unit_price: { type: "number", description: "KDV hariç birim alış fiyatı (TL). Bilinmiyorsa 0." },
        },
        required: ["name", "barcode", "quantity", "unit_price"],
      },
    },
  },
  required: ["supplier", "invoice_date", "items"],
} as const;

type RawInvoice = {
  supplier?: string;
  invoice_date?: string;
  items?: { name?: string; barcode?: string; quantity?: number; unit_price?: number }[];
};

export async function scanInvoiceAction(
  base64Image: string,
  mediaType: string
): Promise<ScanInvoiceResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { ok: false, error: "no-key" };

  const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;
  const media = (allowed.includes(mediaType as (typeof allowed)[number])
    ? mediaType
    : "image/jpeg") as (typeof allowed)[number];

  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: INVOICE_MODEL,
      max_tokens: 8000,
      system:
        "Sen bir Türk perakende işletmesi için fatura okuma asistanısın. Sana verilen tedarikçi " +
        "alış faturası fotoğrafından tedarikçi ünvanını, fatura tarihini ve satır satır ürün " +
        "kalemlerini (ad, varsa barkod, miktar, birim alış fiyatı) çıkar. Tahmin etme; net " +
        "okuyamadığın alanı boş ya da 0 bırak. Yalnızca istenen yapılandırılmış çıktıyı üret.",
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: media, data: base64Image } },
            {
              type: "text",
              text: "Bu alış faturasındaki tedarikçiyi, fatura tarihini ve tüm ürün kalemlerini çıkar.",
            },
          ],
        },
      ],
      output_config: { format: { type: "json_schema", schema: INVOICE_SCHEMA } },
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return { ok: false, error: "empty" };
    }

    let parsed: RawInvoice;
    try {
      parsed = JSON.parse(textBlock.text) as RawInvoice;
    } catch {
      return { ok: false, error: "failed", message: "Fatura verisi çözümlenemedi." };
    }

    const items: ScannedInvoiceItem[] = (parsed.items ?? [])
      .map((item) => ({
        name: (item.name ?? "").trim(),
        barcode: (item.barcode ?? "").trim(),
        quantity: Number(item.quantity) || 0,
        unitPrice: Number(item.unit_price) || 0,
      }))
      .filter((item) => item.name);

    return {
      ok: true,
      supplier: (parsed.supplier ?? "").trim(),
      invoiceDate: (parsed.invoice_date ?? "").trim(),
      items,
    };
  } catch (error) {
    const messageText = error instanceof Error ? error.message : "Bilinmeyen hata";
    return { ok: false, error: "failed", message: messageText };
  }
}

export async function hasInvoiceScanEnabledAction(): Promise<boolean> {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}
