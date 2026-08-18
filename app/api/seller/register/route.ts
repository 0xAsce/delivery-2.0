import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { randomBytes } from "node:crypto";
import { isValidWilaya } from "@/lib/wilayas";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const password = String(body.password || "");
    const storeName = String(body.storeName || "").trim();

    // Location
    const wilaya = String(body.wilaya || "").trim();
    const city = String(body.city || "").trim();

    if (
      !name ||
      !email ||
      !phone ||
      !storeName ||
      !wilaya ||
      !city ||
      password.length < 8
    ) {
      return NextResponse.json(
        {
          error:
            "Name, store name, email, phone, wilaya, baladia and an 8+ character password are required.",
        },
        { status: 400 }
      );
    }

    // Validate Wilaya
    if (!isValidWilaya(wilaya)) {
      return NextResponse.json(
        { error: "Invalid wilaya." },
        { status: 400 }
      );
    }

    // Validate Baladia
    if (city.length < 2 || city.length > 100) {
      return NextResponse.json(
        { error: "Invalid baladia." },
        { status: 400 }
      );
    }

    const existing = await db.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "An account already exists with this email or phone.",
        },
        { status: 409 }
      );
    }

    const user = await db.user.create({
      data: {
        name,
        email,
        phone,

        // Seller's location
        wilaya,
        city,

        password: await hashPassword(password),
        role: "SELLER",

        store: {
          create: {
            name: storeName,
            email,
            phone,
            status: "CLOSED",
          },
        },
      },

      include: {
        store: true,
      },
    });

    // Email verification token
    const token = randomBytes(32).toString("hex");

    await db.verificationToken.create({
      data: {
        identifier: `email:${user.id}`,
        token,
        expires: new Date(Date.now() + 24 * 3600000),
      },
    });

    const verificationUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin
    }/api/seller/verify-email?token=${token}`;

    return NextResponse.json(
      {
        ok: true,

        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          wilaya: user.wilaya,
          city: user.city,
          store: user.store
            ? {
                id: user.store.id,
                name: user.store.name,
              }
            : null,
        },

        verificationUrl:
          process.env.NODE_ENV === "production"
            ? undefined
            : verificationUrl,

        message: "Account created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("seller registration", error);

    return NextResponse.json(
      { error: "Unable to create seller account." },
      { status: 500 }
    );
  }
}