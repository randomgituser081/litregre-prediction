import { NextResponse } from "next/server";
import { createUser, extractError } from "@/lib/predictionApi";
import { normalizeNigerianPhone } from "@/lib/phone";

interface RegisterBody {
  phone?: string;
  pin?: string;
  confirmPin?: string;
  agreed?: boolean;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RegisterBody;
    const number = normalizeNigerianPhone(body.phone ?? "");
    const pin = body.pin ?? "";
    const confirmPin = body.confirmPin ?? "";
    const agreed = Boolean(body.agreed);

    // Client-side mirrors these too, but validate server-side as well
    if (!/^234\d{10}$/.test(number)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Invalid phone number. Use a Nigerian number, e.g. 08012345678.",
        },
        { status: 400 }
      );
    }

    if (!/^\d{4,6}$/.test(pin)) {
      return NextResponse.json(
        { ok: false, error: "PIN must be 4 to 6 digits." },
        { status: 400 }
      );
    }

    if (pin !== confirmPin) {
      return NextResponse.json(
        { ok: false, error: "PINs do not match." },
        { status: 400 }
      );
    }

    if (!agreed) {
      return NextResponse.json(
        { ok: false, error: "You must agree to the terms before registering." },
        { status: 400 }
      );
    }

    const result = await createUser({
      number,
      pin,
      confirm_pin: confirmPin,
    });

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: extractError(result.data) },
        { status: result.status }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Account created successfully. You can now sign in.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Network error. Please try again." },
      { status: 500 }
    );
  }
}
