import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/data";
import { OrderTrackerLive } from "@/components/site/OrderTrackerLive";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Track Your Order" };

export default async function OrderTrackingPage({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id);
  if (!order) notFound();

  return (
    <div className="bg-ink pb-24 pt-32">
      <div className="container max-w-3xl">
        <p className="eyebrow mb-3">Order Confirmed</p>
        <h1 className="section-heading mb-2">Thank you.</h1>
        <p className="mb-10 font-mono text-sm text-smoke">
          Order #{order.orderNumber} · Placed {formatDate(order.createdAt)}
        </p>

        <OrderTrackerLive orderId={order.id} initialStatus={order.status} orderType={order.orderType} />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-char p-6">
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-smoke">Details</p>
            <dl className="space-y-2 text-sm text-bone-muted">
              <div className="flex justify-between"><dt>Type</dt><dd className="text-bone">{order.orderType.replace("_", " ")}</dd></div>
              <div className="flex justify-between"><dt>Payment</dt><dd className="text-bone">{order.paymentMethod} · {order.paymentStatus}</dd></div>
              {order.address && <div className="flex justify-between gap-4"><dt>Address</dt><dd className="text-right text-bone">{order.address}, {order.city}</dd></div>}
              {order.estimatedTime && (
                <div className="flex justify-between"><dt>Estimated</dt><dd className="text-bone">{new Date(order.estimatedTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</dd></div>
              )}
            </dl>
          </div>

          <div className="rounded-2xl bg-char p-6">
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-smoke">Order Summary</p>
            <ul className="space-y-3">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                    <Image src={item.dish.imageUrl} alt={item.dish.name} fill className="object-cover" sizes="40px" />
                  </div>
                  <span className="flex-1 text-sm text-bone-muted">{item.quantity}× {item.dish.name}</span>
                  <span className="font-mono text-xs text-bone">{formatCurrency(Number(item.unitPrice) * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-white/10 pt-4 font-display text-lg text-bone">
              <span>Total</span><span>{formatCurrency(Number(order.total))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
