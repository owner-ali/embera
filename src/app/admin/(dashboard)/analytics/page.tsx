import { TrendingUp, Star, Users2, Percent } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { RevenueTrendChart, CategoryRevenueChart, StatusBreakdownChart } from "@/components/admin/Charts";
import { getRevenueTrend, getCategoryRevenueBreakdown, getOrderStatusBreakdown, getDashboardStats } from "@/lib/data-admin";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const [revenueTrend, categoryRevenue, statusBreakdown, stats, topDishes, reviewAgg] = await Promise.all([
    getRevenueTrend(30),
    getCategoryRevenueBreakdown(),
    getOrderStatusBreakdown(),
    getDashboardStats(),
    prisma.orderItem.groupBy({ by: ["dishId"], _sum: { quantity: true }, orderBy: { _sum: { quantity: "desc" } }, take: 5 }),
    prisma.review.aggregate({ where: { isApproved: true }, _avg: { rating: true }, _count: true }),
  ]);

  const dishDetails = await prisma.dish.findMany({ where: { id: { in: topDishes.map((d) => d.dishId) } } });
  const dishMap = new Map(dishDetails.map((d) => [d.id, d]));
  const totalCustomers = await prisma.customer.count();
  const repeatCustomers = await prisma.customer.count({ where: { orders: { some: {} } } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-bone">Analytics</h1>
        <p className="mt-1 text-sm text-bone-muted">Deeper performance insights across the last 30 days.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={TrendingUp} label="Total Revenue" value={formatCurrency(stats.totalRevenue)} accent />
        <StatCard icon={Star} label="Avg Rating" value={(reviewAgg._avg.rating ?? 0).toFixed(1)} />
        <StatCard icon={Users2} label="Customers w/ Orders" value={String(repeatCustomers)} />
        <StatCard icon={Percent} label="Conversion (orders/customers)" value={totalCustomers > 0 ? `${Math.round((repeatCustomers / totalCustomers) * 100)}%` : "—"} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl bg-char p-6">
          <h2 className="mb-4 font-display text-lg text-bone">Revenue (30 days)</h2>
          <RevenueTrendChart data={revenueTrend} />
        </div>
        <div className="rounded-2xl bg-char p-6">
          <h2 className="mb-4 font-display text-lg text-bone">Revenue by Category</h2>
          {categoryRevenue.length > 0 ? <CategoryRevenueChart data={categoryRevenue} /> : <p className="py-16 text-center text-sm text-smoke">No sales yet.</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl bg-char p-6">
          <h2 className="mb-4 font-display text-lg text-bone">Order Status Breakdown</h2>
          {statusBreakdown.length > 0 ? <StatusBreakdownChart data={statusBreakdown} /> : <p className="py-16 text-center text-sm text-smoke">No orders yet.</p>}
        </div>
        <div className="rounded-2xl bg-char p-6">
          <h2 className="mb-4 font-display text-lg text-bone">Top 5 Dishes</h2>
          <ul className="space-y-3">
            {topDishes.map((t, i) => {
              const dish = dishMap.get(t.dishId);
              if (!dish) return null;
              return (
                <li key={t.dishId} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                  <span className="flex items-center gap-3 text-sm text-bone-muted">
                    <span className="font-mono text-xs text-smoke">#{i + 1}</span>
                    {dish.name}
                  </span>
                  <span className="font-mono text-sm text-gold">{t._sum.quantity} sold</span>
                </li>
              );
            })}
            {topDishes.length === 0 && <p className="py-6 text-center text-sm text-smoke">No sales yet.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}
