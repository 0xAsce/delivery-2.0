"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const WILAYAS = [
  "Adrar",
  "Chlef",
  "Laghouat",
  "Oum El Bouaghi",
  "Batna",
  "Béjaïa",
  "Biskra",
  "Béchar",
  "Blida",
  "Bouira",
  "Tamanrasset",
  "Tébessa",
  "Tlemcen",
  "Tiaret",
  "Tizi Ouzou",
  "Alger",
  "Djelfa",
  "Jijel",
  "Sétif",
  "Saïda",
  "Skikda",
  "Sidi Bel Abbès",
  "Annaba",
  "Guelma",
  "Constantine",
  "Médéa",
  "Mostaganem",
  "M'Sila",
  "Mascara",
  "Ouargla",
  "Oran",
  "El Bayadh",
  "Illizi",
  "Bordj Bou Arréridj",
  "Boumerdès",
  "El Tarf",
  "Tindouf",
  "Tissemsilt",
  "El Oued",
  "Khenchela",
  "Souk Ahras",
  "Tipaza",
  "Mila",
  "Aïn Defla",
  "Naâma",
  "Aïn Témouchent",
  "Ghardaïa",
  "Relizane",
  "Timimoun",
  "Bordj Badji Mokhtar",
  "Ouled Djellal",
  "Béni Abbès",
  "In Salah",
  "In Guezzam",
  "Touggourt",
  "Djanet",
  "El M'Ghair",
  "El Meniaa",
];

export default function CustomerRegister() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    wilaya: "",
    city: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.wilaya) {
      setError("Please select your wilaya.");
      return;
    }

    if (form.city.trim().length < 2) {
      setError("Please enter your city.");
      return;
    }

    setBusy(true);

    try {
      const response = await fetch("/api/customer/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          password: form.password,
          wilaya: form.wilaya,
          city: form.city.trim(),
          address: form.address.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.error || "Unable to create your account."
        );
        return;
      }

      // Registration automatically creates the customer session.
      router.replace("/customer/profile");
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] p-4 flex items-center justify-center">
      <form
        onSubmit={submit}
        className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Create your account
          </h1>

          <p className="text-gray-500 mt-1">
            Register with your phone number and delivery information.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 text-red-700 p-3 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold mb-1">
            Name
          </label>

          <input
            required
            value={form.name}
            onChange={(e) =>
              updateField("name", e.target.value)
            }
            placeholder="Your full name"
            maxLength={100}
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">
            Phone number
          </label>

          <input
            required
            value={form.phone}
            onChange={(e) =>
              updateField("phone", e.target.value)
            }
            placeholder="05XXXXXXXX"
            inputMode="tel"
            autoComplete="tel"
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">
              Password
            </label>

            <input
              required
              type="password"
              value={form.password}
              onChange={(e) =>
                updateField("password", e.target.value)
              }
              placeholder="At least 8 characters"
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              Confirm password
            </label>

            <input
              required
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                updateField(
                  "confirmPassword",
                  e.target.value
                )
              }
              placeholder="Repeat password"
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">
              Wilaya
            </label>

            <select
              required
              value={form.wilaya}
              onChange={(e) =>
                updateField("wilaya", e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 p-3 bg-white outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select wilaya</option>

              {WILAYAS.map((wilaya) => (
                <option key={wilaya} value={wilaya}>
                  {wilaya}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              City
            </label>

            <input
              required
              value={form.city}
              onChange={(e) =>
                updateField("city", e.target.value)
              }
              placeholder="Your city"
              maxLength={100}
              className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">
            Address{" "}
            <span className="text-gray-400 font-normal">
              (optional)
            </span>
          </label>

          <textarea
            value={form.address}
            onChange={(e) =>
              updateField("address", e.target.value)
            }
            placeholder="Your delivery address"
            maxLength={300}
            rows={3}
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-black resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-black text-white p-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? "Creating account…" : "Create account"}
        </button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            href="/customer/login"
            className="underline font-bold text-black"
          >
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}