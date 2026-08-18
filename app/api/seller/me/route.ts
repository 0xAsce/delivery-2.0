import { NextResponse } from "next/server";
import { getSeller } from "@/lib/seller-auth";

export async function GET() {
  const user = await getSeller();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({
    user: {
      id: user.id, name: user.name, email: user.email, emailVerified: !!user.emailVerified,
      phone: user.phone, phoneVerified: !!user.phoneVerifiedAt, twoFactorEnabled: user.twoFactorEnabled,
      store: user.store,
    },
  });
}
