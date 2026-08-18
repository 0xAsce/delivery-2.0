import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { normalizeAlgerianPhone } from "@/lib/phone";
import { createCustomerSession } from "@/lib/customer-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = normalizeAlgerianPhone(body.phone);
    const code = String(body.code || "").trim();
    const password = String(body.password || "");
    if (!phone || !/^\d{6}$/.test(code) || password.length < 8) return NextResponse.json({ error: "Phone, 6-digit code and an 8+ character password are required." }, { status: 400 });
    const record = await db.verificationToken.findFirst({ where: { identifier: `customer-reset:${phone}`, token: code } });
    if (!record || record.expires < new Date()) return NextResponse.json({ error: "Invalid or expired code." }, { status: 400 });
    const user = await db.user.findUnique({ where: { phone } });
    if (!user || user.role !== "CUSTOMER") return NextResponse.json({ error: "Unable to reset password." }, { status: 400 });
    await db.$transaction([
      db.user.update({ where: { id: user.id }, data: { password: await hashPassword(password) } }),
      db.verificationToken.delete({ where: { token: record.token } }),
      db.customerSession.deleteMany({ where: { userId: user.id } }),
    ]);
    await createCustomerSession(user.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to reset password." }, { status: 500 });
  }
}