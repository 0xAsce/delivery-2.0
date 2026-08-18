"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const status = {
  PENDING: ["قيد الانتظار", "bg-amber-100 text-amber-800"],
  CONFIRMED: ["تم التأكيد", "bg-blue-100 text-blue-800"],
  OUT_FOR_DELIVERY: ["في الطريق", "bg-orange-100 text-orange-800"],
  DELIVERED: ["تم التوصيل", "bg-green-100 text-green-800"],
  CANCELLED: ["ملغى", "bg-red-100 text-red-800"],
};

export default function CustomerOrders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/customer/orders").then(async (r) => {
      if (r.status === 401) { window.location.href = "/customer/login"; return; }
      const d = await r.json();
      if (!r.ok) { setError(d.error || "تعذر تحميل الطلبات"); return; }
      setOrders(d.orders || []);
    }).catch(() => setError("تعذر الاتصال بالخادم"));
  }, []);
  if (!orders && !error) return <main className="min-h-screen bg-[#f7f8f4] flex items-center justify-center">جاري التحميل…</main>;
  return <main dir="rtl" className="min-h-screen bg-[#f7f8f4] p-4">
    <div className="max-w-2xl mx-auto space-y-4">
      <header className="bg-white rounded-3xl p-5 border border-gray-200 flex items-center justify-between">
        <div><p className="text-sm text-gray-500">حسابي</p><h1 className="text-2xl font-black">طلباتي</h1></div>
        <Link href="/customer/profile" className="rounded-xl bg-black text-white px-4 py-2 font-bold">الملف الشخصي</Link>
      </header>
      {error && <div className="bg-red-50 text-red-700 rounded-2xl p-4">{error}</div>}
      {orders?.length === 0 && <div className="bg-white rounded-3xl p-8 text-center border border-gray-200"><h2 className="font-black text-xl">لا توجد طلبات بعد</h2><p className="text-gray-500 mt-2">ابدأ التسوق الآن.</p><Link href="/" className="inline-block mt-5 rounded-xl bg-black text-white px-5 py-3 font-bold">تصفح المنتجات</Link></div>}
      {orders?.map((order) => {
  const s =
    status[order.status] ||
    [order.status, "bg-gray-100 text-gray-700"];

  async function cancelOrder(e) {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      "هل أنت متأكد أنك تريد إلغاء هذا الطلب؟"
    );

    if (!confirmed) return;

    try {
      const response = await fetch("/api/customer/orders", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "تعذر إلغاء الطلب");
        return;
      }

      setOrders((current) =>
        current.map((item) =>
          item.id === order.id
            ? { ...item, status: "CANCELLED" }
            : item
        )
      );
    } catch {
      alert("تعذر الاتصال بالخادم");
    }
  }

  return (
    <div
      key={order.id}
      className="bg-white rounded-3xl p-5 border border-gray-200"
    >
      <Link
        href={`/customer/orders/${order.id}`}
        className="block hover:opacity-80 transition"
      >
        <div className="flex justify-between gap-3">
          <div>
            <b>طلب #{order.id.slice(-8)}</b>

            <p className="text-sm text-gray-500 mt-1">
              {new Date(order.createdAt).toLocaleString("ar-DZ")}
            </p>
          </div>

          <span
            className={`h-fit rounded-full px-3 py-1 text-xs font-bold ${s[1]}`}
          >
            {s[0]}
          </span>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          {order.items.length} منتج
        </div>

        <div className="mt-1 text-xl font-black">
          {Number(order.total).toLocaleString("fr-DZ")} دج
        </div>
      </Link>

      {order.status === "PENDING" && (
        <button
          type="button"
          onClick={cancelOrder}
          className="mt-4 w-full rounded-xl bg-red-50 text-red-700 border border-red-200 px-4 py-3 font-bold hover:bg-red-100 transition"
        >
          إلغاء الطلب
        </button>
      )}
    </div>
  );
})}
    </div>
  </main>;
}
