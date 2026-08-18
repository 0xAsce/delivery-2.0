import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSellerSession } from "@/lib/seller-auth";
import { verifyTotp } from "@/lib/totp";

export async function POST(req: Request) {
  const { challenge, code } = await req.json();
  const record = await db.verificationToken.findFirst({ where: { identifier: { startsWith: "2fa:" }, token: String(challenge || "") } });
  if (!record || record.expires < new Date()) return NextResponse.json({ error: "Invalid or expired challenge." }, { status: 400 });
  const userId = record.identifier.slice(3);
  const user = await db.user.findUnique({ where: { id: userId }, include: { store: true } });
  if (!user || user.role !== "SELLER" || !user.twoFactorEnabled || !user.twoFactorSecret || !verifyTotp(user.twoFactorSecret, String(code || ""))) {
    return NextResponse.json({ error: "Invalid authenticator code." }, { status: 401 });
  }
  await db.verificationToken.delete({ where: { token: record.token } });
  await createSellerSession(user.id);
  return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, phoneVerified: !!user.phoneVerifiedAt, store: user.store } });
}
