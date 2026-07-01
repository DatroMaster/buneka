export const BUNEKA_BRAND = {
  name: "Buneka",
  domain: "buneka.com",
  slogan: "Barkodu okut, fiyati gor, satisini bil."
} as const;

export const PLAN_CODES = ["PRICE", "CASH", "STOCK", "PATRON"] as const;

export type PlanCode = (typeof PLAN_CODES)[number];
