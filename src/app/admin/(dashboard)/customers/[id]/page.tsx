import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomerProfilePage({ params }: { params: { id: string } }) {
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: {
      orders: { orderBy: { createdAt: "desc" }, include: { items: true } },
      reservations: { orderBy: { date: "desc" } },
    },
  });
  if (!customer) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-bone">{customer.name}</h1>
        <p className="mt-1 text-sm text-bone-muted">{customer.email} · {customer.phone ?? "No phone"} · Joined {formatDate(customer.createdAt)}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl bg-char p-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-smoke">Total Spent</p>
          <p className="mt-3 font-display text-2xl text-gold">{formatCurrency(Number(customer.totalSpent))}</p>
        </div>
        <div className="rounded-2xl bg-char p-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-smoke">Orders</p>
          <p className="mt-3 font-display text-2xl text-bone">{customer.orders.length}</p>
        </div>
        <div className="rounded-2xl bg-char p-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-smoke">Reservations</p>
          <p className="mt-3 font-display text-2xl text-bone">{customer.reservations.length}</p>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-display text-xl text-bone">Order History</h2>
        <div className="overflow-x-auto rounded-2xl bg-char">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-smoke">
                <th className="px-5 py-3 font-mono">Order</th>
                <th className="px-5 py-3 font-mono">Items</th>
                <th className="px-5 py-3 font-mono">Total</th>
                <th className="px-5 py-3 font-mono">Status</th>
                <th className="px-5 py-3 font-mono">Date</th>
              </tr>
            </thead>
            <tbody>
              {customer.orders.map((o) => (
                <tr key={o.id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3 font-mono text-xs text-bone">{o.orderNumber}</td>
                  <td className="px-5 py-3 text-bone-muted">{o.items.reduce((s, i) => s + i.quantity, 0)} items</td>
                  <td className="px-5 py-3 font-mono text-gold">{formatCurrency(Number(o.total))}</td>
                  <td className="px-5 py-3 text-bone-muted">{o.status}</td>
                  <td className="px-5 py-3 font-mono text-xs text-smoke">{formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
