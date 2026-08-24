"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, MailOpen, Trash2, Phone } from "lucide-react";
import { markMessageRead, deleteMessage } from "@/lib/actions/admin-misc";
import { formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";

export interface AdminMessageRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function AdminMessagesList({ messages }: { messages: AdminMessageRow[] }) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);

  async function toggleRead(id: string, current: boolean) {
    const result = await markMessageRead(id, !current);
    if (result.success) router.refresh();
    else toast.error(result.error ?? "Failed");
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    const result = await deleteMessage(id);
    if (result.success) { toast.success("Message deleted"); router.refresh(); }
    else toast.error(result.error ?? "Failed");
  }

  return (
    <div className="divide-y divide-white/5 overflow-hidden rounded-2xl bg-char">
      {messages.map((m) => {
        const open = openId === m.id;
        return (
          <div key={m.id} className={cn("p-5", !m.isRead && "bg-ember-900/10")}>
            <button
              onClick={() => { setOpenId(open ? null : m.id); if (!m.isRead) toggleRead(m.id, m.isRead); }}
              className="flex w-full items-start justify-between gap-4 text-left"
            >
              <div className="flex items-start gap-3">
                {m.isRead ? <MailOpen size={16} className="mt-1 text-smoke" /> : <Mail size={16} className="mt-1 text-ember-400" />}
                <div>
                  <p className={cn("text-sm", m.isRead ? "text-bone-muted" : "font-semibold text-bone")}>{m.name}</p>
                  <p className="text-xs text-smoke">{m.email}{m.phone && ` · ${m.phone}`}</p>
                  {!open && <p className="mt-1 line-clamp-1 text-sm text-bone-muted">{m.message}</p>}
                </div>
              </div>
              <span className="whitespace-nowrap font-mono text-[10px] text-smoke">{formatDate(m.createdAt)}</span>
            </button>
            {open && (
              <div className="mt-3 pl-7">
                <p className="text-sm leading-relaxed text-bone-muted">{m.message}</p>
                <div className="mt-3 flex gap-4 text-xs">
                  <a href={`mailto:${m.email}`} className="text-gold hover:underline">Reply by email</a>
                  {m.phone && <a href={`tel:${m.phone}`} className="flex items-center gap-1 text-gold hover:underline"><Phone size={11} /> Call</a>}
                  <button onClick={() => handleDelete(m.id)} className="ml-auto flex items-center gap-1 text-ember-400 hover:underline"><Trash2 size={12} /> Delete</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
