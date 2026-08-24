import { DollarSign, ShoppingBag, Users, CalendarCheck, Receipt, Clock, TrendingUp, ChefHat } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { RevenueTrendChart, OrdersTrendChart, StatusBreakdownChart } from "@/components/admin/Charts";
import { getDashboardStats, getRevenueTrend, getOrdersTrend, getOrderStatusBreakdown } from "@/lib/data-admin";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, revenueTrend, ordersTrend, statusBreakdown] = await Promise.all([
    getDashboardStats(),
    getRevenueTrend(),
    getOrdersTrend(),
    getOrderStatusBreakdown(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-bone">Dashboard</h1>
        <p className="mt-1 text-sm text-bone-muted">Live overview of EMBERA&apos;s performance.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={formatCurrency(stats.totalRevenue)} accent />
        <StatCard icon={ShoppingBag} label="Total Orders" value={String(stats.totalOrders)} />
        <StatCard icon={Users} label="Customers" value={String(stats.customers)} />
        <StatCard icon={CalendarCheck} label="Reservations" value={String(stats.reservations)} />
        <StatCard icon={Receipt} label="Avg Order Value" value={formatCurrency(stats.avgOrderValue)} />
        <StatCard icon={Clock} label="Pending Orders" value={String(stats.pendingOrders)} />
        <StatCard icon={TrendingUp} label="Today's Revenue" value={formatCurrency(stats.todayRevenue)} accent />
        <StatCard icon={ChefHat} label="Popular Dish" value={stats.popularDish} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl bg-char p-6 lg:col-span-2">
          <h2 className="mb-4 font-display text-lg text-bone">Revenue (last 14 days)</h2>
          <RevenueTrendChart data={revenueTrend} />
        </div>
        <div className="rounded-2xl bg-char p-6">
          <h2 className="mb-4 font-display text-lg text-bone">Orders by Status</h2>
          {statusBreakdown.length > 0 ? (
            <StatusBreakdownChart data={statusBreakdown} />
          ) : (
            <p className="py-12 text-center text-sm text-smoke">No orders yet.</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-char p-6">
        <h2 className="mb-4 font-display text-lg text-bone">Orders (last 14 days)</h2>
        <OrdersTrendChart data={ordersTrend} />
      </div>
    </div>
  );
}
