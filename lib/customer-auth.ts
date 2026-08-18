import { cookies } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { db } from "@/lib/db";

const COOKIE = "customer_session";
const SESSION_DAYS = 30;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createCustomerSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  await db.customerSession.create({
    data: { userId, tokenHash: hashToken(token), expires: new Date(Date.now() + SESSION_DAYS * 86400000) },
  });
  const jar = await cookies();
  jar.set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_DAYS * 86400 });
}

export async function destroyCustomerSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await db.customerSession.deleteMany({ where: { tokenHash: hashToken(token) } });
  jar.set(COOKIE, "", { httpOnly: true, expires: new Date(0), path: "/" });
}

export async function getCustomer() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const session = await db.customerSession.findUnique({ where: { tokenHash: hashToken(token) }, include: { user: true } });
  if (!session || session.expires < new Date() || session.user.role !== "CUSTOMER") return null;
  return session.user;
}