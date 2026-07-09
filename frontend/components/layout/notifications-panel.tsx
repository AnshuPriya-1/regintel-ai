"use client";
import * as React from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { notifications as seed } from "@/lib/mock-data";
import { FileText, ListChecks, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const iconFor: Record<string, React.ElementType> = {
  Documents: FileText, Tasks: ListChecks, Risk: AlertTriangle, AI: Sparkles,
};
const colorFor: Record<string, string> = {
  Documents: "text-primary bg-primary-tint", Tasks: "text-accent bg-accent-tint",
  Risk: "text-danger bg-danger-tint", AI: "text-warning bg-warning-tint",
};

export function NotificationsPanel({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState(seed);
  const [tab, setTab] = React.useState("all");

  const filtered = items.filter((n) => {
    if (tab === "all") return true;
    if (tab === "unread") return !n.read;
    return n.type === tab;
  });

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full max-w-md flex-col p-0">
        <SheetHeader className="flex-row items-center justify-between">
          <SheetTitle>Notifications</SheetTitle>
          <Button variant="link" size="sm" className="h-auto p-0" onClick={() => setItems((i) => i.map((n) => ({ ...n, read: true })))}>
            Mark all as read
          </Button>
        </SheetHeader>
        <div className="border-b border-border px-6 py-3">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="w-full justify-start overflow-x-auto no-scrollbar">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="Documents">Documents</TabsTrigger>
              <TabsTrigger value="Tasks">Tasks</TabsTrigger>
              <TabsTrigger value="Risk">Risk</TabsTrigger>
              <TabsTrigger value="AI">AI</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((n) => {
            const Icon = iconFor[n.type] ?? FileText;
            return (
              <button
                key={n.id}
                onClick={() => setItems((items) => items.map((it) => (it.id === n.id ? { ...it, read: true } : it)))}
                className={cn(
                  "flex w-full gap-3 border-b border-border-soft px-6 py-4 text-left transition-colors hover:bg-surface-muted",
                  !n.read && "bg-primary-tint/30"
                )}
              >
                <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", colorFor[n.type])}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    {!n.read && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                  </div>
                  <p className="mt-0.5 text-xs text-foreground-muted">{n.detail}</p>
                  <p className="mt-1 text-[11px] text-foreground-subtle">{n.time}</p>
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <p className="text-sm text-foreground-muted">You&apos;re all caught up.</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
