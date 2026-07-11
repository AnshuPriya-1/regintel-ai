"use client";
import { DueDateBadge } from "@/components/shared/due-date-badge";
import * as React from "react";
import { motion } from "framer-motion";
import { User2 } from "lucide-react";
import { Badge, riskVariant } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { tasks as mockTasks } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

const columns: { key: string; label: string }[] = [
  { key: "To Do", label: "To Do" },
  { key: "In Progress", label: "In Progress" },
  { key: "Review", label: "Review" },
  { key: "Completed", label: "Completed" },
];

interface KanbanBoardProps {
  initialTasks?: Task[];
  onStatusChange?: (id: string, status: Task["status"]) => void;
}

export function KanbanBoard({ initialTasks, onStatusChange }: KanbanBoardProps) {
  const [tasks, setTasks] = React.useState(initialTasks ?? mockTasks);

  React.useEffect(() => {
    if (initialTasks) setTasks(initialTasks);
  }, [initialTasks]);
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [overCol, setOverCol] = React.useState<string | null>(null);

  function drop(status: string) {
    if (!dragId) return;
    setTasks((ts) => ts.map((t) => (t.id === dragId ? { ...t, status: status as typeof t.status } : t)));
    onStatusChange?.(dragId, status as Task["status"]);
    setDragId(null);
    setOverCol(null);
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key);
        return (
          <div
            key={col.key}
            onDragOver={(e) => { e.preventDefault(); setOverCol(col.key); }}
            onDragLeave={() => setOverCol(null)}
            onDrop={() => drop(col.key)}
            className={cn(
              "flex flex-col gap-3 rounded-2xl border border-border bg-surface-muted/60 p-3 transition-colors",
              overCol === col.key && "bg-primary-tint ring-2 ring-primary/30"
            )}
          >
            <div className="flex items-center justify-between px-1">
              <p className="text-[13px] font-semibold text-foreground">{col.label}</p>
              <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium text-foreground-muted">{colTasks.length}</span>
            </div>
            <div className="flex flex-col gap-2.5 min-h-[80px]">
              {colTasks.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  draggable
                  onDragStart={() => setDragId(t.id)}
                  className="cursor-grab space-y-2.5 rounded-xl border border-border bg-surface p-3.5 shadow-[var(--shadow-sm)] active:cursor-grabbing"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-medium leading-snug text-foreground">{t.title}</p>
                    <Badge variant={riskVariant(t.priority)} className="shrink-0">{t.priority}</Badge>
                  </div>
                  <p className="text-[11.5px] text-foreground-muted">{t.department}</p>
                  <Progress value={t.progress} />
                  <div className="flex items-center justify-between text-[11px] text-foreground-subtle">
                    <span className="flex items-center gap-1"><User2 className="h-3 w-3" /> {t.owner.split(" ")[0]}</span>
                    <DueDateBadge date={t.dueDate} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
