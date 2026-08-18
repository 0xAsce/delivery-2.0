"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function formatPrice(value) {
  return `${Number(value || 0).toLocaleString("en-DZ")} DA`;
}

function statusClass(status) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";

    case "CONFIRMED":
      return "bg-blue-100 text-blue-800";

    case "PROCESSING":
      return "bg-purple-100 text-purple-800";

    case "SHIPPED":
      return "bg-indigo-100 text-indigo-800";

    case "DELIVERED":
      return "bg-green-100 text-green-800";

    case "CANCELLED":
      return "bg-red-100 text-red-800";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function CustomerOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/customer/orders",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/customer/login");
          return;
        }

        throw new Error(
          data?.error || "Failed to load orders."
        );
      }

      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to load your orders."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function deleteOrder(orderId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/customer/orders/${orderId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to delete order."
        );
      }

      setOrders((current) =>
        current.filter(
          (order) => order.id !== orderId
        )
      );
    } catch (err) {
      console.error(err);

      alert(
        err.message || "Failed to delete order."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] p-4">
      <div className="max-w-4xl mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black">
              My Orders
            </h1>

            <p className="text-gray-500 mt-1">
              View and manage your orders.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl bg-black text-white px-4 py-3 font-bold"
          >
            Shop
          </Link>
        </div>

        {error && (
          <div className="rounded-2xl bg-red-50 text-red-700 p-4 mb-5">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-3xl border border-gray-200 p-6 animate-pulse"
              >
                <div className="h-5 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-3" />
                <div className="h-10 bg-gray-200 rounded mt-6" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center">
            <h2 className="text-xl font-black">
              No orders yet
            </h2>

            <p className="text-gray-500 mt-2">
              Your orders will appear here.
            </p>

            <Link
              href="/"
              className="inline-block mt-5 rounded-xl bg-black text-white px-5 py-3 font-bold"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const firstItem = order.items?.[0];

              const itemCount =
                order.items?.reduce(
                  (sum, item) =>
                    sum + Number(item.quantity || 0),
                  0
                ) || 0;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">
                        Order
                      </p>

                      <h2 className="font-black text-lg break-all">
                        #{order.id}
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(
                          order.createdAt
                        ).toLocaleString("en-DZ")}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${statusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="font-bold">
                          {firstItem?.name ||
                            "Order items"}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          {itemCount} item
                          {itemCount === 1
                            ? ""
                            : "s"}
                        </p>
                      </div>

                      <p className="font-black whitespace-nowrap">
                        {formatPrice(order.total)}
                      </p>
                    </div>

                    {order.deliveryMethod && (
                      <p className="text-sm text-gray-500 mt-3">
                        Delivery:{" "}
                        <span className="font-semibold text-gray-700">
                          {order.deliveryMethod}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/customer/orders/${order.id}`}
                      className="flex-1 text-center rounded-xl bg-black text-white px-4 py-3 font-bold"
                    >
                      View order
                    </Link>

                    {order.status === "PENDING" && (
                      <button
                        type="button"
                        onClick={() =>
                          deleteOrder(order.id)
                        }
                        className="rounded-xl border border-red-200 text-red-600 px-4 py-3 font-bold hover:bg-red-50"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}