import { cookies } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { db } from "@/lib/db";

const COOKIE = "seller_session";
const SESSION_DAYS = 30;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSellerSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  await db.sellerSession.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expires: new Date(Date.now() + SESSION_DAYS * 86400000),
    },
  });
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

export async function destroySellerSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    await db.sellerSession.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  jar.set(COOKIE, "", { httpOnly: true, expires: new Date(0), path: "/" });
}

export async function getSeller() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const session = await db.sellerSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { include: { store: true } } },
  });
  if (!session || session.expires < new Date() || session.user.role !== "SELLER") return null;
  return session.user;
}
