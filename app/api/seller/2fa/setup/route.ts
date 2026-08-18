import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSeller } from "@/lib/seller-auth";
import { randomBase32, verifyTotp } from "@/lib/totp";

export async function POST() {
  const user = await getSeller();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const secret = randomBase32();
  await db.user.update({ where: { id: user.id }, data: { twoFactorSecret: secret, twoFactorEnabled: false } });
  const label = encodeURIComponent(user.email || user.id);
  const issuer = encodeURIComponent("Hanout Direct");
  return NextResponse.json({ secret, otpauthUrl: `otpauth://totp/${issuer}:${label}?secret=${secret}&issuer=${issuer}` });
}

export async function PUT(req: Request) {
  const user = await getSeller();
  if (!user || !user.twoFactorSecret) return NextResponse.json({ error: "Set up 2FA first." }, { status: 400 });
  const { code } = await req.json();
  if (!verifyTotp(user.twoFactorSecret, String(code || ""))) return NextResponse.json({ error: "Invalid authenticator code." }, { status: 400 });
  await db.user.update({ where: { id: user.id }, data: { twoFactorEnabled: true } });
  return NextResponse.json({ ok: true });
}
