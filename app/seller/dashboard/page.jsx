"use client";

import { useEffect, useMemo, useState } from "react";

const translations = {
  ar: {
    dashboard: "لوحة تحكم البائع",
    seller: "حساب البائع",
    logout: "تسجيل الخروج",
    language: "اللغة",
    arabic: "العربية",
    english: "English",

    overview: "نظرة عامة",
    todayOrders: "طلبات اليوم",
    revenue: "الإيرادات",
    pendingOrders: "الطلبات المعلقة",
    newCustomers: "عملاء جدد",

    bestSelling: "المنتجات الأكثر مبيعًا",
    product: "المنتج",
    sold: "المبيعات",
    salesGraph: "المبيعات",
    last7Days: "آخر 7 أيام",

    lowStock: "تنبيهات المخزون المنخفض",
    stock: "المخزون",
    remaining: "متبقي",
    outOfStock: "نفد المخزون",

    storeStatus: "حالة المتجر",
    open: "مفتوح",
    busy: "مشغول",
    closed: "مغلق",
    vacation: "وضع العطلة",

    storeProfile: "معلومات المتجر",
    storeName: "اسم المتجر",
    contactEmail: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    deliveryRadius: "نطاق التوصيل (كم)",
    description: "الوصف",
    address: "العنوان",
    saveProfile: "حفظ المعلومات",
    saving: "جاري الحفظ…",
    saved: "تم الحفظ.",

    openingHours: "ساعات العمل",
    saveHours: "حفظ ساعات العمل",
    closedDay: "مغلق",

    verificationSecurity: "التحقق والأمان",
    verified: "تم التحقق",
    notVerified: "لم يتم التحقق",
    sendPhoneCode: "إرسال رمز الهاتف",
    verify: "تحقق",
    code: "الرمز",

    taxInformation: "المعلومات الضريبية",
    taxId: "الرقم الجبائي / NIF",
    legalName: "الاسم القانوني للنشاط",
    saveTax: "حفظ المعلومات",

    noLowStock: "لا توجد منتجات منخفضة المخزون.",
    noSales: "لا توجد مبيعات بعد.",

    currency: "دج",
  },

  en: {
    dashboard: "Seller Dashboard",
    seller: "Seller Account",
    logout: "Logout",
    language: "Language",
    arabic: "العربية",
    english: "English",

    overview: "Overview",
    todayOrders: "Today's Orders",
    revenue: "Revenue",
    pendingOrders: "Pending Orders",
    newCustomers: "New Customers",

    bestSelling: "Best-Selling Products",
    product: "Product",
    sold: "Sold",
    salesGraph: "Sales",
    last7Days: "Last 7 Days",

    lowStock: "Low Stock Alerts",
    stock: "Stock",
    remaining: "remaining",
    outOfStock: "Out of stock",

    storeStatus: "Store Status",
    open: "Open",
    busy: "Busy",
    closed: "Closed",
    vacation: "Vacation Mode",

    storeProfile: "Store Profile",
    storeName: "Store Name",
    contactEmail: "Contact Email",
    phone: "Phone",
    deliveryRadius: "Delivery Radius (km)",
    description: "Description",
    address: "Address",
    saveProfile: "Save Profile",
    saving: "Saving…",
    saved: "Saved.",

    openingHours: "Opening Hours",
    saveHours: "Save Hours",
    closedDay: "Closed",

    verificationSecurity: "Verification & Security",
    verified: "Verified",
    notVerified: "Not verified",
    sendPhoneCode: "Send Phone Code",
    verify: "Verify",
    code: "Code",

    taxInformation: "Tax Information",
    taxId: "Tax ID / NIF",
    legalName: "Business Legal Name",
    saveTax: "Save Tax Information",

    noLowStock: "No low-stock products.",
    noSales: "No sales yet.",

    currency: "DZD",
  },
};

const DAYS = [
  {
    key: "Monday",
    en: "Monday",
    ar: "الاثنين",
  },
  {
    key: "Tuesday",
    en: "Tuesday",
    ar: "الثلاثاء",
  },
  {
    key: "Wednesday",
    en: "Wednesday",
    ar: "الأربعاء",
  },
  {
    key: "Thursday",
    en: "Thursday",
    ar: "الخميس",
  },
  {
    key: "Friday",
    en: "Friday",
    ar: "الجمعة",
  },
  {
    key: "Saturday",
    en: "Saturday",
    ar: "السبت",
  },
  {
    key: "Sunday",
    en: "Sunday",
    ar: "الأحد",
  },
];

const STATUS_LABELS = {
  OPEN: {
    ar: "مفتوح",
    en: "Open",
  },
  BUSY: {
    ar: "مشغول",
    en: "Busy",
  },
  CLOSED: {
    ar: "مغلق",
    en: "Closed",
  },
  VACATION: {
    ar: "وضع العطلة",
    en: "Vacation Mode",
  },
};

/*
 * DEMO ANALYTICS DATA
 *
 * This is temporary.
 * Later we will replace this with data from:
 *
 * PostgreSQL / Neon
 *        ↓
 * Prisma
 *        ↓
 * /api/seller/dashboard
 *
 * For now this lets you test the dashboard UI.
 */
const DEMO_ANALYTICS = {
  todayOrders: 18,

  revenue: 24750,

  pendingOrders: 6,

  newCustomers: 7,

  sales: [
    {
      day: "Monday",
      value: 3200,
    },
    {
      day: "Tuesday",
      value: 4800,
    },
    {
      day: "Wednesday",
      value: 2900,
    },
    {
      day: "Thursday",
      value: 6100,
    },
    {
      day: "Friday",
      value: 4300,
    },
    {
      day: "Saturday",
      value: 7350,
    },
    {
      day: "Sunday",
      value: 24750,
    },
  ],

  bestSellingProducts: [
    {
      name: "Fresh Milk",
      nameAr: "حليب طازج",
      sold: 42,
    },
    {
      name: "Bread",
      nameAr: "خبز",
      sold: 36,
    },
    {
      name: "Eggs",
      nameAr: "بيض",
      sold: 29,
    },
    {
      name: "Olive Oil",
      nameAr: "زيت الزيتون",
      sold: 21,
    },
    {
      name: "Cheese",
      nameAr: "جبن",
      sold: 18,
    },
  ],

  lowStockProducts: [
    {
      name: "Fresh Milk",
      nameAr: "حليب طازج",
      stock: 3,
    },
    {
      name: "Eggs",
      nameAr: "بيض",
      stock: 2,
    },
    {
      name: "Olive Oil",
      nameAr: "زيت الزيتون",
      stock: 1,
    },
    {
      name: "Cheese",
      nameAr: "جبن",
      stock: 0,
    },
  ],
};

function formatMoney(value, language) {
  return new Intl.NumberFormat(
    language === "ar" ? "ar-DZ" : "en-DZ",
    {
      maximumFractionDigits: 0,
    }
  ).format(value);
}

function StatCard({
  title,
  value,
  subtitle,
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-black">
        {value}
      </p>

      {subtitle && (
        <p className="mt-1 text-xs text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function SalesChart({ data, language, currency }) {
  const max = Math.max(...data.map((x) => x.value), 1);

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black">
            {language === "ar"
              ? "المبيعات"
              : "Sales"}
          </h2>

          <p className="text-sm text-gray-500">
            {language === "ar"
              ? "آخر 7 أيام"
              : "Last 7 Days"}
          </p>
        </div>
      </div>

      <div className="flex h-64 items-end gap-2">
        {data.map((item) => {
          const height =
            Math.max(
              (item.value / max) * 100,
              5
            );

          const day = DAYS.find(
            (x) => x.key === item.day
          );

          return (
            <div
              key={item.day}
              className="flex h-full flex-1 flex-col justify-end"
            >
              <div className="mb-1 text-center text-[10px] text-gray-500">
                {formatMoney(item.value, language)}
              </div>

              <div
                className="w-full rounded-t-lg bg-black transition-all"
                style={{
                  height: `${height}%`,
                }}
                title={`${formatMoney(
                  item.value,
                  language
                )} ${currency}`}
              />

              <div className="mt-2 text-center text-[10px] text-gray-500">
                {language === "ar"
                  ? day?.ar
                  : day?.en}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BestSellingProducts({
  products,
  language,
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black">
        {language === "ar"
          ? "المنتجات الأكثر مبيعًا"
          : "Best-Selling Products"}
      </h2>

      <div className="mt-4 divide-y">
        {products.map((product, index) => (
          <div
            key={product.name}
            className="flex items-center justify-between py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 font-black">
                {index + 1}
              </div>

              <span className="font-medium">
                {language === "ar"
                  ? product.nameAr
                  : product.name}
              </span>
            </div>

            <span className="font-bold">
              {product.sold}{" "}
              {language === "ar"
                ? "مباع"
                : "sold"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LowStockAlerts({
  products,
  language,
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black">
        {language === "ar"
          ? "تنبيهات المخزون المنخفض"
          : "Low Stock Alerts"}
      </h2>

      {products.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">
          {language === "ar"
            ? "لا توجد منتجات منخفضة المخزون."
            : "No low-stock products."}
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {products.map((product) => {
            const outOfStock =
              product.stock <= 0;

            return (
              <div
                key={product.name}
                className={`flex items-center justify-between rounded-xl border p-3 ${
                  outOfStock
                    ? "border-red-200 bg-red-50"
                    : "border-yellow-200 bg-yellow-50"
                }`}
              >
                <div>
                  <p className="font-bold">
                    {language === "ar"
                      ? product.nameAr
                      : product.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {language === "ar"
                      ? `متبقي ${product.stock}`
                      : `${product.stock} remaining`}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    outOfStock
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {outOfStock
                    ? language === "ar"
                      ? "نفد المخزون"
                      : "Out of stock"
                    : language === "ar"
                    ? "مخزون منخفض"
                    : "Low stock"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SellerDashboard() {
  const [language, setLanguage] =
    useState("ar");

  const [data, setData] = useState(null);

  const [error, setError] = useState("");

  const [saved, setSaved] = useState("");

  const [saving, setSaving] = useState(false);

  const [phoneCode, setPhoneCode] =
    useState("");

  const [devCode, setDevCode] =
    useState("");

  useEffect(() => {
    const stored =
      localStorage.getItem(
        "seller-language"
      );

    if (
      stored === "ar" ||
      stored === "en"
    ) {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang =
      language;

    document.documentElement.dir =
      language === "ar"
        ? "rtl"
        : "ltr";

    localStorage.setItem(
      "seller-language",
      language
    );
  }, [language]);

  async function load() {
    try {
      const response = await fetch(
        "/api/seller/me"
      );

      if (!response.ok) {
        window.location.href =
          "/seller/login";

        return;
      }

      const result =
        await response.json();

      setData(result.user);
    } catch (e) {
      setError(
        language === "ar"
          ? "تعذر تحميل بيانات البائع."
          : "Unable to load seller data."
      );
    }
  }

  useEffect(() => {
    load();
  }, []);

  const t = translations[language];

  const currency = t.currency;

  const analytics = DEMO_ANALYTICS;

  const status =
    data?.store?.status || "OPEN";

  const statusLabel =
    STATUS_LABELS[status]?.[language] ||
    status;

  const hours =
    data?.store?.openingHours ||
    Object.fromEntries(
      DAYS.map((day) => [
        day.key,
        {
          open: "08:00",
          close: "18:00",
          closed: false,
        },
      ])
    );

  function updateStore(key, value) {
    setData((current) => ({
      ...current,
      store: {
        ...current.store,
        [key]: value,
      },
    }));
  }

  function setHour(day, key, value) {
    updateStore("openingHours", {
      ...hours,
      [day]: {
        ...hours[day],
        [key]: value,
      },
    });
  }

  async function saveProfile() {
    setSaving(true);
    setSaved("");
    setError("");

    try {
      const response = await fetch(
        "/api/seller/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            data.store
          ),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        setError(
          result.error ||
            "Unable to save."
        );

        setSaving(false);

        return;
      }

      setData((current) => ({
        ...current,
        store: result.store,
      }));

      setSaved(t.saved);
    } catch {
      setError(
        language === "ar"
          ? "تعذر حفظ المعلومات."
          : "Unable to save."
      );
    }

    setSaving(false);
  }

  async function requestPhoneCode() {
    const response = await fetch(
      "/api/seller/phone/request"
    );

    const result =
      await response.json();

    if (result.code) {
      setDevCode(result.code);
    }

    setSaved(
      language === "ar"
        ? "تم إرسال رمز التحقق."
        : "Verification code sent."
    );
  }

  async function verifyPhone() {
    const response = await fetch(
      "/api/seller/phone/verify",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          code: phoneCode,
        }),
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      setError(result.error);

      return;
    }

    setData((current) => ({
      ...current,
      phoneVerified: true,
    }));

    setSaved(
      language === "ar"
        ? "تم التحقق من الهاتف."
        : "Phone verified."
    );
  }

  async function logout() {
    await fetch(
      "/api/seller/logout",
      {
        method: "POST",
      }
    );

    window.location.href =
      "/seller/login";
  }

  if (!data) {
    return (
      <main
        dir={
          language === "ar"
            ? "rtl"
            : "ltr"
        }
        className="flex min-h-screen items-center justify-center bg-[#f7f8f4]"
      >
        <div className="text-gray-500">
          {language === "ar"
            ? "جاري التحميل…"
            : "Loading…"}
        </div>
      </main>
    );
  }

  return (
    <main
      dir={
        language === "ar"
          ? "rtl"
          : "ltr"
      }
      className="min-h-screen bg-[#f7f8f4]"
    >
      {/* HEADER */}

      <header className="sticky top-0 z-30 border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div>
            <h1 className="text-xl font-black">
              {t.dashboard}
            </h1>

            <p className="text-sm text-gray-500">
              {data.email}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-xl border">
              <button
                onClick={() =>
                  setLanguage("ar")
                }
                className={`px-3 py-2 text-sm font-bold ${
                  language === "ar"
                    ? "bg-black text-white"
                    : "bg-white"
                }`}
              >
                العربية
              </button>

              <button
                onClick={() =>
                  setLanguage("en")
                }
                className={`px-3 py-2 text-sm font-bold ${
                  language === "en"
                    ? "bg-black text-white"
                    : "bg-white"
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={logout}
              className="rounded-xl border px-4 py-2 font-bold"
            >
              {t.logout}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
        {/* ERRORS */}

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {saved && (
          <div className="rounded-xl bg-green-50 p-4 text-green-700">
            {saved}
          </div>
        )}

        {/* DASHBOARD OVERVIEW */}

        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-black">
              {t.overview}
            </h2>

            <p className="text-sm text-gray-500">
              {language === "ar"
                ? "ملخص أداء متجرك"
                : "Your store performance overview"}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title={t.todayOrders}
              value={analytics.todayOrders}
              subtitle={
                language === "ar"
                  ? "طلب اليوم"
                  : "orders today"
              }
            />

            <StatCard
              title={t.revenue}
              value={`${formatMoney(
                analytics.revenue,
                language
              )} ${currency}`}
              subtitle={
                language === "ar"
                  ? "إجمالي إيرادات اليوم"
                  : "Today's revenue"
              }
            />

            <StatCard
              title={t.pendingOrders}
              value={analytics.pendingOrders}
              subtitle={
                language === "ar"
                  ? "تحتاج إلى المعالجة"
                  : "Need attention"
              }
            />

            <StatCard
              title={t.newCustomers}
              value={analytics.newCustomers}
              subtitle={
                language === "ar"
                  ? "عملاء جدد اليوم"
                  : "New customers today"
              }
            />
          </div>
        </section>

        {/* SALES GRAPH */}

        <SalesChart
          data={analytics.sales}
          language={language}
          currency={currency}
        />

        {/* BEST SELLING + LOW STOCK */}

        <section className="grid gap-6 lg:grid-cols-2">
          <BestSellingProducts
            products={
              analytics.bestSellingProducts
            }
            language={language}
          />

          <LowStockAlerts
            products={
              analytics.lowStockProducts
            }
            language={language}
          />
        </section>

        {/* STORE STATUS */}

        <section className="rounded-3xl border bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black">
                {t.storeStatus}
              </h2>

              <p className="text-sm text-gray-500">
                {language === "ar"
                  ? "الحالة الحالية للمتجر"
                  : "Current store status"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {Object.keys(
                STATUS_LABELS
              ).map((value) => (
                <button
                  key={value}
                  onClick={() =>
                    updateStore(
                      "status",
                      value
                    )
                  }
                  className={`rounded-xl border px-4 py-2 font-bold ${
                    status === value
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                >
                  {
                    STATUS_LABELS[value][
                      language
                    ]
                  }
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-gray-50 p-4 text-center">
            <span className="text-sm text-gray-500">
              {t.storeStatus}
            </span>

            <div className="mt-1 text-xl font-black">
              {statusLabel}
            </div>
          </div>
        </section>

        {/* STORE PROFILE */}

        <section className="space-y-5 rounded-3xl border bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-xl font-black">
              {t.storeProfile}
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="text-sm font-bold">
                {t.storeName}
              </span>

              <input
                value={
                  data.store?.name || ""
                }
                onChange={(e) =>
                  updateStore(
                    "name",
                    e.target.value
                  )
                }
                className="mt-1 w-full rounded-xl border p-3"
              />
            </label>

            <label>
              <span className="text-sm font-bold">
                {t.contactEmail}
              </span>

              <input
                type="email"
                value={
                  data.store?.email || ""
                }
                onChange={(e) =>
                  updateStore(
                    "email",
                    e.target.value
                  )
                }
                className="mt-1 w-full rounded-xl border p-3"
              />
            </label>

            <label>
              <span className="text-sm font-bold">
                {t.phone}
              </span>

              <input
                value={
                  data.store?.phone || ""
                }
                onChange={(e) =>
                  updateStore(
                    "phone",
                    e.target.value
                  )
                }
                className="mt-1 w-full rounded-xl border p-3"
              />
            </label>

            <label>
              <span className="text-sm font-bold">
                {t.deliveryRadius}
              </span>

              <input
                type="number"
                value={
                  data.store
                    ?.deliveryRadius ?? ""
                }
                onChange={(e) =>
                  updateStore(
                    "deliveryRadius",
                    e.target.value === ""
                      ? null
                      : Number(
                          e.target.value
                        )
                  )
                }
                className="mt-1 w-full rounded-xl border p-3"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-bold">
              {t.description}
            </span>

            <textarea
              rows={3}
              value={
                data.store?.description ||
                ""
              }
              onChange={(e) =>
                updateStore(
                  "description",
                  e.target.value
                )
              }
              className="mt-1 w-full rounded-xl border p-3"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold">
              {t.address}
            </span>

            <input
              value={
                data.store?.address || ""
              }
              onChange={(e) =>
                updateStore(
                  "address",
                  e.target.value
                )
              }
              className="mt-1 w-full rounded-xl border p-3"
            />
          </label>

          <button
            disabled={saving}
            onClick={saveProfile}
            className="rounded-xl bg-black px-5 py-3 font-bold text-white"
          >
            {saving
              ? t.saving
              : t.saveProfile}
          </button>
        </section>

        {/* OPENING HOURS */}

        <section className="space-y-4 rounded-3xl border bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">
            {t.openingHours}
          </h2>

          {DAYS.map((day) => (
            <div
              key={day.key}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-3"
            >
              <b>
                {language === "ar"
                  ? day.ar
                  : day.en}
              </b>

              <input
                disabled={
                  hours[day.key]?.closed
                }
                type="time"
                value={
                  hours[day.key]?.open ||
                  "08:00"
                }
                onChange={(e) =>
                  setHour(
                    day.key,
                    "open",
                    e.target.value
                  )
                }
                className="rounded-lg border p-2"
              />

              <input
                disabled={
                  hours[day.key]?.closed
                }
                type="time"
                value={
                  hours[day.key]?.close ||
                  "18:00"
                }
                onChange={(e) =>
                  setHour(
                    day.key,
                    "close",
                    e.target.value
                  )
                }
                className="rounded-lg border p-2"
              />

              <label className="col-span-3 text-sm">
                <input
                  type="checkbox"
                  checked={
                    !!hours[day.key]?.closed
                  }
                  onChange={(e) =>
                    setHour(
                      day.key,
                      "closed",
                      e.target.checked
                    )
                  }
                  className="mx-2"
                />

                {t.closedDay}
              </label>
            </div>
          ))}

          <button
            onClick={saveProfile}
            className="rounded-xl bg-black px-5 py-3 font-bold text-white"
          >
            {t.saveHours}
          </button>
        </section>

        {/* VERIFICATION */}

        <section className="space-y-4 rounded-3xl border bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">
            {t.verificationSecurity}
          </h2>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-2 text-sm">
              {t.contactEmail}:{" "}
              {data.emailVerified
                ? t.verified
                : t.notVerified}
            </span>

            <span className="rounded-full bg-gray-100 px-3 py-2 text-sm">
              {t.phone}:{" "}
              {data.phoneVerified
                ? t.verified
                : t.notVerified}
            </span>
          </div>

          {!data.phoneVerified && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={
                  requestPhoneCode
                }
                className="rounded-xl border px-4 py-2 font-bold"
              >
                {t.sendPhoneCode}
              </button>

              <input
                value={phoneCode}
                onChange={(e) =>
                  setPhoneCode(
                    e.target.value
                  )
                }
                placeholder={t.code}
                className="rounded-xl border p-2"
              />

              <button
                onClick={verifyPhone}
                className="rounded-xl bg-black px-4 py-2 font-bold text-white"
              >
                {t.verify}
              </button>

              {devCode && (
                <span className="self-center text-xs">
                  {language === "ar"
                    ? "رمز التطوير:"
                    : "Dev code:"}{" "}
                  {devCode}
                </span>
              )}
            </div>
          )}
        </section>

        {/* TAX */}

        <section className="space-y-4 rounded-3xl border bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">
            {t.taxInformation}
          </h2>

          <div className="grid gap-3 md:grid-cols-2">
            <input
              placeholder={t.taxId}
              value={
                data.store
                  ?.taxInformation?.taxId ||
                ""
              }
              onChange={(e) =>
                updateStore(
                  "taxInformation",
                  {
                    ...(data.store
                      ?.taxInformation ||
                      {}),
                    taxId:
                      e.target.value,
                  }
                )
              }
              className="rounded-xl border p-3"
            />

            <input
              placeholder={t.legalName}
              value={
                data.store
                  ?.taxInformation
                  ?.legalName || ""
              }
              onChange={(e) =>
                updateStore(
                  "taxInformation",
                  {
                    ...(data.store
                      ?.taxInformation ||
                      {}),
                    legalName:
                      e.target.value,
                  }
                )
              }
              className="rounded-xl border p-3"
            />
          </div>

          <button
            onClick={saveProfile}
            className="rounded-xl bg-black px-5 py-3 font-bold text-white"
          >
            {t.saveTax}
          </button>
        </section>
      </div>
    </main>
  );
}
