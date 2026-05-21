import { NextResponse } from "next/server";

const BASE_URL =
  process.env.PREDICTION_API_BASE_URL ?? "https://mtn.lenhub.net";

export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/api/prediction/bet_of_day/`, {
      next: { revalidate: 300 }, // cache 5 minutes — changes once per day
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch bet of the day." },
      { status: 502 }
    );
  }
}
