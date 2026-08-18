"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const status = { PENDING: "قيد الانتظار", CONFIRMED: "تم التأكيد", OUT_FOR_DELIVERY: "في الطريق", DELIVERED: "تم التوصيل", CANCELLED: "ملغى" };
const steps = ["PENDING", "CONFIRMED", "OUT_FOR_DELIVERY", "DELIVERED"];

export default function OrderDetails() {
  const { id } = useParams(); const [order, setOrder] = useState(null); const [error, setError] = useState("");
  useEffect(() => { fetch("/api/customer/orders").then(async r => { if (r.status === 401) { window.location.href = "/customer/login"; return; } const d = await r.json(); const found = d.orders?.find(x => x.id === id); if (!found) setError("الطلب غير موجود"); else setOrder(found); }).catch(() => setError("تعذر الاتصال بالخادم")); }, [id]);
  if (!order) return <main dir="rtl" className="min-h-screen bg-[#f7f8f4] p-4 flex items-center justify-center">{error || "جاري التحميل…"}</main>;
  const current = steps.indexOf(order.status);
  return <main dir="rtl" className="min-h-screen bg-[#f7f8f4] p-4"><div className="max-w-2xl mx-auto space-y-4">
    <div className="flex items-center justify-between"><Link href="/customer/orders" className="underline">← طلباتي</Link><Link href="/customer/profile" className="underline">الملف الشخصي</Link></div>
    <section className="bg-white rounded-3xl p-6 border border-gray-200"><p className="text-gray-500">تفاصيل الطلب</p><h1 className="text-2xl font-black mt-1">#{order.id.slice(-8)}</h1><p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString("ar-DZ")}</p>
      <div className="mt-6 space-y-3">{steps.map((step, i) => <div key={step} className="flex items-center gap-3"><div className={`w-4 h-4 rounded-full ${i <= current ? "bg-green-600" : "bg-gray-200"}`} /><span className={i === current ? "font-black" : "text-gray-600"}>{status[step]}</span></div>)}</div>
    </section>
    <section className="bg-white rounded-3xl p-6 border border-gray-200"><h2 className="font-black text-lg mb-4">المنتجات</h2>{order.items.map(item => <div key={item.id} className="flex justify-between gap-3 py-3 border-b last:border-0"><div><b>{item.name}</b><p className="text-sm text-gray-500">{item.quantity} × {Number(item.price).toLocaleString("fr-DZ")} دج</p></div><b>{(Number(item.price) * item.quantity).toLocaleString("fr-DZ")} دج</b></div>)}<div className="flex justify-between mt-5 text-xl font-black"><span>المجموع</span><span>{Number(order.total).toLocaleString("fr-DZ")} دج</span></div></section>
    <section className="bg-white rounded-3xl p-6 border border-gray-200"><h2 className="font-black mb-3">معلومات التوصيل</h2><p>{order.wilaya || "—"} · {order.city || "—"}</p>{order.address && <p className="text-gray-600 mt-1">{order.address}</p>}<p className="text-gray-500 text-sm mt-3">الدفع: {order.paymentStatus === "PAID" ? "مدفوع" : "الدفع عند الاستلام"}</p>{order.note && <p className="mt-3 text-gray-600">ملاحظة: {order.note}</p>}</section>
  </div></main>;
}
