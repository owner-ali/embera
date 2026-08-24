import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getAllAdminUsers } from "@/lib/data-admin";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (user?.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  const users = await getAllAdminUsers();
  const rows = users.map((u) => ({
    id: u.id, name: u.name, email: u.email, role: u.role, isActive: u.isActive,
    permissions: u.permissions.map((p) => p.key), createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-bone">Admin Users</h1>
        <p className="mt-1 text-sm text-bone-muted">{users.length} accounts with dashboard access — Super Admin only.</p>
      </div>
      <AdminUsersTable users={rows} currentUserId={user.id} />
    </div>
  );
}
