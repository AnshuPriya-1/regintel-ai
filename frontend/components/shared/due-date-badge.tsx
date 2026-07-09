import { CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";

function urgency(dateStr: string) {
  const due = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86400000);
  if (diffDays < 0) return { label: `Overdue by ${Math.abs(diffDays)}d`, tone: "danger" as const };
  if (diffDays === 0) return { label: "Due today", tone: "warning" as const };
  if (diffDays <= 3) return { label: `Due in ${diffDays}d`, tone: "warning" as const };
  return { label: dateStr.slice(5), tone: "muted" as const };
}

const toneClasses = {
  danger: "bg-danger-tint text-danger",
  warning: "bg-warning-tint text-warning",
  muted: "bg-surface-muted text-foreground-muted",
};

export function DueDateBadge({ date, className }: { date: string; className?: string }) {
  const u = urgency(date);
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap", toneClasses[u.tone], className)}>
      <CalendarClock className="h-3 w-3" />
      {u.label}
    </span>
  );
}