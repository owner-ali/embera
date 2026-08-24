import { getAllOrders } from "@/lib/data-admin";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  const rows = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.customer?.name ?? o.guestName ?? "Guest",
    itemsSummary: o.items.map((i) => `${i.quantity}× ${i.dish.name}`).join(", "),
    quantity: o.items.reduce((s, i) => s + i.quantity, 0),
    total: Number(o.total),
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    orderType: o.orderType,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-bone">Orders</h1>
        <p className="mt-1 text-sm text-bone-muted">{orders.length} total — change status to sync live order tracking.</p>
      </div>
      {rows.length > 0 ? (
        <AdminOrdersTable orders={rows} />
      ) : (
        <p className="rounded-2xl bg-char p-10 text-center text-bone-muted">No orders yet.</p>
      )}
    </div>
  );
}
