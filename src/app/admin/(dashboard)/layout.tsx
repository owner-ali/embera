import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { getRecentNotifications, getUnreadNotificationCount } from "@/lib/data-admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Middleware already guards /admin, but pages render server-side —
  // double-check here so direct data access below is never unauthenticated.
  if (!session?.user || (session.user as any).accountType !== "admin") {
    redirect("/admin/login");
  }

  const [notifications, unreadCount] = await Promise.all([
    getRecentNotifications(),
    getUnreadNotificationCount(),
  ]);

  const user = session.user as any;

  return (
    <div className="flex min-h-screen bg-ink">
      <AdminSidebar role={user.role} permissions={user.permissions ?? []} />
      <div className="flex flex-1 flex-col">
        <AdminTopbar
          user={{ name: user.name, email: user.email, role: user.role }}
          notifications={notifications}
          unreadCount={unreadCount}
        />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
