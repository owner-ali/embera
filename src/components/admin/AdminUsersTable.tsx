"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { createAdminUser, updateAdminUser, deleteAdminUser } from "@/lib/actions/admin-misc";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";

const roles = ["SUPER_ADMIN", "MANAGER", "STAFF"];
const allPermissions = [
  "DASHBOARD", "ORDERS", "MENU", "RESERVATIONS", "CUSTOMERS",
  "REVIEWS", "GALLERY", "MESSAGES", "ANALYTICS", "SETTINGS", "USERS",
];

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  permissions: string[];
  createdAt: string;
}

export function AdminUsersTable({ users, currentUserId }: { users: AdminUserRow[]; currentUserId: string }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUserRow | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remove ${name}'s access?`)) return;
    const result = await deleteAdminUser(id);
    if (result.success) { toast.success("User removed"); router.refresh(); }
    else toast.error(result.error ?? "Failed");
  }

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-ember"><Plus size={16} /> New User</button>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-char">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-smoke">
              <th className="px-5 py-4 font-mono">Name</th>
              <th className="px-5 py-4 font-mono">Email</th>
              <th className="px-5 py-4 font-mono">Role</th>
              <th className="px-5 py-4 font-mono">Status</th>
              <th className="px-5 py-4 font-mono">Joined</th>
              <th className="px-5 py-4 font-mono text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-4 text-bone">{u.name}{u.id === currentUserId && <span className="ml-2 font-mono text-[10px] text-smoke">(you)</span>}</td>
                <td className="px-5 py-4 text-bone-muted">{u.email}</td>
                <td className="px-5 py-4 font-mono text-xs text-gold">{u.role.replace("_", " ")}</td>
                <td className="px-5 py-4">
                  <span className={cn("rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase", u.isActive ? "bg-green-900/40 text-green-400" : "bg-white/5 text-smoke")}>
                    {u.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-5 py-4 font-mono text-xs text-smoke">{formatDate(u.createdAt)}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setEditing(u); setModalOpen(true); }} className="text-bone-muted hover:text-gold"><Pencil size={15} /></button>
                    {u.id !== currentUserId && (
                      <button onClick={() => handleDelete(u.id, u.name)} className="text-bone-muted hover:text-ember-400"><Trash2 size={15} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <UserModal
          initial={editing}
          onClose={() => setModalOpen(false)}
          onSaved={() => { setModalOpen(false); router.refresh(); }}
        />
      )}
    </div>
  );
}

function UserModal({ initial, onClose, onSaved }: { initial: AdminUserRow | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(initial?.role ?? "STAFF");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [permissions, setPermissions] = useState<string[]>(initial?.permissions ?? ["DASHBOARD"]);
  const [submitting, setSubmitting] = useState(false);

  function togglePermission(p: string) {
    setPermissions((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const result = initial
      ? await updateAdminUser(initial.id, { name, role: role as any, permissions: permissions as any, isActive })
      : await createAdminUser({ name, email, password, role: role as any, permissions: permissions as any });
    setSubmitting(false);
    if (!result.success) { toast.error(result.error ?? "Failed to save"); return; }
    toast.success(initial ? "User updated" : "User created");
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-char p-7">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl text-bone">{initial ? "Edit User" : "New Admin User"}</h2>
          <button onClick={onClose} className="text-smoke hover:text-bone"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-smoke">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-bone focus:border-ember-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-smoke">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required disabled={!!initial} className="w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-bone focus:border-ember-500 focus:outline-none disabled:opacity-50" />
          </div>
          {!initial && (
            <div>
              <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-smoke">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={8} className="w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-bone focus:border-ember-500 focus:outline-none" />
            </div>
          )}
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-smoke">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-bone focus:border-ember-500 focus:outline-none">
              {roles.map((r) => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
            </select>
          </div>
          {role !== "SUPER_ADMIN" && (
            <div>
              <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-smoke">Permissions</label>
              <div className="flex flex-wrap gap-2">
                {allPermissions.map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => togglePermission(p)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors",
                      permissions.includes(p) ? "border-ember-500 bg-ember-500 text-ink" : "border-white/10 text-bone-muted hover:border-white/30"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
          {initial && (
            <label className="flex items-center gap-2 text-sm text-bone-muted">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="accent-ember-500" />
              Active
            </label>
          )}
          <button type="submit" disabled={submitting} className="btn-ember w-full disabled:opacity-60">
            {submitting ? "Saving…" : initial ? "Save Changes" : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}
