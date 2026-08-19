"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StoresPage() {
  const [stores, setStores] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStores() {
      try {
        const response = await fetch(
          "/api/customer/stores"
        );

        if (response.status === 401) {
          window.location.href =
            "/customer/login?next=/stores";
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.error ||
              "Unable to load stores."
          );
          return;
        }

        setStores(data.stores || []);
        setLocation(data.location || null);
      } catch (error) {
        console.error(error);
        setError(
          "Unable to connect to the server."
        );
      }
    }

    loadStores();
  }, []);

  if (!stores && !error) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#f7f8f4] flex items-center justify-center"
      >
        <div className="text-gray-500">
          جاري البحث عن المحلات في منطقتك…
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f7f8f4] p-4"
    >
      <div className="max-w-3xl mx-auto space-y-5">
        <header className="bg-white rounded-3xl p-6 border border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">
                موقعك
              </p>

              <h1 className="text-2xl font-black mt-1">
                المحلات في منطقتك
              </h1>

              {location && (
                <p className="text-gray-500 mt-2">
                  📍 {location.wilaya} —{" "}
                  {location.city}
                </p>
              )}
            </div>

            <Link
              href="/customer/profile"
              className="rounded-xl bg-black text-white px-4 py-2 font-bold"
            >
              حسابي
            </Link>
          </div>
        </header>

        {error && (
          <div className="rounded-2xl bg-red-50 text-red-700 p-4">
            {error}
          </div>
        )}

        {stores?.length === 0 && (
          <section className="bg-white rounded-3xl border border-gray-200 p-8 text-center">
            <div className="text-5xl mb-4">
              🏪
            </div>

            <h2 className="text-xl font-black">
              لا توجد محلات متاحة حالياً
            </h2>

            <p className="text-gray-500 mt-2">
              لا يوجد بائع مفتوح في منطقتك حالياً.
            </p>

            <Link
              href="/customer/profile"
              className="inline-block mt-5 rounded-xl bg-black text-white px-5 py-3 font-bold"
            >
              تعديل معلوماتي
            </Link>
          </section>
        )}

        <div className="grid gap-4">
          {stores?.map((store) => (
            <article
              key={store.id}
              className="bg-white rounded-3xl border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#E4F1EA] flex items-center justify-center text-2xl">
                    🏪
                  </div>

                  <div>
                    <h2 className="text-xl font-black">
                      {store.name}
                    </h2>

                    {store.user?.name && (
                      <p className="text-sm text-gray-500 mt-1">
                        {store.user.name}
                      </p>
                    )}

                    <p className="text-sm text-gray-500 mt-1">
                      📍 {store.user?.city}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-bold">
                  مفتوح
                </span>
              </div>

              {store.description && (
                <p className="text-gray-600 mt-4">
                  {store.description}
                </p>
              )}

              <Link
                href={`/store/${store.id}`}
                className="block text-center mt-5 rounded-xl bg-black text-white px-5 py-3 font-bold"
              >
                تصفح المحل
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}