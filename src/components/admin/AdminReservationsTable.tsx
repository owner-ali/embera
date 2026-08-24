"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateReservationStatus, rescheduleReservation } from "@/lib/actions/admin-operations";
import { formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";

export interface AdminReservationRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  tableLabel: string | null;
  status: string;
  specialRequest: string | null;
}

const statusColor: Record<string, string> = {
  PENDING: "text-smoke border-white/15",
  CONFIRMED: "text-green-400 border-green-800",
  CANCELLED: "text-red-400 border-red-800",
  COMPLETED: "text-blue-400 border-blue-800",
};

export function AdminReservationsTable({ reservations }: { reservations: AdminReservationRow[] }) {
  const router = useRouter();
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  async function setStatus(id: string, status: string) {
    const result = await updateReservationStatus(id, status as any);
    if (result.success) { toast.success("Reservation updated"); router.refresh(); }
    else toast.error(result.error ?? "Failed");
  }

  async function submitReschedule(id: string) {
    if (!newDate || !newTime) return;
    const result = await rescheduleReservation(id, newDate, newTime);
    setRescheduleId(null);
    if (result.success) { toast.success("Reservation rescheduled"); router.refresh(); }
    else toast.error(result.error ?? "Failed");
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-char">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-smoke">
            <th className="px-5 py-4 font-mono">Customer</th>
            <th className="px-5 py-4 font-mono">Date</th>
            <th className="px-5 py-4 font-mono">Time</th>
            <th className="px-5 py-4 font-mono">Guests</th>
            <th className="px-5 py-4 font-mono">Table</th>
            <th className="px-5 py-4 font-mono">Status</th>
            <th className="px-5 py-4 font-mono text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id} className="border-b border-white/5 last:border-0 align-top hover:bg-white/[0.02]">
              <td className="px-5 py-4">
                <p className="text-bone">{r.name}</p>
                <p className="text-xs text-smoke">{r.email} · {r.phone}</p>
                {r.specialRequest && <p className="mt-1 text-xs italic text-bone-muted">&ldquo;{r.specialRequest}&rdquo;</p>}
              </td>
              <td className="px-5 py-4 font-mono text-xs text-bone-muted">{formatDate(r.date)}</td>
              <td className="px-5 py-4 font-mono text-xs text-bone-muted">{r.time}</td>
              <td className="px-5 py-4 text-bone-muted">{r.guests}</td>
              <td className="px-5 py-4 text-bone-muted">{r.tableLabel ?? "—"}</td>
              <td className="px-5 py-4">
                <span className={cn("rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider", statusColor[r.status])}>{r.status}</span>
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap justify-end gap-2 text-xs">
                  {r.status !== "CONFIRMED" && <button onClick={() => setStatus(r.id, "CONFIRMED")} className="text-green-400 hover:underline">Confirm</button>}
                  {r.status !== "CANCELLED" && <button onClick={() => setStatus(r.id, "CANCELLED")} className="text-red-400 hover:underline">Cancel</button>}
                  <button onClick={() => setRescheduleId(rescheduleId === r.id ? null : r.id)} className="text-gold hover:underline">Reschedule</button>
                </div>
                {rescheduleId === r.id && (
                  <div className="mt-3 flex flex-col gap-2 rounded-xl bg-ink p-3">
                    <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="rounded-lg border border-white/10 bg-char px-2 py-1.5 text-xs text-bone" />
                    <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="rounded-lg border border-white/10 bg-char px-2 py-1.5 text-xs text-bone" />
                    <button onClick={() => submitReschedule(r.id)} className="rounded-lg bg-ember-500 px-2 py-1.5 text-xs text-ink">Save</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
