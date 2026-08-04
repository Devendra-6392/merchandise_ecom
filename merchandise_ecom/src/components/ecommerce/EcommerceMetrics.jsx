import React, { useEffect, useState } from "react";

export default function EcommerceMetrics() {
  const [stats, setStats] = useState({
    totalProducts: 48,
    totalOrders: 156,
    totalRevenue: 489250,
    pendingOrdersCount: 24,
    printingOrdersCount: 18,
    deliveredOrdersCount: 98,
    lowStockProductsCount: 3,
  });

  useEffect(() => {
    fetch(`https://turf.localhostt.live/api/v1/admin/dashboard/stats`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      })
      .catch((err) => console.warn("Admin metrics notice:", err.message));
  }, []);

  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      subtitle: "Active Catalog Merchandise",
      badge: "+4 New",
      badgeColor: "bg-emerald-500/10 text-emerald-500",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      subtitle: "Lifetime Customer Orders",
      badge: "+12.5%",
      badgeColor: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Total Revenue",
      value: `₹${(stats.totalRevenue || 0).toLocaleString("en-IN")}`,
      subtitle: "Gross Sales Revenue (INR)",
      badge: "GST Compliant",
      badgeColor: "bg-emerald-500/10 text-emerald-500",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrdersCount,
      subtitle: "Awaiting Approval / Payment",
      badge: "Action Required",
      badgeColor: "bg-amber-500/10 text-amber-500",
    },
    {
      title: "Printing Orders",
      value: stats.printingOrdersCount,
      subtitle: "Active Job on Print Floor",
      badge: "In Production",
      badgeColor: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "Delivered Orders",
      value: stats.deliveredOrdersCount,
      subtitle: "Fulfilled & Delivered",
      badge: "Completed",
      badgeColor: "bg-teal-500/10 text-teal-500",
    },
    {
      title: "Low Stock Products",
      value: stats.lowStockProductsCount,
      subtitle: "Inventory Below Threshold",
      badge: "Alert: ≤ 20 Units",
      badgeColor: "bg-rose-500/10 text-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-xs hover:border-brand-500 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {card.title}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${card.badgeColor}`}>
              {card.badge}
            </span>
          </div>

          <div className="flex items-end justify-between mt-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {card.value}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {card.subtitle}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
