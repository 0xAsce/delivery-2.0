 "use client";

import { useEffect, useMemo, useState } from "react";

const statuses = [
  ["", "الكل"],
  ["PENDING", "معلقة"],
  ["CONFIRMED", "مؤكدة"],
  ["PROCESSING", "قيد التحضير"],
  ["SHIPPED", "تم الشحن"],
  ["DELIVERED", "تم التسليم"],
  ["CANCELLED", "ملغاة"],
];

const statusLabels = Object.fromEntries(statuses);

function money(value) {
  return new Intl.NumberFormat("ar-DZ", {
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function date(value) {
  return new Intl.DateTimeFormat("ar-DZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const query = filter ? `?status=${encodeURIComponent(filter)}` : "";
      const response = await fetch(`/api/seller/orders${query}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "تعذر تحميل الطلبات");

      setOrders(data.orders || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [filter]);

  async function updateStatus(id, status) {
    try {
      const response = await fetch(`/api/seller/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "تعذر تحديث الطلب");

      setOrders((current) =>
        current.map((order) => (order.id === id ? data.order : order))
      );
      setSelected(data.order);
    } catch (e) {
      setError(e.message);
    }
  }

  async function updatePayment(id, paymentStatus) {
    try {
      const response = await fetch(`/api/seller/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "تعذر تحديث الدفع");

      setOrders((current) =>
        current.map((order) => (order.id === id ? data.order : order))
      );
      setSelected(data.order);
    } catch (e) {
      setError(e.message);
    }
  }

  const pendingCount = useMemo(
    () => orders.filter((order) => order.status === "PENDING").length,
    [orders]
  );

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black">إدارة الطلبات</h1>
            <p className="mt-1 text-sm text-gray-500">
              {pendingCount} طلب معلق في القائمة الحالية
            </p>
          </div>

          <div className="flex gap-2">
            <a
              href="/seller/dashboard"
              className="rounded-xl border bg-white px-4 py-2 font-bold shadow-sm"
            >
              ← لوحة التحكم
            </a>
            <button
              onClick={load}
              className="rounded-xl bg-black px-4 py-2 font-bold text-white"
            >
              تحديث
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-5 flex flex-wrap gap-2">
          {statuses.map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded-full px-4 py-2 text-sm font-bold ${
                filter === value
                  ? "bg-black text-white"
                  : "border bg-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          {loading ? (
            <p className="py-12 text-center text-gray-500">
              جاري تحميل الطلبات...
            </p>
          ) : orders.length === 0 ? (
            <p className="py-12 text-center text-gray-500">
              لا توجد طلبات في هذه الحالة.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-right">
                <thead className="border-b bg-gray-50 text-sm text-gray-500">
                  <tr>
                    <th className="p-4">الطلب</th>
                    <th className="p-4">العميل</th>
                    <th className="p-4">المكان</th>
                    <th className="p-4">المنتجات</th>
                    <th className="p-4">المجموع</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4">التاريخ</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => setSelected(order)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <td className="p-4 font-black">
                        #{order.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="p-4">
                        <p className="font-bold">
                          {order.customer?.name || order.name || "بدون اسم"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.customer?.phone || order.phone || "—"}
                        </p>
                      </td>
                      <td className="p-4 text-sm">
                        {order.wilaya || order.customer?.wilaya || "—"}
                        {order.city || order.customer?.city
                          ? ` / ${order.city || order.customer?.city}`
                          : ""}
                      </td>
                      <td className="p-4 text-sm">
                        {order.items.length} منتج /{" "}
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} وحدة
                      </td>
                      <td className="p-4 font-black">
                        {money(order.total)} دج
                      </td>
                      <td className="p-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold">
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-gray-500">
                        {date(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {selected && (
          <div className="fixed inset-0 z-50 bg-black/40 p-4">
            <div className="mx-auto mt-8 max-h-[90vh] max-w-3xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">تفاصيل الطلب</p>
                  <h2 className="text-2xl font-black">
                    #{selected.id.slice(-8).toUpperCase()}
                  </h2>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="rounded-xl border px-3 py-2 font-bold"
                >
                  إغلاق
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border p-4">
                  <h3 className="mb-2 font-black">العميل</h3>
                  <p>{selected.customer?.name || selected.name || "—"}</p>
                  <p>{selected.customer?.phone || selected.phone || "—"}</p>
                  <p>{selected.customer?.email || selected.email || "—"}</p>
                </div>

                <div className="rounded-xl border p-4">
                  <h3 className="mb-2 font-black">التوصيل</h3>
                  <p>
                    {selected.wilaya || selected.customer?.wilaya || "—"} /{" "}
                    {selected.city || selected.customer?.city || "—"}
                  </p>
                  <p>
                    {selected.address || selected.customer?.address || "بدون عنوان"}
                  </p>
                  <p>الطريقة: {selected.deliveryMethod || "—"}</p>
                </div>
              </div>

              <div className="my-4 rounded-xl border p-4">
                <h3 className="mb-3 font-black">المنتجات</h3>

                <div className="divide-y">
                  {selected.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} × {money(item.price)} دج
                        </p>
                      </div>
                      <p className="font-black">
                        {money(item.price * item.quantity)} دج
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex justify-between border-t pt-3 text-lg font-black">
                  <span>المجموع</span>
                  <span>{money(selected.total)} دج</span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-bold">حالة الطلب</p>
                  <select
                    value={selected.status}
                    onChange={(e) => updateStatus(selected.id, e.target.value)}
                    className="w-full rounded-xl border p-3 font-bold"
                  >
                    {statuses
                      .filter(([value]) => value)
                      .map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <p className="mb-2 text-sm font-bold">حالة الدفع</p>
                  <select
                    value={selected.paymentStatus}
                    onChange={(e) =>
                      updatePayment(selected.id, e.target.value)
                    }
                    className="w-full rounded-xl border p-3 font-bold"
                  >
                    <option value="UNPAID">غير مدفوع</option>
                    <option value="PAID">مدفوع</option>
                    <option value="REFUNDED">مسترجع</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  ["CONFIRMED", "تأكيد الطلب"],
                  ["PROCESSING", "بدء التحضير"],
                  ["SHIPPED", "تم الشحن"],
                  ["DELIVERED", "تم التسليم"],
                  ["CANCELLED", "إلغاء الطلب"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => updateStatus(selected.id, value)}
                    className={`rounded-xl px-4 py-2 font-bold ${
                      value === "CANCELLED"
                        ? "bg-red-600 text-white"
                        : "bg-black text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <p className="mt-4 text-xs text-gray-400">
                تم إنشاء الطلب: {date(selected.createdAt)}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
