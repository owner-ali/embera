import Link from "next/link";
import { getAllCustomers } from "@/lib/data-admin";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await getAllCustomers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-bone">Customers</h1>
        <p className="mt-1 text-sm text-bone-muted">{customers.length} registered customers</p>
      </div>

      {customers.length === 0 ? (
        <p className="rounded-2xl bg-char p-10 text-center text-bone-muted">No customers yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-char">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-smoke">
                <th className="px-5 py-4 font-mono">Name</th>
                <th className="px-5 py-4 font-mono">Email</th>
                <th className="px-5 py-4 font-mono">Orders</th>
                <th className="px-5 py-4 font-mono">Reservations</th>
                <th className="px-5 py-4 font-mono">Total Spent</th>
                <th className="px-5 py-4 font-mono">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <Link href={`/admin/customers/${c.id}`} className="text-bone hover:text-gold">{c.name}</Link>
                  </td>
                  <td className="px-5 py-4 text-bone-muted">{c.email}</td>
                  <td className="px-5 py-4 text-bone-muted">{c._count.orders}</td>
                  <td className="px-5 py-4 text-bone-muted">{c._count.reservations}</td>
                  <td className="px-5 py-4 font-mono text-gold">{formatCurrency(Number(c.totalSpent))}</td>
                  <td className="px-5 py-4 font-mono text-xs text-smoke">{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
