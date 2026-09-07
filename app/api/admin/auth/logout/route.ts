import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session";
import { logActivity } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySession(token);

    if (session) {
      await logActivity({
        adminEmail: session.email,
        action: "logout",
        entityType: "auth",
        details: "Admin logged out",
      });
    }

    const res = NextResponse.json({ success: true, message: "Logged out successfully" });
    res.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return res;
  } catch {
    return NextResponse.json({ success: true });
  }
}