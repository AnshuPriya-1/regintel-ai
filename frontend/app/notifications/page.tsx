"use client";
import * as React from "react";
import { FileText, ListChecks, AlertTriangle, Sparkles, CheckCheck } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { notifications as seed } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const iconFor: Record<string, React.ElementType> = { Documents: FileText, Tasks: ListChecks, Risk: AlertTriangle, AI: Sparkles };
const colorFor: Record<string, string> = {
  Documents: "text-primary bg-primary-tint", Tasks: "text-accent bg-accent-tint", Risk: "text-danger bg-danger-tint", AI: "text-warning bg-warning-tint",
};

export default function NotificationsPage() {
  const [items, setItems] = React.useState(seed);
  const [tab, setTab] = React.useState("all");
  const filtered = items.filter((n) => tab === "all" || (tab === "unread" ? !n.read : n.type === tab));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Notifications</h1>
          <p className="mt-1 text-sm text-foreground-muted">{items.filter((n) => !n.read).length} unread</p>
        </div>
        <Button variant="outline" onClick={() => setItems((i) => i.map((n) => ({ ...n, read: true })))}>
          <CheckCheck className="h-4 w-4" /> Mark all as read
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full overflow-x-auto no-scrollbar sm:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="Documents">Documents</TabsTrigger>
          <TabsTrigger value="Tasks">Tasks</TabsTrigger>
          <TabsTrigger value="Risk">Risk</TabsTrigger>
          <TabsTrigger value="AI">AI</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {filtered.map((n) => {
          const Icon = iconFor[n.type] ?? FileText;
          return (
            <button
              key={n.id}
              onClick={() => setItems((items) => items.map((it) => (it.id === n.id ? { ...it, read: true } : it)))}
              className={cn("flex w-full items-start gap-3 border-b border-border-soft px-5 py-4 text-left transition-colors last:border-0 hover:bg-surface-muted", !n.read && "bg-primary-tint/30")}
            >
              <div className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full", colorFor[n.type])}><Icon className="h-4 w-4" /></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  {!n.read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                </div>
                <p className="mt-0.5 text-[13px] text-foreground-muted">{n.detail}</p>
                <p className="mt-1 text-[11px] text-foreground-subtle">{n.time}</p>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && <p className="p-10 text-center text-sm text-foreground-muted">Nothing here.</p>}
      </div>
    </div>
  );
}
