import type { PlanCode } from "@buneka/core";

export const FEATURE_CODES = [
  "price_query",
  "product_create",
  "sale_create",
  "daily_cash",
  "stock_tracking",
  "profit_details",
  "reports",
  "serenis_note",
  "multi_device",
  "campaign_access"
] as const;

export type FeatureCode = (typeof FEATURE_CODES)[number];

export const PLAN_FEATURES: Record<PlanCode, readonly FeatureCode[]> = {
  PRICE: ["price_query", "product_create", "reports"],
  CASH: ["price_query", "product_create", "sale_create", "daily_cash", "reports"],
  STOCK: [
    "price_query",
    "product_create",
    "sale_create",
    "daily_cash",
    "stock_tracking",
    "profit_details",
    "reports"
  ],
  PATRON: [...FEATURE_CODES]
} as const;
