"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Bell, LogOut, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Notification } from "@prisma/client";

export function AdminTopbar({
  user,
  notifications,
  unreadCount,
}: {
  user: { name: string; email: string; role: string };
  notifications: Notification[];
  unreadCount: number;
}) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="flex items-center justify-between border-b border-white/5 bg-ink px-6 py-4">
      <div className="relative hidden max-w-xs flex-1 sm:block">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-smoke" />
        <input
          placeholder="Search…"
          className="w-full rounded-full border border-white/10 bg-char py-2 pl-10 pr-4 text-sm text-bone placeholder:text-smoke focus:border-ember-500 focus:outline-none"
        />
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-bone/70 hover:bg-white/5 hover:text-gold"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-ember-500 font-mono text-[9px] text-ink">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="glass-panel absolute right-0 top-12 z-20 max-h-96 w-80 overflow-y-auto rounded-2xl shadow-card">
              <p className="border-b border-white/10 px-4 py-3 font-mono text-xs uppercase tracking-wider text-smoke">Notifications</p>
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-smoke">You&apos;re all caught up.</p>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="border-b border-white/5 px-4 py-3 last:border-0">
                    <p className="text-sm text-bone">{n.title}</p>
                    <p className="mt-0.5 text-xs text-bone-muted">{n.body}</p>
                    <p className="mt-1 font-mono text-[10px] text-smoke">{formatDate(n.createdAt)}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="hidden text-right sm:block">
          <p className="text-sm text-bone">{user.name}</p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-smoke">{user.role.replace("_", " ")}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ember-500 font-display text-sm text-ink">
          {user.name.charAt(0)}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          aria-label="Log out"
          className="flex h-10 w-10 items-center justify-center rounded-full text-bone/70 hover:bg-white/5 hover:text-ember-400"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}
