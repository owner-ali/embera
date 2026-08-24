import { prisma } from "@/lib/prisma";
import { subDays, startOfDay, format } from "date-fns";

export async function getDashboardStats() {
  const [revenueAgg, orderCount, customerCount, reservationCount, pendingOrders, todayRevenueAgg, avgOrderAgg] =
    await Promise.all([
      prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } }),
      prisma.order.count(),
      prisma.customer.count(),
      prisma.reservation.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.aggregate({
        where: { paymentStatus: "PAID", createdAt: { gte: startOfDay(new Date()) } },
        _sum: { total: true },
      }),
      prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _avg: { total: true } }),
    ]);

  const popularDishItem = await prisma.orderItem.groupBy({
    by: ["dishId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 1,
  });
  const popularDish = popularDishItem[0]
    ? await prisma.dish.findUnique({ where: { id: popularDishItem[0].dishId } })
    : null;

  return {
    totalRevenue: Number(revenueAgg._sum.total ?? 0),
    totalOrders: orderCount,
    customers: customerCount,
    reservations: reservationCount,
    avgOrderValue: Number(avgOrderAgg._avg.total ?? 0),
    pendingOrders,
    todayRevenue: Number(todayRevenueAgg._sum.total ?? 0),
    popularDish: popularDish?.name ?? "—",
  };
}

export async function getRevenueTrend(days = 14) {
  const since = subDays(new Date(), days);
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: since }, paymentStatus: "PAID" },
    select: { createdAt: true, total: true },
  });

  const byDay = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    byDay.set(format(subDays(new Date(), i), "MMM d"), 0);
  }
  for (const o of orders) {
    const key = format(o.createdAt, "MMM d");
    if (byDay.has(key)) byDay.set(key, (byDay.get(key) ?? 0) + Number(o.total));
  }
  return Array.from(byDay.entries()).map(([date, revenue]) => ({ date, revenue: +revenue.toFixed(2) }));
}

export async function getOrdersTrend(days = 14) {
  const since = subDays(new Date(), days);
  const orders = await prisma.order.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } });

  const byDay = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) byDay.set(format(subDays(new Date(), i), "MMM d"), 0);
  for (const o of orders) {
    const key = format(o.createdAt, "MMM d");
    if (byDay.has(key)) byDay.set(key, (byDay.get(key) ?? 0) + 1);
  }
  return Array.from(byDay.entries()).map(([date, orders]) => ({ date, orders }));
}

export async function getOrderStatusBreakdown() {
  const rows = await prisma.order.groupBy({ by: ["status"], _count: true });
  return rows.map((r) => ({ status: r.status, count: r._count }));
}

export async function getCategoryRevenueBreakdown() {
  const items = await prisma.orderItem.findMany({
    include: { dish: { include: { category: true } } },
  });
  const byCategory = new Map<string, number>();
  for (const item of items) {
    const cat = item.dish.category.name;
    byCategory.set(cat, (byCategory.get(cat) ?? 0) + Number(item.unitPrice) * item.quantity);
  }
  return Array.from(byCategory.entries()).map(([category, revenue]) => ({ category, revenue: +revenue.toFixed(2) }));
}

export async function getAllOrders() {
  return prisma.order.findMany({
    include: { items: { include: { dish: true } }, customer: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllReservations() {
  return prisma.reservation.findMany({
    include: { table: true, customer: true },
    orderBy: { date: "asc" },
  });
}

export async function getAllCustomers() {
  return prisma.customer.findMany({
    include: { _count: { select: { orders: true, reservations: true } } },
    orderBy: { totalSpent: "desc" },
  });
}

export async function getAllReviews() {
  return prisma.review.findMany({
    include: { customer: true, dish: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllGalleryImages() {
  return prisma.galleryImage.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
}

export async function getAllMessages() {
  return prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getAllAdminUsers() {
  return prisma.user.findMany({ include: { permissions: true }, orderBy: { createdAt: "asc" } });
}

export async function getAllSiteSettings() {
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function getRecentNotifications(limit = 12) {
  return prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: limit });
}

export async function getUnreadNotificationCount() {
  return prisma.notification.count({ where: { isRead: false } });
}
