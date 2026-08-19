"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SellerRegister() {
  const [form, setForm] = useState({
    name: "",
    storeName: "",
    email: "",
    phone: "",
    password: "",
    wilaya: "",
    city: "",
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
    setBusy(true);

    try {
      if (!form.wilaya) {
        setError("Please select your wilaya.");
        setBusy(false);
        return;
      }

      if (!form.city) {
        setError("Please select your baladia.");
        setBusy(false);
        return;
      }

      const response = await fetch("/api/seller/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          storeName: form.storeName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
          wilaya: form.wilaya,
          city: form.city,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed.");
        return;
      }

      if (data.verificationUrl) {
        localStorage.setItem(
          "sellerVerificationUrl",
          data.verificationUrl
        );
      }

      window.location.href = "/seller/login?registered=1";
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
        className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-4"
      >
        <div>
          <h1 className="text-2xl font-black">
            Create seller account
          </h1>

          <p className="text-gray-500 mt-1">
            Set up your store and start managing orders.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 text-red-700 p-3">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold mb-1">
            Your name
          </label>

          <input
            required
            type="text"
            value={form.name}
            onChange={(e) =>
              updateField("name", e.target.value)
            }
            placeholder="Your name"
            className="w-full rounded-xl border border-gray-300 p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">
            Store name
          </label>

          <input
            required
            type="text"
            value={form.storeName}
            onChange={(e) =>
              updateField("storeName", e.target.value)
            }
            placeholder="Store name"
            className="w-full rounded-xl border border-gray-300 p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">
            Email address
          </label>

          <input
            required
            type="email"
            value={form.email}
            onChange={(e) =>
              updateField("email", e.target.value)
            }
            placeholder="Email address"
            className="w-full rounded-xl border border-gray-300 p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">
            Phone number
          </label>

          <input
            required
            type="tel"
            value={form.phone}
            onChange={(e) =>
              updateField("phone", e.target.value)
            }
            placeholder="Phone number"
            className="w-full rounded-xl border border-gray-300 p-3"
          />
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
              className="w-full rounded-xl border border-gray-300 p-3 bg-white"
            >
              <option value="">
                {loadingWilayas
                  ? "Loading..."
                  : "Select Wilaya"}
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
              disabled={!form.wilaya || loadingBaladias}
              className="w-full rounded-xl border border-gray-300 p-3 bg-white"
            >
              <option value="">
                {!form.wilaya
                  ? "Select Wilaya first"
                  : loadingBaladias
                  ? "Loading..."
                  : "Select Baladia"}
              </option>

              {baladias.map((baladia) => (
                <option key={baladia} value={baladia}>
                  {baladia}
                </option>
              ))}
            </select>
          </div>
        </div>

        <input
          required
          minLength={8}
          type="password"
          value={form.password}
          onChange={(e) =>
            updateField("password", e.target.value)
          }
          placeholder="Password (8+ characters)"
          className="w-full rounded-xl border border-gray-300 p-3"
        />

        <button
          disabled={busy}
          className="w-full rounded-xl bg-black text-white p-3 font-bold disabled:opacity-50"
        >
          {busy ? "Creating…" : "Create seller account"}
        </button>

        <p className="text-sm text-center">
          Already registered?{" "}
          <Link
            className="underline font-bold"
            href="/seller/login"
          >
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}