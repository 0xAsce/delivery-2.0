 "use client";

import { useEffect, useMemo, useState } from "react";

const emptyForm = {
  name: "",
  description: "",
  categoryId: "",
  categoryName: "عام",
  costPrice: "",
  sellingPrice: "",
  discountPrice: "",
  stockQuantity: "0",
  lowStockAlert: "5",
  sku: "",
  barcode: "",
  imageUrl: "",
  isFeatured: false,
};

function money(value) {
  return new Intl.NumberFormat("ar-DZ", {
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function SellerProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/seller/products", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "تعذر تحميل المنتجات");

      setProducts(data.products || []);
      setCategories(data.categories || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      `${p.name} ${p.category?.name || ""}`.toLowerCase().includes(q)
    );
  }, [products, search]);

  function startEdit(product) {
    const variant = product.variants?.[0];

    setEditingId(product.id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      categoryId: product.categoryId || "",
      categoryName: product.category?.name || "عام",
      costPrice: product.costPrice ?? "",
      sellingPrice: product.sellingPrice ?? "",
      discountPrice: product.discountPrice ?? "",
      stockQuantity: variant?.stockQuantity ?? 0,
      lowStockAlert: variant?.lowStockAlert ?? 5,
      sku: variant?.sku || "",
      barcode: variant?.barcode || "",
      imageUrl: product.images?.[0]?.url || "",
      isFeatured: Boolean(product.isFeatured),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const endpoint = editingId
        ? `/api/seller/products/${editingId}`
        : "/api/seller/products";

      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "تعذر حفظ المنتج");

      setMessage(editingId ? "تم تحديث المنتج بنجاح" : "تمت إضافة المنتج بنجاح");
      resetForm();
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(product) {
    const confirmed = window.confirm(
      `هل تريد إخفاء المنتج "${product.name}" من المتجر؟`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/seller/products/${product.id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر حذف المنتج");

      setMessage("تم إخفاء المنتج. بقيت بياناته محفوظة للطلبات القديمة.");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function toggleHidden(product) {
    try {
      const response = await fetch(`/api/seller/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: !product.isHidden }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر تغيير حالة المنتج");

      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black">إدارة المنتجات</h1>
            <p className="mt-1 text-sm text-gray-500">
              إضافة وتعديل وإخفاء المنتجات والمخزون
            </p>
          </div>

          <a
            href="/seller/dashboard"
            className="rounded-xl border bg-white px-4 py-2 font-bold shadow-sm"
          >
            ← لوحة التحكم
          </a>
        </div>

        {(error || message) && (
          <div
            className={`mb-5 rounded-xl border p-4 ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {error || message}
          </div>
        )}

        <form
          onSubmit={submit}
          className="mb-8 rounded-2xl border bg-white p-5 shadow-sm"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black">
              {editingId ? "تعديل المنتج" : "إضافة منتج جديد"}
            </h2>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border px-4 py-2 font-bold"
              >
                إلغاء التعديل
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <label className="space-y-1">
              <span className="text-sm font-bold">اسم المنتج *</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border p-3"
                placeholder="مثال: حليب كامل الدسم"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-bold">الفئة</span>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full rounded-xl border p-3"
              >
                <option value="">إنشاء/استخدام الفئة العامة</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            {!form.categoryId && (
              <label className="space-y-1">
                <span className="text-sm font-bold">اسم الفئة الجديدة</span>
                <input
                  value={form.categoryName}
                  onChange={(e) =>
                    setForm({ ...form, categoryName: e.target.value })
                  }
                  className="w-full rounded-xl border p-3"
                />
              </label>
            )}

            <label className="space-y-1">
              <span className="text-sm font-bold">سعر البيع *</span>
              <input
                required
                type="number"
                min="0"
                value={form.sellingPrice}
                onChange={(e) =>
                  setForm({ ...form, sellingPrice: e.target.value })
                }
                className="w-full rounded-xl border p-3"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-bold">سعر التكلفة</span>
              <input
                type="number"
                min="0"
                value={form.costPrice}
                onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
                className="w-full rounded-xl border p-3"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-bold">سعر التخفيض</span>
              <input
                type="number"
                min="0"
                value={form.discountPrice}
                onChange={(e) =>
                  setForm({ ...form, discountPrice: e.target.value })
                }
                className="w-full rounded-xl border p-3"
                placeholder="اختياري"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-bold">المخزون</span>
              <input
                type="number"
                min="0"
                value={form.stockQuantity}
                onChange={(e) =>
                  setForm({ ...form, stockQuantity: e.target.value })
                }
                className="w-full rounded-xl border p-3"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-bold">تنبيه المخزون عند</span>
              <input
                type="number"
                min="0"
                value={form.lowStockAlert}
                onChange={(e) =>
                  setForm({ ...form, lowStockAlert: e.target.value })
                }
                className="w-full rounded-xl border p-3"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-bold">SKU</span>
              <input
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="w-full rounded-xl border p-3"
                placeholder="يتم توليده تلقائياً إن تركته فارغاً"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-bold">الباركود</span>
              <input
                value={form.barcode}
                onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                className="w-full rounded-xl border p-3"
              />
            </label>

            <label className="space-y-1 md:col-span-2">
              <span className="text-sm font-bold">رابط الصورة</span>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full rounded-xl border p-3"
                placeholder="https://..."
              />
            </label>

            <label className="space-y-1 md:col-span-3">
              <span className="text-sm font-bold">الوصف</span>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="min-h-24 w-full rounded-xl border p-3"
              />
            </label>

            <label className="flex items-center gap-2 font-bold">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) =>
                  setForm({ ...form, isFeatured: e.target.checked })
                }
              />
              منتج مميز
            </label>
          </div>

          <button
            disabled={saving}
            className="mt-5 rounded-xl bg-black px-6 py-3 font-black text-white disabled:opacity-50"
          >
            {saving ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة المنتج"}
          </button>
        </form>

        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-black">
              المنتجات ({filtered.length})
            </h2>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border p-3"
              placeholder="بحث عن منتج..."
            />
          </div>

          {loading ? (
            <p className="py-10 text-center text-gray-500">جاري التحميل...</p>
          ) : filtered.length === 0 ? (
            <p className="py-10 text-center text-gray-500">
              لا توجد منتجات.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-right">
                <thead className="border-b text-sm text-gray-500">
                  <tr>
                    <th className="p-3">المنتج</th>
                    <th className="p-3">الفئة</th>
                    <th className="p-3">السعر</th>
                    <th className="p-3">المخزون</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3">إجراءات</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filtered.map((product) => {
                    const variant = product.variants?.[0];
                    const stock = variant?.stockQuantity ?? 0;
                    const low = stock <= (variant?.lowStockAlert ?? 0);

                    return (
                      <tr key={product.id}>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            {product.images?.[0]?.url ? (
                              <img
                                src={product.images[0].url}
                                alt=""
                                className="h-12 w-12 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                                📦
                              </div>
                            )}
                            <div>
                              <p className="font-black">{product.name}</p>
                              {product.isFeatured && (
                                <span className="text-xs text-amber-600">
                                  ⭐ مميز
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3">{product.category?.name || "—"}</td>
                        <td className="p-3 font-bold">
                          {money(product.discountPrice ?? product.sellingPrice)} دج
                        </td>
                        <td className="p-3">
                          <span className={low ? "font-black text-red-600" : "font-bold"}>
                            {stock}
                          </span>
                        </td>
                        <td className="p-3">
                          {product.isHidden ? (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold">
                              مخفي
                            </span>
                          ) : (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                              ظاهر
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => startEdit(product)}
                              className="rounded-lg border px-3 py-2 text-sm font-bold"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => toggleHidden(product)}
                              className="rounded-lg border px-3 py-2 text-sm font-bold"
                            >
                              {product.isHidden ? "إظهار" : "إخفاء"}
                            </button>
                            {!product.isHidden && (
                              <button
                                onClick={() => remove(product)}
                                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white"
                              >
                                حذف
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
