"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

const stages = [
  { key: "PENDING", label: "Order Received" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PREPARING", label: "Preparing" },
  { key: "READY", label: "Ready" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { key: "COMPLETED", label: "Completed" },
];

export function OrderTrackerLive({
  orderId,
  initialStatus,
  orderType,
}: {
  orderId: string;
  initialStatus: string;
  orderType: string;
}) {
  const [status, setStatus] = useState(initialStatus);

  // Poll for status changes made by admin — real sync, no mocking.
  useEffect(() => {
    if (status === "COMPLETED" || status === "CANCELLED") return;
    const id = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.status) setStatus(data.status);
      } catch {
        // silent — will retry on next interval
      }
    }, 8000);
    return () => clearInterval(id);
  }, [orderId, status]);

  const visibleStages = orderType === "DELIVERY" ? stages : stages.filter((s) => s.key !== "OUT_FOR_DELIVERY");
  const currentIndex = visibleStages.findIndex((s) => s.key === status);

  if (status === "CANCELLED") {
    return (
      <div className="rounded-2xl border border-ember-800 bg-ember-900/30 p-8 text-center">
        <p className="font-display text-2xl text-ember-300">This order was cancelled.</p>
        <p className="mt-2 text-sm text-bone-muted">Contact us if you believe this is a mistake.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-8">
      <div className="relative flex flex-col gap-0 sm:flex-row sm:items-start sm:justify-between">
        <div
          aria-hidden
          className="absolute left-4 top-4 hidden h-px bg-white/10 sm:block"
          style={{ right: "1rem" }}
        />
        <motion.div
          aria-hidden
          className="absolute left-4 top-4 hidden h-px bg-ember-500 sm:block"
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / (visibleStages.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />

        {visibleStages.map((stage, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <div key={stage.key} className="relative z-10 mb-8 flex items-center gap-3 sm:mb-0 sm:flex-col sm:items-center sm:gap-2 sm:text-center">
              <motion.div
                animate={active ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 1.6, repeat: active ? Infinity : 0 }}
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                  done ? "border-ember-500 bg-ember-500 text-ink" : active ? "border-ember-500 bg-ink text-ember-400" : "border-white/15 bg-ink text-smoke"
                )}
              >
                {done ? <Check size={14} /> : active ? <Clock size={14} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
              </motion.div>
              <span className={cn("font-mono text-[11px] uppercase tracking-wider sm:max-w-[80px]", active ? "text-ember-400" : done ? "text-bone" : "text-smoke")}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
