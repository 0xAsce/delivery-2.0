import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { email } = await req.json();
  const normalized = String(email || "").trim().toLowerCase();
  const user = await db.user.findUnique({ where: { email: normalized } });
  if (!user || user.role !== "SELLER") return NextResponse.json({ ok: true });

  const token = randomBytes(32).toString("hex");
  await db.verificationToken.deleteMany({ where: { identifier: `reset:${user.id}` } });
  await db.verificationToken.create({ data: { identifier: `reset:${user.id}`, token, expires: new Date(Date.now() + 3600000) } });
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin}/seller/reset-password?token=${token}`;
  console.info("SELLER PASSWORD RESET URL:", resetUrl);
  return NextResponse.json({ ok: true, resetUrl: process.env.NODE_ENV === "production" ? undefined : resetUrl });
}
