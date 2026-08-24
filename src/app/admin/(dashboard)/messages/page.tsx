import { getAllMessages } from "@/lib/data-admin";
import { AdminMessagesList } from "@/components/admin/AdminMessagesList";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await getAllMessages();
  const unread = messages.filter((m) => !m.isRead).length;
  const rows = messages.map((m) => ({
    id: m.id, name: m.name, email: m.email, phone: m.phone,
    message: m.message, isRead: m.isRead, createdAt: m.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-bone">Messages</h1>
        <p className="mt-1 text-sm text-bone-muted">{unread} unread of {messages.length} total</p>
      </div>
      {rows.length > 0 ? <AdminMessagesList messages={rows} /> : <p className="rounded-2xl bg-char p-10 text-center text-bone-muted">No messages yet.</p>}
    </div>
  );
}
