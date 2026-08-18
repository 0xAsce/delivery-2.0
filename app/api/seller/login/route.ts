import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSellerSession } from "@/lib/seller-auth";
import { randomBytes } from "node:crypto";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const user = await db.user.findUnique({ where: { email: String(email || "").trim().toLowerCase() }, include: { store: true } });
    if (!user || user.role !== "SELLER" || !user.password || !(await verifyPassword(String(password || ""), user.password))) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    if (user.twoFactorEnabled && user.twoFactorSecret) {
      const challenge = randomBytes(24).toString("hex");
      await db.verificationToken.deleteMany({ where: { identifier: `2fa:${user.id}` } });
      await db.verificationToken.create({ data: { identifier: `2fa:${user.id}`, token: challenge, expires: new Date(Date.now() + 5 * 60000) } });
      return NextResponse.json({ requires2FA: true, challenge });
    }
    await createSellerSession(user.id);
    return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, phoneVerified: !!user.phoneVerifiedAt, store: user.store } });
  } catch {
    return NextResponse.json({ error: "Unable to log in." }, { status: 500 });
  }
}
