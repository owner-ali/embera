"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { updateOrderStatus } from "@/lib/actions/admin-operations";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";

const statuses = ["PENDING", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"];

const statusColor: Record<string, string> = {
  PENDING: "text-smoke border-white/15",
  CONFIRMED: "text-blue-400 border-blue-800",
  PREPARING: "text-gold border-gold/40",
  READY: "text-green-400 border-green-800",
  OUT_FOR_DELIVERY: "text-ember-400 border-ember-800",
  COMPLETED: "text-green-400 border-green-800",
  CANCELLED: "text-red-400 border-red-800",
};

export interface AdminOrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  itemsSummary: string;
  quantity: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderType: string;
  status: string;
  createdAt: string;
}

export function AdminOrdersTable({ orders }: { orders: AdminOrderRow[] }) {
  const [rows, setRows] = useState(orders);
  const [isPending, startTransition] = useTransition();
  const [openId, setOpenId] = useState<string | null>(null);

  function handleStatusChange(id: string, status: string) {
    setOpenId(null);
    startTransition(async () => {
      const result = await updateOrderStatus(id, status as any);
      if (result.success) {
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
        toast.success("Order status updated");
      } else {
        toast.error(result.error ?? "Failed to update");
      }
    });
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-char">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-smoke">
            <th className="px-5 py-4 font-mono">Order</th>
            <th className="px-5 py-4 font-mono">Customer</th>
            <th className="px-5 py-4 font-mono">Items</th>
            <th className="px-5 py-4 font-mono">Amount</th>
            <th className="px-5 py-4 font-mono">Payment</th>
            <th className="px-5 py-4 font-mono">Type</th>
            <th className="px-5 py-4 font-mono">Status</th>
            <th className="px-5 py-4 font-mono">Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
              <td className="px-5 py-4 font-mono text-xs text-bone">{o.orderNumber}</td>
              <td className="px-5 py-4 text-bone-muted">{o.customerName}</td>
              <td className="max-w-[200px] truncate px-5 py-4 text-bone-muted" title={o.itemsSummary}>{o.itemsSummary}</td>
              <td className="px-5 py-4 font-mono text-bone">{formatCurrency(o.total)}</td>
              <td className="px-5 py-4 text-xs text-bone-muted">{o.paymentMethod} · {o.paymentStatus}</td>
              <td className="px-5 py-4 text-xs text-bone-muted">{o.orderType.replace("_", " ")}</td>
              <td className="relative px-5 py-4">
                <button
                  onClick={() => setOpenId(openId === o.id ? null : o.id)}
                  disabled={isPending}
                  className={cn("flex items-center gap-1 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider", statusColor[o.status])}
                >
                  {o.status.replace(/_/g, " ")} <ChevronDown size={12} />
                </button>
                {openId === o.id && (
                  <div className="glass-panel absolute left-5 top-12 z-20 w-48 overflow-hidden rounded-xl shadow-card">
                    {statuses.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(o.id, s)}
                        className="block w-full px-4 py-2.5 text-left text-xs text-bone-muted hover:bg-white/5 hover:text-bone"
                      >
                        {s.replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                )}
              </td>
              <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-smoke">{formatDate(o.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
