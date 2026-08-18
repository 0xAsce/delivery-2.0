import { NextResponse } from "next/server";
import { randomInt } from "node:crypto";
import { db } from "@/lib/db";
import { getCustomer } from "@/lib/customer-auth";

export async function POST() {
  const user = await getCustomer();
  if (!user || !user.phone) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const code = String(randomInt(100000, 1000000));
  await db.verificationToken.deleteMany({ where: { identifier: `customer-phone:${user.id}` } });
  await db.verificationToken.create({ data: { identifier: `customer-phone:${user.id}`, token: code, expires: new Date(Date.now() + 10 * 60000) } });
  const response: { ok: true; devCode?: string } = { ok: true };
  if (process.env.NODE_ENV !== "production") response.devCode = code;
  return NextResponse.json(response);
}