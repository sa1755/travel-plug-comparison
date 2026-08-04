import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const countryCode = (await headers()).get("x-vercel-ip-country") ?? undefined;
  return NextResponse.json({ countryCode }, { headers: { "Cache-Control": "no-store" } });
}
