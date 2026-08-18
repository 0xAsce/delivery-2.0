import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { email } = await req.json();
  const user = await db.user.findUnique({ where: { email: String(email || "").trim().toLowerCase() } });
  if (!user || user.role !== "SELLER") return NextResponse.json({ ok: true });
  const token = randomBytes(32).toString("hex");
  await db.verificationToken.deleteMany({ where: { identifier: `email:${user.id}` } });
  await db.verificationToken.create({ data: { identifier: `email:${user.id}`, token, expires: new Date(Date.now() + 86400000) } });
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin}/api/seller/verify-email?token=${token}`;
  console.info("SELLER EMAIL VERIFICATION URL:", verificationUrl);
  return NextResponse.json({ ok: true, verificationUrl: process.env.NODE_ENV === "production" ? undefined : verificationUrl });
}
