import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { createCustomerSession } from "@/lib/customer-auth";
import { normalizeAlgerianPhone } from "@/lib/phone";
import { isValidWilaya } from "@/lib/wilayas";
import { isValidBaladia } from "@/lib/locations";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const phone = normalizeAlgerianPhone(body.phone);
    const password = String(body.password || "");

    const wilaya = String(body.wilaya || "").trim();
    const city = String(body.city || "").trim();

    const address =
      String(body.address || "").trim() || null;

    if (
      !name ||
      !phone ||
      !isValidWilaya(wilaya) ||
      !city ||
      password.length < 8
    ) {
      return NextResponse.json(
        {
          error:
            "Name, phone, password, wilaya and baladia are required.",
        },
        { status: 400 }
      );
    }

    if (!isValidBaladia(wilaya, city)) {
      return NextResponse.json(
        {
          error:
            "The selected baladia does not belong to the selected wilaya.",
        },
        { status: 400 }
      );
    }

    if (
      name.length > 100 ||
      city.length > 100 ||
      (address && address.length > 300)
    ) {
      return NextResponse.json(
        { error: "One or more fields are too long." },
        { status: 400 }
      );
    }

    const existing = await db.user.findUnique({
      where: {
        phone,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "An account already exists with this phone number.",
        },
        { status: 409 }
      );
    }

    const user = await db.user.create({
      data: {
        name,
        phone,
        password: await hashPassword(password),
        wilaya,
        city,
        address,
        role: "CUSTOMER",
      },
    });

    await createCustomerSession(user.id);

    return NextResponse.json(
      {
        ok: true,

        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          wilaya: user.wilaya,
          city: user.city,
          address: user.address,
          phoneVerified: false,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("customer registration", error);

    return NextResponse.json(
      { error: "Unable to create customer account." },
      { status: 500 }
    );
  }
}