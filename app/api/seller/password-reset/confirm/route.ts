import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export async function POST(req: Request) {
  const { token, password } = await req.json();
  if (!token || String(password || "").length < 8) return NextResponse.json({ error: "A valid token and an 8+ character password are required." }, { status: 400 });
  const record = await db.verificationToken.findUnique({ where: { token } });
  if (!record || record.expires < new Date() || !record.identifier.startsWith("reset:")) return NextResponse.json({ error: "Invalid or expired reset token." }, { status: 400 });
  const userId = record.identifier.slice(6);
  await db.$transaction([
    db.user.update({ where: { id: userId }, data: { password: await hashPassword(password) } }),
    db.verificationToken.delete({ where: { token } }),
    db.sellerSession.deleteMany({ where: { userId } }),
  ]);
  return NextResponse.json({ ok: true });
}
