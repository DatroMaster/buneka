import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  const realIp = headerList.get("x-real-ip");
  const vercelIp = headerList.get("x-vercel-forwarded-for");
  const ip = (forwardedFor || vercelIp || realIp || "")
    .split(",")
    .map((value) => value.trim())
    .find(Boolean);

  return NextResponse.json({ ip: ip || "gizli" });
}
