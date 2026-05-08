import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const phone = (searchParams.get("phone") ?? "").replace(/\D/g, "");
  const token = searchParams.get("token") ?? "";

  if (phone.length < 10 || !token) {
    return NextResponse.redirect(`${origin}/login?invalidLink=1`);
  }

  // Demo flow: this endpoint extracts phone from URL and marks registration verified.
  // In production, verify token and persist user state before redirect.
  return NextResponse.redirect(`${origin}/login?verified=1&phone=${encodeURIComponent(phone)}`);
}
