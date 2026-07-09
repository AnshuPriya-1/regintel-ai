"use client";
import { DueDateBadge } from "@/components/shared/due-date-badge";
import Link from "next/link";
import { FileText, MoreHorizontal, Eye, Download, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, statusVariant, riskVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { documents, tasks, auditTrail } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function RecentDocumentsPanel() {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Recent Documents</CardTitle>
        <Link href="/documents"><Button variant="link" size="sm" className="h-auto p-0 text-xs">View all</Button></Link>
      </CardHeader>
      <div className="divide-y divide-border-soft px-2 pb-2">
        {documents.slice(0, 5).map((doc) => (
          <div key={doc.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-muted">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger-tint text-danger">
              <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-foreground">{doc.name}</p>
              <p className="text-[11.5px] text-foreground-muted">{doc.category} · {doc.obligations} obligations</p>
            </div>
            <Badge variant={statusVariant(doc.status)}>{doc.status}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function UpcomingTasksPanel() {
  const upcoming = tasks.filter((t) => t.status !== "Completed").slice(0, 5);
  return (
    <Card className="col-span-1">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Upcoming Tasks</CardTitle>
        <Link href="/workflow-tasks"><Button variant="link" size="sm" className="h-auto p-0 text-xs">View all</Button></Link>
      </CardHeader>
      <div className="divide-y divide-border-soft px-2 pb-2">
        {upcoming.map((t) => (
          <div key={t.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-muted">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-foreground">{t.title}</p>
              <p className="text-[11.5px] text-foreground-muted">{t.department}</p>
            </div>
            <Badge variant={riskVariant(t.priority)}>{t.priority}</Badge>
            <DueDateBadge date={t.dueDate} className="shrink-0" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function RecentActivityPanel() {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Recent Activities</CardTitle>
        <Link href="/audit-trail"><Button variant="link" size="sm" className="h-auto p-0 text-xs">View all</Button></Link>
      </CardHeader>
      <div className="space-y-4 px-5 pb-5">
        {auditTrail.slice(0, 5).map((a, i) => (
          <div key={a.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={cn("flex h-6 w-6 items-center justify-center rounded-full", a.status === "Verified" ? "bg-success-tint text-success" : "bg-warning-tint text-warning")}>
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              {i < 4 && <div className="mt-1 h-full w-px flex-1 bg-border" />}
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <p className="text-[13px] text-foreground">{a.action} <span className="text-foreground-muted">· Clause {a.clause}</span></p>
              <p className="text-[11.5px] text-foreground-subtle">{a.owner} · {new Date(a.time).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
