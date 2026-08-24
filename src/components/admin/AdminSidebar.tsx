"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, LayoutGrid, CalendarCheck,
  Users, Star, Images, MessageSquare, BarChart3, ShieldCheck, Settings, Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, permission: "DASHBOARD" },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, permission: "ORDERS" },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed, permission: "MENU" },
  { href: "/admin/categories", label: "Categories", icon: LayoutGrid, permission: "MENU" },
  { href: "/admin/reservations", label: "Reservations", icon: CalendarCheck, permission: "RESERVATIONS" },
  { href: "/admin/customers", label: "Customers", icon: Users, permission: "CUSTOMERS" },
  { href: "/admin/reviews", label: "Reviews", icon: Star, permission: "REVIEWS" },
  { href: "/admin/gallery", label: "Gallery", icon: Images, permission: "GALLERY" },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare, permission: "MESSAGES" },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, permission: "ANALYTICS" },
  { href: "/admin/users", label: "Users", icon: ShieldCheck, permission: "USERS" },
  { href: "/admin/settings", label: "Settings", icon: Settings, permission: "SETTINGS" },
];

export function AdminSidebar({ role, permissions }: { role: string; permissions: string[] }) {
  const pathname = usePathname();
  const isSuperAdmin = role === "SUPER_ADMIN";

  const visibleItems = navItems.filter((item) => isSuperAdmin || permissions.includes(item.permission));

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-char lg:flex">
      <div className="flex items-center gap-2 px-6 py-6">
        <Flame size={20} className="text-ember-500" />
        <div>
          <p className="font-display text-lg tracking-wide text-bone">EMBERA</p>
          <p className="font-mono text-[10px] uppercase tracking-widest2 text-smoke">Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {visibleItems.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active ? "bg-ember-500 text-ink" : "text-bone-muted hover:bg-white/5 hover:text-bone"
              )}
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 px-6 py-4">
        <p className="font-mono text-[10px] text-smoke">CodedByAli © {new Date().getFullYear()}</p>
      </div>
    </aside>
  );
}
