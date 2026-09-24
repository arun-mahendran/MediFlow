import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "default" | "emergency" | "high" | "low";
  loading?: boolean;
}

const tones = {
  default: "bg-accent text-accent-foreground",
  emergency: "bg-emergency-soft text-emergency",
  high: "bg-high-soft text-high",
  low: "bg-low-soft text-low",
};

export function StatCard({ label, value, hint, icon: Icon, tone = "default", loading }: StatCardProps) {
  return (
    <div className="panel dashboard-stat flex min-h-36 items-start justify-between gap-4 p-5 transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {loading ? (
          <div className="mt-2 h-8 w-16 animate-pulse rounded-md bg-muted" />
        ) : (
          <p className="mt-3 break-words text-3xl font-bold tabular-nums">{value}</p>
        )}
        {hint && <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>}
      </div>
      <span className={cn("grid size-11 shrink-0 place-items-center rounded-lg", tones[tone])}>
        <Icon className="size-5" />
      </span>
    </div>
  );
}
