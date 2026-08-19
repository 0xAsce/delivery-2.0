"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

  const [wilayas, setWilayas] = useState([]);
  const [baladias, setBaladias] = useState([]);

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadingWilayas, setLoadingWilayas] = useState(true);
  const [loadingBaladias, setLoadingBaladias] = useState(false);

  useEffect(() => {
    async function loadWilayas() {
      try {
        const response = await fetch("/api/locations");

        if (!response.ok) {
          throw new Error("Unable to load wilayas");
        }

        const data = await response.json();

        setWilayas(data.wilayas || []);
      } catch (error) {
        console.error(error);
        setError("Unable to load wilayas.");
      } finally {
        setLoadingWilayas(false);
      }
    }

    loadWilayas();
  }, []);

  useEffect(() => {
    if (!form.wilaya) {
      setBaladias([]);
      return;
    }

    async function loadBaladias() {
      setLoadingBaladias(true);

      try {
        const response = await fetch(
          `/api/locations?wilaya=${encodeURIComponent(form.wilaya)}`
        );

        if (!response.ok) {
          throw new Error("Unable to load baladias");
        }

        const data = await response.json();

        setBaladias(data.baladias || []);
      } catch (error) {
        console.error(error);
        setBaladias([]);
        setError("Unable to load baladias.");
      } finally {
        setLoadingBaladias(false);
      }
    }

    loadBaladias();
  }, [form.wilaya]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleWilayaChange(value) {
    setForm((current) => ({
      ...current,
      wilaya: value,
      city: "",
    }));

    setError("");
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

    if (!form.city) {
      setError("Please select your baladia.");
      return;
    }

    setBusy(true);

    try {
      const response = await fetch(
        "/api/customer/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            phone: form.phone.trim(),
            password: form.password,
            wilaya: form.wilaya,
            city: form.city,
            address: form.address.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.error ||
            "Unable to create your account."
        );
        return;
      }

      /*
       * Registration creates the customer session.
       *
       * Send the customer to the seller-selection page
       * instead of directly to the profile.
       */
      router.replace("/customer/select-seller");
    } catch (error) {
      console.error(error);
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
            Register with your phone number and location.
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
                updateField(
                  "password",
                  e.target.value
                )
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
                handleWilayaChange(e.target.value)
              }
              disabled={loadingWilayas}
              className="w-full rounded-xl border border-gray-300 p-3 bg-white outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">
                {loadingWilayas
                  ? "Loading..."
                  : "Select wilaya"}
              </option>

              {wilayas.map((wilaya) => (
                <option
                  key={wilaya.code}
                  value={wilaya.name}
                >
                  {wilaya.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              Baladia
            </label>

            <select
              required
              value={form.city}
              onChange={(e) =>
                updateField("city", e.target.value)
              }
              disabled={
                !form.wilaya || loadingBaladias
              }
              className="w-full rounded-xl border border-gray-300 p-3 bg-white outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">
                {!form.wilaya
                  ? "Select wilaya first"
                  : loadingBaladias
                  ? "Loading..."
                  : "Select baladia"}
              </option>

              {baladias.map((baladia) => (
                <option
                  key={baladia}
                  value={baladia}
                >
                  {baladia}
                </option>
              ))}
            </select>
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
          {busy
            ? "Creating account…"
            : "Create account"}
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