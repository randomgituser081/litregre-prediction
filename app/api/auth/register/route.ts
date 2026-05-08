import { NextResponse } from "next/server";

type RegisterBody = {
  phone?: string;
  pin?: string;
  agreed?: boolean;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RegisterBody;
    const phone = (body.phone ?? "").replace(/\D/g, "");
    const pin = body.pin ?? "";
    const agreed = Boolean(body.agreed);

    if (phone.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Invalid phone number." },
        { status: 400 }
      );
    }

    if (!/^\d{4,6}$/.test(pin)) {
      return NextResponse.json(
        { ok: false, error: "PIN must be 4 to 6 digits." },
        { status: 400 }
      );
    }

    if (!agreed) {
      return NextResponse.json(
        { ok: false, error: "You must agree to terms before registering." },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const token = Buffer.from(`${phone}:${Date.now()}`).toString("base64url");

    // Phone number is intentionally attached to the endpoint URL
    // so your backend can extract it directly from query params.
    const verificationLink = `${baseUrl}/api/auth/complete-registration?phone=${encodeURIComponent(phone)}&token=${encodeURIComponent(token)}`;

    return NextResponse.json({
      ok: true,
      message: "Registration started. Verification link sent.",
      verificationLink,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }
}
