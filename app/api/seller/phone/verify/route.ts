import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSeller } from "@/lib/seller-auth";

export async function POST(req: Request) {
  const user = await getSeller();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { code } = await req.json();
  const record = await db.verificationToken.findFirst({ where: { identifier: `phone:${user.id}`, token: String(code || "") } });
  if (!record || record.expires < new Date()) return NextResponse.json({ error: "Invalid or expired code." }, { status: 400 });
  await db.$transaction([
    db.user.update({ where: { id: user.id }, data: { phoneVerifiedAt: new Date() } }),
    db.verificationToken.deleteMany({ where: { identifier: `phone:${user.id}`, token: String(code || "") } }),
  ]);
  return NextResponse.json({ ok: true });
}
