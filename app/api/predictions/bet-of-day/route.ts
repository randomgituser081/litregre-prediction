import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const BASE_URL =
  process.env.PREDICTION_API_BASE_URL ?? "https://mtn.lenhub.net";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.backendToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${BASE_URL}/api/prediction/bet_of_day/`, {
      headers: {
        Authorization: `Bearer ${session.user.backendToken}`,
      },
      next: { revalidate: 300 },
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
