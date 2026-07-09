"use client";
import { DueDateBadge } from "@/components/shared/due-date-badge";
import * as React from "react";
import { Badge, riskVariant, statusVariant } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { tasks } from "@/lib/mock-data";

export function TasksTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-muted/60 text-left text-[11.5px] font-semibold uppercase tracking-wide text-foreground-muted">
            <th className="px-4 py-3">Task</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Owner</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Due Date</th>
            <th className="px-4 py-3 w-40">Progress</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id} className="border-b border-border-soft last:border-0 hover:bg-surface-muted">
              <td className="px-4 py-3 font-medium text-foreground">{t.title}</td>
              <td className="px-4 py-3 text-foreground-muted">{t.department}</td>
              <td className="px-4 py-3 text-foreground-muted">{t.owner}</td>
              <td className="px-4 py-3"><Badge variant={riskVariant(t.priority)}>{t.priority}</Badge></td>
              <td className="px-4 py-3"><Badge variant={statusVariant(t.status)}>{t.status}</Badge></td>
              <td className="px-4 py-3"><DueDateBadge date={t.dueDate} /></td>
              <td className="px-4 py-3"><Progress value={t.progress} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
