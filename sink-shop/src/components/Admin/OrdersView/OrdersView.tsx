import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  priceEur: number;
  priceBgn: number;
}

interface Product {
  id: string;
  model: {
    en: string;
    bg: string;
  };
  title: {
    en: string;
    bg: string;
  };
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalEur: number;
  totalBgn: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

const OrdersView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation();

  const isEnglish = i18n.language === "en";
  const currency = isEnglish ? "€" : "лв";

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://artindohome.com/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://artindohome.com/api/admin/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      console.error("Error fetching products:", err);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://artindohome.com/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Refresh orders
      fetchOrders();
    } catch (err: any) {
      console.error("Error updating order status:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    const statusKey = `admin.orderStatuses.${status}` as const;
    return t(statusKey);
  };

  const getPaymentStatusText = (status: string) => {
    const statusKey = `admin.paymentStatuses.${status}` as const;
    return t(statusKey);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getProductInfo = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return { model: `Product ID: ${productId}`, title: "" };

    const lang = isEnglish ? "en" : "bg";
    return {
      model: product.model[lang] || product.model.en,
      title: product.title[lang] || product.title.en,
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error loading orders: {error}</div>
        <button
          onClick={fetchOrders}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{t("admin.orders")}</h2>
        <div className="text-sm text-gray-500">
          {t("admin.totalOrders")}: {orders.length}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{t("admin.noOrders")}</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {t("admin.order")} #{order.id.substring(0, 8)}
                      </h3>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {getPaymentStatusText(order.paymentStatus)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-gray-900">
                      {isEnglish ? order.totalEur.toFixed(2) : order.totalBgn.toFixed(2)} {currency}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? t("cart.item") : t("cart.items")}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">{t("admin.customerInfo")}:</h4>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                    {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                  </p>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">{t("admin.items")}:</h4>
                  <div className="mt-1 text-sm text-gray-600 space-y-1">
                    {order.items.map((item) => {
                      const productInfo = getProductInfo(item.productId);
                      return (
                        <div key={item.id} className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{productInfo.model}</div>
                            <div className="text-xs text-gray-500">{productInfo.title}</div>
                            <div className="text-xs text-gray-500">
                              {t("admin.quantity")}: {item.quantity}
                            </div>
                          </div>
                          <span className="font-medium">
                            {isEnglish ? item.priceEur.toFixed(2) : item.priceBgn.toFixed(2)}{" "}
                            {currency}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">{t("admin.orderStatuses.pending")}</option>
                    <option value="processing">{t("admin.orderStatuses.processing")}</option>
                    <option value="shipped">{t("admin.orderStatuses.shipped")}</option>
                    <option value="delivered">{t("admin.orderStatuses.delivered")}</option>
                    <option value="cancelled">{t("admin.orderStatuses.cancelled")}</option>
                  </select>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrdersView;
