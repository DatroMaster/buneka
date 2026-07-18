export const FEATURE_DEFINITIONS = [
  { code: "price_query", label: "Barkodla fiyat sorgulama" },
  { code: "product_create", label: "Ürün ekleme ve katalog" },
  { code: "sale_create", label: "Satış kaydı" },
  { code: "daily_cash", label: "Günlük kasa raporu" },
  { code: "stock_tracking", label: "Stok takibi" },
  { code: "profit_details", label: "Kâr / marj görünürlüğü" },
  { code: "reports", label: "Raporlar" },
  { code: "multi_device", label: "Çoklu cihaz" },
  { code: "campaign_access", label: "Veresiye ve kampanya erişimi" },
] as const;

export type FeatureCode = (typeof FEATURE_DEFINITIONS)[number]["code"];
export type PlanCode = "PRICE" | "CASH" | "STOCK" | "PATRON";

export const PLAN_FEATURES: Record<PlanCode, readonly FeatureCode[]> = {
  PRICE: ["price_query", "product_create", "reports"],
  CASH: ["price_query", "product_create", "sale_create", "daily_cash", "reports"],
  STOCK: ["price_query", "product_create", "sale_create", "daily_cash", "stock_tracking", "profit_details", "reports"],
  PATRON: FEATURE_DEFINITIONS.map((feature) => feature.code),
};

const PLAN_CODE_ALIASES: Record<string, PlanCode> = {
  PRICE: "PRICE",
  CASH: "CASH",
  STOCK: "STOCK",
  PATRON: "PATRON",
  "BUNEKA FIYAT": "PRICE",
  "BUNEKA FİYAT": "PRICE",
  "BUNEKA KASA": "CASH",
  "BUNEKA STOK": "STOCK",
  "BUNEKA PATRON": "PATRON",
};

export function normalizePlanCode(codeOrName: string | null | undefined): PlanCode | null {
  if (!codeOrName) return null;
  return PLAN_CODE_ALIASES[codeOrName.trim().toLocaleUpperCase("tr-TR")] || null;
}

export function getFeatureCodesForPlan(codeOrName: string | null | undefined): FeatureCode[] {
  const planCode = normalizePlanCode(codeOrName);
  return planCode ? [...PLAN_FEATURES[planCode]] : [];
}

export function getFeatureLabels(featureCodes: readonly string[]) {
  const featureSet = new Set(featureCodes);
  return FEATURE_DEFINITIONS.filter((feature) => featureSet.has(feature.code)).map((feature) => feature.label);
}

export function isFeatureCode(value: string | null | undefined): value is FeatureCode {
  return FEATURE_DEFINITIONS.some((feature) => feature.code === value);
}
