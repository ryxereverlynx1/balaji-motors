import { NextRequest, NextResponse } from "next/server";
import { getFinanceSettings, updateFinanceSettings } from "@/lib/db";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await getFinanceSettings();
    return NextResponse.json({ success: true, settings });
  } catch {
    return NextResponse.json({ error: "Failed to fetch finance settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { interestRatePerAnnum, minDownPaymentPercent, minDownPaymentAmount } = body;

    const rate = Number(interestRatePerAnnum);
    if (isNaN(rate) || rate < 0 || rate > 50) {
      return NextResponse.json(
        { error: "Valid annual interest rate percentage between 0% and 50% is required." },
        { status: 400 }
      );
    }

    const minPct = Number(minDownPaymentPercent);
    if (isNaN(minPct) || minPct < 0 || minPct > 90) {
      return NextResponse.json(
        { error: "Valid minimum down payment percentage between 0% and 90% is required." },
        { status: 400 }
      );
    }

    const minAmt = minDownPaymentAmount !== undefined ? Number(minDownPaymentAmount) : 0;

    const updated = await updateFinanceSettings(
      {
        interestRatePerAnnum: rate,
        minDownPaymentPercent: minPct,
        minDownPaymentAmount: isNaN(minAmt) ? 0 : minAmt,
      },
      session.email
    );

    return NextResponse.json({ success: true, settings: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update finance settings" }, { status: 500 });
  }
}