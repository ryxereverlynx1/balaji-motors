import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session";
import { getAdminByEmail } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySession(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = await getAdminByEmail(session.email);

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.adminId,
      email: session.email,
      name: admin ? admin.name : "Balaji Motors Admin",
      role: session.role,
    },
  });
}