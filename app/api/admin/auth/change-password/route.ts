import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken, comparePassword, hashPassword } from "@/lib/auth";
import { getAdminByEmail, saveAdminUser, logActivity } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "All password fields are required." }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
    }

    const admin = await getAdminByEmail(session.email);
    if (!admin) {
      return NextResponse.json({ error: "Admin account not found." }, { status: 404 });
    }

    const isMatch = await comparePassword(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect current password." }, { status: 400 });
    }

    admin.passwordHash = await hashPassword(newPassword);
    admin.updatedAt = new Date().toISOString();
    await saveAdminUser(admin);

    await logActivity({
      adminEmail: session.email,
      action: "change_password",
      entityType: "auth",
      details: "Admin password successfully updated.",
    });

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to change password.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
