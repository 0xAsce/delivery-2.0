import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token." }, { status: 400 });
  const record = await db.verificationToken.findUnique({ where: { token } });
  if (!record || record.expires < new Date() || !record.identifier.startsWith("email:")) {
    return NextResponse.json({ error: "Invalid or expired verification token." }, { status: 400 });
  }
  const userId = record.identifier.slice(6);
  await db.$transaction([
    db.user.update({ where: { id: userId }, data: { emailVerified: new Date() } }),
    db.verificationToken.delete({ where: { token } }),
  ]);
  return NextResponse.redirect(new URL("/seller/login?verified=1", req.url));
}
