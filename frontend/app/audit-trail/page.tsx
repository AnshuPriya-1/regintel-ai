"use client";
import * as React from "react";
import { CheckCircle2, Clock, ChevronDown, User2, FileCheck2, Search, Download } from "lucide-react";
import { Badge, statusVariant } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { EmptyState } from "@/components/shared/empty-state";
import { auditTrail } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function AuditTrailPage() {
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");

  const filtered = auditTrail.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.action.toLowerCase().includes(q) ||
      a.owner.toLowerCase().includes(q) ||
      a.clause.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Audit Trail</h1>
          <p className="mt-1 text-sm text-foreground-muted">A tamper-evident log of every compliance action taken on the platform.</p>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
            <Input
              placeholder="Search action, owner, clause..."
              className="w-64 pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button variant="outline" disabled className="cursor-not-allowed opacity-60">
                    <Download className="h-4 w-4" /> Export
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Export will be enabled once the backend is connected</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No matching audit entries" description="Try a different search term." />
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <div className="space-y-0">
            {filtered.map((a, i) => (
              <div key={a.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", a.status === "Verified" ? "bg-success-tint text-success" : "bg-warning-tint text-warning")}>
                    {a.status === "Verified" ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </div>
                  {i < filtered.length - 1 && <div className="w-px flex-1 bg-border" />}
                </div>
                <div className="min-w-0 flex-1 pb-6">
                  <button
                    onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                    className="flex w-full items-start justify-between gap-3 text-left"
                  >
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-medium text-foreground">{a.action}</p>
                      <p className="mt-0.5 text-[12px] text-foreground-muted">Clause {a.clause} · {a.owner}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
                      <ChevronDown className={cn("h-4 w-4 text-foreground-muted transition-transform", expanded === a.id && "rotate-180")} />
                    </div>
                  </button>
                  <p className="mt-1 text-[11.5px] text-foreground-subtle">
                    {new Date(a.time).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                  {expanded === a.id && (
                    <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-surface-muted p-4 text-[12.5px] sm:grid-cols-3">
                      <div className="flex items-center gap-2"><User2 className="h-3.5 w-3.5 text-foreground-muted" /> Owner: {a.owner}</div>
                      <div className="flex items-center gap-2"><FileCheck2 className="h-3.5 w-3.5 text-foreground-muted" /> Evidence attached</div>
                      <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-foreground-muted" /> Status: {a.status}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}