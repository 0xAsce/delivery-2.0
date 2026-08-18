import { NextResponse } from "next/server";
import { randomInt } from "node:crypto";
import { db } from "@/lib/db";
import { getSeller } from "@/lib/seller-auth";

export async function POST() {
  const user = await getSeller();
  if (!user || !user.phone) return NextResponse.json({ error: "Unauthorized or no phone number." }, { status: 401 });
  const code = String(randomInt(100000, 1000000));
  await db.verificationToken.deleteMany({ where: { identifier: `phone:${user.id}` } });
  await db.verificationToken.create({ data: { identifier: `phone:${user.id}`, token: code, expires: new Date(Date.now() + 10 * 60000) } });
  console.info("SELLER PHONE VERIFICATION CODE:", code);
  return NextResponse.json({ ok: true, code: process.env.NODE_ENV === "production" ? undefined : code });
}
