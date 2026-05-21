import { NextResponse } from "next/server";

const BASE_URL =
  process.env.PREDICTION_API_BASE_URL ?? "https://mtn.lenhub.net";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const params = new URLSearchParams();

  const page = searchParams.get("page");
  const pageSize = searchParams.get("page_size");
  const search = searchParams.get("search");

  if (page) params.set("page", page);
  if (pageSize) params.set("page_size", pageSize);
  if (search) params.set("search", search);

  try {
    const res = await fetch(
      `${BASE_URL}/api/prediction/general/?${params.toString()}`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch predictions." },
      { status: 502 }
    );
  }
}
