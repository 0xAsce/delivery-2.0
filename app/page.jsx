"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORY_LIST, C } from "@/lib/data";

const categoryNames = { boissons: "مشروبات", epicerie: "بقالة", hygiene: "نظافة", snacks: "وجبات خفيفة" };
const statusNames = { PENDING: "قيد الانتظار", CONFIRMED: "تم التأكيد", OUT_FOR_DELIVERY: "في الطريق", DELIVERED: "تم التوصيل", CANCELLED: "ملغى" };

export default function Page() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [products, setProducts] = useState([]);
const [store, setStore] = useState(null);
const [hasSeller, setHasSeller] = useState(false);
  const [cart, setCart] = useState({});
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
  async function load() {
    try {
      const meResponse = await fetch(
        "/api/customer/me",
        {
          cache: "no-store",
        }
      );

      const me =
        meResponse.ok
          ? await meResponse.json()
          : null;

      const historyResponse = await fetch(
        "/api/customer/orders",
        {
          cache: "no-store",
        }
      );

      const history =
        historyResponse.ok
          ? await historyResponse.json()
          : { orders: [] };

      setUser(me?.user || null);
      setOrders(history.orders || []);

      if (me?.user) {
        const productsResponse =
          await fetch(
            "/api/customer/main-seller/products",
            {
              cache: "no-store",
            }
          );

        if (productsResponse.ok) {
          const productsData =
            await productsResponse.json();

          setProducts(
            productsData.products || []
          );

          setStore(
            productsData.store || null
          );

          setHasSeller(
            !!productsData.hasSeller
          );
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoaded(true);
    }
  }

  load();
}, []);

  const filtered = useMemo(() => products.filter(p => (category === "all" || p.category === category) && p.name.toLowerCase().includes(search.toLowerCase())), [products, category, search]);
  const cartItems = Object.entries(cart).map(([id, qty]) => { const p = products.find(x => x.id === id); return p ? { ...p, qty } : null; }).filter(Boolean);
  const total = cartItems.reduce((sum, p) => sum + p.price * p.qty, 0);

  function add(id) { setCart(v => ({ ...v, [id]: (v[id] || 0) + 1 })); }
  function remove(id) { setCart(v => { const next = { ...v }; next[id] = Math.max(0, (next[id] || 0) - 1); if (!next[id]) delete next[id]; return next; }); }

  async function checkout() {
    if (!user) { window.location.href = "/customer/login?next=/"; return; }
    if (!cartItems.length) return;
    setMessage("");
    const r = await fetch("/api/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    items: cartItems.map((p) => ({
      id: p.id,
      name: p.name,
      unit: p.unit,
      price: p.price,
      qty: p.qty,
    })),
  }),
});
const d = await r.json();
    if (!r.ok) { setMessage(d.error || "تعذر إرسال الطلب"); return; }
    setCart({}); setOrders(v => [d.order, ...v]); setSelected(d.order); setMessage("تم إرسال طلبك بنجاح");
  }

  if (!loaded) return <main className="min-h-screen bg-[#f7f8f4] flex items-center justify-center">جاري التحميل…</main>;

  return <main dir="rtl" className="min-h-screen bg-[#f7f8f4] text-[#16221B]">
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="font-black text-xl" style={{ color: C.primaryDark }}>حانوت دايركت</Link>
        <div className="flex items-center gap-2">
          {user ? <><Link href="/customer/orders" className="rounded-xl border px-3 py-2 font-bold">طلباتي</Link><Link href="/customer/profile" className="rounded-xl bg-black text-white px-3 py-2 font-bold">حسابي</Link></> : <Link href="/customer/login?next=/" className="rounded-xl bg-black text-white px-4 py-2 font-bold">تسجيل الدخول</Link>}
        </div>
      </div>
    </header>
{user && hasSeller && store && (
  <section className="bg-white rounded-3xl border border-gray-200 p-5">
    <div className="flex items-center gap-4">
      {store.logo ? (
        <img
          src={store.logo}
          alt={store.name}
          className="w-16 h-16 rounded-2xl object-cover"
        />
      ) : (
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl">
          🏪
        </div>
      )}

      <div className="flex-1">
        <p className="text-sm text-gray-500">
          حانوتك الرئيسي
        </p>

        <h2 className="text-xl font-black">
          {store.name}
        </h2>

        {store.description && (
          <p className="text-sm text-gray-500 mt-1">
            {store.description}
          </p>
        )}
      </div>

      <Link
        href="/customer/select-seller"
        className="rounded-xl border px-3 py-2 text-sm font-bold"
      >
        تغيير
      </Link>
    </div>
  </section>
)}
{user && !hasSeller && (
  <section className="bg-white rounded-3xl border border-gray-200 p-6 text-center">
    <div className="text-5xl mb-3">
      🏪
    </div>

    <h2 className="text-xl font-black">
      اختر حانوتك للبدء
    </h2>

    <p className="text-gray-500 mt-2">
      اختر البائع الرئيسي في منطقتك
      لمشاهدة منتجاته وطلبها.
    </p>

    <Link
      href="/customer/select-seller"
      className="inline-block mt-5 rounded-xl bg-black text-white px-6 py-3 font-black"
    >
      اختيار الحانوت
    </Link>
  </section>
)}
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <section className="rounded-3xl p-6 md:p-8 text-white" style={{ background: `linear-gradient(135deg, ${C.primaryDark}, ${C.primary})` }}>
        <p className="text-sm opacity-80">التسوق السريع</p><h1 className="text-3xl md:text-4xl font-black mt-2">اطلب منتجاتك بسهولة</h1><p className="mt-2 opacity-90">تصفح المنتجات، أضفها للسلة، وتابع طلبك حتى التوصيل.</p>
        {!user && <Link href="/customer/register?next=/" className="inline-block mt-5 rounded-xl bg-white text-black px-5 py-3 font-black">إنشاء حساب للبدء</Link>}
      </section>

      {user && <section className="grid md:grid-cols-3 gap-3"><Link href="/customer/profile" className="bg-white rounded-2xl p-4 border border-gray-200 font-bold">👤 الملف الشخصي<br/><span className="text-sm text-gray-500">{user.name}</span></Link><Link href="/customer/orders" className="bg-white rounded-2xl p-4 border border-gray-200 font-bold">📦 طلباتي<br/><span className="text-sm text-gray-500">{orders.length} طلب</span></Link><div className="bg-white rounded-2xl p-4 border border-gray-200 font-bold">🚚 آخر حالة<br/><span className="text-sm text-gray-500">{orders[0] ? statusNames[orders[0].status] : "لا توجد طلبات"}</span></div></section>}

      <section className="space-y-3"><div className="flex gap-2"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث عن منتج..." className="flex-1 rounded-2xl border border-gray-200 bg-white p-4 outline-none" /></div><div className="flex gap-2 overflow-x-auto pb-1">{["all", ...CATEGORY_LIST].map(c => <button key={c} onClick={() => setCategory(c)} className="whitespace-nowrap rounded-full px-4 py-2 font-bold border" style={{ background: category === c ? C.primary : "#fff", color: category === c ? "#fff" : C.ink, borderColor: category === c ? C.primary : C.line }}>{c === "all" ? "الكل" : categoryNames[c]}</button>)}</div></section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">{filtered.map(p => <article key={p.id} className="bg-white rounded-3xl overflow-hidden border border-gray-200 flex flex-col"><div className="h-36 flex items-center justify-center text-6xl" style={{ background: C.primarySoft }}>{p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : p.emoji}</div><div className="p-4 flex-1"><span className="text-xs text-gray-500">{categoryNames[p.category]}</span><h2 className="font-black mt-1">{p.name}</h2><p className="text-sm text-gray-500">{p.unit}</p><p className="font-black mt-2 text-lg">{p.price.toLocaleString("fr-DZ")} دج</p>{!p.stock ? <div className="mt-3 rounded-xl bg-red-50 text-red-700 p-2 text-center text-sm font-bold">غير متوفر</div> : <div className="mt-3 flex items-center gap-2"><button onClick={() => remove(p.id)} className="w-10 h-10 rounded-xl border font-black">−</button><span className="flex-1 text-center font-black">{cart[p.id] || 0}</span><button onClick={() => add(p.id)} className="w-10 h-10 rounded-xl text-white font-black" style={{ background: C.primary }}>+</button></div>}</div></article>)}</section>

      {message && <div className="fixed bottom-24 right-4 left-4 md:left-auto md:w-96 rounded-2xl bg-white border border-gray-200 shadow-xl p-4 font-bold z-50">{message}</div>}
      {cartItems.length > 0 && <aside className="fixed bottom-0 right-0 left-0 z-40 p-3 bg-white/95 backdrop-blur border-t border-gray-200"><div className="max-w-6xl mx-auto flex items-center gap-3"><div className="flex-1"><b>{cartItems.reduce((s, p) => s + p.qty, 0)} منتج</b><p className="font-black text-lg">{total.toLocaleString("fr-DZ")} دج</p></div><button onClick={checkout} className="rounded-2xl bg-black text-white px-6 py-4 font-black">{user ? "تأكيد الطلب" : "تسجيل الدخول للشراء"}</button></div></aside>}

      {selected && <section className="bg-white rounded-3xl border border-gray-200 p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">آخر طلب</p><h2 className="text-xl font-black">#{selected.id.slice(-8)}</h2></div><Link href={`/customer/orders/${selected.id}`} className="underline font-bold">عرض التفاصيل</Link></div><p className="mt-3 font-bold">{statusNames[selected.status] || selected.status}</p><p className="text-gray-500 mt-1">{Number(selected.total).toLocaleString("fr-DZ")} دج</p></section>}
    </div>
  </main>;
}
