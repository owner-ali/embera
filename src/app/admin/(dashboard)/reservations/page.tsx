import { getAllReservations } from "@/lib/data-admin";
import { AdminReservationsTable } from "@/components/admin/AdminReservationsTable";

export const dynamic = "force-dynamic";

export default async function AdminReservationsPage() {
  const reservations = await getAllReservations();

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayCount = reservations.filter((r) => new Date(r.date).toDateString() === today.toDateString()).length;
  const upcomingCount = reservations.filter((r) => new Date(r.date) >= today && r.status !== "CANCELLED").length;
  const pendingCount = reservations.filter((r) => r.status === "PENDING").length;

  const rows = reservations.map((r) => ({
    id: r.id, name: r.name, email: r.email, phone: r.phone,
    date: r.date.toISOString(), time: r.time, guests: r.guests,
    tableLabel: r.table?.label ?? null, status: r.status, specialRequest: r.specialRequest,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-bone">Reservations</h1>
        <p className="mt-1 text-sm text-bone-muted">
          {todayCount} today · {upcomingCount} upcoming · {pendingCount} pending
        </p>
      </div>
      {rows.length > 0 ? (
        <AdminReservationsTable reservations={rows} />
      ) : (
        <p className="rounded-2xl bg-char p-10 text-center text-bone-muted">No reservations yet.</p>
      )}
    </div>
  );
}
