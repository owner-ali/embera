import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-char p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wider text-smoke">{label}</span>
        <Icon size={16} className={cn(accent ? "text-ember-400" : "text-smoke")} />
      </div>
      <p className={cn("font-display text-3xl", accent ? "text-gold" : "text-bone")}>{value}</p>
    </div>
  );
}
