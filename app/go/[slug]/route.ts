import { redirect } from "next/navigation";
import { BETTING_SITES } from "@/lib/mockData";
import { NextResponse } from "next/server";

const AFFILIATE_MAP: Record<string, string> = {
  betano: "https://betano.com",
  stake: "https://stake.com",
  "1xbet": "https://1xbet.com",
  betjara: "https://betjara.com",
  bet9ja: "https://bet9ja.com",
  betway: "https://betway.com",
};

// Populate from BETTING_SITES too
for (const site of BETTING_SITES) {
  if (!AFFILIATE_MAP[site.slug]) {
    AFFILIATE_MAP[site.slug] = site.affiliateUrl;
  }
}

export function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const url = AFFILIATE_MAP[params.slug] ?? "https://litregreprediction.com/betting-sites";
  return NextResponse.redirect(url, { status: 302 });
}
