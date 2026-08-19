"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SelectSellerPage() {
  const router = useRouter();

  const [stores, setStores] = useState([]);
  const [location, setLocation] = useState(null);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(
          "/api/customer/main-seller",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data?.error ||
              "Unable to load sellers."
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
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  async function chooseSeller() {
    if (!selected) {
      setError("Please select a seller.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        "/api/customer/main-seller",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            storeId: selected,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.error ||
            "Unable to select seller."
        );
        return;
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError(
        "Unable to connect to the server."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#f7f8f4] flex items-center justify-center"
      >
        <p className="font-bold">
          جاري البحث عن البائعين…
        </p>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f7f8f4] p-4"
    >
      <div className="max-w-2xl mx-auto py-10">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8">
          <div className="text-center">
            <div className="text-5xl mb-4">
              🏪
            </div>

            <h1 className="text-2xl md:text-3xl font-black">
              اختر حانوتك الرئيسي
            </h1>

            <p className="text-gray-500 mt-2">
              سنعرض لك منتجات هذا البائع
              تلقائياً عند دخولك للمتجر.
            </p>

            {location && (
              <div className="mt-4 inline-flex rounded-full bg-gray-100 px-4 py-2 text-sm font-bold">
                📍 {location.wilaya} —{" "}
                {location.city}
              </div>
            )}
          </div>

          {error && (
            <div className="mt-6 rounded-xl bg-red-50 text-red-700 p-4 font-bold">
              {error}
            </div>
          )}

          {!stores.length && !error && (
            <div className="mt-8 rounded-2xl bg-yellow-50 text-yellow-800 p-5 text-center">
              <p className="font-black">
                لا يوجد بائع متاح حالياً في منطقتك.
              </p>

              <p className="text-sm mt-2">
                يمكنك العودة لاحقاً عندما يصبح
                أحد البائعين متاحاً.
              </p>
            </div>
          )}

          <div className="mt-8 space-y-3">
            {stores.map((store) => (
              <button
                key={store.id}
                type="button"
                onClick={() =>
                  setSelected(store.id)
                }
                className={`w-full text-right rounded-2xl border p-4 transition ${
                  selected === store.id
                    ? "border-black bg-gray-50 ring-2 ring-black"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  {store.logo ? (
                    <img
                      src={store.logo}
                      alt={store.name}
                      className="w-14 h-14 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl">
                      🏪
                    </div>
                  )}

                  <div className="flex-1">
                    <h2 className="font-black text-lg">
                      {store.name}
                    </h2>

                    {store.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {store.description}
                      </p>
                    )}

                    {store.address && (
                      <p className="text-xs text-gray-400 mt-1">
                        📍 {store.address}
                      </p>
                    )}
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selected === store.id
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                  >
                    {selected === store.id && (
                      <div className="w-3 h-3 rounded-full bg-black" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {stores.length > 0 && (
            <button
              type="button"
              disabled={!selected || saving}
              onClick={chooseSeller}
              className="w-full mt-6 rounded-2xl bg-black text-white p-4 font-black disabled:opacity-40"
            >
              {saving
                ? "جاري الحفظ…"
                : "اختيار هذا البائع والمتابعة"}
            </button>
          )}

          <button
            type="button"
            onClick={() => router.replace("/customer/select-seller")}
            className="w-full mt-3 p-3 text-gray-500 font-bold"
          >
            العودة إلى الحساب
          </button>
        </div>
      </div>
    </main>
  );
}